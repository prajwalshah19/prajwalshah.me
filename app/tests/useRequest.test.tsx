import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useRequest } from '../src/hooks/useRequest';

function deferred() {
  let resolve!: (value: string) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<string>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test('A -> B -> A starts a fresh request and ignores an old rejection', async () => {
  const a = deferred();
  const b = deferred();
  const nextA = deferred();
  const load = vi.fn().mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise).mockReturnValueOnce(nextA.promise);
  const { result, rerender } = renderHook(({ key }) => useRequest(key, load), { initialProps: { key: 'a' } });
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1));
  await act(async () => a.resolve('old A'));
  rerender({ key: 'b' });
  await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
  rerender({ key: 'a' });
  expect(result.current.status).toBe('loading');
  await act(async () => b.reject(new Error('stale error')));
  expect(result.current.status).toBe('loading');
  await act(async () => nextA.resolve('new A'));
  expect(result.current).toEqual({ status: 'ready', data: 'new A' });
});

test('synchronous loader errors become request errors', async () => {
  const load = () => { throw new Error('bad config'); };
  const { result } = renderHook(() => useRequest('a', load));
  await waitFor(() => expect(result.current.status).toBe('error'));
});

test('settling after unmount does not update the request', async () => {
  const pending = deferred();
  const load = () => pending.promise;
  const { result, unmount } = renderHook(() => useRequest('a', load));
  await act(async () => {});
  unmount();
  await act(async () => pending.resolve('late'));
  expect(result.current.status).toBe('loading');
});
