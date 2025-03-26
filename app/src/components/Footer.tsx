// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Projects', url: '/projects' },
  { label: 'More', url: '/more' },
  { label: 'Contact', url: '/contact' },
];

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 bg-secondary dark:bg-primary">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Navigation */}
        <nav className="mb-2">
          <ul className="flex flex-row items-center justify-center space-x-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.url}
                  className="text-primary dark:text-secondary hover:underline text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Divider */}
        <div className="border-t border-primary dark:border-secondary my-2"></div>
        {/* Copyright */}
        <p className="text-primary dark:text-secondary text-sm font-headline">
          © {new Date().getFullYear()} Prajwal Shah. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
