# Data Model: Top Page with Blog Listing and Navigation

**Feature**: Top Page Blog Listing  
**Date**: 2025-12-15  
**Status**: Phase 1 - Design

---

## Overview

This document defines the data entities, types, and relationships for the top page blog listing feature. All entities align with existing type definitions in the project and extend them where necessary.

---

## Core Entities

### 1. ArticleListItem

**Source**: Existing type from [`types/article.ts`](../../types/article.ts)  
**Usage**: Display individual blog posts in the listing grid  
**State**: Reused without modification

```typescript
interface ArticleListItem {
  id: string;                    // Unique identifier from microCMS
  slug: string;                  // URL-friendly identifier for routing
  title: string;                 // Article title
  excerpt: string;               // Short preview text (150-200 chars)
  publishedAt: string;           // ISO 8601 date string
  eyeCatch?: {                   // Optional featured image
    url: string;                 // Image URL from microCMS
    width?: number;              // Image width for next/image
    height?: number;             // Image height for next/image
  };
  categoryNames?: string[];      // Array of category identifiers
  author?: {                     // Optional author information
    name: string;
    avatar?: string;
  };
}
```

**Validation Rules**:

- `id` and `slug` must be unique
- `title` is required, max 200 characters
- `excerpt` is required, 150-200 characters recommended
- `publishedAt` must be valid ISO 8601 date
- `categoryNames` array can be empty (uncategorized posts)

**Transformations**:

- Fetched from microCMS API via [`fetchAllArticles()`](../../lib/microcms.ts:32)
- Transformed via [`transformToListItem()`](../../lib/transforms.ts)
- Sorted by `publishedAt` descending (newest first)

---

### 2. CategoryFilter

**Source**: Existing type from [`types/filters.ts`](../../types/filters.ts)  
**Usage**: Display category filter buttons with post counts  
**State**: Reused without modification

```typescript
interface CategoryFilter {
  id: string;        // Category identifier (matches categoryNames in articles)
  name: string;      // Display name for the category
  count: number;     // Number of posts in this category
}
```

**Validation Rules**:

- `id` must match values in `ArticleListItem.categoryNames`
- `name` is required for display
- `count` must be non-negative integer

**Derivation**:

- Generated from all articles via [`fetchCategoryFilters()`](../../lib/microcms.ts:100)
- Counts calculated by iterating through all articles
- Sorted alphabetically by name

**Example**:

```typescript
const categories: CategoryFilter[] = [
  { id: 'technology', name: 'Technology', count: 12 },
  { id: 'design', name: 'Design', count: 8 },
  { id: 'development', name: 'Development', count: 15 },
];
```

---

### 3. NavigationLink (New)

**Purpose**: Define navigation menu structure for mobile and desktop  
**Usage**: Render navigation menu items  
**State**: New entity for this feature

```typescript
interface NavigationLink {
  label: string;           // Link text displayed to user
  href: string;            // Destination URL
  isExternal?: boolean;    // Whether link opens in new tab (default: false)
  icon?: React.ReactNode;  // Optional icon (lucide-react)
}
```

**Validation Rules**:

- `label` is required, max 50 characters
- `href` must be valid path or URL
- `isExternal` defaults to `false` for internal links

**Static Definition**:

```typescript
const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/', icon: <Home /> },
  { label: 'Blog', href: '/blog', icon: <BookOpen /> },
  { label: 'About', href: '/about', icon: <User /> },     // Placeholder
  { label: 'Contact', href: '/contact', icon: <Mail /> }, // Placeholder
];
```

**Behavior**:

- All links are internal (same-origin navigation)
- About and Contact pages are placeholders (future implementation)
- Icons are optional, used primarily in mobile menu

---

### 4. ViewMoreState (New)

**Purpose**: Manage incremental content loading state  
**Usage**: Track visible articles and loading state  
**State**: Component-level state (useState)

```typescript
interface ViewMoreState {
  visibleCount: number;   // Number of articles currently displayed
  isLoading: boolean;     // Whether "View More" is loading
}
```

**Initial State**:

