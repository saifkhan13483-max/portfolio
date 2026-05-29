import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { servicesApi } from "@/lib/firebase/firestore";
import type { Service } from "@/types";

export function useServices() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = servicesApi.subscribeAll((services) => {
      queryClient.setQueryData(["/services"], services);
    });
    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["/services"],
    queryFn: () => servicesApi.getAll(),
    staleTime: Infinity,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, 'id'>) => servicesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/services"] }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Service>) => servicesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/services"] }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/services"] }),
  });
}