import { useEffect } from "react";
import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

/**
 * Minimal shape required from a Firestore CRUD helper to support this hook.
 * Matches the object returned by `createCRUD` in `src/lib/firebase/firestore.ts`.
 */
interface FirestoreApi<T> {
  getAll: () => Promise<T[]>;
  subscribeAll: (callback: (data: T[]) => void, onError?: (err: Error) => void) => () => void;
}

/**
 * Wires a Firestore collection to React Query with real-time subscription.
 *
 * - The `subscribeAll` listener keeps the cache up-to-date on every Firestore
 *   write, so `staleTime: Infinity` is used to prevent redundant background
 *   re-fetches while the subscription is alive.
 * - `api` must be a stable reference (e.g. a module-level constant) to avoid
 *   re-subscribing on every render.
 *
 * @example
 * export function useProjects() {
 *   return useFirestoreCollection(QUERY_KEYS.projects, projectsApi);
 * }
 */
export function useFirestoreCollection<T>(
  queryKey: readonly string[],
  api: FirestoreApi<T>
): UseQueryResult<T[]> {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = api.subscribeAll((data) => {
      queryClient.setQueryData(queryKey, data);
    });
    return () => unsubscribe();
    // queryKey identity is stable (const tuples from QUERY_KEYS); api is a module-level singleton.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);

  return useQuery({
    queryKey,
    queryFn: () => api.getAll(),
    staleTime: Infinity,
  });
}
