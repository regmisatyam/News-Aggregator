import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // The full rewritten 400-700 word article
  summary: text("summary").notNull(), // Short summary
  category: text("category").notNull(),
  originalSource: text("original_source").notNull(), // For internal reference and deduping
  imageUrl: text("image_url"), // Optional generated or fetched image
  createdAt: timestamp("created_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
