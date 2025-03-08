// src/components/ContactModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        className="bg-secondary dark:bg-primary p-8 shadow-lg max-w-md w-full relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 focus:outline-none"
          aria-label="Close contact modal"
        >
          <X className="w-6 h-6 text-primary dark:text-secondary" />
        </button>
        <h2 className="text-3xl font-bold text-primary dark:text-secondary mb-4">Contact Me</h2>
        <p className="text-lg text-primary dark:text-secondary mb-4">
          You can reach me at <a href="mailto:your-email@example.com" className="underline">your-email@example.com</a>
        </p>
        <p className="text-base text-primary dark:text-secondary">
          Or feel free to drop me a message below.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;
