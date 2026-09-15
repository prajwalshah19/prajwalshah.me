import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import ContentPage from '../components/ContentPage';
import LoadingScreen from '../components/LoadingScreen';
import MarkdownRenderer from '../components/MarkdownRenderer';
import {
  BoardItem,
  getBoardItemBySlug,
  imageUrlFromRef,
} from '../services/boardData';

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const BoardDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<BoardItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBoardItemBySlug(slug)
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (!item) {
    return (
      <ContentPage>
        <div className="w-full max-w-2xl mx-auto py-12 px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary mb-4">
            Not found
          </h1>
          <Link
            to="/board"
            className="inline-flex items-center text-primary dark:text-secondary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to board
          </Link>
        </div>
      </ContentPage>
    );
  }

  const img = imageUrlFromRef(item.imageAssetRef);

  return (
    <ContentPage>
      <article className="w-full max-w-2xl mx-auto py-12 px-6">
        <Link
          to="/board"
          className="inline-flex items-center text-xs text-primary dark:text-secondary hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to board
        </Link>

        <h1 className="text-3xl lg:text-4xl font-body text-primary dark:text-secondary leading-tight mt-2 mb-3">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-primary dark:text-secondary opacity-70 mb-6">
          <span className="uppercase tracking-widest">{item.type}</span>
          {item.creator && (
            <>
              <span aria-hidden>·</span>
              <span>{item.creator}</span>
            </>
          )}
          {item.date && (
            <>
              <span aria-hidden>·</span>
              <span>{formatDate(item.date)}</span>
            </>
          )}
        </div>

        {img && (
          <img
            src={img}
            alt={item.title}
            className="w-full h-auto block mb-6 border border-primary/40 dark:border-secondary/40"
            loading="lazy"
          />
        )}

        {item.markdown ? (
          <div className="mb-6">
            <MarkdownRenderer markdown={item.markdown} />
          </div>
        ) : (
          item.body && (
            <div className="text-sm text-primary dark:text-secondary leading-relaxed mb-6">
              <PortableText value={item.body} />
            </div>
          )
        )}

        {item.caption && (
          <p className="text-xs text-primary dark:text-secondary opacity-80 italic mb-6">
            {item.caption}
          </p>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-primary dark:text-secondary hover:underline"
          >
            <span>Open original</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
        )}
      </article>
    </ContentPage>
  );
};

export default BoardDetail;
