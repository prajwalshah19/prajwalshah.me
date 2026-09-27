// src/components/ThemeToggle.tsx
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC<{ inline?: boolean }> = ({ inline = false }) => {
  // Initialize theme state based on <html> class
  const initialTheme = document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
  const [currentTheme, setCurrentTheme] = useState<string>(initialTheme);


  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
      setCurrentTheme('light');
    } else if (document.documentElement.classList.contains('light')) {
      document.documentElement.classList.replace('light', 'dark');
      //document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setCurrentTheme('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={
        inline
          ? 'p-0 focus:outline-none bg-transparent border-none'
          : 'fixed top-4 right-4 z-50 p-2 focus:outline-none bg-transparent border-none'
      }
    >
      {currentTheme === 'light' ? (
        <Moon
          className={`${inline ? 'w-4 h-4' : 'w-6 h-6'} text-primary dark:text-secondary`}
        />
      ) : (
        <Sun
          className={`${inline ? 'w-4 h-4' : 'w-6 h-6'} text-primary dark:text-secondary`}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
