import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;
