ALTER TABLE "profile" DROP CONSTRAINT "profile_customer_id_unique";--> statement-breakpoint
ALTER TABLE "user_quota" ADD COLUMN "customer_id" text;--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "customer_id";--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_customer_id_unique" UNIQUE("customer_id");