/**
 * Centralized React Query cache key constants.
 *
 * Using a single source of truth for query keys prevents typos and makes
 * cache invalidation calls refactor-safe. Always import from here instead
 * of writing inline string literals.
 */
export const QUERY_KEYS = {
  projects:     ["/projects"]          as const,
  project:      (id: string) => ["/projects", id] as const,
  services:     ["/services"]          as const,
  orders:       ["/orders"]            as const,
} as const;
