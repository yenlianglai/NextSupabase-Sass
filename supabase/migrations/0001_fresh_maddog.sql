ALTER TABLE "profile" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;