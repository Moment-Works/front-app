# Implementation Plan: Blog Article Listing and Detail Pages

**Branch**: `001-blog-article-listing` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-blog-article-listing/spec.md`

## Summary

Implement a blog article listing and detail page system using Next.js 16 App Router with Static Site Generation (SSG). Articles are sourced from microCMS headless CMS using richEditorV2 (HTML) format. The system includes client-side pagination, category-based filtering, automatic table of contents generation, and article navigation. All content is pre-rendered at build time for maximum performance, with shadcn/ui components styled using Tailwind CSS.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode  
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19.2.0, microcms-js-sdk 3.2.0, Tailwind CSS 4, shadcn/ui, node-html-parser  
**Storage**: microCMS headless CMS (external API, build-time fetching only)  
**Testing**: Manual testing during development, future: Jest + React Testing Library  
**Target Platform**: Web (browsers), SSG deployment to Vercel/similar  
**Project Type**: Single web application (Next.js frontend)  
**Performance Goals**: Lighthouse ≥90, LCP ≤2.5s, FCP ≤1.8s, CLS ≤0.1, Initial bundle ≤200KB  
**Constraints**: Constitution-mandated: TypeScript strict mode, App Router only, Tailwind + shadcn/ui exclusive, no Pages Router  
**Scale/Scope**: ~10-50 blog articles initially, designed to scale to 1000+ articles via SSG

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Next.js 14+ App Router Mandatory** | ✅ PASS | Using Next.js 16.0.7, App Router exclusively, proper directory structure |
| **II. TypeScript Strict Mode** | ✅ PASS | tsconfig.json has `"strict": true`, all types explicitly defined |
| **III. Performance First** | ✅ PASS | SSG architecture, target metrics defined, using next/image, code splitting planned |
| **IV. UI Standards** | ✅ PASS | Tailwind CSS 4 + shadcn/ui exclusive (setup required), no other UI libraries |
| **V. Simplicity & Best Practices** | ✅ PASS | Using local state (useState) + React Context if needed, no Redux, YAGNI approach |

**Overall**: ✅ **APPROVED** - No constitution violations. All principles satisfied.

### Post-Design Check (After Phase 1)

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. App Router** | ✅ PASS | Routes: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, using Server Components + selective Client Components |
| **II. TypeScript** | ✅ PASS | Comprehensive type definitions in `types/` directory, no `any` types |
| **III. Performance** | ✅ PASS | Full SSG (no runtime API calls), next/image with proper sizing, bundle optimization via dynamic imports |
| **IV. UI Standards** | ✅ PASS | shadcn/ui components (Card, Badge, Button, Separator), Tailwind styling only |
| **V. Simplicity** | ✅ PASS | Minimal state management (local useState for pagination/filters), straightforward data flow |

**Overall**: ✅ **APPROVED** - Design maintains constitutional compliance.

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-article-listing/
├── spec.md              # Original feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (data structures)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── microcms-api.md
│   └── component-api.md
└── checklists/
    └── requirements.md  # Requirements tracking
```

### Source Code (repository root)

```text
app/
├── blog/
│   ├── page.tsx                 # Blog listing page (Server Component)
│   └── [slug]/
│       └── page.tsx             # Article detail page (Server Component + SSG)
├── layout.tsx                   # Root layout (already exists)
├── globals.css                  # Global styles (Tailwind + shadcn config)
└── favicon.ico

components/
├── ui/                          # shadcn/ui components (auto-generated)
│   ├── card.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   └── separator.tsx
├── blog-listing-client.tsx      # Client component for listing (pagination/filters)
├── article-card.tsx             # Article display card
├── article-grid.tsx             # Grid layout for articles
├── category-filter.tsx          # Category filter UI
├── pagination.tsx               # Pagination controls
├── table-of-contents.tsx        # TOC sidebar (Client Component)
└── article-navigation.tsx       # Previous/next article links

lib/
├── microcms.ts                  # microCMS API client and data fetching
├── transforms.ts                # Data transformation utilities
├── html-processing.ts           # HTML parsing and TOC generation
└── utils.ts                     # Shared utilities (shadcn cn helper, date formatting)

types/
├── microcms.ts                  # microCMS API response types
├── article.ts                   # Application domain types
├── toc.ts                       # Table of contents types
└── filters.ts                   # Filter and pagination types

schema/
├── api-blogs-20251206155310.json      # microCMS blog schema (existing)
└── api-categories-20251206155420.json # microCMS category schema (existing)
```

