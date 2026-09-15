import { toPlainText } from '@portabletext/react';
import { getArticleSummaries } from '../services/articleData';
import CollectionList, { type CollectionViewProps } from './CollectionList';
import CollectionRow from './CollectionRow';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

const WritingList = ({ preview = false }: CollectionViewProps) => (
  <CollectionList
    load={getArticleSummaries}
    label="writing"
    allHref="/writing"
    preview={preview}
    renderItem={(article) => (
      <CollectionRow
        key={article._id}
        title={article.title}
        compact={preview}
        date={
          !article.comingSoon && article.date ? (
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          ) : undefined
        }
        href={
          !article.comingSoon && article.slug?.current
            ? `/articles/${article.slug.current}`
            : undefined
        }
        returnTo={preview ? undefined : '/writing'}
        summary={
          article.comingSoon
            ? 'Coming soon'
            : article.excerpt?.length > 0
              ? toPlainText(article.excerpt)
              : undefined
        }
      />
    )}
  />
);

export default WritingList;
