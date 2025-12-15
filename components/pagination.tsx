/**
 * Pagination component
 * Controls for navigating between pages of articles
 */

'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Don't render pagination if only one page
  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center items-center gap-2 flex-wrap'>
      <Button
        variant='outline'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className='min-w-[2.5rem]'
        >
          {page}
        </Button>
      ))}

      <Button
        variant='outline'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
