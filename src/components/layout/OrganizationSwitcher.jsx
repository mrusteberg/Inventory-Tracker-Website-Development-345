import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiChevronDown, FiBuilding, FiCheck } = FiIcons;

function OrganizationSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentOrganization, userOrganizations, switchOrganization } = useAuth();

  if (!currentOrganization) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <SafeIcon icon={FiBuilding} className="h-4 w-4" />
        <span className="max-w-32 truncate">{currentOrganization.name}</span>
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
                Organizations
              </div>
              {userOrganizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiBuilding} className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{org.userRole}</div>
                    </div>
                  </div>
                  {currentOrganization.id === org.id && (
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

export default OrganizationSwitcher;