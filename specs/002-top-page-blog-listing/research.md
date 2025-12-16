# Research: Top Page with Blog Listing and Navigation

**Feature**: Top Page Blog Listing  
**Date**: 2025-12-15  
**Status**: Phase 0 Complete

---

## Research Tasks

Based on Technical Context analysis, the following research was conducted:

1. **View More Pattern vs Pagination**: Best practices for incremental content loading
2. **URL State Management**: Query parameter handling with Next.js App Router
3. **Mobile Navigation Patterns**: Responsive menu implementation with Tailwind
4. **Component Adaptation Strategy**: Modifying existing pagination-based components for View More pattern

---

## 1. View More Pattern vs Pagination

### Decision

Implement "View More" button with incremental loading (6 posts per click) instead of traditional pagination.

### Rationale

- **User Experience**: Maintains scroll context, users don't lose their place
- **Mobile-Friendly**: Single action (click/tap) vs. pagination jumps
- **Performance**: Progressive loading reduces initial bundle size
- **Engagement**: Encourages content discovery through seamless browsing

### Implementation Approach

```typescript
// State management in client component
const [visibleCount, setVisibleCount] = useState(6);
const [isLoading, setIsLoading] = useState(false);

// View More handler
const handleViewMore = () => {
  setIsLoading(true);
  // Increment visible count by 6
  setVisibleCount(prev => prev + 6);
  setIsLoading(false);
};

// Slice articles based on visible count
const displayedArticles = filteredArticles.slice(0, visibleCount);
const hasMore = visibleCount < filteredArticles.length;
```

### Alternatives Considered

- **Infinite Scroll**: Rejected - less user control, accessibility concerns, browser back button issues
- **Traditional Pagination**: Rejected - spec explicitly requires "View More" pattern
- **Load All Upfront**: Rejected - poor performance for large article counts

### Key Considerations

- Reset visible count to 6 when category filter changes
- Disable button during loading state to prevent race conditions
- Show loading spinner on button while maintaining existing content visibility
- Hide button when all posts are displayed

---

## 2. URL State Management with Next.js App Router

### Decision

Use Next.js App Router's `useSearchParams` and `useRouter` for URL query parameter management.

### Rationale

- **Shareable Links**: Users can share filtered views (e.g., `/?category=technology`)
- **Browser Navigation**: Back/forward buttons work correctly with filter state
- **SEO-Friendly**: Search engines can crawl filtered content
- **App Router Native**: Built-in hooks optimized for App Router architecture

### Implementation Pattern

```typescript
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

// Read current category from URL
const searchParams = useSearchParams();
const categoryFromUrl = searchParams.get('category');

// Update URL when category changes
const router = useRouter();
const handleCategoryChange = (categoryId: string | null) => {
  const params = new URLSearchParams(searchParams);
  if (categoryId) {
    params.set('category', categoryId);
  } else {
    params.delete('category');
  }
  router.push(`/?${params.toString()}`, { scroll: false });
};

// Scroll to top on browser back/forward navigation
useEffect(() => {
  const articleGrid = document.getElementById('article-grid');
  if (articleGrid) {
    articleGrid.scrollIntoView({ behavior: 'smooth' });
  }
}, [categoryFromUrl]);
```

### Best Practices

- Use `{ scroll: false }` to prevent automatic scroll to top during filter changes
- Implement manual scroll behavior for browser back/forward navigation
- Initialize state from URL on component mount
- Clear URL parameter when "All Articles" is selected

### Alternatives Considered

- **Client-Side Only State**: Rejected - no shareable links, poor UX
- **Server-Side Filtering**: Rejected - requires full page reload, poor interactivity
- **Hash-Based Routing**: Rejected - not SEO-friendly, not App Router convention

---

## 3. Mobile Navigation Pattern

### Decision

Implement collapsible mobile menu using shadcn/ui Sheet component with lucide-react icons.

### Rationale

