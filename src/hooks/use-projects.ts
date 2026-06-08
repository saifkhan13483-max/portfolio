import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/firebase/firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { getProjects, getProject } from "@/lib/firebase/firestore-lite";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Project } from "@/types";

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
 */
export function useProjectLite(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => getProject(id),
    enabled: !!id,
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
