// src/pages/AboutMe.tsx
import React, { useEffect, useState } from 'react';
import MiniSocialLinks from './MiniSocialLinks';
import ExperienceCallout from './ExperienceCallout';
import { RichText, getAboutText } from '../services/textData';
import { PortableText } from '@portabletext/react';
interface AboutMeProps {
  scrollToExperience: () => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ scrollToExperience }) => {
  const [about, setAbout] = useState<RichText | null>(null);

  useEffect(() => {
    getAboutText()
      .then((data) => {
        //console.log('Fetched about:', data);
        setAbout(data);
      })
      .catch((error) => console.error('Error fetching about:', error));
  }, []);

  return (
    <div className="relative h-screen px-4">
      {/* Top Content */}
      <div className="pt-4 lg:pt-0">
        <h2 className="text-5xl lg:text-7xl font-body text-primary dark:text-secondary mb-4">
          A bit about me...
        </h2>
        <div
          className="text-lg text-primary dark:text-secondary mb-8"
          style={{
            fontSize: 'calc(1rem + (0.5rem * ((100vh - 400px) / 400)))',
          }}
        >
          <PortableText value={about?.content} />
        </div>
      </div>
      {/* Bottom Content - Absolutely positioned with viewport calculation */}
      <div className="absolute left-0 right-0 bottom-[calc(15vh)] flex flex-col items-center pt-3">
        <MiniSocialLinks />
        <ExperienceCallout scrollToExperience={scrollToExperience} />
      </div>
    </div>
  );
};

export default AboutMe;
