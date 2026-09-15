import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentPage from '../components/ContentPage';
import BoardTile from '../components/BoardTile';
import { BoardItem, getBoardItems } from '../services/boardData';

const Board: React.FC = () => {
  const [items, setItems] = useState<BoardItem[]>([]);

  useEffect(() => {
    getBoardItems().then(setItems).catch(console.error);
  }, []);

  return (
    <ContentPage>
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        <Link
          to="/"
          state={{ scrollTo: 'about' }}
          className="inline-flex items-center text-xs text-primary dark:text-secondary hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to about
        </Link>
        <header className="mb-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary">
            Board
          </h1>
        </header>

        {items.length === 0 ? (
          <p className="text-center text-xs text-primary dark:text-secondary opacity-70">
            Nothing pinned yet.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {items.map((item) => (
              <BoardTile key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </ContentPage>
  );
};

export default Board;
