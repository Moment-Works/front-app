---

description: "Task list for Blog Article Listing and Detail Pages feature implementation"
---

# Tasks: Blog Article Listing and Detail Pages

**Input**: Design documents from [`/specs/001-blog-article-listing/`](.)
**Prerequisites**: [`plan.md`](./plan.md) (✅), [`spec.md`](./spec.md) (✅), [`research.md`](./research.md) (✅), [`data-model.md`](./data-model.md) (✅), [`contracts/`](./contracts/) (✅)

**Tests**: Tests are NOT explicitly requested in the specification. This implementation focuses on manual testing and validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- All file paths are relative to project root: `/Users/gen/Work/side-project/01.moment-works/moment-works-front-app`

## Path Conventions

This is a **Next.js 16 App Router** web application with the following structure:

- **Pages**: `app/` (Server Components)
- **Components**: `components/` and `components/ui/` (shadcn/ui)
- **Business Logic**: `lib/`
- **Type Definitions**: `types/`
- **Schemas**: `schema/` (existing microCMS schemas)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment setup, dependencies installation, and basic type definitions

- [ ] T001 Verify environment variables in `.env.local` (MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY)
- [ ] T002 Install required npm packages: `node-html-parser`, `clsx`, `tailwind-merge`
- [ ] T003 [P] Initialize shadcn/ui with default configuration
- [ ] T004 [P] Install shadcn/ui components: `card`, `badge`, `button`, `separator`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type system and utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create [`types/microcms.ts`](../../types/microcms.ts) with MicroCMSBlog, MicroCMSImage, MicroCMSCategory, MicroCMSListResponse interfaces
- [ ] T006 [P] Create [`types/article.ts`](../../types/article.ts) with ArticleListItem, ArticleDetail, TableOfContents, TocHeading interfaces
- [ ] T007 [P] Create [`types/filters.ts`](../../types/filters.ts) with CategoryFilter and FilterState interfaces
- [ ] T008 [P] Create [`types/navigation.ts`](../../types/navigation.ts) with ArticleNavigation and AdjacentArticle interfaces
- [ ] T009 Create [`lib/utils.ts`](../../lib/utils.ts) with cn() helper and formatDate() utility function
- [ ] T010 Create [`lib/html-processing.ts`](../../lib/html-processing.ts) with slugify(), injectHeadingAnchors(), and extractTableOfContents() functions
- [ ] T011 Create [`lib/transforms.ts`](../../lib/transforms.ts) with transformToListItem() and transformToArticleDetail() functions
- [ ] T012 Create [`lib/microcms.ts`](../../lib/microcms.ts) with API client setup and basic functions: fetchAllArticles(), fetchArticleBySlug(), fetchCategoryFilters()

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Article List Viewing (Priority: P1) 🎯 MVP

**Goal**: Users can view a paginated list of blog articles with essential information (title, thumbnail, publication date, category) to decide which articles to read.

**Independent Test**: Navigate to `/blog`, verify articles display in a grid with proper information, test pagination controls work correctly.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create [`components/article-card.tsx`](../../components/article-card.tsx) component to display individual article with Link, Image, title, date, category badge
- [ ] T014 [P] [US1] Create [`components/article-grid.tsx`](../../components/article-grid.tsx) component with responsive grid layout and empty state handling
- [ ] T015 [P] [US1] Create [`components/pagination.tsx`](../../components/pagination.tsx) component with prev/next buttons and page number controls
- [ ] T016 [US1] Create [`components/blog-listing-client.tsx`](../../components/blog-listing-client.tsx) Client Component managing pagination state and rendering ArticleGrid + Pagination
- [ ] T017 [US1] Create [`app/blog/page.tsx`](../../app/blog/page.tsx) Server Component that fetches articles and renders BlogListingClient with proper metadata
- [ ] T018 [US1] Update [`app/globals.css`](../../app/globals.css) to include Tailwind Typography styles if not present

**Checkpoint**: At this point, User Story 1 should be fully functional - users can browse articles with pagination

---

