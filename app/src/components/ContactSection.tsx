import React from 'react';
import MiniSocialLinks from './MiniSocialLinks';

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-4">
          Let's talk
        </h2>
        <MiniSocialLinks />
      </div>
    </section>
  );
};

export default ContactSection;
