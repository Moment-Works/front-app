# Component API Contract

**Feature**: Blog Article Listing and Detail Pages  
**Version**: 1.0.0  
**Date**: 2025-12-06

## Overview

This document defines the props interfaces and component contracts for all React components in the blog listing feature.

---

## Page Components

### 1. Blog Listing Page (Server Component)

**File**: `app/blog/page.tsx`

```typescript
// Server Component - No props interface needed
// Fetches data at build time and passes to client component

export default async function BlogListingPage() {
  const articles: ArticleListItem[] = await fetchAllArticles();
  const categories: CategoryFilter[] = await fetchCategoryFilters();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Articles</h1>
      <BlogListingClient 
        articles={articles} 
        categories={categories} 
      />
    </main>
  );
}
```

---

### 2. Blog Detail Page (Server Component)

**File**: `app/blog/[slug]/page.tsx`

```typescript
interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const article: ArticleDetail = await fetchArticleBySlug(params.slug);
  
  return (
    <article className="container mx-auto px-4 py-8">
      <ArticleHeader article={article} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <ArticleContent content={article.content} />
        <TableOfContents toc={article.tableOfContents} />
      </div>
      <ArticleNavigation navigation={article.navigation} />
    </article>
  );
}
```

---

## Client Components

### 3. BlogListingClient

**File**: `components/blog-listing-client.tsx`

Primary client component managing filtering and pagination state.

```typescript
interface BlogListingClientProps {
  articles: ArticleListItem[];
  categories: CategoryFilter[];
}

'use client';

export function BlogListingClient({ 
  articles, 
  categories 
}: BlogListingClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Filtering and pagination logic
  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    return articles.filter(a => a.categoryName === getCategoryName(selectedCategoryId));
  }, [articles, selectedCategoryId]);
  
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);
  
  return (
    <div className="space-y-8">
      <CategoryFilter 
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      
      <ArticleGrid articles={paginatedArticles} />
      
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

**Props**:

- `articles`: Pre-fetched array of all articles (from server)
- `categories`: Pre-computed category filters with counts

**State**:

- `currentPage`: Current pagination page number
- `selectedCategoryId`: Currently selected category filter (null = all)

**Derived State**:

- `filteredArticles`: Articles filtered by category
- `paginatedArticles`: Current page of filtered articles

---

### 4. ArticleCard

**File**: `components/article-card.tsx`

Display component for individual article in the listing grid.

```typescript
interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${article.slug}`}>
        {article.eyecatchUrl && (
          <div className="relative aspect-video">
            <Image
              src={article.eyecatchUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <CardHeader>
            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
            <CardDescription>
              {formatDate(article.publishedAt)}
            </CardDescription>
          </CardHeader>
          
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {article.excerpt}
            </p>
          )}
          
          {article.categoryName && (
            <Badge variant="secondary">{article.categoryName}</Badge>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
```

**Props**:

- `article`: Article data for display

**Behavior**:

- Entire card is clickable (wrapped in Link)
- Images use next/image with lazy loading
- Title truncated to 2 lines
- Excerpt truncated to 3 lines

---

### 5. ArticleGrid

**File**: `components/article-grid.tsx`

Grid layout container for article cards.

```typescript
interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

**Props**:

- `articles`: Array of articles to display

**Behavior**:

- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Shows empty state when no articles
- Each article gets unique key

---

### 6. CategoryFilter

**File**: `components/category-filter.tsx`

Category selection UI for filtering articles.

```typescript
interface CategoryFilterProps {
  categories: CategoryFilter[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

'use client';

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategoryId === null ? 'default' : 'outline'}
        onClick={() => onSelectCategory(null)}
      >
        All Articles
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name} ({category.count})
        </Button>
      ))}
    </div>
  );
}
```

**Props**:

- `categories`: Available categories with article counts
- `selectedCategoryId`: Currently active filter (null = show all)
- `onSelectCategory`: Callback when category clicked

**Behavior**:

- Shows "All Articles" button to clear filter
- Highlights selected category
- Displays article count per category

---

### 7. Pagination

**File**: `components/pagination.tsx`

Pagination controls for article listing.

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

'use client';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
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
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
```

**Props**:

- `currentPage`: Current active page
- `totalPages`: Total number of pages
- `onPageChange`: Callback when page changed

**Behavior**:

- Hidden when only 1 page
- Disables prev/next at boundaries
- Highlights current page
- All page numbers shown (simple implementation)

---

## Server Components (Article Detail)

### 8. ArticleHeader

**File**: `components/article-header.tsx`

Article metadata display at top of detail page.

```typescript
interface ArticleHeaderProps {
  article: ArticleDetail;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
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
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
        
        {article.categoryName && (
          <Badge variant="secondary">{article.categoryName}</Badge>
        )}
      </div>
    </header>
  );
}
```

**Props**:

- `article`: Full article detail data

**Behavior**:

- Hero image uses priority loading (LCP optimization)
- Semantic HTML (header, h1, time elements)
- Displays category badge if present

---

### 9. ArticleContent

**File**: `components/article-content.tsx`

Renders article HTML content with proper styling.

```typescript
interface ArticleContentProps {
  content: string; // HTML with injected anchor IDs
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
```

**Props**:

- `content`: Processed HTML string with anchor IDs

**Behavior**:

- Uses Tailwind Typography plugin (`prose` classes)
- Renders sanitized HTML from microCMS
- Anchor IDs enable scroll navigation

**Required Styles** (in `globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  .prose h1, .prose h2, .prose h3 {
    scroll-margin-top: 2rem;
  }
}
```

---

### 10. TableOfContents (Client Component)

**File**: `components/table-of-contents.tsx`

Interactive navigation sidebar for article sections.

```typescript
interface TableOfContentsProps {
  toc: TableOfContents;
}

'use client';

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Scroll spy logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );
    
    toc.headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [toc]);
  
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <nav className="sticky top-4 h-fit">
      <h2 className="font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-2 text-sm">
        {toc.headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'text-left hover:text-primary transition-colors',
                activeId === heading.id ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Props**:

- `toc`: Table of contents structure

**State**:

- `activeId`: Currently visible section (scroll spy)

**Behavior**:

- Sticky positioning (follows scroll)
- Highlights active section with IntersectionObserver
- Smooth scrolls to section on click
- Indents based on heading level

---

### 11. ArticleNavigation

**File**: `components/article-navigation.tsx`

Previous/next article links at bottom of detail page.

```typescript
interface ArticleNavigationProps {
  navigation: ArticleNavigation;
}

export function ArticleNavigation({ navigation }: ArticleNavigationProps) {
  return (
    <nav className="flex justify-between gap-4 mt-12 pt-8 border-t">
      {navigation.previous ? (
        <Link
          href={`/blog/${navigation.previous.slug}`}
          className="flex-1 p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <span className="text-sm text-muted-foreground">← Previous</span>
          <p className="font-medium mt-1">{navigation.previous.title}</p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      
      {navigation.next ? (
