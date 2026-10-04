import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import MarkdownRenderer from '../src/components/MarkdownRenderer';
import ScrollToTop from '../src/components/ScrollToTop';

const scrollIntoView = vi.fn();
const markdown = `
[Details](#details) [Duplicate](#details-1) [Encoded](#caf%C3%A9)
[Missing](#absent) [Malformed](#%E0%A4%A) [Empty](#)
[External](https://example.com/docs)

## Details
## Details
## Details-1
## **Formatted** [heading](https://example.com) with \`code\`
## Café
`;

function LocationProbe() {
  const { pathname, search, hash } = useLocation();
  return <output data-testid="location">{pathname}{search}{hash}</output>;
}

function mount(content = markdown, fragment = '') {
  window.history.replaceState(null, '', `/#/articles/example?preview=yes${fragment}`);
  return render(
    <HashRouter>
      <ScrollToTop />
      <LocationProbe />
      <Routes>
        <Route path="/articles/:slug" element={<MarkdownRenderer markdown={content} />} />
        <Route path="*" element={<p>Wrong route</p>} />
      </Routes>
    </HashRouter>,
  );
}

beforeEach(() => {
  scrollIntoView.mockClear();
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView });
});
afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
  Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

test('fragment links preserve pathname and search, scroll, and work repeatedly', async () => {
  mount();
  const link = screen.getByRole('link', { name: 'Details', exact: true });
  expect(link.getAttribute('href')).toBe('#/articles/example?preview=yes#details');
  vi.mocked(window.scrollTo).mockClear();
  fireEvent.click(link);
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
  expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('details'));
  expect(screen.getByTestId('location').textContent).toBe('/articles/example?preview=yes#details');
  expect(window.location.hash).toBe('#/articles/example?preview=yes#details');
  fireEvent.click(link);
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(2));
  expect(window.scrollTo).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('link', { name: 'Duplicate' }));
  await waitFor(() => expect(scrollIntoView.mock.instances.at(-1)).toBe(document.getElementById('details-1')));
});

test('heading IDs include formatted text and resolve duplicate collisions deterministically', () => {
  const view = mount();
  const ids = () => screen.getAllByRole('heading').map(heading => heading.id);
  expect(ids()).toEqual(['details', 'details-1', 'details-1-1', 'formatted-heading-with-code', 'café']);
  view.unmount();
  mount();
  expect(ids()).toEqual(['details', 'details-1', 'details-1-1', 'formatted-heading-with-code', 'café']);
});

test('encoded fragments scroll to decoded IDs and direct route hashes scroll on mount', async () => {
  const view = mount();
  fireEvent.click(screen.getByRole('link', { name: 'Encoded' }));
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
  expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('café'));
  view.unmount();
  scrollIntoView.mockClear();
  mount(markdown, '#caf%C3%A9');
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
  expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('café'));
});

test.each(['Missing', 'Malformed', 'Empty'])('%s fragment never throws or leaves the route', async name => {
  mount();
  const link = screen.getByRole('link', { name });
  expect(link.getAttribute('href')).toMatch(/^#\/articles\/example\?preview=yes/);
  expect(() => fireEvent.click(link)).not.toThrow();
  await waitFor(() => expect(screen.getByTestId('location').textContent).toMatch(/^\/articles\/example\?preview=yes/));
  expect(screen.queryByText('Wrong route')).toBeNull();
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }])('modified clicks retain route-safe href without intercepting navigation: %j', modifiers => {
  mount();
  const link = screen.getByRole('link', { name: 'Details', exact: true });
  expect(link.getAttribute('href')).toBe('#/articles/example?preview=yes#details');
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...modifiers });
  let intercepted: boolean | undefined;
  // Observe after React's delegated handler, then suppress jsdom's native navigation
  // before dispatch ends so it cannot leak a pending hash change into another test.
  window.addEventListener('click', nativeEvent => {
    intercepted = nativeEvent.defaultPrevented;
    nativeEvent.preventDefault();
  }, { once: true });
  fireEvent(link, event);
  expect(intercepted).toBe(false);
  expect(scrollIntoView).not.toHaveBeenCalled();
  expect(screen.getByTestId('location').textContent).toBe('/articles/example?preview=yes');
});

test('GFM footnote references and backlinks scroll to non-heading IDs without leaving the route', async () => {
  mount('A statement[^1].\n\n[^1]: Supporting detail.');
  const reference = screen.getByRole('link', { name: '1', exact: true });
  const backlink = screen.getByRole('link', { name: 'Back to reference 1' });
  const footnote = document.getElementById('user-content-fn-1');
  expect(footnote?.tagName).toBe('LI');
  expect(reference.id).toBe('user-content-fnref-1');
  expect(reference.getAttribute('href')).toBe('#/articles/example?preview=yes#user-content-fn-1');
  expect(backlink.getAttribute('href')).toBe('#/articles/example?preview=yes#user-content-fnref-1');

  fireEvent.click(reference);
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
  expect(scrollIntoView.mock.instances[0]).toBe(footnote);
  expect(screen.getByTestId('location').textContent).toBe('/articles/example?preview=yes#user-content-fn-1');

  fireEvent.click(backlink);
  await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(2));
  expect(scrollIntoView.mock.instances[1]).toBe(reference);
  expect(screen.getByTestId('location').textContent).toBe('/articles/example?preview=yes#user-content-fnref-1');
  expect(screen.queryByText('Wrong route')).toBeNull();
});

test('external links retain a safe new-tab target and styling', () => {
  mount();
  const link = screen.getByRole('link', { name: 'External' });
  expect(link.getAttribute('href')).toBe('https://example.com/docs');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  expect(link.className).toBe('inline-flex items-center gap-1');
});
