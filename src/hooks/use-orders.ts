import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ordersApi } from "@/lib/firebase/firestore";
import type { Order } from "@/types";

export function useOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = ordersApi.subscribeAll((orders) => {
      queryClient.setQueryData(["/orders"], orders);
    });
    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["/orders"],
    queryFn: () => ordersApi.getAll(),
    staleTime: Infinity, // Real-time updates handle freshness
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Order> }) => ordersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/orders"] }),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Order, 'id'>) => ordersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/orders"] }),
  });
}
