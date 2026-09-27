import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface CollectionRowProps {
  title: string;
  date?: ReactNode;
  subtitle?: string;
  location?: string;
  summary?: ReactNode;
  href?: string;
  compact?: boolean;
}

const CollectionRow = ({
  title,
  date,
  subtitle,
  location,
  summary,
  href,
  compact = false,
}: CollectionRowProps) => {
  const Heading = compact ? 'h3' : 'h2';
  const content = (
    <>
      <div className="flex-1 min-w-0 [overflow-wrap:anywhere]">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <Heading
            className={`text-sm font-body ${href ? 'group-hover:underline underline-offset-4' : ''}`}
          >
            {title}
          </Heading>
          {date && (
            <span className="shrink-0 text-[10px] opacity-60">{date}</span>
          )}
        </div>
        {(subtitle || location) && (
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs opacity-70">
            {subtitle && <p>{subtitle}</p>}
            {location && <p className="text-[10px]">{location}</p>}
          </div>
        )}
        {summary && (
          <div
            className={`mt-2 text-xs leading-relaxed opacity-70 [&>p+p]:mt-2 ${compact ? 'line-clamp-2' : ''}`}
          >
            {summary}
          </div>
        )}
      </div>
      {href && (
        <ArrowUpRight
          aria-hidden="true"
          className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100"
        />
      )}
    </>
  );
  const className =
    'group flex items-start gap-4 py-5 text-primary dark:text-secondary';

  return (
    <li>
      {href ? (
        <Link to={href} className={className}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
};

export default CollectionRow;
