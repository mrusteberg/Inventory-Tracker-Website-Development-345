import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';

const { FiChevronDown, FiMapPin, FiCheck } = FiIcons;

function BranchSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const { currentOrganization, currentBranch, switchBranch } = useAuth();

  useEffect(() => {
    if (currentOrganization) {
      loadBranches();
    }
  }, [currentOrganization]);

  const loadBranches = async () => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('name');

      if (error) throw error;
      setBranches(data);
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  if (!currentBranch || branches.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <SafeIcon icon={FiMapPin} className="h-4 w-4" />
        <span className="max-w-32 truncate">{currentBranch.name}</span>
        <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
            >
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                Branches
              </div>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    switchBranch(branch);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{branch.name}</div>
                      {branch.address && (
                        <div className="text-xs text-gray-500 truncate">
                          {branch.address}
                        </div>
                      )}
                    </div>
                  </div>
                  {currentBranch.id === branch.id && (
                    <SafeIcon icon={FiCheck} className="h-4 w-4 text-primary-600" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BranchSwitcher;