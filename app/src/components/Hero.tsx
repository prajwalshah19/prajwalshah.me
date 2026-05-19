import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  scrollToNext: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToNext }) => {
  return (
    <section
      id="top"
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8"
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-body text-primary dark:text-secondary leading-[1.05]"
        >
          Hi, I'm Praj
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 text-sm lg:text-base font-body text-primary dark:text-secondary"
        >
          Computer Science and Economics @ Purdue
        </motion.p>
      </div>

      <button
        onClick={scrollToNext}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 text-primary dark:text-secondary opacity-60 hover:opacity-100 transition-opacity duration-200 focus:outline-none"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};

export default Hero;
