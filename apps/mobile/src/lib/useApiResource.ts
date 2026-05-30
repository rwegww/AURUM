import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from '@/auth/AuthProvider';

export const useApiResource = <T,>(path: string | null, options: { auth?: boolean; enabled?: boolean } = {}) => {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!path || options.enabled === false) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<T>(path, options.auth ? { token } : undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [options.auth, options.enabled, path, token]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
};
