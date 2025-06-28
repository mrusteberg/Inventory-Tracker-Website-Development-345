import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import LowStockAlert from '../components/LowStockAlert';

const { FiPackage, FiAlertTriangle, FiTrendingUp, FiDollarSign } = FiIcons;

function Dashboard() {
  const { state } = useInventory();
  const { currentOrganization, currentBranch } = useAuth();
  const { products } = state;

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'Out of Stock').length;
  const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: FiPackage,
      color: 'primary',
      trend: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      icon: FiAlertTriangle,
      color: 'warning',
      trend: '-5%'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: FiAlertTriangle,
      color: 'danger',
      trend: '+2%'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'success',
      trend: '+8%'
    }
  ];

  if (!currentOrganization || !currentBranch) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <SafeIcon icon={FiIcons.FiBuilding} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Selected</h3>
          <p className="text-gray-500 mb-6">Please select an organization and branch to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening at {currentBranch.name}, {currentOrganization.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <RecentActivity />
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LowStockAlert />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/add-product"
            className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-primary-700 font-medium">Add Product</span>
          </Link>
          <Link
            to="/inventory"
            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <SafeIcon icon={FiIcons.FiList} className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">View Inventory</span>
          </Link>
          <Link
            to="/reports"
            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
          >
            <SafeIcon icon={FiIcons.FiBarChart3} className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-purple-700 font-medium">View Reports</span>
          </Link>
          <Link
            to="/team"
            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <SafeIcon icon={FiIcons.FiUsers} className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">Manage Team</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;