## Phase 4: User Story 2 - Article Detail Viewing (Priority: P1) 🎯 MVP

**Goal**: Users can read full article content with proper formatting, table of contents, and navigation context.

**Independent Test**: Click an article from the listing, verify detail page renders with formatted content, TOC is generated, metadata displays correctly, and prev/next navigation links work.

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create [`components/article-header.tsx`](../../components/article-header.tsx) component displaying title, eyecatch image, date, and category badge
- [ ] T020 [P] [US2] Create [`components/article-content.tsx`](../../components/article-content.tsx) component rendering HTML content with prose styling
- [ ] T021 [P] [US2] Create [`components/article-navigation.tsx`](../../components/article-navigation.tsx) component with prev/next article links
- [ ] T022 [P] [US2] Create [`components/table-of-contents.tsx`](../../components/table-of-contents.tsx) Client Component with IntersectionObserver for scroll spy and smooth scrolling
- [ ] T023 [US2] Create [`app/blog/[slug]/page.tsx`](../../app/blog/[slug]/page.tsx) Server Component with generateStaticParams, generateMetadata, and article detail rendering
- [ ] T024 [US2] Add scroll-margin-top CSS rule to [`app/globals.css`](../../app/globals.css) for heading elements (`.prose h1, .prose h2, .prose h3`)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - complete article reading experience with navigation

---

## Phase 5: User Story 3 - Category-based Filtering (Priority: P2)

**Goal**: Users can filter articles by selecting specific categories to find related content.

**Independent Test**: Create articles with various categories, navigate to `/blog`, click category filter buttons, verify only articles with selected category display, clear filter to see all articles again, verify pagination works with filters.

### Implementation for User Story 3

- [ ] T025 [US3] Create [`components/category-filter.tsx`](../../components/category-filter.tsx) Client Component with category buttons and selection state
- [ ] T026 [US3] Update [`components/blog-listing-client.tsx`](../../components/blog-listing-client.tsx) to add category filter state management and integrate CategoryFilter component
- [ ] T027 [US3] Update [`app/blog/page.tsx`](../../app/blog/page.tsx) to fetch and pass category filters to BlogListingClient
- [ ] T028 [US3] Test filter + pagination interaction to ensure page resets when filter changes

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - users can browse, filter, and read articles

---

## Phase 6: User Story 4 - Table of Contents Navigation (Priority: P3)

**Goal**: Users can quickly navigate to specific sections within long articles using an interactive table of contents.

**Independent Test**: Create an article with multiple heading levels (h1, h2, h3), view detail page, verify TOC is sticky, click TOC items and confirm smooth scrolling to sections, scroll manually and verify current section is highlighted in TOC.

### Implementation for User Story 4

- [ ] T029 [US4] Enhance [`components/table-of-contents.tsx`](../../components/table-of-contents.tsx) with proper sticky positioning and visual hierarchy based on heading levels
- [ ] T030 [US4] Add URL hash update on TOC navigation in [`components/table-of-contents.tsx`](../../components/table-of-contents.tsx) for shareable section links
- [ ] T031 [US4] Test IntersectionObserver performance and adjust rootMargin if needed for optimal scroll spy behavior
- [ ] T032 [US4] Verify TOC works correctly on mobile viewports with responsive layout adjustments

