import { useState, useMemo, useRef } from "react";

/**
 * Generic search-filter hook for admin list pages.
 *
 * Accepts an optional `data` array and a `filterFn` predicate, and returns
 * the current search string, its setter, and the filtered list.
 *
 * `filterFn` is held in a ref so callers can define it inline without
 * invalidating the memo on every render.
 *
 * @example
 * const { search, setSearch, filtered } = useAdminSearch(
 *   projects,
 *   (p, q) => p.title.toLowerCase().includes(q)
 * );
 */
export function useAdminSearch<T>(
  data: T[] | undefined,
  filterFn: (item: T, query: string) => boolean
): { search: string; setSearch: (v: string) => void; filtered: T[] } {
  const [search, setSearch] = useState("");

  const filterFnRef = useRef(filterFn);
  filterFnRef.current = filterFn;

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(item => filterFnRef.current(item, q));
  }, [data, search]);

  return { search, setSearch, filtered };
}
