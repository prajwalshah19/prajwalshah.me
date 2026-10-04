import React from 'react';
import { useRequest } from '../hooks/useRequest';
import RequestError from '../components/RequestError';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import { getProjectBySlug } from '../services/projectData';

// The page already renders the project name as its own heading, so drop a
// redundant leading "# Title" line from the markdown body if present.
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+.+\n?/, '');
}

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const result = useRequest(slug || '', getProjectBySlug);
  if (result.status === 'loading') return <LoadingScreen />;
  if (result.status === 'error') return <RequestError label="this project" />;
  const project = result.data;

  if (!project) {
    return (
      <>
        <div className="w-full lg:w-3/5 mx-auto py-8 px-4 text-center">
          <h1 className="text-4xl font-body text-primary dark:text-secondary mb-4">
            Project not found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-2">
          {project.name}
        </h1>
        <p className="text-sm text-primary dark:text-secondary mb-4">
          {project.dates}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <MarkdownRenderer markdown={stripLeadingH1(project.content)} />
      </div>
    </>
  );
};

export default ProjectDetail;