- **Consistency**: shadcn/ui aligns with project UI standards (Constitution IV)
- **Accessibility**: Built-in ARIA attributes, keyboard navigation, focus management
- **Responsive**: Automatic mobile/desktop breakpoint handling
- **Animation**: Smooth transitions built-in

### Implementation Strategy

```typescript
// Use shadcn/ui Sheet for mobile menu
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

// Breakpoint: 1024px (lg:)
// Mobile/Tablet (< 1024px): Show collapsible menu
// Desktop (≥ 1024px): Show horizontal navigation links

<header className="border-b">
  {/* Mobile Menu (< 1024px) */}
  <div className="lg:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </SheetContent>
    </Sheet>
  </div>

  {/* Desktop Navigation (≥ 1024px) */}
  <nav className="hidden lg:flex gap-6">
    <Link href="/">Home</Link>
    <Link href="/blog">Blog</Link>
    <Link href="/about">About</Link>
    <Link href="/contact">Contact</Link>
  </nav>
</header>
```

### Key Features

- **Auto-Close on Navigation**: Sheet closes when user clicks a link
- **State Management**: Sheet component manages open/close state internally
- **Smooth Transitions**: CSS animations via shadcn/ui
- **Touch-Friendly**: Large tap targets (recommended 44x44px minimum)

### Alternatives Considered

- **Custom Drawer**: Rejected - reinventing the wheel, accessibility concerns
- **Hamburger Menu with Custom Overlay**: Rejected - more code, less maintainable
- **Bottom Navigation Bar**: Rejected - not in spec, different UX pattern

---

## 4. Component Adaptation Strategy

### Decision

Adapt existing [`BlogListingClient`](../../components/blog-listing-client.tsx) component for "View More" pattern while maintaining type safety.

### Current Implementation Analysis

```typescript
// Existing component uses:
// - Pagination state (currentPage)
// - Filter state (selectedCategoryId)
// - Pagination component with page numbers
// - 10 items per page

// Needs adaptation to:
// - View More state (visibleCount)
// - Filter state (preserve existing)
// - View More button (replace Pagination)
// - 6 items per initial load/increment
```

### Adaptation Approach

**Option 1: Create New Component** (RECOMMENDED)

- Create `TopPageListingClient` component
- Copy logic from `BlogListingClient`
- Replace pagination with View More pattern
- Maintain type safety and reuse ArticleGrid, CategoryFilter

**Rationale**:

- Preserves existing `/blog` page functionality
- Clear separation of concerns
- No risk of breaking existing features
- Easier to maintain and test

**Option 2: Add Props to Existing Component**

```typescript
interface BlogListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilter[];
  mode?: 'pagination' | 'viewMore'; // New prop
  itemsPerLoad?: number; // New prop
}
```

**Rationale**: Single component, less code duplication

**Rejected Because**:

- Increases complexity
- Risk of breaking existing `/blog` page
- Harder to test and maintain
- Violates YAGNI principle (different use cases)

### Reusable Components

- ✅ [`ArticleGrid`](../../components/article-grid.tsx) - No changes needed
- ✅ [`ArticleCard`](../../components/article-card.tsx) - No changes needed  
- ✅ [`CategoryFilter`](../../components/category-filter.tsx) - No changes needed
- ❌ [`Pagination`](../../components/pagination.tsx) - Not used (replaced by View More button)

---

## 5. Error Handling & Loading States

### Decision

Implement comprehensive error and loading states using Next.js error boundaries and client-side state management.

### Error Handling Pattern

```typescript
// API Error Handling
try {
  const articles = await fetchAllArticles();
} catch (error) {
  // Log error for debugging
  console.error('Failed to fetch articles:', error);
  // Show user-friendly message
  return <ErrorState message="Unable to load articles" onRetry={refetch} />;
}

// Empty State Handling
if (filteredArticles.length === 0) {
  return <EmptyState message="No posts in this category yet. Check back soon!" />;
}
```

### Loading State Pattern

