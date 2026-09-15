import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

      const listRect = list.getBoundingClientRect();
      const footerStyle = getComputedStyle(footer);
      const available =
        (window.visualViewport?.height ?? window.innerHeight) -
        (listRect.top - section.getBoundingClientRect().top) -
        parseFloat(getComputedStyle(section).paddingBottom) -
        footer.getBoundingClientRect().height -
        parseFloat(footerStyle.marginTop) -
        parseFloat(footerStyle.marginBottom);
      const border = parseFloat(getComputedStyle(list).borderBottomWidth);
      let count = 0;
      for (const row of rows) {
        if (
          row.getBoundingClientRect().bottom - listRect.top + border >
          available
        )
          break;
        count++;
      }
      // On very short windows, keep one entry and allow ordinary page scrolling.
      rows.forEach((row, index) => {
        row.hidden = index >= Math.max(1, count);
      });
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
    };
  }, [preview, items]);

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
        <ul
          ref={listRef}
          className="text-left divide-y divide-primary/30 dark:divide-secondary/30 border-y border-primary/30 dark:border-secondary/30"
        >
          {items.map(renderItem)}
        </ul>
      )}
      {preview && (
        <div ref={footerRef} className="mt-6 text-center">
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
