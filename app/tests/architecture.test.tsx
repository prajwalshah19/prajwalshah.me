import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { beforeEach, afterEach, expect, test, vi } from 'vitest';
import ProjectDetail from '../src/pages/ProjectDetail';
import BoardDetail from '../src/pages/BoardDetail';
import Board from '../src/pages/Board';
import Home from '../src/pages/Home';
import ArticleDetail from '../src/pages/ArticleDetail';
import { getProjectBySlug, getProjects } from '../src/services/projectData';

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock('../src/services/sanity', () => ({ client: { fetch } }));

beforeEach(() => { fetch.mockReset(); });
afterEach(() => vi.restoreAllMocks());

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

const project = (name: string) => ({ _id: name, name, tags: [], content: 'Body', dates: '2026', slug: { current: name } });

function Navigate() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/projects/b')}>Next project</button>;
}

function renderProject() {
  return render(<MemoryRouter initialEntries={['/projects/a']}><Navigate /><Routes><Route path="/projects/:slug" element={<ProjectDetail />} /></Routes></MemoryRouter>);
}

test.each([null, undefined])('normalizes nullable project fields (%s) at both service entry points', async (tags) => {
  fetch.mockResolvedValueOnce({ ...project('a'), tags, content: null });
  expect(await getProjectBySlug('a')).toMatchObject({ tags: [], content: '' });
  fetch.mockResolvedValueOnce([{ ...project('a'), tags, content: null }]);
  expect(await getProjects()).toMatchObject([{ tags: [], content: '' }]);
});

test('renders a schema-valid project without tags', async () => {
  fetch.mockResolvedValue({ ...project('a'), tags: null });
  renderProject();
  expect(await screen.findByRole('heading', { name: 'a' })).toBeTruthy();
});

test('hides old project data while the new slug is loading and shows request errors', async () => {
  const next = deferred<ReturnType<typeof project>>();
  fetch.mockResolvedValueOnce(project('a')).mockReturnValueOnce(next.promise);
  renderProject();
  await screen.findByRole('heading', { name: 'a' });
  fireEvent.click(screen.getByText('Next project'));
  expect(screen.queryByRole('heading', { name: 'a' })).toBeNull();
  await act(async () => next.reject(new Error('offline')));
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(screen.queryByText('Project not found')).toBeNull();
});

test('late responses cannot overwrite a newer project', async () => {
  const first = deferred<ReturnType<typeof project>>();
  const second = deferred<ReturnType<typeof project>>();
  fetch.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
  renderProject();
  fireEvent.click(screen.getByText('Next project'));
  await act(async () => second.resolve(project('b')));
  await screen.findByRole('heading', { name: 'b' });
  await act(async () => first.resolve(project('a')));
  expect(screen.getByRole('heading', { name: 'b' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'a' })).toBeNull();
});

test('Board loading is not reported as an empty collection', async () => {
  fetch.mockReturnValue(new Promise(() => {}));
  render(<MemoryRouter><Board /></MemoryRouter>);
  expect(screen.queryByText('Nothing pinned yet.')).toBeNull();
  expect(screen.getByRole('status')).toBeTruthy();
});

test('Board fetch failure is not reported as empty', async () => {
  fetch.mockRejectedValue(new Error('offline'));
  render(<MemoryRouter><Board /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(screen.queryByText('Nothing pinned yet.')).toBeNull();
});

test('Board detail distinguishes a failed request from a missing document', async () => {
  fetch.mockRejectedValue(new Error('offline'));
  render(<MemoryRouter initialEntries={['/board/a']}><Routes><Route path="/board/:slug" element={<BoardDetail />} /></Routes></MemoryRouter>);
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(screen.queryByText('Not found')).toBeNull();
});

test('Home exposes failed about and social-link requests', async () => {
  fetch.mockRejectedValue(new Error('offline'));
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect((await screen.findAllByRole('alert')).length).toBeGreaterThanOrEqual(2);
});

test('a missing article is not advertised as coming soon', async () => {
  fetch.mockResolvedValue(null);
  render(<MemoryRouter initialEntries={['/articles/missing']}><Routes><Route path="/articles/:slug" element={<ArticleDetail />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Article not found')).toBeTruthy();
});

test('Home distinguishes missing about text from loading', async () => {
  fetch.mockImplementation((query: string) => Promise.resolve(query.includes('experience') ? [] : null));
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(await screen.findByText('About information is not available yet.')).toBeTruthy();
});

test('a genuinely missing project renders not found', async () => {
  fetch.mockResolvedValue(null);
  renderProject();
  await waitFor(() => expect(screen.getByText('Project not found')).toBeTruthy());
});
