# Data Model Design

**Feature**: Blog Article Listing and Detail Pages  
**Branch**: `001-blog-article-listing`  
**Date**: 2025-12-06

## Overview

This document defines the data structures, TypeScript interfaces, and data flow for the blog listing feature using microCMS as the content source.

---

## 1. Core Domain Entities

### 1.1 Blog Article

Represents a blog post fetched from microCMS with richEditorV2 content.

```typescript
// types/microcms.ts

/**
 * Blog article from microCMS API
 * Based on schema: schema/api-blogs-20251206155310.json
 */
export interface MicroCMSBlog {
  id: string;
  title: string;
  content: string; // HTML from richEditorV2
  eyecatch?: MicroCMSImage;
  category?: MicroCMSCategory;
  publishedAt?: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

/**
 * Image object from microCMS media field
 */
export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

/**
 * Category reference from microCMS relation field
 */
export interface MicroCMSCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * microCMS API list response wrapper
 */
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
```

### 1.2 Table of Contents

Derived structure extracted from article HTML content.

```typescript
// types/toc.ts

/**
 * Individual heading entry in table of contents
 */
export interface TocHeading {
  id: string;        // Anchor ID (slugified heading text)
  text: string;      // Heading text content
  level: 1 | 2 | 3;  // Heading level (h1, h2, h3)
}

/**
 * Complete table of contents for an article
 */
export interface TableOfContents {
  headings: TocHeading[];
}
```

### 1.3 Article Navigation

Context for previous/next article links.

```typescript
// types/navigation.ts

/**
 * Adjacent article information for navigation
 */
export interface AdjacentArticle {
  slug: string;
  title: string;
}

/**
 * Navigation context for article detail page
 */
export interface ArticleNavigation {
  previous: AdjacentArticle | null;
  next: AdjacentArticle | null;
}
```

---

## 2. Application-Level Types

### 2.1 Article List Item

Optimized structure for article listing display.

```typescript
// types/article.ts

/**
 * Article card data for listing page
 */
export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string; // Optional: first 150 chars of content
  eyecatchUrl?: string;
  categoryName?: string;
  publishedAt: string; // ISO 8601
}

/**
 * Full article data for detail page
 */
export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  content: string; // Processed HTML with anchor IDs
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
```

### 2.2 Pagination State

Client-side pagination state management.

```typescript
// types/pagination.ts

/**
 * Pagination configuration and state
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

/**
 * Paginated data wrapper
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationState;
}
```

### 2.3 Filter State

Category filtering state.

```typescript
// types/filters.ts

/**
 * Available category filter option
 */
export interface CategoryFilter {
  id: string;
  name: string;
  count: number; // Number of articles in category
}

/**
 * Current filter state
 */
export interface FilterState {
  selectedCategoryId: string | null;
}
```

---

## 3. Data Transformations

### 3.1 microCMS to Application Types

```typescript
// lib/transforms.ts

/**
 * Transform microCMS blog to article list item
 */
export function transformToListItem(blog: MicroCMSBlog): ArticleListItem {
  return {
    id: blog.id,
    slug: blog.id, // Use ID as slug, or extract from custom field if available
    title: blog.title,
    excerpt: extractExcerpt(blog.content, 150),
    eyecatchUrl: blog.eyecatch?.url,
    categoryName: blog.category?.name,
    publishedAt: blog.publishedAt || blog.createdAt,
  };
}

/**
 * Transform microCMS blog to article detail
 */
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

/**
 * Extract plain text excerpt from HTML content
 */
function extractExcerpt(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}
```

### 3.2 HTML Processing

```typescript
// lib/html-processing.ts

import { parse } from 'node-html-parser';
import type { TocHeading, TableOfContents } from '@/types/toc';

/**
 * Inject anchor IDs into heading elements
 */
export function injectHeadingAnchors(html: string): string {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');

  headings.forEach((heading) => {
    const id = slugify(heading.text);
    heading.setAttribute('id', id);
  });

  return root.toString();
}

/**
 * Extract table of contents from HTML
 */
export function extractTableOfContents(html: string): TableOfContents {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');

  const tocHeadings: TocHeading[] = headings.map((heading) => ({
    id: heading.getAttribute('id') || slugify(heading.text),
    text: heading.text,
    level: parseInt(heading.tagName[1]) as 1 | 2 | 3,
  }));

  return { headings: tocHeadings };
}

/**
 * Convert text to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}
```

---

## 4. Data Flow Architecture

### 4.1 Build-Time Data Flow

```
┌─────────────────┐
│  microCMS API   │
└────────┬────────┘
         │ Build time fetch
         ↓
┌─────────────────┐
│  API Client     │ lib/microcms.ts
│  (SDK)          │
└────────┬────────┘
         │ Raw MicroCMSBlog[]
         ↓
┌─────────────────┐
│  Transformers   │ lib/transforms.ts
│  & Processors   │
└────────┬────────┘
         │ ArticleListItem[] / ArticleDetail
         ↓
┌─────────────────┐
│  Static Pages   │ 
│  (HTML + JSON)  │
└─────────────────┘
```

