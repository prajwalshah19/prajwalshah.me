import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { Experience, getExperiences } from '../services/experienceData';

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  useEffect(() => {
    let active = true;
    getExperiences()
      .then((items) => {
        if (!active) return;
        setExperiences(items);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Error fetching experience:', error);
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
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

        {status !== 'ready' || experiences.length === 0 ? (
          <p
            role="status"
            className="py-8 text-center text-xs text-primary dark:text-secondary opacity-70"
          >
            {status === 'loading'
              ? 'Loading experience…'
              : status === 'error'
                ? 'Couldn’t load experience. Please try again later.'
                : 'No experience listed yet.'}
          </p>
        ) : (
          <ul className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30">
            {experiences.map((experience) => (
              <li
                key={experience._id}
                className="py-5 text-primary dark:text-secondary"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-body">{experience.company}</h3>
                  {experience.dateRange && (
                    <span className="shrink-0 text-[10px] opacity-60">
                      {experience.dateRange}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs opacity-70">
                  <p>{experience.position}</p>
                  {experience.location && (
                    <p className="text-[10px]">{experience.location}</p>
                  )}
                </div>
                {experience.description?.length > 0 && (
                  <div className="mt-2 text-xs leading-relaxed opacity-70 [&>p+p]:mt-2">
                    <PortableText value={experience.description} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
