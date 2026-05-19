import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import { Project, getProjectBySlug } from '../services/projectData';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const goBack = () =>
    navigate('/', { state: { scrollTo: 'work', workTab: 'projects' } });

  if (loading) return <LoadingScreen />;

  if (!project) {
    return (
      <ContentPage>
        <div className="w-full lg:w-3/5 mx-auto py-8 px-4 text-center">
          <h1 className="text-4xl font-body text-primary dark:text-secondary mb-4">
            Project not found
          </h1>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center text-primary dark:text-secondary hover:underline bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to work
          </button>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center text-primary dark:text-secondary hover:underline mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to work
        </button>
        <h1 className="text-5xl font-body text-primary dark:text-secondary mt-4 mb-2">
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
        <MarkdownRenderer markdown={project.content} />
      </div>
    </ContentPage>
  );
};

export default ProjectDetail;
