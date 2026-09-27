import React, { useEffect, useState } from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { ArrowUpRight } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import ExperienceList from '../components/ExperienceList';
import { RichText, PlainText, getAboutText, getGithubLink, getLinkedinLink } from '../services/textData';

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => {
      const isEmpty =
        Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === 'string' &&
        children[0].trim() === '';
      if (isEmpty) return <div className="h-2" />;
      return <p className="mb-4">{children}</p>;
    },
  },
};

const Home: React.FC = () => {
  const [about, setAbout] = useState<RichText | null>(null);
  const [githubLink, setGithubLink] = useState<PlainText | null>(null);
  const [linkedinLink, setLinkedinLink] = useState<PlainText | null>(null);

  useEffect(() => {
    getAboutText().then(setAbout).catch(console.error);
    getGithubLink().then(setGithubLink).catch(console.error);
    getLinkedinLink().then(setLinkedinLink).catch(console.error);
  }, []);

  const links = [
    { label: 'GitHub', url: githubLink?.content },
    { label: 'LinkedIn', url: linkedinLink?.content },
  ].filter((link) => link.url);

  return (
    <ContentPage>
      <div className="w-full max-w-2xl mx-auto px-6 pb-24">
        <div className="text-sm text-primary dark:text-secondary leading-relaxed">
          {about?.content && (
            <PortableText
              value={about.content}
              components={portableTextComponents}
            />
          )}
        </div>

        {links.length > 0 && (
          <div className="flex gap-4 mt-2 mb-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary dark:text-secondary opacity-70 hover:opacity-100 hover:underline underline-offset-4 transition-opacity"
              >
                {link.label}
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}

        <h2 className="text-sm font-semibold text-primary dark:text-secondary mt-12 mb-2">
          Experience
        </h2>
        <ExperienceList />
      </div>
    </ContentPage>
  );
};

export default Home;
