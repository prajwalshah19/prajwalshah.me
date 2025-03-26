// src/components/ContentPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';

interface ContentPageProps {
  children: React.ReactNode;
}

const menuItems = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Projects', url: '/projects' },
  { label: 'More', url: '/more' },
  { label: 'Contact', url: '/contact' },
];

const ContentPage: React.FC<ContentPageProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen relative w-full bg-secondary dark:bg-primary">
      <div className="absolute lg:sticky top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <ThemeToggle />
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="p-3 border border-primary dark:border-secondary rounded-full bg-transparent focus:outline-none"
        >
          <motion.div
            animate={{ rotate: menuOpen ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-primary dark:text-secondary" />
            ) : (
              <Menu className="w-6 h-6 text-primary dark:text-secondary" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow pt-20 lg:pt-2">{children}</main>

      {/* Footer always sticks to bottom */}
      <Footer />

      {/* Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-secondary bg-opacity-90 dark:bg-primary dark:bg-opacity-90 flex items-center justify-center"
          >
            <div className="bg-transparent p-4">
              <ul className="space-y-6 text-center">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="text-3xl text-primary dark:text-secondary font-body"
                  >
                    <Link
                      to={item.url}
                      onClick={toggleMenu}
                      className="no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentPage;
