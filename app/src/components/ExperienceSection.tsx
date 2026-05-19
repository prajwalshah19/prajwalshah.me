import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { RichText, getExperienceText } from '../services/textData';
import { Experience, getExperiences } from '../services/experienceData';

function yearOf(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return String(d.getFullYear());
}

const ExperienceSection: React.FC = () => {
  const [intro, setIntro] = useState<RichText | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getExperienceText().then(setIntro).catch(console.error);
    getExperiences().then(setExperiences).catch(console.error);
  }, []);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section
      id="experience"
      className="w-full min-h-screen flex items-center bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-2">
          Experience
        </h2>

        {intro?.content && (
          <div className="text-[11px] text-primary dark:text-secondary opacity-80 mb-5">
            <PortableText value={intro.content} />
          </div>
        )}

        <ul className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-t border-b border-primary/30 dark:border-secondary/30 max-h-[60vh] overflow-y-auto">
          {experiences.map((exp) => {
            const isOpen = expandedId === exp._id;
            return (
              <li key={exp._id}>
                <button
                  type="button"
                  onClick={() => toggle(exp._id)}
                  aria-expanded={isOpen}
                  aria-controls={`exp-body-${exp._id}`}
                  className="w-full text-left py-2.5 flex items-center gap-3 focus:outline-none"
                >
                  <span className="font-mono text-[11px] tabular-nums text-primary dark:text-secondary opacity-70 w-9 shrink-0">
                    {yearOf(exp.date)}
                  </span>
                  <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
                    <span className="text-xs text-primary dark:text-secondary truncate">
                      {exp.company}
                    </span>
                    <span className="text-[11px] text-primary dark:text-secondary opacity-70 truncate">
                      {exp.position}
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
                      id={`exp-body-${exp._id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 pl-12 pr-4 text-[11px] text-primary dark:text-secondary opacity-90">
                        <div className="text-[9px] opacity-70 mb-1">
                          {exp.dateRange}
                          {exp.location && ` · ${exp.location}`}
                        </div>
                        <PortableText value={exp.description} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ExperienceSection;
