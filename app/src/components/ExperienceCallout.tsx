// src/components/ExperienceCallout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ExperienceCalloutProps {
  scrollToExperience: () => void;
}

const ExperienceCallout: React.FC<ExperienceCalloutProps> = ({ scrollToExperience }) => {
  return (
    <motion.div
      onClick={scrollToExperience}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full flex items-center justify-center cursor-pointer mt-8"
    >
      <motion.span
        className="flex items-center justify-center text-xl text-primary dark:text-secondary"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        My experience
        <ArrowDown className="w-6 h-6 text-primary dark:text-secondary ml-2" />
      </motion.span>
    </motion.div>
  );
};

export default ExperienceCallout;