### 4.2 Runtime Data Flow (Client-Side)

```
┌─────────────────┐
│  Static Props   │ Pre-rendered in HTML
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  React State    │ useState for pagination/filters
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Filtered &     │ useMemo for performance
│  Paginated Data │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  UI Components  │ Card, Badge, Button, etc.
└─────────────────┘
```

---

## 5. State Management

### 5.1 Server State (Build-Time)

All data fetched at build time and embedded in static pages.

```typescript
// app/blog/page.tsx (Server Component)

export default async function BlogListingPage() {
  const articles = await fetchAllArticles(); // Build-time only
  const categories = await fetchAllCategories();
  
  return (
    <BlogListingClient 
      articles={articles}
      categories={categories}
    />
  );
}
```

### 5.2 Client State (Runtime)

Minimal client state for interactions.

```typescript
// components/blog-listing-client.tsx

'use client';

export function BlogListingClient({ 
  articles, 
  categories 
}: BlogListingClientProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Derived state (memoized)
  const filteredArticles = useMemo(() => {
    return selectedCategory
      ? articles.filter(a => a.categoryName === selectedCategory)
      : articles;
  }, [articles, selectedCategory]);
  
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);
  
  // ... render logic
}
```

---

## 6. Data Validation

### 6.1 Runtime Type Guards

```typescript
// lib/validation.ts

/**
 * Validate microCMS blog response
 */
export function isMicroCMSBlog( unknown): data is MicroCMSBlog {
  if (typeof data !== 'object' || data === null) return false;
  
  const blog = data as Partial<MicroCMSBlog>;
  
  return (
    typeof blog.id === 'string' &&
    typeof blog.title === 'string' &&
    typeof blog.content === 'string' &&
    typeof blog.createdAt === 'string'
  );
}

/**
 * Validate article has required fields for display
 */
export function isValidArticle(article: ArticleListItem): boolean {
  return (
    article.id.length > 0 &&
    article.title.length > 0 &&
    article.publishedAt.length > 0
  );
}
```

### 6.2 Build-Time Validation

```typescript
// lib/microcms.ts

/**
 * Fetch and validate all articles
 */
export async function fetchAllArticles(): Promise<ArticleListItem[]> {
  const response = await client.getList<MicroCMSBlog>({
    endpoint: 'blogs',
    queries: {
      limit: 1000, // Fetch all articles
      orders: '-publishedAt', // Newest first
    },
  });

  // Filter out invalid articles
  const validBlogs = response.contents.filter(isMicroCMSBlog);
  
  if (validBlogs.length !== response.contents.length) {
    console.warn(`Filtered out ${response.contents.length - validBlogs.length} invalid articles`);
  }

  return validBlogs.map(transformToListItem).filter(isValidArticle);
}
```

---

## 7. Error Handling Data Structures

```typescript
// types/errors.ts

/**
 * Build-time fetch error
 */
export interface BuildError {
  type: 'build_fetch_error';
  endpoint: string;
  message: string;
  timestamp: string;
}

/**
 * Content processing error
 */
export interface ProcessingError {
  type: 'processing_error';
  articleId: string;
  step: 'transform' | 'html_parse' | 'toc_generation';
  message: string;
}

/**
 * Error boundary state
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}
```

---

## 8. Performance Considerations

### 8.1 Data Size Optimization

```typescript
// Optimize image data
export interface OptimizedImageData {
  url: string;
  width: number;
  height: number;
  blurDataURL?: string; // For placeholder blur effect
}

// Only include necessary fields in list items
export interface MinimalArticleListItem {
  id: string;
  slug: string;
  title: string;
  eyecatchUrl?: string;
  categoryName?: string;
  publishedAt: string;
  // NO content field - saves significant data transfer
}
```

### 8.2 Memoization Strategies

```typescript
// Cache table of contents generation
const tocCache = new Map<string, TableOfContents>();

export function extractTableOfContentsWithCache(
  articleId: string,
  html: string
): TableOfContents {
  if (tocCache.has(articleId)) {
    return tocCache.get(articleId)!;
  }
  
  const toc = extractTableOfContents(html);
  tocCache.set(articleId, toc);
  return toc;
}
```

---

## 9. Data Migration & Versioning

### 9.1 Schema Version Tracking

```typescript
// types/schema-version.ts

export const SCHEMA_VERSION = '1.0.0';

export interface SchemaMetadata {
  version: string;
  migrationsApplied: string[];
  lastUpdated: string;
}
```

### 9.2 Future Compatibility

Prepare for potential schema changes:

```typescript
// Future: Adding slug field to microCMS
export interface MicroCMSBlogV2 extends MicroCMSBlog {
  slug?: string; // Optional custom slug field
