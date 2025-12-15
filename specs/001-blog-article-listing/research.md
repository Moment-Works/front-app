# Research & Technical Decisions

**Feature**: Blog Article Listing and Detail Pages  
**Branch**: `001-blog-article-listing`  
**Date**: 2025-12-06

## Phase 0: Research Findings

This document resolves all NEEDS CLARIFICATION items and documents technical decisions for the blog listing feature.

---

## 1. Content Format: richEditorV2 vs Markdown

### Decision

Use microCMS **richEditorV2** content as-is, render as HTML (not Markdown)

### Rationale

- Existing microCMS schema uses `richEditorV2` field type
- richEditorV2 provides WYSIWYG editing experience in microCMS admin
- Outputs structured HTML that can be safely rendered
- Avoids schema migration and content conversion overhead
- Still supports all required features: headings (for TOC), images, lists, code blocks, etc.

### Implementation Approach

- Use microCMS's built-in HTML sanitization
- Parse HTML to extract headings for table of contents generation
- Use standard HTML rendering with proper styling via Tailwind

### Alternatives Considered

- **Markdown with CommonMark**: Would require schema change, content migration, and loss of WYSIWYG editing
- **Hybrid approach**: Unnecessary complexity for no clear benefit

---

## 2. Taxonomy: Categories vs Tags

### Decision

Use **categories** for filtering (single category per article), update spec terminology from "tags" to "categories"

### Rationale

- Existing schema has `category` relation field (single selection)
- No tags field exists in current schema
- Single category is simpler and sufficient for MVP
- Avoids schema changes and maintains data model consistency

### Implementation Approach

- Display category badge on article cards
- Implement category filtering in article listing
- Show all available categories as filter options
- Category is optional (articles can have no category)

### Spec Updates Required

- Replace all "tag" references with "category"
- Update filtering from "multiple tags (OR logic)" to "single category selection"
- Update FR-006, FR-007, FR-008 to reflect category-based filtering

### Alternatives Considered

- **Add tags field**: Would require schema migration, more complex UI
- **Multiple categories**: Would require schema change to support array

---

## 3. microCMS API Integration

### Decision

Use microCMS JavaScript SDK with Next.js 16 App Router SSG

### Rationale

- `microcms-js-sdk` already installed (v3.2.0)
- Provides TypeScript types via `microcms-typescript` package
- Supports pagination and filtering
- Well-documented and actively maintained

### Required Environment Variables

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

### Implementation Approach

```typescript
// lib/microcms.ts - API client setup
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});
```

### Data Fetching Strategy

- Use `generateStaticParams` for article detail pages
- Fetch all articles at build time
- No runtime API calls (pure SSG)
- Articles filtered by microCMS's built-in draft/published status

---

## 4. TypeScript Types from microCMS Schema

### Decision

Generate TypeScript types from microCMS schema JSON files

### Rationale

- Schema files already exist: `schema/api-blogs-*.json`, `schema/api-categories-*.json`
- Ensures type safety matches actual CMS structure
- Can be automated with `microcms-typescript` package

### Generated Types Structure

```typescript
// types/microcms.ts
export interface Blog {
  id: string;
  title: string;
  content: string; // richEditorV2 outputs HTML string
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: {
    id: string;
    name: string;
  };
  publishedAt: string; // ISO 8601 date
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. HTML Rendering & Security

### Decision

Use `dangerouslySetInnerHTML` with microCMS's sanitized HTML output

### Rationale

- microCMS richEditorV2 already sanitizes HTML on their end
- No additional sanitization library needed (reduces bundle size)
- microCMS is a trusted CMS, not user-generated content

### Security Measures

- Content comes from authenticated CMS (not user input)
- microCMS applies XSS protection
- Content fetched at build time (no runtime injection risks)
- Review CSP headers if needed in production

### Implementation

```typescript
<div dangerouslySetInnerHTML={{ __html: article.content }} />
```

---

## 6. Table of Contents Generation

### Decision

Parse HTML content to extract headings (h1, h2, h3) and generate TOC structure

### Rationale

- richEditorV2 outputs semantic HTML with proper heading tags
- Can use browser DOM parsing or lightweight HTML parser
- No markdown-specific AST needed

### Implementation Approach

- Use `node-html-parser` or `cheerio` for server-side HTML parsing
- Extract headings with proper hierarchy
- Generate anchor IDs from heading text (slugify)
- Inject IDs back into rendered HTML for scroll targets

### Library Choice

**node-html-parser** (lightweight, zero dependencies)

```typescript
import { parse } from 'node-html-parser';

