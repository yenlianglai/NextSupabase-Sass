import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";

const handleUpdateUserProfile = async ({
  userName,
  userProfile,
}: {
  userName: string;
  userProfile: UserProfile;
}) => {
  const supabase = createClient();

  // if (email !== userProfile.email) {
  //   const { error: authError } = await supabase.auth.updateUser({ email });
  //   if (authError) throw new Error(`Auth update failed: ${authError.message}`);
  // }

  if (userName !== userProfile.name) {
    const { error: profileError } = await supabase
      .from("profile")
      .update({ name: userName })
      .match({ id: userProfile.id });

    if (profileError)
      throw new Error(`Profile update failed: ${profileError.message}`);
  }
  return { ...userProfile, name: userName };
};

export function useUserProfileMutation() {
  const queryClient = useQueryClient();

  const udpateUserProfile = useMutation({
    mutationFn: handleUpdateUserProfile,
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const currentUserProfile = queryClient.getQueryData(["user"]);
      queryClient.setQueryData(["user"], (oldProfile: UserProfile) => [
        {
          ...oldProfile,
          name: newProfile.userName,
        },
      ]);
      return { currentUserProfile };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["user"], context?.currentUserProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    udpateUserProfile: udpateUserProfile.mutate,
    isUpdating: udpateUserProfile.isPending,
  };
}
