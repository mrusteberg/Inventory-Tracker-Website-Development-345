import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import ProductForm from '../components/ProductForm';

function AddProduct() {
  const navigate = useNavigate();
  const { dispatch } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
      navigate('/inventory');
    } catch (error) {
      console.error('Error adding product:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Fill in the details to add a new product to your inventory</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Add Product"
      />
    </motion.div>
  );
}

export default AddProduct;