import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { toPlainText } from '@portabletext/react';
import { getProjects, Project } from '../services/projectData';

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  useEffect(() => {
    let active = true;
    getProjects()
      .then((items) => {
        if (!active) return;
        setProjects(items);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  if (status !== 'ready' || projects.length === 0) {
    return (
      <p
        role="status"
        className="py-8 text-center text-xs text-primary dark:text-secondary opacity-70"
      >
        {status === 'loading'
          ? 'Loading projects…'
          : status === 'error'
            ? 'Couldn’t load projects. Please try again later.'
            : 'No projects yet.'}
      </p>
    );
  }

  return (
    <ul className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30">
      {projects.map((project) => (
        <li key={project._id}>
          <Link
            to={`/projects/${project.slug.current}`}
            className="group flex items-start gap-4 py-5 text-primary dark:text-secondary"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-sm font-body group-hover:underline underline-offset-4">
                  {project.name}
                </h3>
                {project.dates && (
                  <span className="shrink-0 text-[10px] opacity-60">
                    {project.dates}
                  </span>
                )}
              </div>
              {project.description?.length > 0 && (
                <p className="mt-2 text-xs leading-relaxed opacity-70 line-clamp-2 sm:line-clamp-1">
                  {toPlainText(project.description)}
                </p>
              )}
            </div>
            <ArrowUpRight
              aria-hidden="true"
              className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectsList;
