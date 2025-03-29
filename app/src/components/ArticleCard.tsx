// src/components/ArticleCard.tsx
import React from 'react';
import { Article } from '../services/articleData';
import { PortableText } from '@portabletext/react';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onView: (markdown: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onView }) => {
  return (
    <div className="border border-primary dark:border-secondary p-4 bg-secondary dark:bg-primary shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-body text-primary dark:text-secondary mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-primary dark:text-secondary mb-2">
        {article.date}
      </p>
      <div className="text-base text-primary dark:text-secondary mb-4">
        <PortableText value={article.excerpt} />
      </div>
      <button
        onClick={() => onView(article.content)}
        className="inline-flex items-center text-primary dark:text-secondary hover:underline"
      >
        <span>Read More</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default ArticleCard;
