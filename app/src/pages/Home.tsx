// src/pages/Home.tsx
import React from 'react';
import Hero from '../components/Hero';
import Bio from '../components/Bio';
import ThemeToggle from '../components/ThemeToggle';

const Home: React.FC = () => {
  // Scroll smoothly to the 'about' section when the arrow is clicked
  const scrollToBio = () => {
    const aboutSection = document.getElementById('bio');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg:secondary dark:bg-primary mx-auto w-screen h-screen">
      <ThemeToggle />
      <Hero scrollToBio={scrollToBio} />
      <Bio />
    </div>
  );
};

export default Home;
