import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [userOrganizations, setUserOrganizations] = useState([]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserOrganizations(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserOrganizations(session.user.id);
        } else {
          setUser(null);
          setCurrentOrganization(null);
          setCurrentBranch(null);
          setUserOrganizations([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserOrganizations = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          organization:organizations(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const orgs = data.map(item => ({
        ...item.organization,
        userRole: item.role
      }));

      setUserOrganizations(orgs);

      // Set current organization if none selected
      if (orgs.length > 0 && !currentOrganization) {
        setCurrentOrganization(orgs[0]);
        await loadBranches(orgs[0].id);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    }
  };

  const loadBranches = async (organizationId) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) throw error;

      if (data.length > 0 && !currentBranch) {
        setCurrentBranch(data[0]);
      }
    } catch (error) {
      console.error('Error loading branches:', error);
      toast.error('Failed to load branches');
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Successfully signed in!');
      return { data, error: null };
    } catch (error) {
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signUp = async (email, password, fullName, organizationName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create organization and add user as owner
      if (data.user) {
        await createOrganizationForUser(data.user.id, organizationName, fullName);
      }

      toast.success('Account created successfully!');
      return { data, error: null };
    } catch (error) {
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const createOrganizationForUser = async (userId, organizationName, ownerName) => {
    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{
          name: organizationName,
          owner_id: userId,
          settings: {
            timezone: 'UTC',
            currency: 'USD',
            date_format: 'YYYY-MM-DD'
          }
        }])
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as organization member
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: orgData.id,
          user_id: userId,
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      // Create default branch
      const { error: branchError } = await supabase
        .from('branches')
        .insert([{
          organization_id: orgData.id,
          name: 'Main Branch',
          address: '',
          manager_id: userId
        }]);

      if (branchError) throw branchError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userId,
          full_name: ownerName,
          avatar_url: null
        }]);

      if (profileError) throw profileError;

    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const switchOrganization = async (organization) => {
    setCurrentOrganization(organization);
    setCurrentBranch(null);
    await loadBranches(organization.id);
  };

  const switchBranch = (branch) => {
    setCurrentBranch(branch);
  };

  const value = {
    user,
    loading,
    currentOrganization,
    currentBranch,
    userOrganizations,
    signIn,
    signUp,
    signOut,
    switchOrganization,
    switchBranch,
    loadUserOrganizations
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}