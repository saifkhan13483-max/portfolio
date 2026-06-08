import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/firebase/firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { getProjects, getProject } from "@/lib/firebase/firestore-lite";
import { QUERY_KEYS } from "@/lib/query-keys";
import { queryClient } from "@/lib/queryClient";
import type { Project } from "@/types";

/**
 * Fire-and-forget Firestore prefetch — call on nav hover so data arrives
 * before the route chunk finishes loading. No-ops if data is already fresh.
 */
export function prefetchProjects() {
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Real-time subscription hook — uses full Firestore SDK (~60KB).
 * Keep this for admin pages that need live updates.
 */
export function useProjects() {
  return useFirestoreCollection(QUERY_KEYS.projects, projectsApi);
}

/**
 * One-shot read hook — uses Firestore Lite (~17KB).
 * Use this on all public pages (Portfolio, Home gallery).
 * Shares the same React Query cache key as useProjects(), so data
 * from an admin session is reused without extra fetches.
 */
export function useProjectsLite() {
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
  });
}

/**
 * One-shot single-project read — uses Firestore Lite.
 * Use on the public ProjectDetail page.
 *
 * initialData seeds the detail cache from the already-cached projects list
 * so navigating from the portfolio page shows content INSTANTLY — no Firestore
 * round-trip needed. initialDataUpdatedAt tells React Query the data is as
 * fresh as the list query, preventing unnecessary background refetches.
 */
export function useProjectLite(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => getProject(id),
    enabled: !!id,
    initialData: () => {
      const list = queryClient.getQueryData<Project[]>(QUERY_KEYS.projects);
      return list?.find((p) => p.id === id);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(QUERY_KEYS.projects)?.dataUpdatedAt,
  });
}

/**
 * Prefetch a single project on card hover so the detail page opens instantly.
 * Seeds both the individual key and (if not cached) the list key.
 */
export function prefetchProject(id: string) {
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => getProject(id),
    staleTime: 30 * 60 * 1000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Project, "id">) => projectsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Project>) => projectsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}
