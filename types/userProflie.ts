export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "user" | "admin" | null;
  tier: "free" | "basic" | "pro" | "premium";
  created_at: Date;
};
