# Database Migration Guide

## Adding Slug and Excerpt Fields

This guide will help you migrate your database to include the new `slug` and `excerpt` fields for articles.

### What's Changed

1. **New Fields Added to Articles Table:**
   - `slug` (text, nullable): URL-friendly slug generated from the article title
   - `excerpt` (text, nullable): Short preview text (160 characters max)

2. **New Features:**
   - Articles are now accessible via slug URLs (e.g., `/article/breaking-news-story`)
   - Automatic slug generation from titles for new articles
   - Backward compatibility: old numeric IDs still work

### Migration Steps

#### Step 1: Update Database Schema

Run the following command to push the schema changes to your database:

```bash
npm run db:push
```

This will add the new `slug` and `excerpt` columns to your articles table. Both fields are nullable, so your existing data won't be affected.

#### Step 2: Update Existing Articles (Optional but Recommended)

To populate slugs and excerpts for your existing articles, run:

```bash
tsx --env-file=.env server/scripts/update-slugs.ts
```

This script will:
- Generate URL-friendly slugs from existing article titles
- Create excerpts from article summaries
- Update all articles that don't have these fields

#### Step 3: Verify the Changes

After running the migration:

1. Check your database to ensure the new columns exist
2. Verify that existing articles have been updated with slugs
3. Test accessing articles via their new slug URLs

### Example URLs

**Before:**
- `/article/123` (numeric ID)

**After:**
- `/article/breaking-news-story` (slug)
- `/article/123` (still works for backward compatibility)

### Rollback (if needed)

If you need to rollback these changes:

1. Remove the `slug` and `excerpt` fields from `shared/schema.ts`
2. Run `npm run db:push` again

Note: This will remove the columns and any data in them.

### Future Articles

All newly generated articles will automatically include:
- A unique slug based on their title
- An excerpt generated from their summary

No additional action is required for future articles.

