# Quickstart: Top Page with Blog Listing and Navigation

**Feature**: Top Page Blog Listing  
**Date**: 2025-12-15  
**Status**: Phase 1 - Implementation Guide

---

## Overview

This quickstart guide provides step-by-step implementation instructions for the top page blog listing feature. Follow these steps sequentially to build the feature according to the specifications and design contracts.

---

## Prerequisites

- ✅ Next.js 16.0.7 with App Router
- ✅ TypeScript 5+ with strict mode
- ✅ Tailwind CSS 4
- ✅ shadcn/ui components installed
- ✅ Existing blog infrastructure at [`/blog`](../../../app/blog/page.tsx)
- ✅ microCMS API configured and working

---

## Implementation Steps

### Step 1: Create Navigation Types (5 min)

Create new type definition for navigation links.

**File**: `types/navigation.ts`

```typescript
import type { ReactNode } from 'react';

export interface NavigationLink {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: ReactNode;
}
```

**Validation**:

```bash
npx tsc --noEmit
```

---

### Step 2: Create Mobile Navigation Component (20 min)

Build responsive navigation with shadcn/ui Sheet component.

**File**: `components/mobile-navigation.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Menu, Home, BookOpen, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { NavigationLink } from '@/types/navigation';

const defaultLinks: NavigationLink[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Blog', href: '/blog', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'About', href: '/about', icon: <User className="h-5 w-5" /> },
  { label: 'Contact', href: '/contact', icon: <Mail className="h-5 w-5" /> },
];

interface MobileNavigationProps {
  links?: NavigationLink[];
}

export function MobileNavigation({ links = defaultLinks }: MobileNavigationProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="text-xl font-bold">
          Moment Works
        </Link>

        {/* Mobile Menu (< 1024px) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    {link.icon}
                    <span className="text-lg">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation (≥ 1024px) */}
        <nav className="hidden lg:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

**Validation**:

```bash
# Type check
npx tsc --noEmit

# Visual check (run dev server)
npm run dev
# Navigate to any page and test mobile menu at < 1024px width
```

---

### Step 3: Create View More Button Component (15 min)

Build button for incremental content loading.

**File**: `components/view-more-button.tsx`

```typescript
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
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="lg"
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            View More
            {remaining > 0 && (
              <span className="ml-2 text-muted-foreground">
                ({remaining} remaining)
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
```

**Validation**:

```bash
npx tsc --noEmit
```

---

### Step 4: Adapt Category Filter Component (10 min)

Add `disabled` prop to existing CategoryFilter for loading states.

**File**: `components/category-filter.tsx`

```typescript
// ADD disabled prop to interface
interface CategoryFilterProps {
  categories: CategoryFilter[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;  // NEW
}

export function CategoryFilter({
  categories,
  selectedId,
  onChange,
  disabled = false,  // NEW
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* All Articles button */}
      <Button
        variant={selectedId === null ? 'default' : 'outline'}
        onClick={() => onChange(null)}
        disabled={disabled}  // NEW
      >
        All Articles
      </Button>

      {/* Category buttons */}
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedId === category.id ? 'default' : 'outline'}
          onClick={() => onChange(category.id)}
          disabled={disabled}  // NEW
        >
          {category.name} ({category.count})
        </Button>
      ))}
    </div>
  );
}
```

**Validation**:

```bash
npx tsc --noEmit
```

---

### Step 5: Create Top Page Listing Client Component (45 min)

Main component orchestrating View More pattern and category filtering.

**File**: `components/top-page-listing-client.tsx`

```typescript
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArticleGrid } from './article-grid';
import { CategoryFilter } from './category-filter';
import { ViewMoreButton } from './view-more-button';
import type { ArticleListItem } from '@/types/article';
import type { CategoryFilter as CategoryFilterType } from '@/types/filters';

const ITEMS_PER_LOAD = 6;

interface TopPageListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilterType[];
}

