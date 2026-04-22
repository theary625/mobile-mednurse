/**
 * Calculate estimated reading time for text content
 * Average reading speed: 200-250 words per minute
 */
export const calculateReadTime = (content: string | null): number => {
  if (!content) return 1;
  
  const wordsPerMinute = 225;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readTime); // Minimum 1 minute
};

/**
 * Format read time for display
 */
export const formatReadTime = (minutes: number): string => {
  return `${minutes} min read`;
};