```typescript
// View More Button Loading
<Button 
  onClick={handleLoadMore}
  disabled={isLoading || !hasMore}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    'View More'
  )}
</Button>

// Category Filter Loading
<Button
  onClick={handleCategoryChange}
  disabled={isLoadingCategory}
>
  {isLoadingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {category.name} ({category.count})
</Button>
```

### Best Practices

- Show spinner on button, maintain existing content visibility
- Disable all interactive elements during loading
- Provide clear error messages with retry actions
- Log errors for debugging purposes
- Use optimistic UI updates where appropriate

---

## 6. SEO & Metadata Strategy

### Decision

Use Next.js App Router Metadata API for comprehensive SEO optimization.

### Implementation

```typescript
// app/page.tsx (Server Component)
import type { Metadata } from 'next';

export const meta Metadata = {
  title: 'Moment Works - Latest Articles',
  description: 'Explore our latest blog articles covering technology, design, and development insights',
  openGraph: {
    title: 'Moment Works - Latest Articles',
    description: 'Explore our latest blog articles covering technology, design, and development insights',
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
    description: 'Explore our latest blog articles covering technology, design, and development insights',
    images: ['/og-image.png'],
  },
};
```

### Dynamic Metadata for Filtered Views

```typescript
// Generate metadata based on category filter
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const category = searchParams.category;
  
  if (category) {
    return {
      title: `${category} Articles - Moment Works`,
      description: `Browse articles about ${category}`,
    };
  }
  
  return {
    title: 'Moment Works - Latest Articles',
    description: 'Explore our latest blog articles',
  };
}
```

### Best Practices

- Include canonical URL to avoid duplicate content
- Update metadata when category filter is active
- Use descriptive titles and descriptions (150-160 chars)
- Include Open Graph and Twitter Card tags
- Optimize images for social sharing (1200x630px)

---

## Technology Choices Summary

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| Next.js App Router | Page routing & SSR | Required by constitution, optimal for SEO |
| TypeScript Strict | Type safety | Required by constitution, prevents runtime errors |
| Tailwind CSS | Styling | Required by constitution, utility-first approach |
| shadcn/ui Sheet | Mobile menu | Required by constitution, accessible & animated |
| lucide-react | Icons | Already in project, consistent icon set |
| useSearchParams | URL state | App Router native, shareable links |
| useState | View More state | Simple client-side state, no complex needs |
| microcms-js-sdk | Content API | Already integrated, existing data pipeline |

---

## Performance Considerations

### Optimization Strategies

1. **Server Components**: Fetch data server-side, pass to client components
2. **Code Splitting**: Mobile menu as separate chunk (dynamic import if needed)
3. **Image Optimization**: Use `next/image` for all eye-catch images
4. **Lazy Loading**: Images below fold use `loading="lazy"`
5. **Bundle Size**: View More button inline (small), Sheet component on-demand

### Expected Performance

- **Initial Load**: ~150KB JS (Server Component + Client hydration)
- **LCP**: <2s (Server-rendered content, optimized images)
- **FID**: <100ms (Minimal client-side JS for interactivity)
- **CLS**: <0.1 (Fixed image dimensions, no layout shift)

### Monitoring Points

- Lighthouse CI on PR
- Bundle analyzer for JS size
- Core Web Vitals in production
- API response times (microCMS)

---

## Open Questions Resolved

All open questions from the spec have been addressed through this research:

1. ✅ **View More Pattern**: Incremental loading, 6 posts per click
2. ✅ **URL State Management**: useSearchParams with query parameters
3. ✅ **Mobile Navigation**: shadcn/ui Sheet component at 1024px breakpoint
4. ✅ **Component Reusability**: Create new TopPageListingClient, reuse existing components
5. ✅ **Error Handling**: Comprehensive error states with retry actions
6. ✅ **Loading States**: Spinners on buttons, disable during operations
7. ✅ **SEO Metadata**: Next.js Metadata API with dynamic updates
8. ✅ **Performance**: Server Components, image optimization, code splitting

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**

- Generate data-model.md (entity definitions)
- Generate contracts/ (component API contracts)
- Generate quickstart.md (implementation guide)
- Update agent context with new technologies
