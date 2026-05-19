import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import MarkdownRenderer from './MarkdownRenderer';
import { getProjects, Project } from '../services/projectData';
import { getArticles, Article } from '../services/articleData';

type Tab = 'projects' | 'thoughts';

const FEATURED_PROJECTS = 3;
const WORDS_PER_MINUTE = 225;

function readingTime(md: string): number {
  if (!md) return 1;
  return Math.max(1, Math.round(md.trim().split(/\s+/).length / WORDS_PER_MINUTE));
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const WorkSection: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
    getArticles().then(setArticles).catch(console.error);
  }, []);

  // Honor incoming navigation state (e.g. from a detail page back-link).
  useEffect(() => {
    const t = (location.state as { workTab?: Tab } | null)?.workTab;
    if (t === 'projects' || t === 'thoughts') setActiveTab(t);
  }, [location.state]);

  // Reset expanded row when switching tabs
  useEffect(() => {
    setExpandedId(null);
  }, [activeTab]);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const featured = projects.slice(0, FEATURED_PROJECTS);
  const archive = projects.slice(FEATURED_PROJECTS);

  return (
    <section
      id="work"
      className="w-full min-h-screen flex items-center bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-body text-primary dark:text-secondary mb-4">
          Work
        </h2>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Work category"
          className="flex items-center justify-center gap-6 mb-6"
        >
          {(['projects', 'thoughts'] as Tab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-1 text-xs uppercase tracking-widest text-primary dark:text-secondary transition-opacity focus:outline-none ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                {tab}
                {isActive && (
                  <motion.span
                    layoutId="work-tab-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-primary dark:bg-secondary"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="max-h-[60vh] overflow-y-auto text-left">
          {activeTab === 'projects' ? (
            <ProjectsList
              featured={featured}
              archive={archive}
              expandedId={expandedId}
              toggle={toggle}
            />
          ) : (
            <ThoughtsList
              articles={articles}
              expandedId={expandedId}
              toggle={toggle}
            />
          )}
        </div>
      </div>
    </section>
  );
};

interface ProjectsListProps {
  featured: Project[];
  archive: Project[];
  expandedId: string | null;
  toggle: (id: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  featured,
  archive,
  expandedId,
  toggle,
}) => (
  <>
    <ul className="divide-y divide-primary/30 dark:divide-secondary/30 border-t border-b border-primary/30 dark:border-secondary/30">
      {featured.map((project) => {
        const isOpen = expandedId === project._id;
        return (
          <li key={project._id}>
            <button
              type="button"
              onClick={() => toggle(project._id)}
              aria-expanded={isOpen}
              className="w-full text-left py-2.5 flex items-center gap-3 focus:outline-none"
            >
              <span className="text-primary dark:text-secondary opacity-70 text-xs w-3 shrink-0">
                ◆
              </span>
              <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
                <span className="text-xs text-primary dark:text-secondary truncate">
                  {project.name}
                </span>
                <span className="text-[11px] text-primary dark:text-secondary opacity-70 truncate">
                  {project.dates}
                </span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-primary dark:text-secondary shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-3 pl-6 pr-4 text-[11px] text-primary dark:text-secondary opacity-90">
                    <div className="mb-2">
                      <PortableText value={project.description} />
                    </div>
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-full text-[9px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/projects/${project.slug?.current}`}
                      className="inline-flex items-center hover:underline text-[11px]"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}

      {archive.map((project) => (
        <li key={project._id}>
          <Link
            to={`/projects/${project.slug?.current}`}
            className="flex items-center gap-3 py-2 text-primary dark:text-secondary hover:underline"
          >
            <span className="opacity-70 text-xs w-3 shrink-0">◆</span>
            <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
              <span className="text-xs truncate">{project.name}</span>
              <span className="text-[11px] opacity-70 truncate">
                {project.dates}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </>
);

interface ThoughtsListProps {
  articles: Article[];
  expandedId: string | null;
  toggle: (id: string) => void;
}

const ThoughtsList: React.FC<ThoughtsListProps> = ({
  articles,
  expandedId,
  toggle,
}) => {
  if (articles.length === 0) {
    return (
      <p className="text-[11px] text-primary dark:text-secondary opacity-70 text-center py-4">
        Nothing here yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-primary/30 dark:divide-secondary/30 border-t border-b border-primary/30 dark:border-secondary/30">
      {articles.map((article) => {
        const isOpen = expandedId === article._id;
        const minutes = readingTime(article.content);
        return (
          <li key={article._id}>
            <button
              type="button"
              onClick={() => toggle(article._id)}
              aria-expanded={isOpen}
              className="w-full text-left py-2.5 flex items-start gap-3 focus:outline-none"
            >
              <span className="text-primary dark:text-secondary opacity-70 text-xs w-3 shrink-0 mt-0.5">
                ✎
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs text-primary dark:text-secondary">
                  {article.title}
                </span>
                <span className="block text-[9px] text-primary dark:text-secondary opacity-70 mt-0.5">
                  {formatDate(article.date)} · {minutes} min read
                </span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-primary dark:text-secondary shrink-0 transition-transform duration-200 mt-0.5 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-3 pl-6 pr-4 text-xs text-primary dark:text-secondary">
                    <MarkdownRenderer markdown={article.content} />
                    <div className="mt-3">
                      <Link
                        to={`/articles/${article.slug?.current}`}
                        className="inline-flex items-center hover:underline text-[11px]"
                      >
                        <span>Permalink</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

export default WorkSection;
