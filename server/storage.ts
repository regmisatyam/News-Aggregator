import { articles, type InsertArticle, type Article } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  getArticleByOriginalSource(source: string): Promise<Article | undefined>;
  getCategories(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(limit = 10, category?: string): Promise<Article[]> {
    let query = db.select().from(articles).orderBy(desc(articles.createdAt));
    
    if (category) {
      query = query.where(eq(articles.category, category)); // @ts-ignore - drizzle type complexity with dynamic where
    }
    
    return await query.limit(limit);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getArticleByOriginalSource(source: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.originalSource, source));
    return article;
  }

  async getCategories(): Promise<string[]> {
    const result = await db.selectDistinct({ category: articles.category }).from(articles);
    return result.map(r => r.category);
  }
}

export const storage = new DatabaseStorage();
