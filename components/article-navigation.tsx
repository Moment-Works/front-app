/**
 * Article navigation component
 * Previous/next article links
 */

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import type { ArticleNavigation as ArticleNavigationType } from '@/types/article';

interface ArticleNavigationProps {
  navigation: ArticleNavigationType;
}

export function ArticleNavigation({ navigation }: ArticleNavigationProps) {
  const { previous, next } = navigation;

  // Don't render if no navigation available
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className='mt-12'>
      <Separator className='mb-8' />

      <div className='flex justify-between gap-4'>
        {previous ? (
          <Link
            href={`/blog/${previous.slug}`}
            className='flex-1 p-4 border rounded-lg hover:bg-accent transition-colors group'
          >
            <span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
              ← Previous Article
            </span>
            <p className='font-medium mt-1 line-clamp-2'>{previous.title}</p>
          </Link>
        ) : (
          <div className='flex-1' />
        )}

        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className='flex-1 p-4 border rounded-lg hover:bg-accent transition-colors text-right group'
          >
            <span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
              Next Article →
            </span>
            <p className='font-medium mt-1 line-clamp-2'>{next.title}</p>
          </Link>
        ) : (
          <div className='flex-1' />
        )}
      </div>
    </nav>
  );
}
