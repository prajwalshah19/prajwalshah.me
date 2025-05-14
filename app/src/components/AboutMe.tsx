// src/pages/AboutMe.tsx
import React, { useEffect, useRef, useState } from 'react';
import MiniSocialLinks from './MiniSocialLinks';
import ExperienceCallout from './ExperienceCallout';
import { RichText, getAboutText } from '../services/textData';
import { PortableText, PortableTextComponents } from '@portabletext/react';

interface AboutMeProps {
  scrollToExperience: () => void;
}

const MAX_ABOUT_HEIGHT = 500; 
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 500;

const portableTextComponents: PortableTextComponents = {
  block: {
    // Handle 'normal' blocks (paragraphs)
    normal: ({ children }) => {
      if (!children || (Array.isArray(children) && children.length === 0)) {
        return <p></p>;
      }

      const renderNodesWithLineBreaks = (nodes: React.ReactNode[] | React.ReactNode) => {
        const nodesArray = Array.isArray(nodes) ? nodes : [nodes];
        
        return nodesArray.flatMap((node, index) => {
          if (typeof node === 'string' && node.includes('\n')) {
            return node.split('\n').map((line, lineIndex) => (
              <React.Fragment key={`line-${index}-${lineIndex}`}>
                {lineIndex > 0 && <br />}
                {line}
              </React.Fragment>
            ));
          }
          return <React.Fragment key={`node-${index}`}>{node}</React.Fragment>; 
        });
      };

      return <p>{renderNodesWithLineBreaks(children)}</p>;
    },
  },
};

const AboutMe: React.FC<AboutMeProps> = ({ scrollToExperience }) => {
  const [about, setAbout] = useState<RichText | null>(null);
  const [, setShowCallout] = useState(true);
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
    <div className="relative min-h-screen px-4 flex flex-col pb-32 sm:pb-40">
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
          <PortableText value={about?.content} components={portableTextComponents} />
        </div>
      </div>
      {/* Bottom Content: Always show ExperienceCallout, ensure space below */}
      <div className="flex flex-col items-center pt-3 pb-8">
        <MiniSocialLinks />
        <ExperienceCallout scrollToExperience={scrollToExperience} />
      </div>
    </div>
  );
};

export default AboutMe;
