import React from 'react';
import AboutMe from '../AboutMe';
import AboutExperience from '../AboutExperience';

const AboutPage: React.FC = () => {
  const scrollToExperience = () => {
    const expSection = document.getElementById('experience');
    if (expSection) {
      expSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full lg:w-3/5 mx-auto space-y-12 lg:p-0 p-2">
      <AboutMe scrollToExperience={scrollToExperience} />
      <AboutExperience />
    </div>
  );
};

export default AboutPage;
