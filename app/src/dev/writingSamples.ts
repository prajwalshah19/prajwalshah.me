import type { Article } from '../services/articleData';

const entries = [
  {
    title: 'What makes a system reliable?',
    summary: 'Thinking about failure, recovery, and the space between them.',
    date: '2026-09-01',
    slug: 'sample-reliable-systems',
  },
  {
    title: 'The economics of a small decision',
    summary: 'How incentives shape the choices we barely notice.',
    date: '2026-08-01',
    slug: 'sample-small-decisions',
  },
  {
    title: 'Notes on building tools',
    summary: 'A few questions about making software that feels useful.',
    date: '2026-07-01',
    slug: 'sample-building-tools',
  },
];

export const writingSamples: Article[] = entries.map((entry) => ({
  _id: entry.slug,
  title: entry.title,
  slug: { current: entry.slug },
  date: entry.date,
  link: '',
  preview: true,
  excerpt: [
    {
      _type: 'block',
      _key: entry.slug,
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: 'summary', text: entry.summary, marks: [] },
      ],
    },
  ],
  content: `${entry.summary}\n\nThis is sample text for reviewing the writing layout. It is not a published article.\n\n## A place for the full piece\n\nThe homepage shows a title, date, and short summary. The full article opens here, with room for longer paragraphs, headings, and code.`,
}));
