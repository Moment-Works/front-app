'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  loadedCount: number;
  totalCount: number;
}

export function ViewMoreButton({
  onClick,
  isLoading,
  hasMore,
  loadedCount,
  totalCount,
}: ViewMoreButtonProps) {
  // Hide button when no more articles
  if (!hasMore) return null;

  const remaining = totalCount - loadedCount;

  return (
    <div className='flex justify-center mt-8'>
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant='outline'
        size='lg'
        className='min-w-[200px]'
      >
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading...
          </>
        ) : (
          <>
            View More
            {remaining > 0 && (
              <span className='ml-2 text-muted-foreground'>
                ({remaining} remaining)
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