```typescript
const [visibleCount, setVisibleCount] = useState(6);
const [isLoading, setIsLoading] = useState(false);
```

**State Transitions**:

1. **Initial Load**: `{ visibleCount: 6, isLoading: false }`
2. **Click "View More"**: `{ visibleCount: 6, isLoading: true }`
3. **Content Loaded**: `{ visibleCount: 12, isLoading: false }`
4. **Filter Changed**: `{ visibleCount: 6, isLoading: false }` (reset)

**Business Rules**:

- Initial visible count: 6 articles
- Increment amount: 6 articles per "View More" click
- Reset to 6 when category filter changes
- Maximum: Total number of filtered articles
- Button hidden when `visibleCount >= filteredArticles.length`

---

### 5. FilterState (Existing, Adapted)

**Purpose**: Track selected category filter and URL synchronization  
**Usage**: Filter articles by category  
**State**: Component-level state synchronized with URL query parameters

```typescript
interface FilterState {
  selectedCategoryId: string | null;  // Currently selected category ID
}
```

**State Management**:

```typescript
// Read from URL on mount
const searchParams = useSearchParams();
const initialCategory = searchParams.get('category');
const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategory);

// Update URL when filter changes
const updateFilter = (categoryId: string | null) => {
  setSelectedCategoryId(categoryId);
  const params = new URLSearchParams(searchParams);
  if (categoryId) {
    params.set('category', categoryId);
  } else {
    params.delete('category');
  }
  router.push(`/?${params.toString()}`, { scroll: false });
};
```

**Business Rules**:

- `null` = show all articles (no filter)
- Non-null = show only articles with matching category
- URL parameter `?category=<id>` reflects current filter
- Browser back/forward updates filter state
- Filter change resets visible count to 6

---

### 6. MobileMenuState (New)

**Purpose**: Track mobile navigation menu open/closed state  
**Usage**: Control mobile menu visibility  
**State**: Managed by shadcn/ui Sheet component (internal)

```typescript
// Sheet component manages state internally
// No explicit state definition needed
// Triggers and content control behavior
```

**Behavior**:

- **Closed by default** on page load
- **Opens** when user clicks menu trigger button
- **Closes** when:
  - User clicks menu trigger again
  - User clicks a navigation link
  - User clicks outside menu (overlay)
  - User presses Escape key
- **Breakpoint**: Visible only on screens < 1024px

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                        Top Page                              │
│                       (Server Component)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ fetches data
                              ▼
            ┌─────────────────────────────────────┐
            │         microCMS API                 │
            │  - fetchAllArticles()                │
            │  - fetchCategoryFilters()            │
            └─────────────────────────────────────┘
                              │
                              │ returns
                              ▼
            ┌─────────────────────────────────────┐
            │      ArticleListItem[]               │
            │      CategoryFilter[]                │
            └─────────────────────────────────────┘
                              │
                              │ passes as props
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              TopPageListingClient                            │
│                  (Client Component)                          │
│                                                              │
│  State:                                                      │
│  - selectedCategoryId: string | null                         │
│  - visibleCount: number                                      │
│  - isLoading: boolean                                        │
│                                                              │
│  Computed:                                                   │
│  - filteredArticles = filter(articles, selectedCategoryId)   │
│  - displayedArticles = slice(filteredArticles, 0, visible)   │
│  - hasMore = visibleCount < filteredArticles.length          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ renders
                              ▼
            ┌─────────────────────────────────────┐
            │      CategoryFilter                  │
            │  - categories: CategoryFilter[]      │
            │  - selected: string | null           │
            │  - onChange: (id) => void            │
            └─────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
            ▼                                   ▼
┌─────────────────────┐         ┌─────────────────────┐
│   ArticleGrid       │         │  View More Button    │
│  - articles[]       │         │  - onClick: load()   │
│                     │         │  - disabled: loading │
│   └─> ArticleCard   │         │  - visible: hasMore  │
│       (reused)      │         └─────────────────────┘
└─────────────────────┘
```

---

## Data Flow

### 1. Initial Page Load

```
1. Server Component (app/page.tsx):
   ├─> fetchAllArticles() → ArticleListItem[]
   ├─> fetchCategoryFilters() → CategoryFilter[]
   └─> Pass to TopPageListingClient

