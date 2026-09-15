import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PREVIEW_COUNT = 3;

export interface CollectionViewProps {
  preview?: boolean;
}

interface CollectionListProps<T> extends CollectionViewProps {
  load: () => Promise<T[]>;
  label: string;
  allHref: string;
  renderItem: (item: T) => ReactNode;
}

function CollectionList<T>({
  load,
  label,
  allHref,
  renderItem,
  preview = false,
}: CollectionListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  useEffect(() => {
    let active = true;
    load()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setStatus('ready');
      })
      .catch((error) => {
        console.error(`Error fetching ${label}:`, error);
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [load, label]);

  const visibleItems = preview ? items.slice(0, PREVIEW_COUNT) : items;

  return (
    <>
      {status !== 'ready' || items.length === 0 ? (
        <p
          role="status"
          className="py-8 text-center text-xs text-primary dark:text-secondary opacity-70"
        >
          {status === 'loading'
            ? `Loading ${label}…`
            : status === 'error'
              ? `Couldn’t load ${label}. Please try again later.`
              : `No ${label} yet.`}
        </p>
      ) : (
        <ul className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30">
          {visibleItems.map(renderItem)}
        </ul>
      )}
      {preview && (
        <div className="mt-6 text-center">
          <Link
            to={allHref}
            className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase text-primary dark:text-secondary opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            See all {label}{' '}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}

export default CollectionList;
