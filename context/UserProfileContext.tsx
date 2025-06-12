// "use client";

// import { createContext, useContext } from "react";
// import { useUserData } from "@/hooks/users/useUserProfile";
// import { UserProfile } from "@/types/userProflie";

// interface OrganizationContextValue {
//   userProfile: UserProfile;
//   isLoadingUserProfile: boolean;
//   error: Error | null;
// }

// const OrganizationContext = createContext<OrganizationContextValue | null>(
//   null
// );

// export function UserProfileProviders({
//   children,
//   initialUserProfile,
// }: {
//   children: React.ReactNode;
//   initialUserProfile: UserProfile;
// }) {
//   const {
//     data: userProfile,
//     isLoading,
//     error,
//   } = useUserData(initialUserProfile);

//   return (
//     <OrganizationContext.Provider
//       value={{
//         userProfile: userProfile!, // now a ProfileRow
//         isLoadingUserProfile: isLoading,
//         error,
//       }}
//     >
//       {children}
//     </OrganizationContext.Provider>
//   );
// }

// export function useUserProfile() {
//   const context = useContext(OrganizationContext);
//   if (!context) {
//     throw new Error("useOrganization must be used within OrganizationProvider");
//   }
//   return context;
// }
