import { useEffect, useState } from 'react';

type Result<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: unknown };

/** Pass a stable loader (a service function or useCallback), not an inline closure. */
export function useRequest<T>(key: string, load: (key: string) => Promise<T>): Result<T> {
  const [state, setState] = useState<{ key: string; load: typeof load; result: Result<T> }>(
    () => ({ key, load, result: { status: 'loading' } })
  );
  // Reset during render so old data never flashes under a new route, including A -> B -> A.
  if (state.key !== key || state.load !== load) {
    setState({ key, load, result: { status: 'loading' } });
  }

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => load(key)).then(
      (data) => { if (active) setState({ key, load, result: { status: 'ready', data } }); },
      (error: unknown) => { if (active) setState({ key, load, result: { status: 'error', error } }); }
    );
    return () => { active = false; };
  }, [key, load]);

  return state.key === key && state.load === load ? state.result : { status: 'loading' };
}
