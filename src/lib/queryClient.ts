import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query client.
 *
 * All data fetching in this project goes through Firebase hooks that supply
 * their own queryFn, so no default queryFn is registered here.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
