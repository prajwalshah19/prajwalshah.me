import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from '../src/App';

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock('../src/services/sanity', () => ({ client: { fetch } }));
afterEach(() => { vi.restoreAllMocks(); window.location.hash = ''; });

test('actual route render failures preserve navigation and recover on navigation', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  // Invalid CMS data throws in BoardDetail before its page markup is returned.
  fetch.mockResolvedValueOnce({ _id: 'broken', title: 'Broken', imageAssetRef: 42 }).mockResolvedValue([]);
  window.location.hash = '#/board/broken';
  render(<App />);
  expect(await screen.findByText('Something went wrong')).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(await screen.findByText('No projects yet.')).toBeTruthy();
  expect(screen.queryByText('Something went wrong')).toBeNull();
});
