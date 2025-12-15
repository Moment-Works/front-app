/**
 * Blog listing page (Server Component)
 * Displays paginated list of blog articles
 */

import { fetchAllArticles, fetchCategoryFilters } from '@/lib/microcms';
import { BlogListingClient } from '@/components/blog-listing-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Articles',
  description: 'Browse our latest blog articles and insights',
};

export default async function BlogListingPage() {
  const articles = await fetchAllArticles();
  const categories = await fetchCategoryFilters();

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8'>Blog Articles</h1>
      <BlogListingClient articles={articles} categories={categories} />
    </main>
  );
}
