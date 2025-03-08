// src/pages/AboutExperience.tsx
import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';
import { Experience, getExperiences } from '../services/experienceData';
import { RichText } from '../services/textData';
import { getExperienceText } from '../services/textData';
import { PortableText } from '@portabletext/react';

const AboutExperience: React.FC = () => {
  const [timelineData, setTimelineData] = useState<Experience[]>([]);
  const [experienceText, setExperienceText] = useState<RichText | null>(null);

  useEffect(() => {
    getExperiences()
      .then((data: Experience[]) => {
        //console.log("Fetched experiences:", data);
        setTimelineData(data);
      })
      .catch((error) => console.error("Error fetching experiences:", error));
  }, []);

  useEffect(() => {
    getExperienceText()
      .then((data: RichText) => {
        //console.log("Fetched experience text:", data);
        setExperienceText(data);
      })
      .catch((error) => console.error("Error fetching experiences:", error));
  }, []);


  return (
    <div className="flex flex-col items-start h-[98vh]" id="experience">
      <h2 className="text-5xl lg:text-7xl font-body text-primary dark:text-secondary mt-4 mb-4">
        My Journey
      </h2>
      <div className="text-lg text-primary dark:text-secondary mb-8">
        <PortableText value = {experienceText?.content} />
      </div>
      <Timeline entries={timelineData} />
    </div>
  );
};

export default AboutExperience;
