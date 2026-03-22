// src/components/VerticalNav.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export interface NavLink {
  label: string;
  url: string;
}

export interface VerticalNavProps {
  header: string;
  links: NavLink[];
}

const VerticalNav: React.FC<VerticalNavProps> = ({ header, links }) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className="flex flex-col items-start space-y-4">
      <h2 className="lg:text-6xl text-3xl font-bold font-body text-primary dark:text-secondary">
        {header}
      </h2>
      <div className="flex flex-col space-y-4">
        {links.map((link, index) => {
          const isActive = currentPath === link.url;
          return (
            <motion.a
              key={index}
              href={link.url}
              className={`flex items-center space-x-1 no-underline lg:text-4xl text-2xl${
                isActive ? 'font-bold' : ''
              } text-primary dark:text-secondary`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{link.label}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalNav;
