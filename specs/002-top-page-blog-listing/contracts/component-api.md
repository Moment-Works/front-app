# Component API Contracts

**Feature**: Top Page Blog Listing  
**Date**: 2025-12-15  
**Status**: Phase 1 - Design

---

## Overview

This document defines the API contracts for all components involved in the top page blog listing feature. Each contract specifies props, events, state, and behavior to ensure consistent implementation and testing.

---

## 1. TopPageListingClient (New Component)

**File**: `components/top-page-listing-client.tsx`  
**Type**: Client Component ('use client')  
**Purpose**: Manage View More loading and category filtering for top page

### Props Interface

```typescript
interface TopPageListingClientProps {
  articles: ArticleListItem[];      // All articles from server
  categories: CategoryFilter[];     // All categories with counts
}
```

### State Management

```typescript
interface ComponentState {
  selectedCategoryId: string | null;  // Current filter, synced with URL
  visibleCount: number;               // Number of articles to display
  isLoading: boolean;                 // Loading state for View More
}
```

### Public Methods

```typescript
// Initialize from URL query parameter
function initializeFromUrl(): void;

// Handle category filter change
function handleCategoryChange(categoryId: string | null): void;

// Handle View More button click
function handleLoadMore(): void;

// Scroll to article grid (for browser navigation)
function scrollToGrid(): void;
```

### Computed Values

```typescript
// Articles filtered by selected category
const filteredArticles: ArticleListItem[] = useMemo(() => {
  if (!selectedCategoryId) return articles;
  return articles.filter(a => a.categoryNames?.includes(selectedCategoryId));
}, [articles, selectedCategoryId]);

// Articles to display based on visible count
const displayedArticles: ArticleListItem[] = useMemo(() => {
  return filteredArticles.slice(0, visibleCount);
}, [filteredArticles, visibleCount]);

// Whether more articles are available
const hasMore: boolean = visibleCount < filteredArticles.length;
```

### Behavior Specification

**Initial Load**:

1. Read `category` query parameter from URL
2. Set `selectedCategoryId` from URL or null
3. Set `visibleCount` to 6
4. Render initial 6 articles (filtered if category present)

**Category Filter Change**:

1. Update `selectedCategoryId` state
2. Update URL query parameter (`?category={id}` or remove if null)
3. Reset `visibleCount` to 6
4. Disable all category buttons during state update
5. Re-render with filtered articles

**View More Click**:

1. Set `isLoading` to true
2. Disable View More button
3. Increment `visibleCount` by 6
4. Set `isLoading` to false
5. Re-render with additional articles

**Browser Navigation (Back/Forward)**:

1. Detect URL change via `useSearchParams`
2. Update `selectedCategoryId` from new URL
3. Reset `visibleCount` to 6
4. Scroll to article grid smoothly
5. Re-render with new filter

### Event Handlers

```typescript
// Category button click
onCategoryChange: (categoryId: string | null) => void;

// View More button click
onLoadMore: () => void;

// URL change (browser navigation)
onUrlChange: (newCategory: string | null) => void;
```

### Accessibility

- All interactive elements keyboard accessible
- Category buttons have proper ARIA labels
- Loading states announced to screen readers
- View More button disabled state properly communicated

### Testing Requirements

```typescript
// Unit Tests
describe('TopPageListingClient', () => {
  it('renders initial 6 articles');
  it('filters articles by category');
  it('loads 6 more articles on View More click');
  it('resets to 6 articles when category changes');
  it('updates URL when category selected');
  it('reads category from URL on mount');
  it('disables buttons during loading');
  it('hides View More when all articles displayed');
  it('shows empty state when no articles in category');
});
```

---

## 2. MobileNavigation (New Component)

**File**: `components/mobile-navigation.tsx`  
**Type**: Client Component ('use client')  
**Purpose**: Responsive navigation menu for mobile/tablet/desktop

### Props Interface

```typescript
interface MobileNavigationProps {
  links: NavigationLink[];  // Navigation links to display
}

interface NavigationLink {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
}
```

### Default Props

```typescript
const defaultLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

### State Management

```typescript
// No explicit state - Sheet component manages internally
// Open/close controlled by Sheet component
```

### Responsive Behavior

```typescript
// Mobile/Tablet (< 1024px)
<div className="lg:hidden">
  <Sheet>
    <SheetTrigger>Menu Icon</SheetTrigger>
    <SheetContent>Navigation Links</SheetContent>
  </Sheet>
