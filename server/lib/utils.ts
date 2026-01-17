/**
 * Generate a URL-friendly slug from a title
 * @param title - The article title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove all non-word chars except hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate an excerpt from content
 * @param content - The full article content
 * @param maxLength - Maximum length of the excerpt (default: 160 characters)
 * @returns A truncated excerpt with ellipsis
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const cleanContent = content.trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Try to cut at the last sentence within maxLength
  const truncated = cleanContent.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  } else if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

