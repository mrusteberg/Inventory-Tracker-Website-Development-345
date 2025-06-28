import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiPlus, FiMinus } = FiIcons;

function QuantityModal({ product, onClose, onUpdate }) {
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(Math.max(0, quantity));
  };

  const adjustQuantity = (amount) => {
    setQuantity(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Update Quantity</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Product: {product.name}</p>
          <p className="text-sm text-gray-600">Current quantity: {product.quantity}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
              >
                <SafeIcon icon={FiMinus} className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default QuantityModal;