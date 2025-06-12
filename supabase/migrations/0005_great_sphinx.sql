CREATE TABLE "user_quota" (
	"id" uuid PRIMARY KEY NOT NULL,
	"num_usages" numeric DEFAULT 0,
	"threshold" numeric DEFAULT 10
);
--> statement-breakpoint
ALTER TABLE "user_quota_counters" RENAME TO "usage_log";--> statement-breakpoint
ALTER TABLE "usage_log" DROP CONSTRAINT "user_quota_counters_user_id_profile_id_fk";
--> statement-breakpoint
DROP INDEX "uq_quota_user_date";--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "stripe_customer_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_quota" ADD CONSTRAINT "user_quota_id_profile_id_fk" FOREIGN KEY ("id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_quota_id" ON "user_quota" USING btree ("id");--> statement-breakpoint
ALTER TABLE "usage_log" ADD CONSTRAINT "usage_log_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_quota_user_date" ON "usage_log" USING btree ("user_id","updated_at");--> statement-breakpoint
ALTER TABLE "usage_log" DROP COLUMN "period_date";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_stripe_customer_id_unique" UNIQUE("stripe_customer_id");