import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import OrganizationSwitcher from './layout/OrganizationSwitcher';
import BranchSwitcher from './layout/BranchSwitcher';
import UserMenu from './layout/UserMenu';

const { FiPackage, FiHome, FiList, FiPlus, FiBarChart3, FiSettings, FiMenu, FiX, FiUsers, FiHelpCircle } = FiIcons;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/inventory', icon: FiList, label: 'Inventory' },
    { path: '/add-product', icon: FiPlus, label: 'Add Product' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' },
    { path: '/team', icon: FiUsers, label: 'Team' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <SafeIcon icon={FiPackage} className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">InventoryPro</span>
            </Link>
            <div className="hidden lg:flex items-center space-x-2">
              <OrganizationSwitcher />
              <BranchSwitcher />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <SafeIcon icon={isOpen ? FiX : FiMenu} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex flex-col space-y-2 px-3 py-2 border-b border-gray-100 mb-2">
              <OrganizationSwitcher />
              <BranchSwitcher />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;