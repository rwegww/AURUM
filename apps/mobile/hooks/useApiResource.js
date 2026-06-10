import React from "react";

export const useApiResource = (loader, dependencies = [], options = {}) => {
  const [data, setData] = React.useState(options.initialData ?? null);
  const [loading, setLoading] = React.useState(Boolean(options.loadOnMount ?? true));
  const [error, setError] = React.useState(null);
  const mountedRef = React.useRef(true);
  const requestIdRef = React.useRef(0);

  const load = React.useCallback(async () => {
    if (!loader) return null;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await loader();
      if (mountedRef.current && requestIdRef.current === requestId) setData(result);
      return result;
    } catch (err) {
      if (mountedRef.current && requestIdRef.current === requestId) setError(err);
      return null;
    } finally {
      if (mountedRef.current && requestIdRef.current === requestId) setLoading(false);
    }
  }, dependencies);

  React.useEffect(() => {
    mountedRef.current = true;
    if (options.loadOnMount !== false) {
      load();
    }
    return () => {
      requestIdRef.current += 1;
      mountedRef.current = false;
    };
  }, [load, options.loadOnMount]);

  return {
    data,
    setData,
    loading,
    error,
    reload: load
  };
};
