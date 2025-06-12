CREATE TABLE "essays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"status" text DEFAULT 'pending',
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grading_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"essay_id" uuid NOT NULL,
	"total_score" numeric(5, 2) NOT NULL,
	"llm_feedback" jsonb,
	"graded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"image_url" text,
	"additional_instruction" text,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user',
	"tier" text DEFAULT 'free',
	CONSTRAINT "profile_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_quota_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_date" date NOT NULL,
	"token_count" numeric DEFAULT 0,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grading_results" ADD CONSTRAINT "grading_results_essay_id_essays_id_fk" FOREIGN KEY ("essay_id") REFERENCES "public"."essays"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_owner_id_profile_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quota_counters" ADD CONSTRAINT "user_quota_counters_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_idx" ON "essays" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "problem_idx" ON "essays" USING btree ("problem_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_grading_results_essay_id" ON "grading_results" USING btree ("essay_id");--> statement-breakpoint
CREATE INDEX "owner_idx" ON "problems" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "name_idx" ON "profile" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "profile" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_quota_user_date" ON "user_quota_counters" USING btree ("user_id","period_date");