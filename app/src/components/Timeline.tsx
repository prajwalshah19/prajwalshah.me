// src/components/Timeline.tsx
import React from 'react';
import { PortableText } from '@portabletext/react';
import { Experience } from '../services/experienceData';

interface TimelineProps {
  entries: Experience[];
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  return (
    <div className="w-full lg:w-3/5 mx-auto flex flex-col items-start">
      {entries.map((entry, index) => (
        <div key={entry._id} className="flex mb-8">
          <div className="flex flex-col items-center mr-4">
            <div className="w-4 h-4 rounded-full bg-primary dark:bg-secondary"></div>
            {index !== entries.length && (
              <div className="flex-1 w-px bg-primary dark:bg-secondary"></div>
            )}
          </div>
          <div>
            <p className="text-sm text-primary dark:text-secondary">{entry.dateRange}</p>
            <h3 className="text-xl font-bold text-primary dark:text-secondary">
              {entry.position}
            </h3>
            <h4 className="text-lg text-primary dark:text-secondary">
              {entry.company}
            </h4>
            {entry.location && (
              <p className="text-sm italic text-primary dark:text-secondary">
                {entry.location}
              </p>
            )}
            <div className="mt-2 text-base text-primary dark:text-secondary">
              <PortableText value={entry.description} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
