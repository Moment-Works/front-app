'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileQuestion } from 'lucide-react';
import { ArticleGrid } from './article-grid';
import { CategoryFilter } from './category-filter';
import { ViewMoreButton } from './view-more-button';
import type { ArticleListItem } from '@/types/article';
import type { CategoryFilter as CategoryFilterType } from '@/types/filters';

const ITEMS_PER_LOAD = 6;

interface TopPageListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilterType[];
}

export function TopPageListingClient({
  articles,
  categories,
}: TopPageListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize category from URL
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categoryFromUrl
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  // Filter articles by selected category
  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    return articles.filter((article) =>
      article.categoryNames?.includes(selectedCategoryId)
    );
  }, [articles, selectedCategoryId]);

  // Slice articles based on visible count
  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  // Check if more articles available
  const hasMore = visibleCount < filteredArticles.length;

  // Handle category filter change (T009, T011, T012)
  const handleCategoryChange = (categoryId: string | null) => {
    // Disable buttons during loading
    setIsLoading(true);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`, { scroll: false });

    // Update state
    setSelectedCategoryId(categoryId);
    setVisibleCount(ITEMS_PER_LOAD); // Reset to initial count (T011)

    // Re-enable buttons
    setIsLoading(false);
  };

  // Handle View More button click
  const handleLoadMore = () => {
    setIsLoading(true);

    // Simulate brief loading for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
      setIsLoading(false);
    }, 100);
  };

  // Sync with URL changes (browser back/forward) (T010)
  useEffect(() => {
    const newCategory = searchParams.get('category');
    if (newCategory !== selectedCategoryId) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setSelectedCategoryId(newCategory);
        setVisibleCount(ITEMS_PER_LOAD);

        // Scroll to article grid
        const articleGrid = document.getElementById('article-grid');
        if (articleGrid) {
          articleGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }, [searchParams, selectedCategoryId]);

  // Empty state - no articles at all
  if (articles.length === 0) {
    return (
      <div className='text-center py-12'>
        <FileQuestion className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
        <p className='text-lg text-muted-foreground'>
          No blog posts available. Check back soon!
        </p>
      </div>
    );
  }

  // Empty state - no articles in selected category
  if (filteredArticles.length === 0 && selectedCategoryId) {
    return (
      <div className='space-y-8'>
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategoryChange}
          disabled={isLoading}
        />

        <div className='text-center py-12'>
          <FileQuestion className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
          <p className='text-lg text-muted-foreground'>
            No posts in this category yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Category Filter (T012 - disabled prop) */}
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategoryChange}
        disabled={isLoading}
      />

      {/* Article Grid */}
      <div id='article-grid'>
        <ArticleGrid articles={displayedArticles} />
      </div>

      {/* View More Button */}
      <ViewMoreButton
        onClick={handleLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        loadedCount={displayedArticles.length}
        totalCount={filteredArticles.length}
      />
    </div>
  );
}
