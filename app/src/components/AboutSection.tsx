import React, { useEffect, useState } from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { RichText, getAboutText } from '../services/textData';

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => {
      const isEmpty =
        Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === 'string' &&
        children[0].trim() === '';
      if (isEmpty) return <div className="h-2" />;
      return <p className="mb-4">{children}</p>;
    },
  },
};

const AboutSection: React.FC = () => {
  const [about, setAbout] = useState<RichText | null>(null);

  useEffect(() => {
    getAboutText().then(setAbout).catch(console.error);
  }, []);

  return (
    <section
      id="about"
      className="w-full min-h-screen flex items-center bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-6">
          About
        </h2>
        <div className="text-xs text-primary dark:text-secondary leading-relaxed text-left">
          {about?.content && (
            <PortableText
              value={about.content}
              components={portableTextComponents}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
