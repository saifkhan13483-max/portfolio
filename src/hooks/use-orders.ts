import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/firebase/firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Order } from "@/types";

export function useOrders() {
  return useFirestoreCollection(QUERY_KEYS.orders, ordersApi);
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) => ordersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Order, "id">) => ordersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  });
}
