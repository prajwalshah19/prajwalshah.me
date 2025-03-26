// src/pages/About.tsx
import React from 'react';
import ContentPage from '../components/ContentPage';
import AboutMe from '../components/AboutMe';
import AboutExperience from '../components/AboutExperience';

const About: React.FC = () => {
  const scrollToExperience = () => {
    const expSection = document.getElementById('experience');
    if (expSection) {
      expSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto space-y-12 lg:p-0 p-2">
        <AboutMe scrollToExperience={scrollToExperience} />
        <AboutExperience />
      </div>
    </ContentPage>
  );
};

export default About;