2. TopPageListingClient:
   ├─> Read URL params: selectedCategoryId
   ├─> Initialize visibleCount = 6
   ├─> Filter articles by category
   ├─> Slice to first 6 articles
   └─> Render components
```

### 2. Category Filter Change

```
User clicks category button
   │
   ├─> updateFilter(categoryId)
   │   ├─> setSelectedCategoryId(categoryId)
   │   ├─> Update URL: /?category={id}
   │   └─> setVisibleCount(6)  // Reset
   │
   ├─> Recompute filteredArticles
   ├─> Slice to first 6 articles
   └─> Re-render ArticleGrid
```

### 3. View More Click

```
User clicks "View More"
   │
   ├─> setIsLoading(true)
   │
   ├─> setVisibleCount(prev => prev + 6)
   │
   ├─> Recompute displayedArticles
   │   (slice to new visibleCount)
   │
   ├─> setIsLoading(false)
   │
   └─> Re-render ArticleGrid with more articles
```

### 4. Browser Back/Forward

```
Browser navigation event
   │
   ├─> URL changes: /?category={newId}
   │
   ├─> useSearchParams detects change
   │
   ├─> Update selectedCategoryId from URL
   │
   ├─> Reset visibleCount to 6
   │
   ├─> Scroll to article grid
   │
   └─> Re-render with new filter
```

---

## Validation & Error Handling

### API Response Validation

```typescript
// Type guard for ArticleListItem
function isValidArticle(item: unknown): item is ArticleListItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'slug' in item &&
    'title' in item &&
    'publishedAt' in item
  );
}

// Validate API response
const articles = await fetchAllArticles();
if (!articles.every(isValidArticle)) {
  throw new Error('Invalid article data received from API');
}
```

### Empty State Handling

```typescript
// No articles at all
if (articles.length === 0) {
  return <EmptyState message="No blog posts available. Check back soon!" />;
}

// No articles in selected category
if (filteredArticles.length === 0 && selectedCategoryId) {
  return <EmptyState message="No posts in this category yet. Check back soon!" />;
}
```

### Error Boundaries

```typescript
// API fetch error
try {
  const articles = await fetchAllArticles();
} catch (error) {
  console.error('Failed to fetch articles:', error);
  return <ErrorState message="Unable to load articles" onRetry={() => router.refresh()} />;
}
```

---

## Performance Considerations

### Data Fetching

- **Server-Side**: Fetch all articles once on server (Server Component)
- **Client-Side**: No additional API calls, pure client-side filtering
- **Caching**: Leverage Next.js default fetch caching

### State Updates

- **Filter Change**: O(n) array filter operation
- **View More**: O(1) count increment + O(n) slice
- **Memo**: Use `useMemo` for filtered/displayed articles

### Memory

- **Full Dataset**: Store all articles in component (acceptable for blog content)
- **Displayed**: Slice array for rendering (no duplication)
- **Category Count**: Pre-computed on server, no client calculation

---

## Type Exports

All types are defined in existing type files:

```typescript
// types/article.ts
export interface ArticleListItem { /* ... */ }
export interface ArticleDetail { /* ... */ }

// types/filters.ts
export interface CategoryFilter { /* ... */ }

// NEW: types/navigation.ts (to be created)
export interface NavigationLink {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
}
```

---

## Summary

**Reused Entities**:

- ✅ ArticleListItem (no changes)
- ✅ CategoryFilter (no changes)
- ✅ FilterState pattern (adapted with URL sync)

**New Entities**:

- ✅ NavigationLink (static navigation structure)
- ✅ ViewMoreState (incremental loading)
- ✅ MobileMenuState (managed by shadcn/ui Sheet)

**Key Principles**:

- Type safety enforced with TypeScript strict mode
- Existing types preserved for compatibility
- Server-side data fetching, client-side filtering
- URL synchronization for shareable links
- Incremental loading for better UX and performance
