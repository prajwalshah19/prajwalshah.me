import React from 'react';
import { Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { type BoardItemSummary } from '../services/boardData';
import BoardImage from './BoardImage';

interface BoardTileProps {
  item: BoardItemSummary;
}

const baseTile =
  'block border border-primary/40 dark:border-secondary/40 bg-secondary dark:bg-primary p-3 text-primary dark:text-secondary mb-4 break-inside-avoid';
const interactiveTile =
  'hover:border-primary dark:hover:border-secondary transition-colors duration-150 no-underline';

const BoardTile: React.FC<BoardTileProps> = ({ item }) => {
  const inner = renderByType(item);

  // External link wins — opens in new tab.
  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseTile} ${interactiveTile}`}
      >
        {inner}
        <div className="mt-2 flex items-center gap-1 text-[10px] opacity-70">
          <span>Open</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </a>
    );
  }

  // Internal detail page when there's long-form content + a slug to route to.
  if (item.hasDetail && item.slug?.current) {
    return (
      <Link
        to={`/board/${item.slug.current}`}
        className={`${baseTile} ${interactiveTile}`}
      >
        {inner}
        <div className="mt-2 flex items-center gap-1 text-[10px] opacity-70">
          <span>Read</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </Link>
    );
  }

  return <div className={baseTile}>{inner}</div>;
};

function renderByType(item: BoardItemSummary): React.ReactNode {

  switch (item.type) {
    case 'photo':
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block" />
          {(item.title || item.caption) && (
            <div className="mt-2">
              {item.title && (
                <p className="text-xs font-body">{item.title}</p>
              )}
              {item.caption && (
                <p className="text-[10px] opacity-70 mt-0.5">{item.caption}</p>
              )}
            </div>
          )}
        </>
      );

    case 'book':
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block mb-2" />
          <p className="text-xs font-body">{item.title}</p>
          {item.creator && (
            <p className="text-[10px] opacity-70 mt-0.5">by {item.creator}</p>
          )}
          {item.caption && (
            <p className="text-[10px] opacity-80 mt-1.5 italic">
              {item.caption}
            </p>
          )}
        </>
      );

    case 'quote':
      return (
        <>
          <blockquote className="text-xs italic font-body leading-relaxed">
            “{item.title}”
          </blockquote>
          {item.creator && (
            <p className="text-[10px] opacity-70 mt-2">— {item.creator}</p>
          )}
          {item.body && (
            <div className="text-[10px] opacity-80 mt-2">
              <PortableText value={item.body} />
            </div>
          )}
        </>
      );

    case 'song':
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block mb-2" />
          <p className="text-xs font-body">{item.title}</p>
          {item.creator && (
            <p className="text-[10px] opacity-70 mt-0.5">{item.creator}</p>
          )}
          {item.caption && (
            <p className="text-[10px] opacity-80 mt-1">{item.caption}</p>
          )}
        </>
      );

    case 'place':
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block" />
          <div className="mt-2">
            <p className="text-xs font-body">{item.title}</p>
            {item.caption && (
              <p className="text-[10px] opacity-70 mt-0.5">{item.caption}</p>
            )}
          </div>
        </>
      );

    case 'blurb':
      return (
        <>
          <p className="text-xs font-body">{item.title}</p>
          {item.body && (
            <div className="text-[11px] opacity-90 mt-1.5 leading-relaxed">
              <PortableText value={item.body} />
            </div>
          )}
          {!item.body && item.caption && (
            <p className="text-[11px] opacity-90 mt-1.5 leading-relaxed">
              {item.caption}
            </p>
          )}
        </>
      );

    case 'link':
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block mb-2" />
          <p className="text-xs font-body">{item.title}</p>
          {item.caption && (
            <p className="text-[10px] opacity-80 mt-1">{item.caption}</p>
          )}
        </>
      );

    case 'other':
    default:
      return (
        <>
          <BoardImage assetRef={item.imageAssetRef} alt={item.title} className="w-full h-auto block mb-2" />
          <p className="text-xs font-body">{item.title}</p>
          {item.creator && (
            <p className="text-[10px] opacity-70 mt-0.5">{item.creator}</p>
          )}
          {item.caption && (
            <p className="text-[10px] opacity-80 mt-1">{item.caption}</p>
          )}
        </>
      );
  }
}

export default BoardTile;
