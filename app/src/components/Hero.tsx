import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import SocialLinks from './SocialLinks';

interface HeroProps {
    scrollToBio: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToBio }) => {
  return (
    <section className="w-full h-screen flex lg:items-center justify-center ">
      <div
        className="
          flex flex-col items-center justify-start pt-[20vh] lg:pt-[13vh] px-2
          lg:w-[80vw] lg:h-[75vh] lg:border-4 lg:border-primary lg:dark:border-secondary
          mx-auto
        "
      >
        <div className = "w-full flex flex-col ">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className=" text-left lg:text-center text-8xl lg:text-[13rem] font-body text-primary dark:text-secondary">
            Hi, <br className="block sm:hidden" /> I'm Praj
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-4 text-xl lg:text-center lg:text-2xl font-headline text-primary dark:text-secondary lg:pt-5">
            Computer Science and Economics @ Purdue
          </motion.p>

          <SocialLinks />
        </div>
      </div>
      <button
        onClick={scrollToBio}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none"
        aria-label="Scroll down to bio"
      >
        <ChevronDown className="w-15 h-15 text-primary dark:text-secondary animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
