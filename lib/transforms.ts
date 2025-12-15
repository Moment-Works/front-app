/**
 * Data transformation utilities
 * Transform microCMS API responses to application domain types
 */

import type { MicroCMSBlog } from '@/types/microcms';
import type {
  ArticleListItem,
  ArticleDetail,
  ArticleNavigation,
} from '@/types/article';
import {
  injectHeadingAnchors,
  extractTableOfContents,
} from './html-processing';

/**
 * Extract plain text excerpt from HTML content
 * @param html - HTML content
 * @param maxLength - Maximum length of excerpt
 * @returns Plain text excerpt
 */
function extractExcerpt(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Transform microCMS blog to article list item
 * @param blog - Raw microCMS blog data
 * @returns Optimized article list item
 */
export function transformToListItem(blog: MicroCMSBlog): ArticleListItem {
  return {
    id: blog.id,
    slug: blog.id, // Use ID as slug
    title: blog.title,
    excerpt: extractExcerpt(blog.content, 150),
    eyecatchUrl: blog.eyecatch?.url,
    categoryNames: blog.categories?.map((cat) => cat.name) || [],
    publishedAt: blog.publishedAt || blog.createdAt,
  };
}

/**
 * Transform microCMS blog to full article detail
 * @param blog - Raw microCMS blog data
 * @param navigation - Article navigation context
 * @returns Full article detail with processed content
 */
export function transformToArticleDetail(
  blog: MicroCMSBlog,
  navigation: ArticleNavigation
): ArticleDetail {
  const processedContent = injectHeadingAnchors(blog.content);
  const toc = extractTableOfContents(processedContent);

  return {
    id: blog.id,
    slug: blog.id,
    title: blog.title,
    content: processedContent,
    eyecatch: blog.eyecatch,
    categoryNames: blog.categories?.map((cat) => cat.name) || [],
    publishedAt: blog.publishedAt || blog.createdAt,
    tableOfContents: toc,
    navigation,
  };
}
