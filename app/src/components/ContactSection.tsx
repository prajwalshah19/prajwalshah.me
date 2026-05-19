import React, { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import MiniSocialLinks from './MiniSocialLinks';
import { RichText, getContactText } from '../services/textData';

const ContactSection: React.FC = () => {
  const [contactText, setContactText] = useState<RichText | null>(null);

  useEffect(() => {
    getContactText()
      .then(setContactText)
      .catch((error) => console.error('Error fetching contact text:', error));
  }, []);

  return (
    <section
      id="contact"
      className="w-full min-h-screen flex items-center bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-4">
          Let's talk
        </h2>
        <div className="text-xs lg:text-sm text-primary dark:text-secondary mb-4">
          {contactText?.content && (
            <PortableText value={contactText.content} />
          )}
        </div>
        <MiniSocialLinks />
      </div>
    </section>
  );
};

export default ContactSection;
