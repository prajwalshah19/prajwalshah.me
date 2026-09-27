import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentPage from '../components/ContentPage';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import { Article, getArticleBySlug } from '../services/articleData';

interface ArticleResult {
  slug: string;
  article: Article | null;
  error: boolean;
}

// The page already renders the article title as its own heading, so drop a
// redundant leading "# Title" line from the markdown body if present.
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+.+\n?/, '');
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [result, setResult] = useState<ArticleResult | null>(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    getArticleBySlug(slug)
      .then((article) => {
        if (active) setResult({ slug, article, error: false });
      })
      .catch((error) => {
        console.error('Error fetching article:', error);
        if (active) setResult({ slug, article: null, error: true });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (slug && result?.slug !== slug) return <LoadingScreen />;

  const article = result?.article;
  const title = article?.title;
  const comingSoon = !article || article.comingSoon || !article.content?.trim();

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-2">
          {title || (result?.error ? 'Article unavailable' : 'Coming soon')}
        </h1>
        {result?.error ? (
          <p
            role="alert"
            className="text-sm text-primary dark:text-secondary opacity-60 mt-4"
          >
            Couldn’t load this article. Please try again.
          </p>
        ) : comingSoon ? (
          title && (
            <p className="text-sm text-primary dark:text-secondary opacity-60 mt-4">
              Coming soon
            </p>
          )
        ) : (
          <>
            {article.date && (
              <p className="text-sm text-primary dark:text-secondary mb-8">
                {article.date}
              </p>
            )}
            <MarkdownRenderer markdown={stripLeadingH1(article.content)} />
          </>
        )}
      </div>
    </ContentPage>
  );
};

export default ArticleDetail;
