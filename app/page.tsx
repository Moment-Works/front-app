/**
 * Top page (Server Component)
 * Main entry point with blog listing and navigation
 */

import { fetchAllArticles, fetchCategoryFilters } from '@/lib/microcms';
import { MobileNavigation } from '@/components/mobile-navigation';
import { TopPageListingClient } from '@/components/top-page-listing-client';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moment Works - Latest Articles',
  description:
    'Explore our latest blog articles covering technology, design, and development insights. Stay updated with our newest content.',
  openGraph: {
    title: 'Moment Works - Latest Articles',
    description:
      'Explore our latest blog articles covering technology, design, and development insights',
    type: 'website',
    url: 'https://momentworks.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moment Works - Latest Articles',
    description:
      'Explore our latest blog articles covering technology, design, and development insights',
  },
};

// Note: Open Graph image is auto-handled by app/opengraph-image.png

export default async function HomePage() {
  // Fetch data server-side (T006)
  let articles, categories;

  try {
    [articles, categories] = await Promise.all([
      fetchAllArticles(),
      fetchCategoryFilters(),
    ]);
  } catch (error) {
    // Error handling (T008)
    console.error('Failed to fetch blog content:', error);
    return (
      <div className='min-h-screen flex flex-col'>
        <MobileNavigation />
        <main className='flex-1 container mx-auto px-4 py-12 text-center'>
          <h1 className='text-2xl font-bold mb-4'>Unable to load articles</h1>
          <p className='text-muted-foreground mb-6'>
            There was a problem loading the blog content. Please try again
            later.
          </p>
          <form>
            <Button type='submit' size='lg'>
              Retry
            </Button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navigation (T007) */}
      <MobileNavigation />

      {/* Main Content */}
      <main className='flex-1 container mx-auto px-4 py-8'>
        {/* Hero Section */}
        <div className='mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Latest Articles
          </h1>
          <p className='text-xl text-muted-foreground'>
            Explore our insights on technology, design, and development
          </p>
        </div>

        {/* Blog Listing */}
        <TopPageListingClient articles={articles} categories={categories} />
      </main>

      {/* Footer */}
      <footer className='border-t py-6 mt-12'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          © 2025 Moment Works. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
