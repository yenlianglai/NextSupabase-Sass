DROP INDEX "name_idx";--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "name" varchar(50) NOT NULL;--> statement-breakpoint
CREATE INDEX "name_idx" ON "profile" USING btree ("name");--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "username";