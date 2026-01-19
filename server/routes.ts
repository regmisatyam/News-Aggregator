import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import cron from "node-cron";
import { fetchRSSNews } from "./lib/news";
import { processArticle } from "./lib/openai";
import { generateSlug, generateExcerpt } from "./lib/utils";

// Helper to generate image for an article
async function generateArticleImage(articleId: number): Promise<string | null> {
  try {
    const response = await fetch(`https://dailyfeed-images.onrender.com/news-image?id=${articleId}`);
    
    if (!response.ok) {
      console.error(`Failed to generate image for article ${articleId}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // The API returns the URL without https://, so we need to add it
    if (data.url) {
      return `https://${data.url}`;
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating image for article ${articleId}:`, error);
    return null;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API Routes ---

  app.get(api.articles.list.path, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const articles = await storage.getArticles(limit, category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get(api.articles.get.path, async (req, res) => {
    try {
      const idOrSlug = req.params.id;
      
      // Try to get by slug first, then fall back to id
      let article: typeof storage.getArticle extends (...args: any) => Promise<infer R> ? R : never;
      
      // Check if it's a numeric id or a slug
      if (/^\d+$/.test(idOrSlug)) {
        article = await storage.getArticle(Number(idOrSlug));
      } else {
        article = await storage.getArticleBySlug(idOrSlug);
      }
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get(api.categories.list.path, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post(api.articles.generate.path, async (req, res) => {
    try {
      const count = await generateNews();
      res.json({ message: "Generation complete", count });
    } catch (error) {
      console.error("Manual generation error:", error);
      res.status(500).json({ message: "Generation failed" });
    }
  });

  // --- Cron Job ---
  
  // Run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    console.log("Running hourly news generation...");
    await generateNews();
  });

  return httpServer;
}

// Helper to generate news
async function generateNews(): Promise<number> {
  console.log("Fetching RSS news...");
  const rawArticles = await fetchRSSNews();
  console.log(`Fetched ${rawArticles.length} raw articles.`);

  let savedCount = 0;
  const createdArticleIds: number[] = [];

  for (const raw of rawArticles) {
    // 1. Deduplication
    const existing = await storage.getArticleByOriginalSource(raw.originalSource);
    if (existing) {
      continue;
    }

    // 2. AI Processing
    console.log(`Processing: ${raw.title}`);
    const processed = await processArticle(raw.title, raw.content, raw.category);
    
    if (processed) {
      // 3. Generate slug and excerpt
      const slug = generateSlug(processed.title);
      const excerpt = generateExcerpt(processed.summary);
      
      // 4. Save article first (must be published before image generation)
      const article = await storage.createArticle({
        title: processed.title,
        slug,
        excerpt,
        content: processed.content,
        summary: processed.summary,
        category: raw.category,
        originalSource: raw.originalSource,
        imageUrl: null, // Will be updated after image generation
        isPublished: true
      });
      
      createdArticleIds.push(article.id);
      savedCount++;
    }
  }

  console.log(`Generated and saved ${savedCount} new articles.`);

  // 5. Generate images for all published articles
  console.log("Generating images for published articles...");
  for (const articleId of createdArticleIds) {
    console.log(`Generating image for article ${articleId}...`);
    const imageUrl = await generateArticleImage(articleId);
    
    if (imageUrl) {
      await storage.updateArticleImageUrl(articleId, imageUrl);
      console.log(`Updated article ${articleId} with image: ${imageUrl}`);
    }
  }

  console.log(`Image generation complete.`);
  return savedCount;
}
