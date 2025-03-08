// src/pages/Projects.tsx
import React, { useState , useEffect } from 'react';
import ContentPage from '../components/ContentPage';
import ProjectCard from '../components/ProjectCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProjects, Project } from '../services/projectData';


const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4; // when this is 2, page nav looks weird FIX IT
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  useEffect(() => {
    getProjects()
      .then((data: Project[]) => {
        //console.log("Fetched projects:", data);
        setProjects(data)})
      .catch(console.error);
  }, []);

  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <ContentPage>
      <div className="w-9/10 lg:w-3/5 mx-auto space-y-8 lg:p-0 p-2 lg:mb-[10vh]">
        <h1 className="text-6xl font-body text-primary dark:text-secondary text-center mt-4 mb-4 lg:mb-8">
          My Work
        </h1>
        <div className="grid lg:gap-x-8 gap-y-4 grid-cols-1 sm:grid-cols-2">
          {currentProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        <div className="flex justify-center items-center space-x-4 mt-8">
        <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center text-primary dark:text-secondary hover:underline disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Prev
          </button>
          <span className="text-primary dark:text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center text-primary dark:text-secondary hover:underline disabled:opacity-50"
          >
            Next <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </ContentPage>
  );
};

export default Projects;
