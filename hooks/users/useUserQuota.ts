import { useQuery } from "@tanstack/react-query";
import { UserQuota } from "@/types/userQuota";

export function useUserQuota() {
  return useQuery<UserQuota, Error>({
    queryKey: ["userQuota"],
    queryFn: async () => {
      const response = await fetch(`/api/userQuota`);
      if (!response.ok) {
        throw new Error("User quota not found");
      }
      const data: UserQuota = await response.json();
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
