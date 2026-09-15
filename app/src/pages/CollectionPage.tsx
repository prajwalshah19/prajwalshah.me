import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import ExperienceList from '../components/ExperienceList';
import ProjectsList from '../components/ProjectsList';
import WritingList from '../components/WritingList';

const collections = {
  experience: {
    title: 'Experience',
    List: ExperienceList,
    homeState: { scrollTo: 'experience' },
  },
  projects: {
    title: 'Projects',
    List: ProjectsList,
    homeState: { scrollTo: 'work', workTab: 'projects' },
  },
  writing: {
    title: 'Writing',
    List: WritingList,
    homeState: { scrollTo: 'work', workTab: 'writing' },
  },
};

const CollectionPage = ({
  category,
}: {
  category: keyof typeof collections;
}) => {
  const { title, List, homeState } = collections[category];

  return (
    <ContentPage>
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <Link
          to="/"
          state={homeState}
          className="inline-flex items-center gap-1 text-xs text-primary dark:text-secondary hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to home
        </Link>
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-8">
          {title}
        </h1>
        <List />
      </div>
    </ContentPage>
  );
};

export default CollectionPage;