**Structure Decision**: Single Next.js web application using App Router with clear separation between pages (app/), reusable components (components/), business logic (lib/), and type definitions (types/). This structure follows Next.js 14+ best practices and scales well as features grow.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations | N/A |

**Note**: This implementation maintains simplicity by using minimal dependencies, leveraging Next.js built-in features (SSG, Image optimization, Route handlers), and avoiding unnecessary abstractions. State management is handled with basic React hooks rather than external libraries.

---

## Phase Outputs

### Phase 0: Research (✅ Complete)

**Document**: [`research.md`](./research.md)

**Key Decisions**:

1. ✅ Use microCMS richEditorV2 (HTML) instead of Markdown - avoids schema migration
2. ✅ Use multiple categories per article (relationList) - matches updated schema
3. ✅ Client-side pagination with build-time data - instant transitions, no API calls
4. ✅ shadcn/ui setup required - constitution mandated
5. ✅ HTML parsing for TOC generation - compatible with richEditorV2
6. ✅ SSG with generateStaticParams - maximum performance

**Technologies Selected**:

- Content rendering: richEditorV2 HTML (dangerouslySetInnerHTML with microCMS sanitization)
- HTML parsing: node-html-parser (lightweight, zero dependencies)
- UI components: shadcn/ui (Card, Badge, Button, Separator)
- State management: React useState (no external library needed)
- Date handling: Intl.DateTimeFormat (built-in)

### Phase 1: Design (✅ Complete)

**Documents**:

- [`data-model.md`](./data-model.md) - Complete type system and data transformations
- [`contracts/microcms-api.md`](./contracts/microcms-api.md) - microCMS API contract
- [`contracts/component-api.md`](./contracts/component-api.md) - React component props interfaces
- [`quickstart.md`](./quickstart.md) - Developer implementation guide

**Data Model Highlights**:

- `MicroCMSBlog`: Raw API response type
- `ArticleListItem`: Optimized for listing display
- `ArticleDetail`: Full article with TOC and navigation
- `TableOfContents`: Extracted heading structure
- `CategoryFilter`: Filter options with counts

**API Contracts**:

- GET `/api/v1/blogs` - Fetch all articles (build-time)
- GET `/api/v1/blogs/{id}` - Fetch single article
- GET `/api/v1/categories` - Fetch categories

**Component Hierarchy**:

```
BlogListingPage (Server)
└── BlogListingClient (Client)
    ├── CategoryFilter (Client)
    ├── ArticleGrid
    │   └── ArticleCard (multiple)
    └── Pagination (Client)

ArticleDetailPage (Server)
├── ArticleHeader (Server)
├── ArticleContent (Server)
├── TableOfContents (Client - scroll spy)
└── ArticleNavigation (Server)
```

---

## Implementation Roadmap

### Phase 2: Implementation Tasks

**Priority Order** (based on user story priorities from spec):

#### P1: Core Functionality (Must Have)

1. **Environment & Dependencies Setup** (30 min)
   - Install shadcn/ui and configure
   - Add node-html-parser, clsx, tailwind-merge
   - Set up environment variables for microCMS
   - Configure TypeScript paths and imports

2. **Type Definitions** (20 min)
   - Create `types/microcms.ts`
   - Create `types/article.ts`
   - Create `types/toc.ts`
   - Create `types/filters.ts`

3. **API Client & Data Layer** (45 min)
   - Implement `lib/microcms.ts` (API client, fetch functions)
   - Implement `lib/html-processing.ts` (TOC extraction, anchor injection)
   - Implement `lib/transforms.ts` (data transformations)
   - Implement `lib/utils.ts` (helper functions)

4. **Blog Listing Page** (60 min)
   - Create `app/blog/page.tsx` (Server Component)
   - Create `components/blog-listing-client.tsx` (pagination/filter logic)
   - Create `components/article-grid.tsx`
   - Create `components/article-card.tsx`
   - Implement basic listing without filters

