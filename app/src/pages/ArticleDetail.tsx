import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingScreen from '../components/LoadingScreen';
import { Article, getArticleBySlug } from '../services/articleData';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug)
      .then(setArticle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (!article) {
    return (
      <ContentPage>
        <div className="w-full lg:w-3/5 mx-auto py-8 px-4 text-center">
          <h1 className="text-4xl font-body text-primary dark:text-secondary mb-4">
            Article not found
          </h1>
          <Link
            to="/thoughts"
            className="inline-flex items-center text-primary dark:text-secondary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to articles
          </Link>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <div className="w-full lg:w-3/5 mx-auto py-8 px-4">
        <Link
          to="/thoughts"
          className="inline-flex items-center text-primary dark:text-secondary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to articles
        </Link>
        <h1 className="text-5xl font-body text-primary dark:text-secondary mt-4 mb-2">
          {article.title}
        </h1>
        <p className="text-sm text-primary dark:text-secondary mb-8">
          {article.date}
        </p>
        <MarkdownRenderer markdown={article.content} />
      </div>
    </ContentPage>
  );
};

export default ArticleDetail;
