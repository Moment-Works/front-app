/**
 * Article grid component
 * Responsive grid layout for displaying multiple article cards
 */

import { ArticleCard } from './article-card';
import type { ArticleListItem } from '@/types/article';

interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground text-lg'>No articles found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