export function TopPageListingClient({
  articles,
  categories,
}: TopPageListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize category from URL
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categoryFromUrl
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  // Filter articles by selected category
  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    return articles.filter((article) =>
      article.categoryNames?.includes(selectedCategoryId)
    );
  }, [articles, selectedCategoryId]);

  // Slice articles based on visible count
  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  // Check if more articles available
  const hasMore = visibleCount < filteredArticles.length;

  // Handle category filter change
  const handleCategoryChange = (categoryId: string | null) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
    
    // Update state
    setSelectedCategoryId(categoryId);
    setVisibleCount(ITEMS_PER_LOAD); // Reset to initial count
  };

  // Handle View More button click
  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate brief loading (remove in production if instant)
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
      setIsLoading(false);
    }, 100);
  };

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    const newCategory = searchParams.get('category');
    if (newCategory !== selectedCategoryId) {
      setSelectedCategoryId(newCategory);
      setVisibleCount(ITEMS_PER_LOAD);
      
      // Scroll to article grid
      const articleGrid = document.getElementById('article-grid');
      if (articleGrid) {
        articleGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams, selectedCategoryId]);

  // Empty state
  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          {selectedCategoryId
            ? 'No posts in this category yet. Check back soon!'
            : 'No blog posts available. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategoryId}
        onChange={handleCategoryChange}
        disabled={isLoading}
      />

      {/* Article Grid */}
      <div id="article-grid">
        <ArticleGrid articles={displayedArticles} />
      </div>

      {/* View More Button */}
      <ViewMoreButton
        onClick={handleLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        loadedCount={displayedArticles.length}
        totalCount={filteredArticles.length}
      />
    </div>
  );
}
```

**Validation**:

```bash
npx tsc --noEmit
```

---

### Step 6: Create Top Page (30 min)

Implement the root route with Server Component data fetching.

**File**: `app/page.tsx`

```typescript
/**
 * Top page (Server Component)
 * Main entry point with blog listing and navigation
 */

import { fetchAllArticles, fetchCategoryFilters } from '@/lib/microcms';
import { MobileNavigation } from '@/components/mobile-navigation';
import { TopPageListingClient } from '@/components/top-page-listing-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moment Works - Latest Articles',
  description:
    'Explore our latest blog articles covering technology, design, and development insights. Stay updated with our newest content.',
  openGraph: {
    title: 'Moment Works - Latest Articles',
    description:
      'Explore our latest blog articles covering technology, design, and development insights',
    type: 'website',
    url: 'https://momentworks.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Moment Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moment Works - Latest Articles',
    description:
      'Explore our latest blog articles covering technology, design, and development insights',
    images: ['/og-image.png'],
  },
};

export default async function HomePage() {
  // Fetch data server-side
  let articles, categories;
  
  try {
    [articles, categories] = await Promise.all([
      fetchAllArticles(),
      fetchCategoryFilters(),
    ]);
  } catch (error) {
    console.error('Failed to fetch ', error);
    return (
      <div className="min-h-screen flex flex-col">
        <MobileNavigation />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load articles</h1>
          <p className="text-muted-foreground mb-6">
            There was a problem loading the blog content. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <MobileNavigation />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Latest Articles
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our insights on technology, design, and development
          </p>
        </div>

        {/* Blog Listing */}
        <TopPageListingClient articles={articles} categories={categories} />
      </main>

      {/* Footer (Optional) */}
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Moment Works. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
```

**Validation**:

```bash
# Type check
npx tsc --noEmit

# Run development server
npm run dev

# Test scenarios:
# 1. Page loads with 6 articles
# 2. Click "View More" - loads 6 more
# 3. Click category - filters and resets to 6
# 4. Browser back button - restores previous state
# 5. Mobile menu works below 1024px
```

---

### Step 7: Add Sheet Component (if not already installed) (5 min)

Ensure shadcn/ui Sheet component is available.

```bash
# Check if Sheet exists
ls components/ui/sheet.tsx

# If not exists, install it
npx shadcn-ui@latest add sheet
```

**Verification**: Check that [`components/ui/sheet.tsx`](../../../components/ui/sheet.tsx) exists.

---

### Step 8: Create Placeholder Routes (10 min)

Create placeholder pages for About and Contact links.

**File**: `app/about/page.tsx`

```typescript
import { MobileNavigation } from '@/components/mobile-navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Moment Works',
  description: 'Learn more about Moment Works',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p className="text-lg text-muted-foreground">
          This page is coming soon.
        </p>
      </main>
    </div>
  );
}
```

**File**: `app/contact/page.tsx`

```typescript
import { MobileNavigation } from '@/components/mobile-navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Moment Works',
  description: 'Get in touch with Moment Works',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-lg text-muted-foreground">
          This page is coming soon.
        </p>
      </main>
    </div>
  );
}
```

**Validation**:

```bash
# Visit pages
# http://localhost:3000/about
# http://localhost:3000/contact
```

---

## Testing Checklist

### Functional Testing

- [ ] **Initial Load**
  - Page loads with 6 articles
  - Articles sorted by publish date (newest first)
  - Category filters visible with counts
  - "View More" button visible if >6 articles
  - Mobile menu visible below 1024px

- [ ] **View More Pattern**
  - Click "View More" loads 6 more articles
  - Button shows loading spinner while loading
  - Button disabled during loading
  - Button hidden when all articles displayed
  - Existing articles remain visible during load

- [ ] **Category Filtering**
  - Click category filters articles correctly
  - Selected category visually highlighted
  - URL updates with `?category=<id>` parameter
  - Filter resets visible count to 6
  - "All Articles" removes filter and resets
  - Category buttons disabled during load
  - Empty state shown when category has no posts

- [ ] **Browser Navigation**
  - Back button restores previous filter state
  - Forward button works correctly
  - URL changes trigger filter update
  - Page scrolls to article grid on navigation

- [ ] **Mobile Navigation**
  - Menu button visible below 1024px
  - Menu opens on button click
  - Menu closes on link click
  - Menu closes on Escape key
  - Menu closes on outside click
  - Links navigate correctly

- [ ] **Desktop Navigation**
  - Menu button hidden at 1024px and above
  - Navigation links visible horizontally
  - Hover states work correctly

- [ ] **Responsive Design**
  - Mobile (< 768px): Single column, mobile menu
  - Tablet (768px - 1024px): Two columns, mobile menu
  - Desktop (≥ 1024px): Three columns, horizontal nav

### Performance Testing

```bash
# Run Lighthouse audit
npm run build
npm run start
# Open DevTools > Lighthouse > Run audit

