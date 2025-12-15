/**
 * Blog listing client component
 * Manages pagination and filtering state for article listing
 */

'use client';

import { useState, useMemo } from 'react';
import { ArticleGrid } from './article-grid';
import { Pagination } from './pagination';
import { CategoryFilter as CategoryFilterComponent } from './category-filter';
import type { ArticleListItem } from '@/types/article';
import type { CategoryFilter } from '@/types/filters';

const ITEMS_PER_PAGE = 10;

interface BlogListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilter[];
}

export function BlogListingClient({
  articles,
  categories,
}: BlogListingClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Filter articles by selected category (match if article has the selected category)
  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    return articles.filter((a) =>
      a.categoryNames?.includes(selectedCategoryId)
    );
  }, [articles, selectedCategoryId]);

  // Paginate filtered articles
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className='space-y-8'>
      <ArticleGrid articles={paginatedArticles} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
