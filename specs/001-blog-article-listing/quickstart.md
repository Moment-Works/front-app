# Quick Start Guide

**Feature**: Blog Article Listing and Detail Pages  
**Branch**: `001-blog-article-listing`  
**Date**: 2025-12-06

## Overview

This guide walks you through implementing the blog listing and detail pages from scratch. Follow these steps in order for a smooth implementation.

---

## Prerequisites

- Node.js 18+ installed
- Next.js 16+ project initialized
- microCMS account with blog API set up
- Environment variables configured

---

## Step 1: Environment Setup (5 minutes)

### 1.1 Install Required Dependencies

```bash
# Already installed:
# - next@16.0.7
# - react@19.2.0
# - microcms-js-sdk@3.2.0
# - tailwindcss@4

# Install additional packages
npm install node-html-parser
npm install clsx tailwind-merge
npm install --save-dev @types/node-html-parser

# Install shadcn/ui
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Import alias: @/*

# Add required shadcn components
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add separator
```

### 1.2 Configure Environment Variables

Create `.env.local`:

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

Add to `.gitignore` if not already present:

```
.env*.local
```

---

## Step 2: Create Type Definitions (10 minutes)

### 2.1 Create `types/microcms.ts`

```typescript
// microCMS API response types
export interface MicroCMSBlog {
  id: string;
  title: string;
  content: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
```

### 2.2 Create `types/article.ts`

```typescript
export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  eyecatchUrl?: string;
  categoryName?: string;
  publishedAt: string;
}

export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  content: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  categoryName?: string;
  publishedAt: string;
  tableOfContents: TableOfContents;
  navigation: ArticleNavigation;
}

export interface TableOfContents {
  headings: TocHeading[];
}

export interface TocHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface ArticleNavigation {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export interface CategoryFilter {
  id: string;
  name: string;
  count: number;
}
```

---

## Step 3: Create API Client (15 minutes)

### 3.1 Create `lib/microcms.ts`

```typescript
import { createClient } from 'microcms-js-sdk';
import type { MicroCMSBlog, MicroCMSListResponse } from '@/types/microcms';
import type { ArticleListItem, ArticleDetail, CategoryFilter } from '@/types/article';
import { transformToListItem, transformToArticleDetail } from './transforms';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not defined');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is not defined');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function fetchAllArticles(): Promise<ArticleListItem[]> {
  const response = await client.getList<MicroCMSBlog>({
    endpoint: 'blogs',
    queries: {
      limit: 1000,
      orders: '-publishedAt',
    },
  });

  return response.contents.map(transformToListItem);
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const blog = await client.get<MicroCMSBlog>({
    endpoint: 'blogs',
    contentId: slug,
  });

  const allArticles = await fetchAllArticles();
  const currentIndex = allArticles.findIndex(a => a.slug === slug);
  
  const navigation = {
    previous: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
    next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null,
  };

  return transformToArticleDetail(blog, navigation);
}

export async function fetchCategoryFilters(): Promise<CategoryFilter[]> {
  const articles = await fetchAllArticles();
  const categoryMap = new Map<string, { name: string; count: number }>();

  articles.forEach(article => {
    if (article.categoryName) {
      const existing = categoryMap.get(article.categoryName);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(article.categoryName, { name: article.categoryName, count: 1 });
      }
    }
  });

  return Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count,
  }));
}
```

---

## Step 4: Create Utility Functions (15 minutes)

### 4.1 Create `lib/html-processing.ts`

```typescript
import { parse } from 'node-html-parser';
import type { TableOfContents, TocHeading } from '@/types/article';

export function injectHeadingAnchors(html: string): string {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');

  headings.forEach(heading => {
    const id = slugify(heading.text);
    heading.setAttribute('id', id);
  });

  return root.toString();
}

export function extractTableOfContents(html: string): TableOfContents {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');

  const tocHeadings: TocHeading[] = headings.map(heading => ({
    id: heading.getAttribute('id') || slugify(heading.text),
    text: heading.text,
    level: parseInt(heading.tagName[1]) as 1 | 2 | 3,
  }));

  return { headings: tocHeadings };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### 4.2 Create `lib/transforms.ts`

```typescript
import type { MicroCMSBlog } from '@/types/microcms';
import type { ArticleListItem, ArticleDetail, ArticleNavigation } from '@/types/article';
import { injectHeadingAnchors, extractTableOfContents } from './html-processing';

export function transformToListItem(blog: MicroCMSBlog): ArticleListItem {
  return {
    id: blog.id,
    slug: blog.id,
    title: blog.title,
    excerpt: extractExcerpt(blog.content, 150),
    eyecatchUrl: blog.eyecatch?.url,
    categoryName: blog.category?.name,
    publishedAt: blog.publishedAt || blog.createdAt,
  };
}

export function transformToArticleDetail(
  blog: MicroCMSBlog,
  navigation: ArticleNavigation
): ArticleDetail {
  const processedContent = injectHeadingAnchors(blog.content);
  const toc = extractTableOfContents(processedContent);

  return {
    id: blog.id,
    slug: blog.id,
    title: blog.title,
    content: processedContent,
    eyecatch: blog.eyecatch,
    categoryName: blog.category?.name,
    publishedAt: blog.publishedAt || blog.createdAt,
    tableOfContents: toc,
    navigation,
  };
}

function extractExcerpt(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
```

### 4.3 Create `lib/utils.ts` (for shadcn/ui)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

---

## Step 5: Create Page Routes (20 minutes)

### 5.1 Create `app/blog/page.tsx`

```typescript
import { fetchAllArticles, fetchCategoryFilters } from '@/lib/microcms';
import { BlogListingClient } from '@/components/blog-listing-client';

export const metadata = {
  title: 'Blog Articles',
  description: 'Browse our latest articles',
};

export default async function BlogListingPage() {
  const articles = await fetchAllArticles();
  const categories = await fetchCategoryFilters();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Articles</h1>
      <BlogListingClient articles={articles} categories={categories} />
    </main>
  );
}
```

### 5.2 Create `app/blog/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAllArticles, fetchArticleBySlug } from '@/lib/microcms';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/table-of-contents';
import { ArticleNavigation } from '@/components/article-navigation';

export async function generateStaticParams() {
  const articles = await fetchAllArticles();
  return articles.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const article = await fetchArticleBySlug(params.slug);
    return {
      title: article.title,
      description: article.content.substring(0, 160),
    };
  } catch {
    return { title: 'Article Not Found' };
  }
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let article;
  
  try {
    article = await fetchArticleBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="mb-8">
        {article.eyecatch && (
          <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
            <Image
              src={article.eyecatch.url}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          {article.categoryName && <Badge variant="secondary">{article.categoryName}</Badge>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        <TableOfContents toc={article.tableOfContents} />
      </div>

      <ArticleNavigation navigation={article.navigation} />
    </article>
  );
}
```

---

## Step 6: Create Components (30 minutes)

### 6.1 Create `components/blog-listing-client.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import type { ArticleListItem, CategoryFilter } from '@/types/article';
import { ArticleCard } from './article-card';
import { CategoryFilter as CategoryFilterComponent } from './category-filter';
import { Pagination } from './pagination';

const ITEMS_PER_PAGE = 10;

interface BlogListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilter[];
}

export function BlogListingClient({ articles, categories }: BlogListingClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    return articles.filter(a => a.categoryName === selectedCategoryId);
  }, [articles, selectedCategoryId]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <CategoryFilterComponent
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={id => {
          setSelectedCategoryId(id);
          setCurrentPage(1);
        }}
      />

      {paginatedArticles.length === 0 ? (
        <div className="text-center py-12">
