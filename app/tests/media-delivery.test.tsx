import { beforeEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BoardTile from '../src/components/BoardTile';
import BoardDetail from '../src/pages/BoardDetail';
import ProjectsList from '../src/components/ProjectsList';
import * as board from '../src/services/boardData';
import * as projects from '../src/services/projectData';

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock('../src/services/sanity', () => ({ client: { fetch } }));
beforeEach(() => fetch.mockReset());

const photo = {
  _id: 'photo', title: 'Photo', type: 'photo' as const, date: '2026-10-03',
  slug: { current: 'photo' }, imageAssetRef: 'image-abc123-4000x3000-jpg', hasDetail: true,
};

test('Board tiles request transformed responsive images and reserve their aspect ratio', () => {
  render(<MemoryRouter><BoardTile item={photo} /></MemoryRouter>);
  const img = screen.getByRole('img') as HTMLImageElement;
  const url = new URL(img.src);
  expect(url.searchParams.get('w')).toBe('640');
  expect(url.searchParams.get('fit')).toBe('max');
  expect(url.searchParams.get('auto')).toBe('format');
  expect(img.getAttribute('srcset')).toContain('1280w');
  expect(img.getAttribute('sizes')).toContain('640px');
  expect(img.getAttribute('width')).toBe('4000');
  expect(img.getAttribute('height')).toBe('3000');
});

test('image variants do not upscale small sources or mislabel width descriptors', () => {
  render(<MemoryRouter><BoardTile item={{ ...photo, imageAssetRef: 'image-abc-200x100-png' }} /></MemoryRouter>);
  const img = screen.getByRole('img') as HTMLImageElement;
  expect(new URL(img.src).searchParams.get('w')).toBe('200');
  const variants = img.srcset.split(', ');
  expect(variants).toHaveLength(1);
  expect(variants[0]).toMatch(/ 200w$/);
});

test.each([undefined, 'broken', 'image-abc-0x100-jpg', 'image-abc-100x0-jpg'])(
  'missing or invalid image reference %s does not render a broken image', (imageAssetRef) => {
    render(<MemoryRouter><BoardTile item={{ ...photo, imageAssetRef }} /></MemoryRouter>);
    expect(screen.queryByRole('img')).toBeNull();
  }
);

test('documented alphanumeric asset IDs are supported', () => {
  expect(board.imageUrlFromRef('image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg')).toContain('G3i4emG6B8JnTmGoN0UjgAp8-300x450.jpg');
});

test('vector images retain their original URL rather than unsupported raster transforms', () => {
  render(<MemoryRouter><BoardTile item={{ ...photo, imageAssetRef: 'image-abc-200x100-svg' }} /></MemoryRouter>);
  const img = screen.getByRole('img') as HTMLImageElement;
  expect(new URL(img.src).search).toBe('');
  expect(img.srcset).toBe('');
  expect(img.getAttribute('width')).toBe('200');
  expect(img.getAttribute('height')).toBe('100');
});

test('Board detail uses larger responsive variants without losing content', async () => {
  fetch.mockResolvedValue({ ...photo, markdown: 'Detailed content' });
  render(<MemoryRouter initialEntries={['/board/photo']}><Routes><Route path="/board/:slug" element={<BoardDetail />} /></Routes></MemoryRouter>);
  const img = await screen.findByRole('img') as HTMLImageElement;
  expect(new URL(img.src).searchParams.get('w')).toBe('1280');
  expect(img.srcset).toContain('1920w');
  expect(img.sizes).toContain('624px');
  expect(screen.getByText('Detailed content')).toBeTruthy();
});

test('Board summaries omit long-form Markdown but retain detail navigation', async () => {
  fetch.mockResolvedValue([photo]);
  await board.getBoardItems();
  const query = fetch.mock.calls[0][0] as string;
  expect(query).not.toMatch(/^\s*markdown\s*,?\s*$/m);
  expect(query).toContain('"hasDetail"');
  render(<MemoryRouter><BoardTile item={photo} /></MemoryRouter>);
  expect(screen.getByRole('link').getAttribute('href')).toBe('/board/photo');
  fetch.mockResolvedValue(photo);
  await board.getBoardItemBySlug('photo');
  expect(fetch.mock.calls[1][0]).toMatch(/^\s*markdown\s*,?\s*$/m);
});

test('project list loads only the summary projection', async () => {
  fetch.mockResolvedValue([{ _id: 'a', name: 'Project A', slug: { current: 'a' }, description: [], dates: '2026' }]);
  render(<MemoryRouter><ProjectsList /></MemoryRouter>);
  await screen.findByText('Project A');
  const query = fetch.mock.calls[0][0] as string;
  const projection = query.slice(query.indexOf('{'));
  expect(projection).not.toMatch(/\bcontent\b/);
  expect(projection).not.toMatch(/\btags\b/);
  fetch.mockResolvedValue({ _id: 'a', name: 'Project A', tags: null, content: 'Long form' });
  expect(await projects.getProjectBySlug('a')).toMatchObject({ tags: [], content: 'Long form' });
});
