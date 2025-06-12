ALTER TABLE "user_quota" ADD COLUMN "tier" text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "tier";