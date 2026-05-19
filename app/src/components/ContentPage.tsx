// src/components/ContentPage.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';

interface ContentPageProps {
  children: React.ReactNode;
  /** When true, removes top padding so a hero can occupy the full viewport. */
  fullBleed?: boolean;
}

const ContentPage: React.FC<ContentPageProps> = ({
  children,
  fullBleed = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen relative w-full bg-secondary dark:bg-primary">
      <ThemeToggle />

      <main className={`flex-grow ${fullBleed ? '' : 'pt-20 lg:pt-2'}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default ContentPage;
