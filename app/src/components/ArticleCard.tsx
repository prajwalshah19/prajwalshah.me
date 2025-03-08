// src/components/ArticleCard.tsx
import React from 'react';
import { Article } from '../services/articleData';
import { PortableText } from '@portabletext/react';
interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="border border-primary dark:border-secondary p-4 bg-secondary dark:bg-primary shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-body text-primary dark:text-secondary mb-2">{article.title}</h3>
      <p className="text-sm text-primary dark:text-secondary mb-2">{article.date}</p>
      <div className="text-base text-primary dark:text-secondary mb-4"><PortableText value={article.excerpt} /></div>
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center text-primary dark:text-secondary hover:underline"
      >
        <span>Read More</span>
        {/* Using the arrow icon similar to our other links */}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
    </div>
  );
};

export default ArticleCard;
