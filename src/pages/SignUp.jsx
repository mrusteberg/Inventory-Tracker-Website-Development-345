import React from 'react';
import { motion } from 'framer-motion';
import SignUpForm from '../components/auth/SignUpForm';

function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <SignUpForm />
      </motion.div>
    </div>
  );
}

export default SignUp;