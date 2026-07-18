import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  company: text("company").notNull(),
  industry: text("industry").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  required_skills: text("required_skills", { mode: "json" }).notNull(), // Stores array of skills
  description_embedding: text("description_embedding", { mode: "json" }).notNull(), // Stores vector array
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const analyses = sqliteTable("analyses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_skills: text("user_skills", { mode: "json" }).notNull(),
  user_embedding: text("user_embedding", { mode: "json" }).notNull(),
  matched_jobs: text("matched_jobs", { mode: "json" }), // Caches job matches
  gap_results: text("gap_results", { mode: "json" }), // Caches gap analysis results
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
