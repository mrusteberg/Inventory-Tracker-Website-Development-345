import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

function StatsCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600'
  };

  const trendColor = trend.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${trendColor} mt-1`}>{trend} from last month</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <SafeIcon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default StatsCard;