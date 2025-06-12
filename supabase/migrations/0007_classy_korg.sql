ALTER TABLE "profile" RENAME COLUMN "stripe_customer_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_stripe_customer_id_unique";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_customer_id_unique" UNIQUE("customer_id");