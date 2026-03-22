import React from 'react';
import Hero from '../Hero';
import Bio from '../Bio';
import ThemeToggle from '../ThemeToggle';

const HomePage: React.FC = () => {
  const scrollToBio = () => {
    const aboutSection = document.getElementById('bio');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-secondary dark:bg-primary mx-auto w-screen h-screen">
      <ThemeToggle />
      <Hero scrollToBio={scrollToBio} />
      <Bio />
    </div>
  );
};

export default HomePage;
