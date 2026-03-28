// src/components/FeaturedNav.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getProjects, Project } from '../services/projectData';

const MotionLink = motion(Link);

const FeaturedNav: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-start space-y-4">
      <h2 className="lg:text-6xl text-3xl font-bold font-body text-primary dark:text-secondary">
        Featured
      </h2>
      <div className="flex flex-col space-y-4">
        {projects.map((project) => (
          <MotionLink
            key={project._id}
            to={`/projects/${project.slug?.current}`}
            className="flex items-center space-x-1 no-underline lg:text-4xl text-2xl text-primary dark:text-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{project.name} <ArrowUpRight className="w-5 h-5 inline" /></span>
          </MotionLink>
        ))}
      </div>
    </div>
  );
};

export default FeaturedNav;
