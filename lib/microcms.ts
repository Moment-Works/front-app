/**
 * microCMS API client and data fetching functions
 */

import { createClient } from 'microcms-js-sdk';
import type { MicroCMSBlog } from '@/types/microcms';
import type { ArticleListItem, ArticleDetail } from '@/types/article';
import type { CategoryFilter } from '@/types/filters';
import { transformToListItem, transformToArticleDetail } from './transforms';

// Validate environment variables
if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error(
    'MICROCMS_SERVICE_DOMAIN is not defined in environment variables'
  );
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is not defined in environment variables');
}

// Initialize microCMS client
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

/**
 * Fetch all blog articles from microCMS
 * @returns Array of article list items, sorted by publish date (newest first)
 */
export async function fetchAllArticles(): Promise<ArticleListItem[]> {
  const allArticles: MicroCMSBlog[] = [];
  let offset = 0;
  const limit = 100; // microCMS max limit per request

  // Fetch all articles with pagination
  while (true) {
    const response = await client.getList<MicroCMSBlog>({
      endpoint: 'blogs',
      queries: {
        limit,
        offset,
        orders: '-publishedAt', // Newest first
      },
    });

    allArticles.push(...response.contents);

    // Break if we've fetched all articles
    if (allArticles.length >= response.totalCount) {
      break;
    }

    offset += limit;
  }

  return allArticles.map(transformToListItem);
}

/**
 * Fetch a single article by slug (ID)
 * @param slug - Article ID/slug
 * @returns Article detail with navigation context
 */
export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const blog = await client.get<MicroCMSBlog>({
    endpoint: 'blogs',
    contentId: slug,
  });

  // Get all articles for navigation context
  const allArticles = await fetchAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);

  const navigation = {
    previous:
      currentIndex > 0
        ? {
            slug: allArticles[currentIndex - 1].slug,
            title: allArticles[currentIndex - 1].title,
          }
        : null,
    next:
      currentIndex < allArticles.length - 1
        ? {
            slug: allArticles[currentIndex + 1].slug,
            title: allArticles[currentIndex + 1].title,
          }
        : null,
  };

  return transformToArticleDetail(blog, navigation);
}

/**
 * Generate category filters with article counts
 * @returns Array of category filters
 */
export async function fetchCategoryFilters(): Promise<CategoryFilter[]> {
  const articles = await fetchAllArticles();
  const categoryMap = new Map<string, { name: string; count: number }>();

  articles.forEach((article) => {
    if (article.categoryNames) {
      article.categoryNames.forEach((categoryName) => {
        const existing = categoryMap.get(categoryName);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(categoryName, {
            name: categoryName,
            count: 1,
          });
        }
      });
    }
  });

  return Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count,
  }));
}
