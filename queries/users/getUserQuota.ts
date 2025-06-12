import { db } from "@/db";

export const getUserQuota = async (id: string) => {
  const found = await db.query.userQuota.findFirst({
    where: (userQuota, { eq }) => eq(userQuota.id, id),
  });

  return found;
};
