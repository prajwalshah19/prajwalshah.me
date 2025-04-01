// src/components/SocialLinks.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import {
  PlainText,
  getGithubLink,
  getLinkedinLink,
} from '../services/textData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1.5, // delay before the social links animate in
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SocialLinks: React.FC = () => {
  const [githubLink, setGithubLink] = useState<PlainText | null>(null);
  const [linkedinLink, setLinkedinLink] = useState<PlainText | null>(null);

  const links = [
    { label: 'github', url: githubLink?.content },
    { label: 'linkedin', url: linkedinLink?.content },
  ];

  useEffect(() => {
    getGithubLink()
      .then((data: PlainText) => {
        //console.log("Fetched experiences:", data);
        setGithubLink(data);
      })
      .catch((error) => console.error('Error fetching github link', error));
  }, []);

  useEffect(() => {
    getLinkedinLink()
      .then((data: PlainText) => {
        //console.log("Fetched experiences:", data);
        setLinkedinLink(data);
      })
      .catch((error) => console.error('Error fetching linkedin link', error));
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="hidden lg:flex lg:flex-row items-center justify-evenly h-[30vh] w-full text-4xl lg:text-5xl text-primary dark:text-secondary font-body pt-8 pb-8 mt-12 lg:mt-0"
    >
      {links.map((link, index) => (
        <motion.a
          target="_blank"
          key={index}
          href={link.url}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center mb-12 p-0 no-underline"
        >
          <span>{link.label}</span>
          <ArrowUpRight className="w-10 h-10" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialLinks;
