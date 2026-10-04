import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading / error / retry support.
 * @param {() => Promise<any>} fetchFn
 * @param {any[]} deps
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Expose both aliases: refetch/reload and isLoading/loading
  return { data, isLoading, loading: isLoading, error, refetch: fetch, reload: fetch };
}
