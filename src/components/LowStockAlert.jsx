import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useInventory } from '../context/InventoryContext';

const { FiAlertTriangle, FiArrowRight } = FiIcons;

function LowStockAlert() {
  const { state } = useInventory();
  const { products } = state;

  const lowStockProducts = products.filter(
    product => product.status === 'Low Stock' || product.status === 'Out of Stock'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Stock Alerts</h2>
        <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-yellow-500" />
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiIcons.FiCheckCircle} className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">All products are well stocked!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-l-4 ${
                product.status === 'Out of Stock'
                  ? 'bg-red-50 border-red-400'
                  : 'bg-yellow-50 border-yellow-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-600">
                    {product.quantity} units remaining
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'Out of Stock'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </motion.div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/inventory"
              className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all inventory
              <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LowStockAlert;