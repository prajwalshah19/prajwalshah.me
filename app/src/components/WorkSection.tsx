import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectsList from './ProjectsList';
import WritingList from './WritingList';

const tabs = ['projects', 'writing'] as const;
type WorkTab = (typeof tabs)[number];

const WorkSection = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<WorkTab>(() => {
    const state = location.state as {
      workTab?: string;
      scrollTo?: string;
    } | null;
    return state?.workTab === 'writing' || state?.scrollTo === 'writing'
      ? 'writing'
      : 'projects';
  });
  const tabButtons = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6">
        <h2
          id="work-heading"
          className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary text-center mb-6"
        >
          Work
        </h2>
        <div
          role="tablist"
          aria-label="Work category"
          className="flex justify-center gap-6 mb-6"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(element) => {
                tabButtons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`work-tab-${tab}`}
              aria-controls={`work-panel-${tab}`}
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case 'ArrowRight':
                    next = (index + 1) % tabs.length;
                    break;
                  case 'ArrowLeft':
                    next = (index + tabs.length - 1) % tabs.length;
                    break;
                  case 'Home':
                    next = 0;
                    break;
                  case 'End':
                    next = tabs.length - 1;
                    break;
                  default:
                    return;
                }
                event.preventDefault();
                setActiveTab(tabs[next]);
                tabButtons.current[next]?.focus();
              }}
              className={`pb-2 border-b text-[11px] uppercase tracking-widest text-primary dark:text-secondary transition-opacity focus-visible:outline focus-visible:outline-offset-4 ${
                activeTab === tab
                  ? 'border-primary dark:border-secondary'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          id="work-panel-projects"
          role="tabpanel"
          aria-labelledby="work-tab-projects"
          hidden={activeTab !== 'projects'}
          tabIndex={0}
        >
          <ProjectsList />
        </div>
        <div
          id="work-panel-writing"
          role="tabpanel"
          aria-labelledby="work-tab-writing"
          hidden={activeTab !== 'writing'}
          tabIndex={0}
        >
          <WritingList />
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
