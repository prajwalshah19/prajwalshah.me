// src/components/ProjectCard.tsx
import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Project } from '../services/projectData';
import { PortableText } from '@portabletext/react';
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="border border-primary dark:border-secondary p-6 shadow-md hover:shadow-xl transition-shadow duration-300 bg-secondary dark:bg-primary">
      <h3 className="text-2xl font-body text-primary dark:text-secondary mb-2">
        {project.name}
      </h3>
      <p className="text-sm text-primary dark:text-secondary mb-2">
        {project.dates}
      </p>
      <div className="text-base text-primary dark:text-secondary mb-4">
        <PortableText value={project.description} />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-primary dark:text-secondary hover:underline"
      >
        <span>View</span>
        <ArrowUpRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
};

export default ProjectCard;
