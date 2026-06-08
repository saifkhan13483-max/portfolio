import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query client.
 *
 * All data fetching in this project goes through Firebase hooks that supply
 * their own queryFn, so no default queryFn is registered here.
 *
 * staleTime: 30 min — portfolio/services data changes rarely; avoids redundant
 *   Firestore reads when the user navigates between pages.
 * gcTime: 60 min — keep inactive cache entries in memory for a full session.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
