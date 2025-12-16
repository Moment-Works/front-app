/**
 * Category filter component
 * Allows users to filter articles by category
 */

'use client';

import { Button } from '@/components/ui/button';
import type { CategoryFilter } from '@/types/filters';

interface CategoryFilterProps {
  categories: CategoryFilter[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  disabled?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  disabled = false,
}: CategoryFilterProps) {
  // Don't render if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className='mb-8'>
      <h2 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider'>
        Filter by Category
      </h2>
      <div className='flex flex-wrap gap-2'>
        <Button
          variant={selectedCategoryId === null ? 'default' : 'outline'}
          onClick={() => onSelectCategory(null)}
          size='sm'
          disabled={disabled}
        >
          All Articles
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category.id)}
            size='sm'
            disabled={disabled}
          >
            {category.name}{' '}
            <span className='ml-1 text-xs'>({category.count})</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
