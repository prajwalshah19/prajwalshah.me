import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { toPlainText } from '@portabletext/react';
import { ArticleSummary, getArticleSummaries } from '../services/articleData';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

const WritingList = () => {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  useEffect(() => {
    let active = true;
    getArticleSummaries()
      .then((items) => {
        if (!active) return;
        setArticles(items);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Error fetching writing:', error);
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  if (status !== 'ready' || articles.length === 0) {
    return (
      <p
        role="status"
        className="py-8 text-center text-xs text-primary dark:text-secondary opacity-70"
      >
        {status === 'loading'
          ? 'Loading writing…'
          : status === 'error'
            ? 'Couldn’t load writing. Please try again later.'
            : 'Nothing published yet. Check back soon.'}
      </p>
    );
  }

  return (
    <ul className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30">
      {articles.map((article) => (
        <li key={article._id}>
          {article.comingSoon ? (
            <div className="py-5 text-primary dark:text-secondary">
              <h3 className="text-sm font-body">{article.title}</h3>
              <p className="mt-2 text-xs opacity-60">Coming soon</p>
            </div>
          ) : (
            <Link
              to={`/articles/${article.slug.current}`}
              className="group flex items-start gap-4 py-5 text-primary dark:text-secondary"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-body group-hover:underline underline-offset-4">
                    {article.title}
                  </h3>
                  {article.date && (
                    <time
                      dateTime={article.date}
                      className="shrink-0 text-[10px] opacity-60"
                    >
                      {formatDate(article.date)}
                    </time>
                  )}
                </div>
                {article.excerpt?.length > 0 && (
                  <p className="mt-2 text-xs leading-relaxed opacity-70 line-clamp-2 sm:line-clamp-1">
                    {toPlainText(article.excerpt)}
                  </p>
                )}
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100"
              />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default WritingList;
