import { sql } from "drizzle-orm";
import {
  pgTable,
  pgSchema,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  numeric,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");
const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

//
// 1. Profile Table
//
export const profile = pgTable(
  "profile",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "admin"] }).default("user"),
    name: varchar("name", { length: 50 }).default("Anonymous"),
    email: text("email").notNull().unique(),
    avatar_url: text("avatar_url"),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("email_idx").on(table.email),
  ]
);

//
// 2. Problems Table
//
export const problems = pgTable(
  "problems",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    owner_id: uuid("owner_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    image_url: text("image_url"),
    additional_instruction: text("additional_instruction"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("owner_idx").on(table.owner_id)]
);

//
// 3. Essays Table
//
export const essays = pgTable(
  "essays",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    problem_id: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    image_url: text("image_url"),
    status: text("status", {
      enum: ["pending", "processing", "graded"],
    }).default("pending"),
    submitted_at: timestamp("submitted_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("user_idx").on(table.user_id),
    index("problem_idx").on(table.problem_id),
  ]
);

//
// 4. Grading Results Table
//
export const gradingResults = pgTable(
  "grading_results",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    essay_id: uuid("essay_id")
      .notNull()
      .references(() => essays.id, { onDelete: "cascade" }),
    total_score: numeric("total_score", { precision: 5, scale: 2 }).notNull(),
    llm_feedback: jsonb("llm_feedback"),
    graded_at: timestamp("graded_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("uq_grading_results_essay_id").on(table.essay_id)]
);

//
// 5. usageLog
//
export const usageLog = pgTable(
  "usage_log",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: uuid("user_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    token_count: numeric("token_count", { mode: "number" }).default(0),
    created_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_quota_user_date").on(table.user_id, table.created_at),
  ]
);

// 6. User Quota Table
export const userQuota = pgTable(
  "user_quota",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => profile.id, { onDelete: "cascade" }),
    customer_id: text("customer_id").unique(),
    subscription_id: text("subscription_id").unique(),
    tier: text("tier", { enum: ["free", "basic", "pro", "premium"] }).default(
      "free"
    ),
    num_usages: numeric("num_usages", { mode: "number" }).default(0),
    threshold: numeric("threshold", { mode: "number" }).default(10),
    next_billed_at: timestamp("next_billed_at"),
  },
  (table) => [uniqueIndex("uq_user_quota_id").on(table.id)]
);