# Check bundle size
npm run build
# Review .next/static/chunks output
```

**Performance Targets**:

- [ ] Lighthouse Performance Score ≥ 90
- [ ] First Contentful Paint (FCP) ≤ 1.8s
- [ ] Largest Contentful Paint (LCP) ≤ 2.5s
- [ ] Cumulative Layout Shift (CLS) ≤ 0.1
- [ ] First Input Delay (FID) ≤ 100ms
- [ ] Initial JS bundle ≤ 200KB

### Accessibility Testing

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces loading states
- [ ] Focus indicators visible and clear
- [ ] ARIA labels present and correct
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Mobile menu properly announced

### Cross-Browser Testing

Test in:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Troubleshooting

### Issue: View More button doesn't load articles

**Solution**: Check that `visibleCount` state is incrementing:

```typescript
console.log('Visible count:', visibleCount);
console.log('Filtered articles:', filteredArticles.length);
```

### Issue: Category filter doesn't update URL

**Solution**: Verify `useRouter` and `useSearchParams` imports:

```typescript
import { useRouter, useSearchParams } from 'next/navigation';
// NOT from 'next/router' (Pages Router)
```

### Issue: Mobile menu doesn't open

**Solution**: Check Sheet component is installed:

```bash
npx shadcn-ui@latest add sheet
```

### Issue: Articles not filtering by category

**Solution**: Verify category IDs match between articles and filters:

```typescript
console.log('Selected:', selectedCategoryId);
console.log('Article categories:', article.categoryNames);
```

### Issue: Browser back button doesn't work

**Solution**: Ensure `useEffect` dependency includes `searchParams`:

```typescript
useEffect(() => {
  // sync logic
}, [searchParams]); // Must include searchParams
```

---

## Performance Optimization

### Image Optimization

Ensure all eye-catch images use `next/image`:

```typescript
// In ArticleCard component
import Image from 'next/image';

{article.eyeCatch && (
  <Image
    src={article.eyeCatch.url}
    alt={article.title}
    width={article.eyeCatch.width || 800}
    height={article.eyeCatch.height || 600}
    className="object-cover"
    loading="lazy"
  />
)}
```

### Code Splitting

Mobile menu is automatically code-split as a Client Component. No additional optimization needed.

### Caching Strategy

```typescript
// In lib/microcms.ts - Next.js automatically caches fetch
export async function fetchAllArticles() {
  // Default caching: 'force-cache'
  // Revalidate every 60 seconds in production
  const response = await client.getList<MicroCMSBlog>({
    endpoint: 'blogs',
    queries: { limit: 100, offset: 0, orders: '-publishedAt' },
  });
  
  return response.contents.map(transformToListItem);
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] All tests passing
- [ ] Lighthouse audit meets targets (≥90 performance)
- [ ] SEO metadata configured correctly
- [ ] Open Graph image exists at `/public/og-image.png`
- [ ] Environment variables set in production:
  - `MICROCMS_SERVICE_DOMAIN`
  - `MICROCMS_API_KEY`
- [ ] Placeholder pages (About, Contact) reviewed
- [ ] Mobile responsive design verified on real devices
- [ ] Cross-browser testing completed
- [ ] Accessibility audit passed

---

## Next Steps

After implementation:

1. **Run `/speckit.tasks` command** to generate tasks.md with implementation tasks
2. **Create feature branch**: `git checkout -b 002-top-page-blog-listing`
3. **Implement components** following this quickstart guide
4. **Write tests** for each component
5. **Run performance audit** and optimize if needed
6. **Create pull request** with constitution compliance check
7. **Deploy to staging** for review
8. **Deploy to production** after approval

---

## Support & Resources

- **Spec Document**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Component Contracts**: [contracts/component-api.md](./contracts/component-api.md)
- **Implementation Plan**: [plan.md](./plan.md)

For questions or issues, refer to the research and contract documents for detailed design decisions and rationale.
