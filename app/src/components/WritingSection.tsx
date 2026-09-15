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
      <WritingList />
    </div>
  </section>
);

export default WritingSection;
