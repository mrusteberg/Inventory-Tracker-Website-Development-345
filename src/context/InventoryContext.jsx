import React, { createContext, useContext, useReducer, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const InventoryContext = createContext();

const initialState = {
  products: [],
  categories: [],
  suppliers: [],
  locations: [],
  loading: false,
  error: null
};

function inventoryReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOAD_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    
    case 'LOAD_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'LOAD_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    
    case 'LOAD_LOCATIONS':
      return { ...state, locations: action.payload };
    
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        products: [...state.products, action.payload],
        loading: false 
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
        loading: false
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        loading: false
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, quantity: action.payload.quantity }
            : product
        ),
        loading: false
      };

    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);
  const { currentOrganization, currentBranch } = useAuth();

  // Load data when organization or branch changes
  useEffect(() => {
    if (currentOrganization && currentBranch) {
      loadAllData();
    }
  }, [currentOrganization, currentBranch]);

  const loadAllData = async () => {
    if (!currentOrganization || !currentBranch) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadSuppliers(),
        loadLocations()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load inventory data');
    }
  };

  const loadProducts = async () => {
    if (!currentBranch) return;

    try {
      const { data, error } = await supabase
        .from('products_inv2024')
        .select(`
          *,
          category:categories_inv2024(name),
          supplier:suppliers_inv2024(name),
          location:locations_inv2024(name)
        `)
        .eq('branch_id', currentBranch.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts = data.map(product => ({
        ...product,
        category: product.category?.name || '',
        supplier: product.supplier?.name || '',
        location: product.location?.name || '',
        status: getProductStatus(product.quantity, product.min_stock)
      }));

      dispatch({ type: 'LOAD_PRODUCTS', payload: formattedProducts });
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  };

  const loadCategories = async () => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('categories_inv2024')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('name');

      if (error) throw error;
      dispatch({ type: 'LOAD_CATEGORIES', payload: data });
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  };

  const loadSuppliers = async () => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('suppliers_inv2024')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('name');

      if (error) throw error;
      dispatch({ type: 'LOAD_SUPPLIERS', payload: data });
    } catch (error) {
      console.error('Error loading suppliers:', error);
      throw error;
    }
  };

  const loadLocations = async () => {
    if (!currentBranch) return;

    try {
      const { data, error } = await supabase
        .from('locations_inv2024')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .order('name');

      if (error) throw error;
      dispatch({ type: 'LOAD_LOCATIONS', payload: data });
    } catch (error) {
      console.error('Error loading locations:', error);
      throw error;
    }
  };

  const getProductStatus = (quantity, minStock) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const addProduct = async (productData) => {
    if (!currentBranch) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data, error } = await supabase
        .from('products_inv2024')
        .insert([{
          ...productData,
          branch_id: currentBranch.id,
          organization_id: currentOrganization.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newProduct = {
        ...data,
        status: getProductStatus(data.quantity, data.min_stock)
      };

      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success('Product added successfully!');
      return { data: newProduct, error: null };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to add product');
      return { data: null, error };
    }
  };

  const updateProduct = async (productData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data, error } = await supabase
        .from('products_inv2024')
        .update(productData)
        .eq('id', productData.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct = {
        ...data,
        status: getProductStatus(data.quantity, data.min_stock)
      };

      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      toast.success('Product updated successfully!');
      return { data: updatedProduct, error: null };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to update product');
      return { data: null, error };
    }
  };

  const deleteProduct = async (productId) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { error } = await supabase
        .from('products_inv2024')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      toast.success('Product deleted successfully!');
      return { error: null };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to delete product');
      return { error };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data, error } = await supabase
        .from('products_inv2024')
        .update({ quantity: newQuantity })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id: productId, quantity: newQuantity } 
      });
      
      toast.success('Quantity updated successfully!');
      return { data, error: null };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to update quantity');
      return { data: null, error };
    }
  };

  const addCategory = async (name) => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('categories_inv2024')
        .insert([{
          name,
          organization_id: currentOrganization.id
        }])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'LOAD_CATEGORIES', payload: [...state.categories, data] });
      toast.success('Category added successfully!');
      return { data, error: null };
    } catch (error) {
      toast.error('Failed to add category');
      return { data: null, error };
    }
  };

  const addSupplier = async (supplierData) => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('suppliers_inv2024')
        .insert([{
          ...supplierData,
          organization_id: currentOrganization.id
        }])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'LOAD_SUPPLIERS', payload: [...state.suppliers, data] });
      toast.success('Supplier added successfully!');
      return { data, error: null };
    } catch (error) {
      toast.error('Failed to add supplier');
      return { data: null, error };
    }
  };

  const value = {
    state,
    dispatch,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
    addCategory,
    addSupplier,
    loadAllData
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}