</div>

// Desktop (≥ 1024px)
<nav className="hidden lg:flex">
  <Link>Navigation Links</Link>
</nav>
```

### Behavior Specification

**Mobile Menu (< 1024px)**:

1. Show hamburger menu icon
2. Click opens side sheet from left
3. Display links vertically with icons
4. Click link navigates and closes sheet
5. Click overlay closes sheet
6. Press Escape closes sheet

**Desktop Navigation (≥ 1024px)**:

1. Hide hamburger menu icon
2. Display links horizontally in header
3. Apply hover states to links
4. Maintain visual hierarchy

### Accessibility

- Menu button labeled "Open navigation menu"
- Sheet has proper ARIA attributes
- Links have clear focus indicators
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announces menu state changes

### Testing Requirements

```typescript
describe('MobileNavigation', () => {
  describe('Mobile View', () => {
    it('shows menu trigger button');
    it('opens sheet on trigger click');
    it('closes sheet on link click');
    it('closes sheet on Escape key');
  });
  
  describe('Desktop View', () => {
    it('hides menu trigger button');
    it('shows navigation links');
    it('applies hover states');
  });
});
```

---

## 3. ViewMoreButton (New Component)

**File**: `components/view-more-button.tsx`  
**Type**: Client Component  
**Purpose**: Load additional articles incrementally

### Props Interface

```typescript
interface ViewMoreButtonProps {
  onClick: () => void;        // Handler for View More action
  isLoading: boolean;         // Loading state
  hasMore: boolean;           // Whether more articles available
  loadedCount: number;        // Number currently displayed
  totalCount: number;         // Total available articles
}
```

### Rendering Logic

```typescript
// Hidden when no more articles
if (!hasMore) return null;

// Disabled during loading
<Button
  onClick={onClick}
  disabled={isLoading}
  variant="outline"
  size="lg"
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      View More ({totalCount - loadedCount} remaining)
    </>
  )}
</Button>
```

### Accessibility

- Button labeled with clear action
- Loading state announced to screen readers
- Disabled state properly communicated
- Keyboard accessible (Enter/Space)

### Testing Requirements

```typescript
describe('ViewMoreButton', () => {
  it('renders with remaining count');
  it('shows loading spinner when loading');
  it('disables button when loading');
  it('hides when no more articles');
  it('calls onClick when clicked');
  it('is keyboard accessible');
});
```

---

## 4. Existing Components (Reused)

### ArticleGrid

**File**: [`components/article-grid.tsx`](../../../components/article-grid.tsx)  
**Status**: Reused without modification  
**Contract**: See existing implementation

```typescript
interface ArticleGridProps {
  articles: ArticleListItem[];
}

// Renders responsive grid (1/2/3 columns)
// No changes needed for top page
```

### ArticleCard

**File**: [`components/article-card.tsx`](../../../components/article-card.tsx)  
**Status**: Reused without modification  
**Contract**: See existing implementation

```typescript
interface ArticleCardProps {
  article: ArticleListItem;
}

