// src/components/ThemeToggle.tsx
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');

  useEffect(() => {
    // Read initial theme from DOM on mount
    const theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    setCurrentTheme(theme);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
      setCurrentTheme('light');
    } else if (document.documentElement.classList.contains('light')) {
      document.documentElement.classList.replace('light', 'dark');
      localStorage.setItem('theme', 'dark');
      setCurrentTheme('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 p-2 focus:outline-none bg-transparent border-none"
    >
      {currentTheme === 'light' ? (
        <Moon className="w-6 h-6 text-primary dark:text-secondary" />
      ) : (
        <Sun className="w-6 h-6 text-primary dark:text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggle;
