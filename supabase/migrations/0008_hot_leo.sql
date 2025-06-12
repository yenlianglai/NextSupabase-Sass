ALTER TABLE "user_quota" ADD COLUMN "subscription_id" text;--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_subscription_id_unique" UNIQUE("subscription_id");