import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import WritingList from '../components/WritingList';

const Writing = () => (
  <ContentPage>
    <div className="w-full max-w-2xl mx-auto px-6 py-12">
      <Link
        to="/"
        state={{ scrollTo: 'writing' }}
        className="inline-flex items-center text-xs text-primary dark:text-secondary hover:underline mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
        Back to home
      </Link>
      <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-8">
        Writing
      </h1>
      <WritingList />
    </div>
  </ContentPage>
);

export default Writing;