**Checkpoint**: All user stories should now be independently functional - complete feature implementation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T033 [P] Add proper SEO metadata generation for listing page in [`app/blog/page.tsx`](../../app/blog/page.tsx)
- [ ] T034 [P] Add Open Graph tags for article detail pages in [`app/blog/[slug]/page.tsx`](../../app/blog/[slug]/page.tsx)
- [ ] T035 [P] Verify all images use `next/image` with proper sizes and priority attributes
- [ ] T036 [P] Test responsive design on mobile (375px), tablet (768px), and desktop (1200px+)
- [ ] T037 Test build process with `npm run build` to verify SSG generates all article pages correctly
- [ ] T038 Run Lighthouse audit on listing and detail pages to verify performance scores ≥90
- [ ] T039 Verify Core Web Vitals: LCP ≤2.5s, FCP ≤1.8s, CLS ≤0.1
- [ ] T040 Test with 50+ articles to ensure pagination and build performance
- [ ] T041 Verify constitution compliance: TypeScript strict mode, no `any` types, App Router only
- [ ] T042 Manual testing checklist from [`plan.md`](./plan.md) Phase 3 section
- [ ] T043 Create or update project README with setup and development instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (Phase 3): Core MVP - should be completed first
  - US2 (Phase 4): Core MVP - can start after US1 or in parallel if different developers
  - US3 (Phase 5): Enhancement - can start after US1 is stable
  - US4 (Phase 6): Enhancement - depends on US2 (TOC component)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ Independent
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ Independent
- **User Story 3 (P2)**: Depends on User Story 1 (extends listing page) - Integrates but maintains independence
- **User Story 4 (P3)**: Depends on User Story 2 (enhances detail page TOC) - Integrates but maintains independence

### Within Each User Story

- Components marked [P] can be developed in parallel (different files)
- Page routes depend on their required components being complete
- Client components depend on Server Components passing correct props
- Always verify types are defined before implementing components that use them

### Parallel Opportunities

- **Phase 1**: All tasks can run in parallel
- **Phase 2**: Tasks T005-T008 (type files) can run in parallel, then T009-T012 (lib files) can run in parallel
- **Phase 3 (US1)**: Tasks T013-T015 can run in parallel (separate component files)
- **Phase 4 (US2)**: Tasks T019-T022 can run in parallel (separate component files)
- **Phase 7**: Most polish tasks can run in parallel (T033-T036)
- **Cross-Story**: US1 and US2 can be developed in parallel by different developers after Phase 2

---

## Parallel Example: User Story 1

```bash
# After Phase 2 completes, launch all US1 components in parallel:
Task T013: "Create components/article-card.tsx component"
Task T014: "Create components/article-grid.tsx component"  
Task T015: "Create components/pagination.tsx component"

# Then implement integration:
Task T016: "Create components/blog-listing-client.tsx" (uses T013-T015)
Task T017: "Create app/blog/page.tsx" (uses T016)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~1.5 hours) - CRITICAL foundation
3. Complete Phase 3: User Story 1 (~2 hours)
4. **STOP and VALIDATE**: Test article listing independently
5. Complete Phase 4: User Story 2 (~2 hours)
6. **STOP and VALIDATE**: Test full read flow (list → detail → navigation)
7. Basic polish and deploy MVP (~1 hour)

**Total MVP Time**: ~7 hours

### Incremental Delivery

1. **Milestone 1**: Setup + Foundational → Foundation ready for all stories
2. **Milestone 2**: + US1 (Article Listing) → Deploy browseable blog
3. **Milestone 3**: + US2 (Article Detail) → Deploy complete reading experience 🎯 **MVP COMPLETE**
4. **Milestone 4**: + US3 (Category Filtering) → Deploy enhanced discoverability
5. **Milestone 5**: + US4 (TOC Navigation) → Deploy full feature set
6. **Milestone 6**: + Polish → Production ready

Each milestone adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Setup + Foundational (Phases 1-2)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (Phase 3) - Article listing
   - Developer B: User Story 2 (Phase 4) - Article detail
3. **After US1 & US2 complete**:
   - Developer A: User Story 3 (Phase 5) - Filtering
   - Developer B: User Story 4 (Phase 6) - TOC enhancements
4. **Together**: Polish and validation (Phase 7)

---

## Success Criteria

### Functional Requirements

- ✅ All FR-001 through FR-034 from [`spec.md`](./spec.md) implemented
- ✅ User stories 1-4 (P1-P3) all satisfied with independent test criteria met
- ✅ Edge cases handled (no articles, no category, no thumbnail, etc.)

### Performance Targets (Constitution Mandated)

- ✅ Lighthouse Performance Score ≥ 90
- ✅ LCP ≤ 2.5s
- ✅ FCP ≤ 1
