import ExperienceList from './ExperienceList';

const ExperienceSection = () => (
  <section
    id="experience"
    aria-labelledby="experience-heading"
    className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
  >
    <div className="w-full max-w-xl mx-auto px-6">
      <h2
        id="experience-heading"
        className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary text-center mb-6"
      >
        Experience
      </h2>
      <ExperienceList />
    </div>
  </section>
);

export default ExperienceSection;
