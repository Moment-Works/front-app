# Implementation Plan: Top Page with Blog Listing and Navigation

**Branch**: `002-top-page-blog-listing` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-top-page-blog-listing/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a top page (`/`) that serves as the main entry point, displaying blog posts with "View More" incremental loading (initial 6 posts, load 6 more each click), category filtering with URL query parameters and browser navigation support, and responsive mobile/desktop navigation menu. Reuse existing blog listing components ([`BlogListingClient`](../../components/blog-listing-client.tsx), [`ArticleGrid`](../../components/article-grid.tsx), [`CategoryFilter`](../../components/category-filter.tsx)) adapted for "View More" pattern instead of pagination, maintain consistency with existing [`/blog`](../../app/blog/page.tsx) page.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode enabled
**Primary Dependencies**: Next.js 16.0.7, React 19.2.0, Tailwind CSS 4, shadcn/ui, lucide-react, microcms-js-sdk 3.2.0
**Storage**: External content via microCMS API (no database required)
**Testing**: Built-in Next.js testing capabilities
**Target Platform**: Web (SSR/SSG via Next.js App Router)
**Project Type**: Web application (Next.js App Router with Server/Client components)
**Performance Goals**:

- Page load < 2 seconds on standard broadband
- Category filter response < 200ms
- View More load < 500ms
- Lighthouse Performance Score ≥ 90
- LCP ≤ 2.5s, FCP ≤ 1.8s, CLS ≤ 0.1, FID ≤ 100ms
**Constraints**:
- Initial JavaScript bundle ≤ 200KB
- Mobile-responsive (320px+)
- Browser back/forward navigation support
**Scale/Scope**: Blog content site with category filtering, incremental loading, responsive navigation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Next.js 14+ App Router Mandatory

- **Status**: PASS
- **Evidence**: Project uses Next.js 16.0.7 with App Router (`app/` directory), existing pages at [`app/blog/page.tsx`](../../app/blog/page.tsx)
- **Action**: Top page will be implemented at [`app/page.tsx`](../../app/page.tsx) following App Router conventions

### ✅ II. TypeScript Strict Mode (NON-NEGOTIABLE)

- **Status**: PASS
- **Evidence**: [`tsconfig.json`](../../tsconfig.json:7) has `"strict": true`, all existing code is fully typed
- **Action**: Continue using strict TypeScript for all new components

### ✅ III. Performance First (NON-NEGOTIABLE)

- **Status**: PASS - Requirements aligned
- **Evidence**: Spec defines performance targets (page load < 2s, filter response < 200ms, View More < 500ms)
- **Action**:
  - Use `next/image` for all images (eye-catch images)
  - Implement proper loading states
  - Leverage Server Components for initial data fetch
  - Use Client Components only for interactive parts (menu, filters, View More button)

### ✅ IV. UI Standards (NON-NEGOTIABLE)

- **Status**: PASS
- **Evidence**: Project uses Tailwind CSS 4 and shadcn/ui components (see [`components/ui/`](../../components/ui/))
- **Action**: Continue using Tailwind utility classes and shadcn/ui components for new navigation menu

### ✅ V. Simplicity & Best Practices

- **Status**: PASS
- **Evidence**: Existing components use React hooks (useState, useMemo) without complex state management
- **Action**:
  - Use `useState` for menu open/close state
  - Use URL query parameters for category filter state (shareable links)
  - Reuse existing components without modification where possible

### Summary (Post-Design Re-evaluation)

**All constitution checks PASS**. No violations detected in Phase 0 (Research) or Phase 1 (Design).

**Design Validation**:

- ✅ All new components follow App Router patterns (Server/Client split)
- ✅ All types strictly defined with TypeScript strict mode
- ✅ Performance targets maintained in design (View More incremental loading)
- ✅ UI uses only Tailwind CSS and shadcn/ui (Sheet component)
- ✅ State management uses useState and URL params (no Redux)
- ✅ Simple, focused component design (YAGNI principle applied)

**No complexity violations identified**. All design decisions justified and align with constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Next.js App Router Structure
app/
├── page.tsx              # NEW: Top page (root route) - Server Component
├── layout.tsx            # Existing: Root layout
├── globals.css           # Existing: Global styles
└── blog/
    ├── page.tsx          # Existing: Blog listing with pagination
    └── [slug]/
        └── page.tsx      # Existing: Individual article pages

components/
├── blog-listing-client.tsx    # ADAPT: For "View More" pattern
├── article-grid.tsx           # REUSE: Grid layout
├── category-filter.tsx        # REUSE: Category filtering
├── article-card.tsx           # REUSE: Article card display
├── mobile-menu.tsx            # NEW: Mobile navigation menu
└── ui/                        # Existing: shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    └── ...

lib/
├── microcms.ts           # REUSE: API client and fetching functions
├── transforms.ts         # REUSE: Data transformations
└── utils.ts              # REUSE: Utility functions

types/
├── article.ts            # REUSE: Article type definitions
├── filters.ts            # REUSE: Filter type definitions
└── microcms.ts           # REUSE: microCMS API types
```

**Structure Decision**: Web application using Next.js App Router. Top page at [`app/page.tsx`](../../app/page.tsx) will be a Server Component that fetches data server-side, passes to client component for interactivity. New mobile menu component will handle responsive navigation. Existing blog components will be adapted for "View More" pattern while maintaining type safety and reusability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
