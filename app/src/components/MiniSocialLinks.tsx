// src/components/MiniSocialLinks.tsx
import React, { useEffect, useState } from 'react';
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
      delay: 1.0,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const MiniSocialLinks: React.FC = () => {
  const [githubLink, setGithubLink] = useState<PlainText | null>(null);
  const [linkedinLink, setLinkedinLink] = useState<PlainText | null>(null);

  const links = [
    { label: 'github', url: githubLink?.content },
    { label: 'linkedin', url: linkedinLink?.content }
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
      className="flex flex-row items-center justify-center space-x-4 w-full pt-1"
    >
      {links.map((link, index) => (
        <motion.a
          target="_blank"
          key={index}
          href={link.url}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center no-underline text-base text-primary dark:text-secondary"
        >
          <span>{link.label}</span>
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default MiniSocialLinks;
