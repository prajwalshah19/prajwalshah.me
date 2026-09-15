import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import { Article, getArticleBySlug } from '../services/articleData';

interface ArticleResult {
  slug: string;
  article: Article | null;
  error: boolean;
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigation = location.state as {
    returnTo?: string;
    title?: string;
  } | null;
  const fromWriting = navigation?.returnTo === '/writing';
  const backTo = fromWriting ? '/writing' : '/';
  const backState = fromWriting
    ? undefined
    : { scrollTo: 'work', workTab: 'writing' };
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
  const title = article?.title || navigation?.title;
  const comingSoon = !article || article.comingSoon || !article.content?.trim();

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
        <Link
          to={backTo}
          state={backState}
          className="inline-flex items-center text-primary dark:text-secondary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to writing
        </Link>
        <h1 className="text-5xl font-body text-primary dark:text-secondary mt-4 mb-2">
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
            <MarkdownRenderer markdown={article.content} />
          </>
        )}
      </div>
    </ContentPage>
  );
};

export default ArticleDetail;
