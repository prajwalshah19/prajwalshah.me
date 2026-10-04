import {
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { useRequest } from '../hooks/useRequest';
import { ArrowRight } from 'lucide-react';

const EMPTY_ITEMS: never[] = [];

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
  const result = useRequest(label, load);
  const { status } = result;
  const items = result.status === 'ready' ? result.data : EMPTY_ITEMS;
  const listRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const footer = footerRef.current;
    const section = list?.closest('section');
    if (!preview || !list || !footer || !section) return;

    let frame = 0;
    let disposed = false;
    const rows = Array.from(list.children) as HTMLElement[];

    const fit = () => {
      // Hidden Work tabs have no measurable width; observe them becoming visible.
      if (!list.getBoundingClientRect().width) return;
      rows.forEach((row) => {
        row.hidden = false;
      });
      footer.hidden = false;

      const listRect = list.getBoundingClientRect();
      const footerStyle = getComputedStyle(footer);
      const footerSpace =
        footer.getBoundingClientRect().height +
        parseFloat(footerStyle.marginTop) +
        parseFloat(footerStyle.marginBottom);
      const available =
        (window.visualViewport?.height ?? window.innerHeight) -
        (listRect.top - section.getBoundingClientRect().top) -
        parseFloat(getComputedStyle(section).paddingBottom);
      const border = parseFloat(getComputedStyle(list).borderBottomWidth);

      // If every row fits without reserving footer space, the See all link
      // adds nothing — show the full list instead.
      const lastRow = rows[rows.length - 1];
      if (
        !lastRow ||
        lastRow.getBoundingClientRect().bottom - listRect.top + border <=
          available
      ) {
        footer.hidden = true;
        return;
      }

      let count = 0;
      for (const row of rows) {
        if (
          row.getBoundingClientRect().bottom - listRect.top + border >
          available - footerSpace
        )
          break;
        count++;
      }
      // On very short windows, keep one entry and allow ordinary page scrolling.
      rows.forEach((row, index) => {
        row.hidden = index >= Math.max(1, count);
      });
      footer.hidden = !rows.some((row) => row.hidden);
    };

    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };

    fit();
    const observer = new ResizeObserver(schedule);
    observer.observe(list);
    observer.observe(footer);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    void document.fonts.ready.then(schedule);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      rows.forEach((row) => {
        row.hidden = false;
      });
      footer.hidden = true;
    };
  }, [preview, items]);

  return (
    <>
      {status !== 'ready' || items.length === 0 ? (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className="py-8 text-center text-xs text-primary dark:text-secondary opacity-70"
        >
          {status === 'loading'
            ? `Loading ${label}…`
            : status === 'error'
              ? `Couldn’t load ${label}. Please try again later.`
              : `No ${label} yet.`}
        </p>
      ) : (
        <ul
          ref={listRef}
          className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30"
        >
          {items.map(renderItem)}
        </ul>
      )}
      {preview && status === 'ready' && items.length > 0 && (
        <div ref={footerRef} hidden className="mt-6 text-center">
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
