import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/firebase/firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Project } from "@/types";

export function useProjects() {
  return useFirestoreCollection(QUERY_KEYS.projects, projectsApi);
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
