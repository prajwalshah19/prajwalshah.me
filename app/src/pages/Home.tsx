import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import WorkSection from '../components/WorkSection';
import ContactSection from '../components/ContactSection';
import ContentPage from '../components/ContentPage';

const Home: React.FC = () => {
  const location = useLocation();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle anchor navigation from other routes (e.g. /articles/:slug → /#projects)
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      // Wait a tick for sections to mount
      setTimeout(() => scrollToId(target), 0);
    }
  }, [location.state]);

  return (
    <ContentPage fullBleed>
      <Hero scrollToNext={() => scrollToId('about')} />

      <AboutSection />
      <ExperienceSection />
      <WorkSection />
      <ContactSection />
    </ContentPage>
  );
};

export default Home;
