import React from 'react';
import { useRequest } from '../hooks/useRequest';
import RequestError from '../components/RequestError';
import BoardTile from '../components/BoardTile';
import { getBoardItems } from '../services/boardData';

const Board: React.FC = () => {
  const result = useRequest('board', getBoardItems);
  const items = result.status === 'ready' ? result.data : [];

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-8">
          Board
        </h1>

        {result.status === 'loading' ? (
          <p role="status">Loading board…</p>
        ) : result.status === 'error' ? (
          <RequestError label="the board" />
        ) : items.length === 0 ? (
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
    </>
  );
};

export default Board;
