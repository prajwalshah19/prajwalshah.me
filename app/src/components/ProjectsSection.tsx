import ProjectsList from './ProjectsList';

const ProjectsSection = () => (
  <section
    id="projects"
    className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
  >
    <div className="w-full max-w-xl mx-auto px-6">
      <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary text-center mb-6">
        Projects
      </h2>
      <ProjectsList />
    </div>
  </section>
);

export default ProjectsSection;
