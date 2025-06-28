import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import ProductForm from '../components/ProductForm';

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = state.products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      dispatch({ 
        type: 'UPDATE_PRODUCT', 
        payload: { ...productData, id: product.id } 
      });
      navigate('/inventory');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update the product information below</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Update Product"
      />
    </motion.div>
  );
}

export default EditProduct;