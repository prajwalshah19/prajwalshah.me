// src/pages/AboutMe.tsx
import React, { useEffect, useRef, useState } from 'react';
import MiniSocialLinks from './MiniSocialLinks';
import ExperienceCallout from './ExperienceCallout';
import { RichText, getAboutText } from '../services/textData';
import { PortableText } from '@portabletext/react';

interface AboutMeProps {
  scrollToExperience: () => void;
}

const MAX_ABOUT_HEIGHT = 500; 
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 500;

const AboutMe: React.FC<AboutMeProps> = ({ scrollToExperience }) => {
  const [about, setAbout] = useState<RichText | null>(null);
  const [showCallout, setShowCallout] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAboutText()
      .then((data) => {
        setAbout(data);
      })
      .catch((error) => console.error('Error fetching about:', error));
  }, []);

  useEffect(() => {
    if (aboutRef.current) {
      const height = aboutRef.current.offsetHeight;
      if (isMobile()) {
        setShowCallout(height < MAX_ABOUT_HEIGHT);
      } else {
        setShowCallout(true);
      }
    }
  }, [about]);

  // Re-evaluate on resize
  useEffect(() => {
    const handleResize = () => {
      if (aboutRef.current) {
        const height = aboutRef.current.offsetHeight;
        if (isMobile()) {
          setShowCallout(height < MAX_ABOUT_HEIGHT);
        } else {
          setShowCallout(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [about]);

  return (
    <div className="relative min-h-screen px-4 flex flex-col">
      {/* Top Content */}
      <div className="pt-4 lg:pt-0 flex-1">
        <h2 className="text-5xl lg:text-7xl font-body text-primary dark:text-secondary mb-4">
          A bit about me...
        </h2>
        <div
          ref={aboutRef}
          className="text-lg text-primary dark:text-secondary mb-8"
          style={{
            fontSize: 'calc(1rem + (0.5rem * ((100vh - 400px) / 400)))',
            overflowWrap: 'break-word',
          }}
        >
          <PortableText value={about?.content} />
        </div>
      </div>
      {/* Bottom Content */}
      {showCallout && (
        <div className="flex flex-col items-center pt-3 pb-8">
          <MiniSocialLinks />
          <ExperienceCallout scrollToExperience={scrollToExperience} />
        </div>
      )}
      {/* Add extra space if callout is hidden */}
      {!showCallout && <div className="h-24" />}
    </div>
  );
};

export default AboutMe;
