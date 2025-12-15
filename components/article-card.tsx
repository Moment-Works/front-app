/**
 * Article card component for listing page
 * Displays individual article with thumbnail, title, date, and category
 */

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { ArticleListItem } from '@/types/article';

interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col'>
      <Link href={`/blog/${article.slug}`} className='flex flex-col h-full'>
        {article.eyecatchUrl && (
          <div className='relative aspect-video'>
            <Image
              src={article.eyecatchUrl}
              alt={article.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        )}

        <CardContent className='p-6 flex-1 flex flex-col'>
          <CardHeader className='p-0 mb-4'>
            <CardTitle className='line-clamp-2 text-xl'>
              {article.title}
            </CardTitle>
            <CardDescription>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </CardDescription>
          </CardHeader>

          {article.excerpt && (
            <p className='text-sm text-muted-foreground line-clamp-3 mb-4 flex-1'>
              {article.excerpt}
            </p>
          )}

          {article.categoryName && (
            <div className='mt-auto'>
              <Badge variant='secondary'>{article.categoryName}</Badge>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
