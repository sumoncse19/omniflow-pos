import { useState, useEffect } from "react";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [v, setV] = useState(0);

  useEffect(() => {
    let stale = false;
    fn()
      .then((d) => {
        if (!stale) {
          setData(d);
          setError("");
        }
      })
      .catch(() => {
        if (!stale) setError("Failed to load");
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [...deps, v]);

  return { data, error, setError, loading, refetch: () => setV((n) => n + 1) };
}
