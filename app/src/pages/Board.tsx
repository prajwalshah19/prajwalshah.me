import React, { useEffect, useState } from 'react';
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
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-8">
          Board
        </h1>

        {items.length === 0 ? (
          <p className="text-xs text-primary dark:text-secondary opacity-70">
            Nothing pinned yet.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 gap-4">
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
