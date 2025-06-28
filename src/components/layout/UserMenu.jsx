import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiUser, FiSettings, FiLogOut, FiChevronDown } = FiIcons;

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <div className="font-medium">
            {user.user_metadata?.full_name || 'User'}
          </div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
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
              className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="font-medium text-gray-900">
                  {user.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiUser} className="h-4 w-4 mr-2" />
                Profile
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4 mr-2" />
                Settings
              </Link>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;