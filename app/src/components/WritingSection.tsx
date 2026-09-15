import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WritingList from './WritingList';

const WritingSection = () => (
  <section
    id="writing"
    aria-labelledby="writing-heading"
    className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
  >
    <div className="w-full max-w-xl mx-auto px-6">
      <h2
        id="writing-heading"
        className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary text-center mb-6"
      >
        Writing
      </h2>
      <WritingList limit={3} />
      <div className="mt-6 text-center">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase text-primary dark:text-secondary opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          All writing <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

export default WritingSection;
