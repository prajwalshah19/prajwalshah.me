// src/components/Footer.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Home', anchor: 'top' },
  { label: 'About', anchor: 'about' },
  { label: 'Experience', anchor: 'experience' },
  { label: 'Work', anchor: 'work' },
  { label: 'Contact', anchor: 'contact' },
];

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (anchor: string) => {
    if (location.pathname === '/') {
      if (anchor === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: anchor === 'top' ? undefined : { scrollTo: anchor } });
    }
  };

  return (
    <footer className="w-full py-4 bg-secondary dark:bg-primary">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <nav className="mb-2">
          <ul className="flex flex-row items-center justify-center space-x-4">
            {menuItems.map((item) => (
              <li key={item.anchor}>
                <button
                  type="button"
                  onClick={() => goToSection(item.anchor)}
                  className="text-primary dark:text-secondary hover:underline text-base bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-primary dark:border-secondary my-2"></div>
        <p className="text-primary dark:text-secondary text-sm font-headline">
          © {new Date().getFullYear()} Prajwal Shah. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
