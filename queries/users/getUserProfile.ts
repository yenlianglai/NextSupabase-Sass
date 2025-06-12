import { db } from "@/db";

export const getUserProfile = async (id: string) => {
  const found = await db.query.profile.findFirst({
    where: (profile, { eq }) => (id ? eq(profile.id, id) : undefined),
  });

  return found;
};
