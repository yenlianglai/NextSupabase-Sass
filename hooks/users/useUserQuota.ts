import { useQuery } from "@tanstack/react-query";
import { UserQuota } from "@/types";

export function useUserQuota() {
  return useQuery<UserQuota, Error>({
    queryKey: ["userQuota"],
    queryFn: async () => {
      const response = await fetch(`/api/userQuota`);

      if (!response.ok) {
        throw new Error("Failed to fetch user quota");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Allow refetch on mount
  });
}
