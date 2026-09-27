import ContentPage from '../components/ContentPage';
import ExperienceList from '../components/ExperienceList';
import ProjectsList from '../components/ProjectsList';
import WritingList from '../components/WritingList';

const collections = {
  experience: { title: 'Experience', List: ExperienceList },
  projects: { title: 'Projects', List: ProjectsList },
  writing: { title: 'Writing', List: WritingList },
};

const CollectionPage = ({
  category,
}: {
  category: keyof typeof collections;
}) => {
  const { title, List } = collections[category];

  return (
    <ContentPage>
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-8">
          {title}
        </h1>
        <List />
      </div>
    </ContentPage>
  );
};

export default CollectionPage;
