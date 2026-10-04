import { useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import RequestError from '../components/RequestError';
import { getArticleBySlug } from '../services/articleData';
import { useRequest } from '../hooks/useRequest';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const result = useRequest(slug || '', getArticleBySlug);
  if (result.status === 'loading') return <LoadingScreen />;
  if (result.status === 'error') return <RequestError label="this article" />;
  const article = result.data;
  if (!article) return <h1 className="py-12 text-center">Article not found</h1>;
  const content = article.content?.trim() || '';
  const comingSoon = article.comingSoon || !content;

  return (
    <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
      <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-2">
        {article.title}
      </h1>
      {comingSoon ? (
        <p className="text-sm text-primary dark:text-secondary opacity-60 mt-4">Coming soon</p>
      ) : (
        <>
          {article.date && <p className="text-sm text-primary dark:text-secondary mb-8">{article.date}</p>}
          <MarkdownRenderer markdown={content.replace(/^\s*#\s+.+\n?/, '')} />
        </>
      )}
    </div>
  );
};

export default ArticleDetail;
