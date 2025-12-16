# Tasks: Top Page with Blog Listing and Navigation

**Input**: Design documents from `/specs/002-top-page-blog-listing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in this feature specification, so no test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router structure: `app/`, `components/`, `lib/`, `types/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared configuration

- [x] T001 Create NavigationLink type definition in types/navigation.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that MUST be complete before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create MobileNavigation component with responsive breakpoints in components/mobile-navigation.tsx
- [x] T003 [P] Create ViewMoreButton component with loading states in components/view-more-button.tsx
- [x] T004 [P] Add disabled prop to CategoryFilter component in components/category-filter.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse Blog Posts (Priority: P1) 🎯 MVP

**Goal**: Display initial 6 blog posts with "View More" incremental loading

**User Story**: As a user, I want to see blog posts on the top page with the ability to view more incrementally

**Independent Test**: Visit `/` and verify:

- Initial 6 posts display
- Click "View More" loads 6 additional posts
- Button disappears when all posts are displayed

### Implementation for User Story 1

- [x] T005 [US1] Create TopPageListingClient component with View More state management in components/top-page-listing-client.tsx
- [x] T006 [US1] Implement app/page.tsx Server Component with data fetching and SEO metadata
- [x] T007 [US1] Integrate MobileNavigation into top page layout in app/page.tsx
- [x] T008 [US1] Add error handling (API failures, network timeouts, retry button) and empty state messages in app/page.tsx

**Checkpoint**: User Story 1 complete - top page displays blog posts with incremental loading

---

## Phase 4: User Story 2 - Category Filtering (Priority: P1) 🎯 MVP

**Goal**: Filter blog posts by category with URL state synchronization

**User Story**: As a user, I want to filter blog posts by category and share filtered views via URL

**Independent Test**: Visit `/` and verify:

- Click category filter updates URL with `?category=<id>`
- Posts filter correctly by category
- Browser back/forward navigation works
- Filter resets visible count to 6 posts

### Implementation for User Story 2

- [x] T009 [US2] Implement category filtering logic with URL query parameters in components/top-page-listing-client.tsx
- [x] T010 [US2] Add browser navigation sync (back/forward) with scroll behavior in components/top-page-listing-client.tsx
- [x] T011 [US2] Implement category filter change resets visible count to 6 in components/top-page-listing-client.tsx
- [x] T012 [US2] Add disabled state for category buttons during loading in components/top-page-listing-client.tsx

**Checkpoint**: User Story 2 complete - category filtering works with shareable URLs and browser navigation

---

## Phase 5: User Story 3 - Mobile Navigation Menu (Priority: P2)

**Goal**: Provide responsive navigation for mobile and tablet devices

**User Story**: As a mobile user, I want to access site navigation through a collapsible menu

**Independent Test**: Resize browser to mobile width (< 1024px) and verify:

- Mobile menu button appears
- Menu opens with navigation links
- Menu closes on link click or outside click
- Desktop navigation appears at ≥ 1024px

### Implementation for User Story 3

- [x] T013 [US3] Install shadcn/ui Sheet component if not already present with `npx shadcn@latest add sheet`
- [x] T014 [US3] Verify mobile menu behavior below 1024px breakpoint in components/mobile-navigation.tsx
- [x] T015 [US3] Verify desktop navigation behavior at 1024px and above in components/mobile-navigation.tsx

**Checkpoint**: User Story 3 complete - responsive navigation works across all device sizes

---

## Phase 6: User Story 4 - Placeholder Pages (Priority: P3)

**Goal**: Create placeholder pages for About and Contact navigation links

**User Story**: As a user, I want to navigate to About and Contact pages (placeholders for future content)

**Independent Test**: Click About and Contact links and verify:

- Pages load without errors
- Consistent navigation present
- Clear "coming soon" messaging

### Implementation for User Story 4

- [x] T016 [P] [US4] Create About placeholder page in app/about/page.tsx
- [x] T017 [P] [US4] Create Contact placeholder page in app/contact/page.tsx

**Checkpoint**: User Story 4 complete - all navigation links functional with placeholder content

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations and validation with measurable acceptance criteria

