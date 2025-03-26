import React, { useEffect, useState } from 'react';
import FeaturedNav from './FeaturedNav';
import GotoNav from './GotoNav';
import { RichText, getBioText } from '../services/textData';
import { PortableText } from '@portabletext/react';
const Bio: React.FC = () => {
  const [bio, setBio] = useState<RichText | null>(null);

  useEffect(() => {
    getBioText()
      .then((data) => {
        //console.log('Fetched bio:', data);
        setBio(data);
      })
      .catch((error) => console.error('Error fetching bio:', error));
  }, []);

  return (
    <section
      id="bio"
      className="w-full h-[98vh] lg:h-screen flex lg:items-center justify-center bg-secondary dark:bg-primary"
    >
      <div className="flex flex-col items-start justify-start pt-[0.5vh] lg:pt-[1vh] px-4 lg:w-[80vw] lg:h-[75vh] lg:border-4 lg:border-primary lg:dark:border-secondary mx-auto">
        <h2 className="lg:text-8xl text-6xl font-body text-primary dark:text-secondary mb-6">
          Bio
        </h2>
        <div className=" text-primary dark:text-secondary lg:text-lg text-base">
          <PortableText value={bio?.content} />
        </div>
        <div className="flex flex-row w-full mt-8 gap-y-4 gap-x-4">
          <div className="w-full lg:w-1/2 h-auto lg:h-[50%]">
            <FeaturedNav />
          </div>
          <div className="w-full lg:w-1/2 h-auto lg:h-[50%]">
            <GotoNav />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;
