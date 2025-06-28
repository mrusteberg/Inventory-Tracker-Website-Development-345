import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useInventory } from '../context/InventoryContext';

const { FiPackage, FiEdit, FiTrash2, FiPlus } = FiIcons;

function RecentActivity() {
  const { state } = useInventory();
  
  // Mock recent activities - in a real app, this would come from an activity log
  const activities = [
    {
      id: 1,
      type: 'added',
      product: 'MacBook Pro 16"',
      quantity: 25,
      time: '2 hours ago',
      icon: FiPlus,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'updated',
      product: 'iPhone 15 Pro',
      quantity: 3,
      time: '4 hours ago',
      icon: FiEdit,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'low_stock',
      product: 'Office Chair Ergonomic',
      quantity: 0,
      time: '6 hours ago',
      icon: FiPackage,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'updated',
      product: 'Wireless Mouse',
      quantity: 150,
      time: '1 day ago',
      icon: FiEdit,
      color: 'text-blue-600'
    },
    {
      id: 5,
      type: 'added',
      product: 'Standing Desk',
      quantity: 12,
      time: '2 days ago',
      icon: FiPlus,
      color: 'text-green-600'
    }
  ];

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'added':
        return `Added ${activity.quantity} units of ${activity.product}`;
      case 'updated':
        return `Updated quantity for ${activity.product} to ${activity.quantity}`;
      case 'low_stock':
        return `${activity.product} is out of stock`;
      default:
        return `Activity for ${activity.product}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-gray-100`}>
              <SafeIcon icon={activity.icon} className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{getActivityMessage(activity)}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;