- [x] T018 [P] Run TypeScript type checking with `npx tsc --noEmit` - Accept: 0 errors ✅
- [x] T019 [P] Run ESLint with `npm run lint` - Accept: 0 errors (3 pre-existing warnings in blog-listing-client.tsx) ✅
- [ ] T020 Verify all quickstart.md test scenarios pass manually - Accept: All 11 functional tests pass
- [ ] T021 Test responsive layout at mobile (< 768px), tablet (768px-1023px), and desktop (≥ 1024px) breakpoints - Accept: Correct column count (1/2/3) and menu behavior at each breakpoint
- [ ] T022 Verify SEO metadata renders correctly in page source - Accept: All OG tags, Twitter tags, and canonical URL present
- [ ] T023 Test browser back/forward navigation with category filters - Accept: Filter state syncs correctly, page scrolls to article grid
- [ ] T024 Verify View More button loading states and disabled behavior - Accept: Button disables during load, shows spinner, re-enables after load
- [ ] T025 Test empty state when category has no posts - Accept: Friendly message displays, navigation remains functional
- [ ] T026 Verify keyboard accessibility for all interactive elements - Accept: Tab navigation works, Enter/Space activate buttons, Escape closes menu
- [ ] T027 Run performance audit with Lighthouse - Accept: Performance score ≥ 90, LCP ≤ 2.5s, FCP ≤ 1.8s, CLS ≤ 0.1, FID ≤ 100ms

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Extends US1 but US1 must be complete first
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent of all other stories

### Within Each User Story

- Core component implementation first
- Integration with existing components second
- State management and URL synchronization last
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: Single task, no parallelism
- **Phase 2**: T002, T003, T004 can all run in parallel (different files)
- **Phase 4**: T016 and T017 can run in parallel (different files)
- **Phase 7**: T018 and T019 can run in parallel (different commands)

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational components together:
Task: "Create MobileNavigation component with responsive breakpoints in components/mobile-navigation.tsx"
Task: "Create ViewMoreButton component with loading states in components/view-more-button.tsx"
Task: "Add disabled prop to CategoryFilter component in components/category-filter.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T004) - CRITICAL
3. Complete Phase 3: User Story 1 (T005-T008)
4. Complete Phase 4: User Story 2 (T009-T012)
5. **STOP and VALIDATE**: Test top page with blog listing and filtering
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP blog listing works
3. Add User Story 2 → Test independently → Category filtering works
4. Add User Story 3 → Test independently → Mobile navigation works
5. Add User Story 4 → Test independently → All navigation functional
6. Polish phase → Production ready

### Sequential Strategy (Recommended)

With a single developer:

1. Complete Setup (T001)
2. Complete Foundational (T002-T004) - leverage parallelism with multiple terminals
3. Complete User Story 1 (T005-T008)
4. Complete User Story 2 (T009-T012)
5. Complete User Story 3 (T013-T015)
6. Complete User Story 4 (T016-T017) - leverage parallelism
7. Complete Polish (T018-T027) - leverage parallelism where possible

---

## Task Summary

**Total Tasks**: 27
**By Phase**:

- Setup: 1 task
- Foundational: 3 tasks (all parallel)
- User Story 1: 4 tasks
- User Story 2: 4 tasks
- User Story 3: 3 tasks
- User Story 4: 2 tasks (parallel)
- Polish: 10 tasks (some parallel)

**Parallel Opportunities**: 5 tasks can run in parallel across foundational and placeholder pages

**MVP Scope**: Phases 1-4 (User Stories 1 & 2) = 12 tasks
**Full Feature**: All phases = 27 tasks

---

## Notes

- All tasks follow strict checklist format with [ID] [P?] [Story] Description
- File paths are explicit and relative to project root
- Tasks are organized by user story for independent implementation
- No tests included as not requested in specification
- View More pattern replaces pagination (from existing blog listing)
- Category filtering maintains filter state through URL query parameters
- Mobile navigation uses shadcn/ui Sheet component (constitution compliant)
- TypeScript strict mode enforced throughout (constitution requirement)
- Performance targets defined: page load < 2s, filter < 200ms, View More < 500ms