5. **Blog Detail Page** (60 min)
   - Create `app/blog/[slug]/page.tsx` with generateStaticParams
   - Create article header component
   - Create article content component
   - Implement article rendering with proper metadata

#### P2: Enhanced Features (Should Have)

6. **Category Filtering** (45 min)
   - Implement `fetchCategoryFilters()` function
   - Create `components/category-filter.tsx`
   - Integrate filter with listing client state
   - Test filter + pagination interaction

7. **Pagination** (30 min)
   - Create `components/pagination.tsx`
   - Implement page state management
   - Add prev/next buttons and page numbers
   - Handle edge cases (first/last page)

8. **Article Navigation** (30 min)
   - Create `components/article-navigation.tsx`
   - Implement prev/next article logic in data layer
   - Add navigation links to detail page

#### P3: Polish Features (Nice to Have)

9. **Table of Contents** (60 min)
   - Create `components/table-of-contents.tsx`
   - Implement IntersectionObserver for scroll spy
   - Add smooth scrolling on click
   - Make TOC sticky positioned

10. **Styling & Polish** (45 min)
    - Fine-tune Tailwind prose styles for article content
    - Add loading skeletons if needed
    - Implement responsive design adjustments
    - Add proper focus states for accessibility

11. **SEO & Metadata** (30 min)
    - Generate proper metadata for each page
    - Add Open Graph tags
    - Create or update sitemap

12. **Testing & Optimization** (60 min)
    - Test build process with multiple articles
    - Run Lighthouse audits
    - Optimize images (ensure next/image usage)
    - Test on mobile devices
    - Verify all constitution metrics met

**Total Estimated Time**: ~8.5 hours

### Phase 3: Testing & Quality Assurance

**Manual Testing Checklist**:

- [ ] Articles display correctly in listing
- [ ] Pagination works (10 items per page)
- [ ] Category filtering works correctly
- [ ] Filter + pagination combination works
- [ ] Article detail pages render properly
- [ ] TOC generates and navigates correctly
- [ ] Prev/next article links work
- [ ] Images load with proper optimization
- [ ] Mobile responsive design works
- [ ] Lighthouse scores meet targets (≥90)

**Performance Validation**:

- [ ] LCP ≤ 2.5s
- [ ] FCP ≤ 1.8s
- [ ] CLS ≤ 0.1
- [ ] Initial bundle ≤ 200KB
- [ ] All images use next/image
- [ ] Build completes successfully with 50+ articles

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| microCMS API rate limits during build | Low | Medium | Implement retry logic, batch requests efficiently |
| Large HTML content causing bundle bloat | Low | Medium | Content is rendered at build time, not included in JS bundle |
| TOC scroll spy performance issues | Low | Low | Use IntersectionObserver (efficient), debounce if needed |
| Category filter confusing (was "tags" in spec) | Medium | Low | Clear naming in UI, explain in documentation |
| Build time increases with many articles | Medium | Medium | Acceptable for SSG (one-time cost), consider ISR if needed later |

---

## Environment Variables Required

```bash
# Required for build
MICROCMS_SERVICE_DOMAIN=your-service-domain  # e.g., "your-blog"
MICROCMS_API_KEY=your-api-key                # API key from microCMS dashboard
```

---

## Dependencies to Install

```json
{
  "dependencies": {
    "node-html-parser": "^6.1.11",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node-html-parser": "^0.7.3"
  }
}
```

Plus shadcn/ui components via CLI:

```bash
npx shadcn@latest init
npx shadcn@latest add card badge button separator
```

---

## Success Criteria

### Functional Requirements Met

- ✅ All FR-001 through FR-034 from spec implemented
- ✅ User stories 1-4 (P1-P3) all satisfied
- ✅ Edge cases handled appropriately

### Performance Targets Met

- ✅ Lighthouse Performance Score ≥ 90
- ✅ Core Web Vitals within targets
- ✅ Bundle size ≤ 200KB

### Code Quality

- ✅ TypeScript strict mode with no `any` types
- ✅ All components properly typed
- ✅ Constitution principles followed
- ✅ Code is maintainable and well-documented

---

## Next Steps

1. **Review this plan** with stakeholders for approval
2. **Set up environment