function extractTOC(html: string) {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');
  return headings.map(h => ({
    level: parseInt(h.tagName[1]),
    text: h.text,
    id: slugify(h.text)
  }));
}
```

---

## 7. Client-side Pagination Strategy

### Decision

Implement client-side pagination with all data pre-rendered

### Rationale

- All articles fetched at build time (SSG)
- No API calls needed at runtime
- Instant page transitions
- Simpler implementation than infinite scroll
- Better UX for browsing specific pages

### Implementation

- Pass all articles to client component via props
- Use React state for current page
- Display 10 articles per page
- Implement page number controls and prev/next buttons
- Maintain filter state during pagination

---

## 8. shadcn/ui Component Setup

### Decision

Install and configure shadcn/ui with required components

### Rationale

- Constitution mandates shadcn/ui for all UI components
- Provides accessible, customizable components
- No framework lock-in (components copied to project)
- Consistent design system

### Required Components

1. **Card** - Article cards in listing
2. **Badge** - Category display
3. **Button** - Pagination controls
4. **Skeleton** - Loading states (if needed)
5. **Separator** - Visual dividers

### Setup Steps

```bash
npx shadcn@latest init
npx shadcn@latest add card badge button skeleton separator
```

### Configuration

- Use default Tailwind config
- Integrate with existing globals.css
- Follow Next.js App Router patterns

---

## 9. Performance Optimization Strategy

### Decision

Implement comprehensive performance optimizations per Constitution requirements

### Target Metrics (Constitution Mandated)

- Lighthouse Performance Score: **≥90**
- First Contentful Paint (FCP): **≤1.8s**
- Largest Contentful Paint (LCP): **≤2.5s**
- Cumulative Layout Shift (CLS): **≤0.1**
- First Input Delay (FID): **≤100ms**
- Initial JS bundle: **≤200KB**

### Implementation Strategy

#### Image Optimization

- Use `next/image` for all images (eyecatch, thumbnails)
- Serve WebP format automatically
- Implement lazy loading for below-fold images
- Specify explicit width/height to prevent CLS

#### Code Splitting

- Separate article listing and detail into different routes
- Dynamic import for TOC component (client-side only)
- Dynamic import for category filter UI
- Leverage Next.js automatic code splitting

#### Static Generation

- All pages pre-rendered at build time
- No runtime API calls
- HTML served from CDN
- Optimal TTFB (Time to First Byte)

---

## 10. Routing Structure

### Decision

Use Next.js App Router with following structure

```
app/
├── blog/
│   ├── page.tsx                 # Article listing (SSG)
│   └── [slug]/
│       └── page.tsx             # Article detail (SSG with generateStaticParams)
```

### Rationale

- Clean, SEO-friendly URLs
- Follows Next.js 14+ App Router conventions
- Supports static generation with `generateStaticParams`
- Easy to add related routes later (categories, search, etc.)

### URL Examples

- Listing: `/blog`
- Article: `/blog/introduction-to-nextjs`
- With category filter: `/blog?category=tech` (client-side)

---

## Summary of Key Decisions

| Area | Decision | Impact |
|------|----------|--------|
| Content Format | richEditorV2 (HTML) | No schema change needed |
| Taxonomy | Single category per article | Simpler than multi-tag |
| API Client | microcms-js-sdk | Already installed |
| Rendering | SSG with build-time fetching | Maximum performance |
| Pagination | Client-side | Instant transitions |
| UI Components | shadcn/ui + Tailwind | Constitution compliant |
| TOC Generation | HTML parsing | Works with richEditorV2 |
| Security | microCMS sanitization | Adequate for CMS content |

---

## Open Items for Phase 1

These items will be addressed in the design phase:

1. Exact TypeScript interfaces from microCMS schema
2. API client implementation details
3. Component hierarchy and props structure
4. State management approach (local vs context)
5. Error boundary implementation
6. SEO metadata generation
7. Accessibility considerations (ARIA labels, keyboard nav)

---

**Next Phase**: Proceed to Phase 1 (Design & Contracts) to create data models and API contracts.
