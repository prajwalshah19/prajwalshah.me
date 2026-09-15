import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BoardTile from './BoardTile';
import { BoardItem, getBoardPreviewItems } from '../services/boardData';

const BoardSection = () => {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getBoardPreviewItems()
      .then(setItems)
      .catch((error) => {
        console.error('Error fetching board preview:', error);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="board"
      aria-labelledby="board-heading"
      className="w-full min-h-screen flex items-start bg-secondary dark:bg-primary py-16"
    >
      <div className="w-full max-w-4xl mx-auto px-6">
        <header className="mb-8 text-center text-primary dark:text-secondary">
          <h2 id="board-heading" className="text-2xl lg:text-3xl font-body">
            Board
          </h2>
          <p className="mt-2 text-xs opacity-70">
            A wandering collection of things I like.
          </p>
          <Link
            to="/board"
            className="inline-flex items-center gap-1 mt-4 text-[11px] tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            View all <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </header>

        {loading || failed || items.length === 0 ? (
          <p
            role="status"
            className="text-center text-xs text-primary dark:text-secondary opacity-70"
          >
            {loading
              ? 'Loading pins…'
              : failed
                ? 'Couldn’t load the board. Please try again later.'
                : 'Nothing pinned yet.'}
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {items.map((item) => (
              <BoardTile key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BoardSection;
