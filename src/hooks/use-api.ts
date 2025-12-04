/**
 * Custom Hook - useApi
 * Provides a convenient way to make API calls with loading and error states
 */

import { useState, useCallback } from "react";
import { apiClient, ApiError } from "@/infrastructure/api/api-client";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with built-in state management
 *
 * @example
 * const { data, isLoading, error, execute } = useApi<User[]>();
 *
 * const fetchUsers = async () => {
 *   await execute(() => apiClient.get('/api/v1/users'));
 * };
 */
export function useApi<T = any>(options?: UseApiOptions): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : "An unexpected error occurred";

        setError(errorMessage);
        options?.onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for making GET requests
 */
export function useApiGet<T = any>(endpoint: string, options?: UseApiOptions) {
  const api = useApi<T>(options);

  const fetch = useCallback(async () => {
    return api.execute(() => apiClient.get<T>(endpoint));
  }, [endpoint, api]);

  return {
    ...api,
    fetch,
  };
}

/**
 * Hook for making POST requests
 */
export function useApiPost<T = any>(endpoint: string, options?: UseApiOptions) {
  const api = useApi<T>(options);

  const post = useCallback(
    async (body: any) => {
      return api.execute(() => apiClient.post<T>(endpoint, body));
    },
    [endpoint, api]
  );

  return {
    ...api,
    post,
  };
}

/**
 * Hook for making PUT requests
 */
export function useApiPut<T = any>(endpoint: string, options?: UseApiOptions) {
  const api = useApi<T>(options);

  const put = useCallback(
    async (body: any) => {
      return api.execute(() => apiClient.put<T>(endpoint, body));
    },
    [endpoint, api]
  );

  return {
    ...api,
    put,
  };
}

/**
 * Hook for making DELETE requests
 */
export function useApiDelete<T = any>(
  endpoint: string,
  options?: UseApiOptions
) {
  const api = useApi<T>(options);

  const del = useCallback(async () => {
    return api.execute(() => apiClient.delete<T>(endpoint));
  }, [endpoint, api]);

  return {
    ...api,
    delete: del,
  };
}
