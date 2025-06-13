import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/types";

export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(`/api/userProfile`);

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return response.json();
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
