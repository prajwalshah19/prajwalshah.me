import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { getProjects, Project } from '../services/projectData';

const FEATURED = 3;

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const featured = projects.slice(0, FEATURED);
  const archive = projects.slice(FEATURED);

  return (
    <section
      id="projects"
      className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-6">
          Projects
        </h2>

        <div className="max-h-[60vh] overflow-y-auto text-left">
          <ul className="divide-y divide-primary/30 dark:divide-secondary/30 border-t border-b border-primary/30 dark:border-secondary/30">
            {featured.map((project) => {
              const isOpen = expandedId === project._id;
              return (
                <li key={project._id}>
                  <button
                    type="button"
                    onClick={() => toggle(project._id)}
                    aria-expanded={isOpen}
                    className="w-full text-left py-2.5 flex items-center gap-3 focus:outline-none"
                  >
                    <span className="text-primary dark:text-secondary opacity-70 text-xs w-3 shrink-0">
                      ◆
                    </span>
                    <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
                      <span className="text-xs text-primary dark:text-secondary truncate">
                        {project.name}
                      </span>
                      <span className="text-[11px] text-primary dark:text-secondary opacity-70 truncate">
                        {project.dates}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-primary dark:text-secondary shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 pl-6 pr-4 text-[11px] text-primary dark:text-secondary opacity-90">
                          <div className="mb-2">
                            <PortableText value={project.description} />
                          </div>
                          {project.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-full text-[9px]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <Link
                            to={`/projects/${project.slug?.current}`}
                            className="inline-flex items-center hover:underline text-[11px]"
                          >
                            <span>Details</span>
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}

            {archive.map((project) => (
              <li key={project._id}>
                <Link
                  to={`/projects/${project.slug?.current}`}
                  className="flex items-center gap-3 py-2 text-primary dark:text-secondary hover:underline"
                >
                  <span className="opacity-70 text-xs w-3 shrink-0">◆</span>
                  <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
                    <span className="text-xs truncate">{project.name}</span>
                    <span className="text-[11px] opacity-70 truncate">
                      {project.dates}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
