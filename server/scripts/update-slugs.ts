/**
 * Migration script to add slugs and excerpts to existing articles
 * Run this after updating the database schema with: npm run db:push
 */

import { db } from "../db";
import { articles } from "@shared/schema";
import { generateSlug, generateExcerpt } from "../lib/utils";
import { isNull, eq } from "drizzle-orm";

async function updateExistingArticles() {
  console.log("Fetching articles without slugs or excerpts...");
  
  // Get all articles that don't have a slug
  const articlesWithoutSlugs = await db
    .select()
    .from(articles)
    .where(isNull(articles.slug));
  
  console.log(`Found ${articlesWithoutSlugs.length} articles to update.`);
  
  let updatedCount = 0;
  
  for (const article of articlesWithoutSlugs) {
    try {
      const slug = generateSlug(article.title);
      const excerpt = article.excerpt || generateExcerpt(article.summary);
      
      await db
        .update(articles)
        .set({ 
          slug,
          excerpt 
        })
        .where(eq(articles.id, article.id));
      
      updatedCount++;
      console.log(`✓ Updated article ${article.id}: ${article.title} -> ${slug}`);
    } catch (error) {
      console.error(`✗ Failed to update article ${article.id}:`, error);
    }
  }
  
  console.log(`\n✅ Successfully updated ${updatedCount} articles!`);
}

// Run the migration
updateExistingArticles()
  .then(() => {
    console.log("Migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