// Displays individual article with:
// - Title, excerpt, publish date
// - Eye-catch image (if available)
// - Category badges
// - No author display (per spec)
```

### CategoryFilter

**File**: [`components/category-filter.tsx`](../../../components/category-filter.tsx)  
**Status**: Reused without modification  
**Contract**: See existing implementation

```typescript
interface CategoryFilterProps {
  categories: CategoryFilter[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;  // NEW: Add for loading state
}

// Renders category buttons with counts
// Highlights selected category
// Includes "All Articles" option
```

**Adaptation Note**: Add `disabled` prop to prevent clicks during loading.

---

## 5. Server Component Contract

### app/page.tsx (Top Page)

**Type**: Server Component (default)  
**Purpose**: Fetch data server-side, pass to client components

### Data Fetching

```typescript
export default async function HomePage() {
  // Fetch all data server-side
  const articles = await fetchAllArticles();
  const categories = await fetchCategoryFilters();
  
  return (
    <main>
      <MobileNavigation links={defaultLinks} />
      <h1>Latest Articles</h1>
      <TopPageListingClient 
        articles={articles} 
        categories={categories} 
      />
    </main>
  );
}
```

### Metadata

```typescript
export const metadata: Metadata = {
  title: 'Moment Works - Latest Articles',
  description: 'Explore our latest blog articles covering technology, design, and development insights',
  openGraph: {
    title: 'Moment Works - Latest Articles',
    description: 'Explore our latest blog articles',
    type: 'website',
    url: 'https://momentworks.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moment Works - Latest Articles',
    description: 'Explore our latest blog articles',
  },
};

// Note: Open Graph image auto-handled by app/opengraph-image.png
```

### Error Handling

```typescript
// Handle API errors gracefully
try {
  const articles = await fetchAllArticles();
} catch (error) {
  console.error('Failed to fetch articles:', error);
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-4">Unable to load articles</h1>
      <p className="text-muted-foreground mb-6">
        There was a problem loading the blog content. Please try again later.
      </p>
      <form>
        <Button type="submit" size="lg">Retry</Button>
      </form>
    </div>
  );
}
```

---

## Component Hierarchy

```
app/page.tsx (Server Component)
  │
  ├─> MobileNavigation (Client Component)
  │   └─> Sheet (shadcn/ui)
  │       ├─> SheetTrigger (Menu Button)
  │       └─> SheetContent (Navigation Links)
  │
  └─> TopPageListingClient (Client Component)
      │
      ├─> CategoryFilter (Client Component - existing)
      │   └─> Button[] (Category buttons)
      │
      ├─> ArticleGrid (Client Component - existing)
      │   └─> ArticleCard[] (Article cards - existing)
      │
      └─> ViewMoreButton (Client Component - new)
          └─> Button (shadcn/ui)
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Initial Page Load                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Server fetches articles & categories                     │
│ 2. Client reads URL: /?category=<id>                        │
│ 3. Initialize: selectedCategoryId, visibleCount=6           │
│ 4. Filter & slice articles                                  │
│ 5. Render: CategoryFilter + ArticleGrid + ViewMoreButton    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │  Category  │ │ View More  │ │  Browser   │
        │   Change   │ │   Click    │ │    Nav     │
        └────────────┘ └────────────┘ └────────────┘
                │             │             │
                ▼             ▼             ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │ Update URL │ │ Increment  │ │ Read URL   │
        │ Reset to 6 │ │ visible +6 │ │ Reset to 6 │
        │ Re-filter  │ │ Re-slice   │ │ Re-filter  │
        └────────────┘ └────────────┘ └────────────┘
```

---

## API Integration

### microCMS API

**Endpoint**: Managed by [`lib/microcms.ts`](../../../lib/microcms.ts)

```typescript
// Fetch all articles
fetchAllArticles(): Promise<ArticleListItem[]>
  - Returns: All articles sorted by publishedAt (newest first)
  - Caching: Next.js default fetch caching
  - Error: Throws on API failure

// Fetch category filters
fetchCategoryFilters(): Promise<CategoryFilter[]>
  - Returns: Categories with article counts
  - Derived: From all articles
  - Sorted: Alphabetically by name
```

### No Additional API Calls

- All filtering happens client-side
- No pagination API calls needed
- Data fetched once on server
- Client receives full dataset

---

## Performance Contracts

### Bundle Size

- **TopPageListingClient**: ~5KB (logic + state)
- **MobileNavigation**: ~3KB + Sheet component (~15KB)
- **ViewMoreButton**: ~1KB
- **Total New Code**: ~24KB (within 200KB budget)

### Rendering

- **Initial**: Server-rendered HTML (instant FCP)
- **Hydration**: Client-side state initialization (<100ms)
- **Filter Change**: Re-render within 200ms
- **View More**: Render 6 more articles within 500ms

### Accessibility

- **Keyboard**: All interactions keyboard accessible
- **Screen Reader**: Proper ARIA labels and announcements
- **Focus Management**: Logical focus order maintained
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)

---

## Summary

**New Components**:

1. ✅ TopPageListingClient - Main orchestrator
2. ✅ MobileNavigation - Responsive menu
3. ✅ ViewMoreButton - Incremental loading

**Adapted Components**:

1. ✅ CategoryFilter - Add `disabled` prop

**Reused Components**:

1. ✅ ArticleGrid - No changes
2. ✅ ArticleCard - No changes
