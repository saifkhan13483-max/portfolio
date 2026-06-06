import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/firebase/firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Service } from "@/types";

export function useServices() {
  return useFirestoreCollection(QUERY_KEYS.services, servicesApi);
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, "id">) => servicesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Service>) => servicesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}
