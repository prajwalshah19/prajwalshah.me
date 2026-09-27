// src/components/ContentPage.tsx
import React from 'react';
import CenteredNav from './CenteredNav';

interface ContentPageProps {
  children: React.ReactNode;
}

const ContentPage: React.FC<ContentPageProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-secondary dark:bg-primary">
      <CenteredNav />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default ContentPage;
