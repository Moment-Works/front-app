/**
 * Blog article detail page (Server Component)
 * Displays full article content with TOC and navigation
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAllArticles, fetchArticleBySlug } from '@/lib/microcms';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/table-of-contents';
import { ArticleNavigation } from '@/components/article-navigation';
import type { Metadata } from 'next';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all articles
export async function generateStaticParams() {
  const articles = await fetchAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await fetchArticleBySlug(slug);

    // Extract plain text from content for description
    const description = article.content
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 160);

    return {
      title: article.title,
      description,
      openGraph: {
        title: article.title,
        description,
        type: 'article',
        publishedTime: article.publishedAt,
        images: article.eyecatch ? [article.eyecatch.url] : [],
      },
    };
  } catch {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await fetchArticleBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Article Header */}
      <header className='mb-8 max-w-4xl'>
        {article.eyecatch && (
          <div className='relative aspect-video mb-6 rounded-lg overflow-hidden'>
            <Image
              src={article.eyecatch.url}
              alt={article.title}
              fill
              priority
              className='object-cover'
              sizes='(max-width: 1200px) 100vw, 1200px'
            />
          </div>
        )}

        <h1 className='text-4xl md:text-5xl font-bold mb-4'>{article.title}</h1>

        <div className='flex items-center gap-4 text-muted-foreground'>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>

          {article.categoryName && (
            <Badge variant='secondary'>{article.categoryName}</Badge>
          )}
        </div>
      </header>

      {/* Article Content with TOC */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8'>
        <div
          className='prose prose-lg prose-slate dark:prose-invert max-w-none'
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <TableOfContents toc={article.tableOfContents} />
      </div>

      {/* Article Navigation */}
      <ArticleNavigation navigation={article.navigation} />

      {/* Back to Blog Link */}
      <div className='mt-8 text-center'>
        <Link
          href='/blog'
          className='text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          ← Back to all articles
        </Link>
      </div>
    </article>
  );
}
