import React, { useState, useEffect } from 'react';
import ArticleCard from '../ArticleCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Article, getArticles } from '../../services/articleData';
import MarkdownModal from '../MarkdownModal';

const MorePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string>('');

  useEffect(() => {
    getArticles()
      .then((data: Article[]) => {
        setArticles(data);
      })
      .catch(console.error);
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleView = (markdown: string) => {
    setSelectedMarkdown(markdown);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="w-full lg:w-3/5 mx-auto space-y-8 py-8 px-4">
        <h1 className="text-6xl font-body text-primary dark:text-secondary text-center mt-4 mb-4 lg:mb-8">
          My thoughts
        </h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {currentArticles.map((article, index) => (
            <ArticleCard key={index} article={article} onView={handleView} />
          ))}
        </div>
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center text-primary dark:text-secondary hover:underline disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Prev
          </button>
          <span className="text-primary dark:text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center text-primary dark:text-secondary hover:underline disabled:opacity-50"
          >
            Next <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
      <MarkdownModal
        isOpen={isModalOpen}
        onClose={closeModal}
        markdown={selectedMarkdown}
      />
    </>
  );
};

export default MorePage;
