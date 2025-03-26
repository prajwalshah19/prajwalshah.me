// src/components/LoadingScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-screen h-screen bg-secondary dark:bg-primary"
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader className="w-12 h-12 text-primary dark:text-secondary animate-spin" />
        <p className="text-2xl font-body text-primary dark:text-secondary">
          Loading...
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
