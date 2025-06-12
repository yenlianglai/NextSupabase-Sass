import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/types/userProflie";

export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(`/api/userProfile`);
      if (!response.ok) {
        throw new Error("User profile not found");
      }
      const data: UserProfile = await response.json();
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
