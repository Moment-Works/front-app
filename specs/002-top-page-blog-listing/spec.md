# Feature Specification: Top Page with Blog Listing and Navigation

**Feature Name**: Top Page Blog Listing with Category Filter and Mobile Navigation  
**Created**: 2025-12-15  
**Status**: Draft

---

## Overview

The top page serves as the main entry point for the website, displaying a comprehensive blog listing with category filtering capabilities and a responsive navigation menu for site navigation. Users can browse all blog posts, filter by categories, and navigate to different sections of the site through an intuitive mobile-responsive interface.

---

## User Scenarios & Testing

### Primary User Flow

1. User lands on the top page (root `/` route)
2. User sees a full list of blog posts with titles, excerpts, and metadata
3. User sees all available categories displayed as filter options
4. User can click on any category to filter blog posts by that category
5. User can access the navigation menu to navigate to other pages
6. On mobile devices, a collapsible menu appears instead of full navigation links

### Key User Scenarios

**Scenario 1: Browsing Blog Posts**

- **Given**: User arrives at the top page
- **When**: The page loads
- **Then**: User sees initial 6 blog posts listed in reverse chronological order (newest first)
- **And**: Posts display title, excerpt, publish date, eye-catch image, and associated categories
- **And**: "View More" button appears if more than 6 posts are available

**Scenario 2: Filtering by Category**

- **Given**: User is viewing the blog listing
- **When**: User clicks on a specific category filter
- **Then**: The list updates to show only posts in that category
- **And**: The selected category is visually highlighted
- **And**: User can see how many posts belong to each category

**Scenario 3: Loading More Posts**

- **Given**: User is viewing the initial 6 blog posts
- **When**: User clicks the "View More" button
- **Then**: 6 additional posts are loaded and displayed below existing posts
- **And**: "View More" button remains visible if more posts are available
- **And**: "View More" button disappears when all posts are displayed

**Scenario 4: Resetting Category Filter**

- **Given**: User has a category filter applied
- **When**: User clicks "All Articles" or deselects the current category
- **Then**: The list resets to initial 6 blog posts (unfiltered)
- **And**: "View More" button appears if more posts are available

**Scenario 5: Using Mobile Navigation Menu**

- **Given**: User accesses the site on a mobile device
- **When**: User taps the menu trigger control
- **Then**: A navigation menu appears
- **And**: Menu displays links to Home, Blog, About, and Contact pages
- **And**: User can close the menu by tapping the control again or selecting a link

**Scenario 6: Desktop Navigation**

- **Given**: User accesses the site on a desktop device
- **When**: The page loads
- **Then**: Navigation links (Home, Blog, About, Contact) are visible in the header
- **And**: No mobile menu control is displayed

---

## Functional Requirements

### FR1: Blog Post Display

- Display initial 6 blog posts on the top page
- Show "View More" button to load additional 6 posts incrementally
- Button disappears when all posts are displayed
- During loading, show loading spinner on the "View More" button while keeping existing posts visible
- Button must be disabled during loading to prevent duplicate requests and race conditions
- Each post must show:
  - Title (clickable link to full article)
  - Excerpt or preview text
  - Publish date
  - Category badges/tags
  - Eye-catch image (if available)
- Posts must be ordered by publish date, newest first
- Use existing blog listing components from `/app/blog/page.tsx`
- Follow existing [`ArticleCard`](../../components/article-card.tsx:23) component specification (no author display)

### FR2: Category Filtering

- Display all available categories as filter buttons
- Show post count for each category (e.g., "Technology (5)")
- Include an "All Articles" option to show unfiltered results
- No category should be selected by default (unless URL contains category query parameter)
- When a category is selected:
  - Only posts in that category are displayed
  - The selected category button is visually highlighted
  - Show loading spinner on button during category filter change
  - All category filter buttons must be disabled during loading to prevent conflicting filter requests
  - URL updates with query parameter (e.g., `/?category=technology`) for shareable links
  - Browser back/forward navigation works correctly with category state
  - When category changes via browser back/forward navigation, page scrolls to top of blog listing to ensure user sees the newly filtered content
  - Post count resets to initial 6 posts (discards any previously loaded posts)
  - "View More" button appears if more posts available in that category
  - "View More" loads additional posts from the selected category only (maintains filter state)
  - If user had loaded more posts before filtering (e.g., 12 posts visible), applying a filter resets to initial 6 posts of the selected category
- When a category has no posts, display friendly empty state message (e.g., "No posts in this category yet. Check back soon!") with lucide-react FileQuestion icon (24x24)
- Category filter uses the existing [`CategoryFilter`](../../components/category-filter.tsx) component

### FR3: Mobile Navigation Menu

- Mobile menu control appears on screens with width < 1024px (mobile/tablet breakpoint)
- Applies to both mobile phones (< 768px) and tablets (768px - 1023px)
- Menu contains navigation links:
  - Home (links to `/`)
  - Blog (links to `/blog`)
  - About (links to `/about` - placeholder for future implementation)
  - Contact (links to `/contact` - placeholder for future implementation)
- Menu can be opened and closed by clicking/tapping the control
- When menu is open, clicking a link navigates to that page and automatically closes the menu
- Menu state does not persist across page navigation (always starts closed on new page load)
- Smooth open/close transition for better user experience

### FR4: Desktop Navigation

- On screens 1024px and wider, display navigation links horizontally in the header
- No mobile menu control shown on desktop
- Links remain accessible and properly styled for hover states

### FR5: Responsive Layout

- Layout adapts to different screen sizes:
  - Mobile (< 768px): Single column, collapsible menu
  - Tablet (768px - 1024px): Two-column grid, collapsible menu
  - Desktop (≥ 1024px): Three-column grid, horizontal navigation
- Category filters wrap appropriately on smaller screens
- Blog post cards stack vertically on mobile

### FR6: Integration with Existing Blog System

- Reuse existing data fetching from [`lib/microcms.ts`](../../lib/microcms.ts)
  - [`fetchAllArticles()`](../../lib/microcms.ts:32)
  - [`fetchCategoryFilters()`](../../lib/microcms.ts:100)
- Create new [`TopPageListingClient`](../../components/top-page-listing-client.tsx) component adapted from existing [`BlogListingClient`](../../components/blog-listing-client.tsx:22) pattern
  - Implements "View More" incremental loading pattern (instead of pagination)
  - Manages category filtering with URL query parameters
  - Maintains same visual design and user experience
- Reuse existing components without modification:
  - [`ArticleGrid`](../../components/article-grid.tsx:14)
  - [`CategoryFilter`](../../components/category-filter.tsx:17) (add `disabled` prop only)
  - [`ArticleCard`](../../components/article-card.tsx:23)

### FR7: Error Handling

- When microCMS API requests fail (network error, API down, timeout):
  - Display user-friendly error message indicating the issue
  - Provide "Retry" button to re-attempt the failed request
  - Maintain page structure and navigation functionality
  - Log error details for debugging purposes
- Error states should be handled for:
  - Initial blog post fetch on page load
  - Category filter data fetch
  - "View More" button clicks
- Error messages should be clear and actionable (e.g., "Unable to load blog posts. Please try again.")

### FR8: Empty States

- When a selected category contains no blog posts:
  - Display friendly message: "No posts in this category yet. Check back soon!"
  - Include lucide-react FileQuestion icon (size: 24x24, className: 'text-muted-foreground') for visual feedback
  - Maintain page structure and navigation
  - Category filter remains functional
- When initial page load returns no posts at all (edge case):
  - Display message: "No blog posts available. Check back soon!"
  - Maintain navigation functionality

### FR9: SEO & Metadata

- Top page must include comprehensive SEO meta
  - **Site Name**: "Moment Works"
  - **Page Title**: "Moment Works - Latest Articles"
  - **Meta Description**: "Explore our latest blog articles covering technology, design, and development insights. Stay updated with our newest content." (150-160 characters)
  - **Open Graph Tags**: For social media sharing
    - `og:title`: "Moment Works - Latest Articles"
    - `og:description`: "Explore our latest blog articles covering technology, design, and development insights"
    - `og:image`: Auto-generated from `app/opengraph-image.png` (1200x630px, already exists)
    - `og:type`: "website"
    - `og:url`: Canonical URL (e.g., `https://momentworks.com`)
  - **Twitter Card Tags**: For Twitter/X sharing
    - `twitter:card`: "summary_large_image"
    - `twitter:title`: "Moment Works - Latest Articles"
    - `twitter:description`: "Explore our latest blog articles covering technology, design, and development insights"
    - `twitter:image`: Auto-generated from `app/opengraph-image.png`
  - **Canonical URL**: Self-referencing canonical tag to avoid duplicate content
- When category filter is active, update meta description to reflect filtered content (e.g., "Browse Technology articles on Moment Works")
- Use Next.js App Router metadata API for implementation
- Note: Next.js automatically handles `opengraph-image.png` file in app directory

---

## Success Criteria

### Measurable Outcomes

1. **Page Load Performance**: Top page loads and displays initial 6 blog posts within 2 seconds when tested with Lighthouse using Fast 3G simulation (4x CPU slowdown, 1.6 Mbps download, 150ms RTT)
2. **Category Filter Responsiveness**: Filtering updates the blog list within 200ms of user interaction
3. **View More Performance**: Loading additional 6 posts takes less than 500ms
4. **Mobile Menu Usability**: Mobile navigation menu opens/closes within 300ms with smooth transition using ease-in-out easing (cubic-bezier(0.4, 0, 0.2, 1))
5. **Cross-Device Compatibility**: Layout renders correctly on mobile (320px+), tablet (768px+), and desktop (1024px+) screens
6. **Navigation Accessibility**: All navigation links and buttons are keyboard-accessible and screen-reader friendly

### Qualitative Outcomes

- Users can quickly browse and filter blog content without confusion
- Category filtering provides immediate visual feedback and resets to initial 6 posts
- "View More" button provides clear affordance for loading additional content
- Mobile navigation feels intuitive and doesn't obstruct content
- Design maintains visual consistency with existing `/blog` page

---

## Key Entities

### BlogPost

- **id**: Unique identifier
- **title**: Article title
- **slug**: URL-friendly identifier
- **excerpt**: Short preview text
- **publishedAt**: Publication date
- **categoryNames**: Array of category identifiers
- **author**: Author information (optional)

### Category

- **id**: Category identifier (matches categoryNames in BlogPost)
- **name**: Display name
- **count**: Number of posts in this category

### NavigationLink

- **label**: Link text (Home, Blog, About, Contact)
- **href**: Destination URL
- **isExternal**: Whether link opens in new tab (default: false)

---

## Assumptions

1. **Existing Blog Infrastructure**: The project already has a working blog system at `/blog` with microCMS integration
2. **Component Reusability**: Existing blog components ([`ArticleGrid`](../../components/article-grid.tsx), [`CategoryFilter`](../../components/category-filter.tsx), [`ArticleCard`](../../components/article-card.tsx)) can be reused; new [`TopPageListingClient`](../../components/top-page-listing-client.tsx) will be created following the same patterns as existing [`BlogListingClient`](../../components/blog-listing-client.tsx)
3. **Navigation Placeholders**: About and Contact pages will be implemented later; links can point to placeholder routes
4. **Styling Framework**: Project uses Tailwind CSS and shadcn/ui components (based on existing [`components/ui/`](../../components/ui/) directory)
5. **Responsive Breakpoints**: Mobile menu breakpoint at 1024px (lg:); navigation switches to horizontal at ≥1024px
6. **Default Category State**: No category filter is pre-selected, showing initial 6 articles
7. **View More Pattern**: Initial load shows 6 posts, each "View More" click loads 6 additional posts
8. **Mobile-First Design**: Layout designed mobile-first, progressively enhanced for larger screens

---

## Out of Scope

- Implementation of About and Contact pages (future features)
- Search functionality for blog posts
- Advanced filtering (multiple categories, date ranges, tags)
- User authentication or personalization
- Blog post creation/editing interface
- Social sharing features
- Comments or user feedback system
- Dark mode toggle (unless already implemented)
- Internationalization/multi-language support

---

## Dependencies

### Internal Dependencies

- Existing blog listing functionality at [`/app/blog/page.tsx`](../../app/blog/page.tsx)
- microCMS API client and data fetching functions ([`lib/microcms.ts`](../../lib/microcms.ts))
- UI components ([`components/ui/button.tsx`](../../components/ui/button.tsx), [`components/ui/card.tsx`](../../components/ui/card.tsx))
- Type definitions ([`types/article.ts`](../../types/article.ts), [`types/filters.ts`](../../types/filters.ts))

### External Dependencies

- Next.js 16.x (App Router)
- React 19.x
- Tailwind CSS 4.x
- lucide-react (for menu icons)
- microCMS API (content source)

---

## Technical Considerations

### Component Architecture

```
app/page.tsx (Server Component)
  ├─ MobileNavigation Component (Client Component)
  │   └─ Sheet (shadcn/ui - collapsible menu for < 1024px)
  └─ TopPageListingClient (Client Component - new, based on BlogListingClient pattern)
      ├─ CategoryFilter (Client Component - existing, add disabled prop)
      ├─ ArticleGrid (Client Component - existing, no changes)
      │   └─ ArticleCard (Client Component - existing, no changes)
      └─ ViewMoreButton (Client Component - new)
```

### State Management

- Navigation menu open/closed state managed by shadcn/ui Sheet component
- Category filter state managed in new [`TopPageListingClient`](../../components/top-page-listing-client.tsx) component
- Post display count state managed in [`TopPageListingClient`](../../components/top-page-listing-client.tsx) (initial: 6, increment: 6)
- URL query parameters used for shareable category filter state
- No global state management needed

### Responsive Design Strategy

- Use Tailwind CSS responsive utilities (`md:`, `lg:` prefixes)
- Mobile menu control hidden on desktop using `lg:hidden`
- Desktop navigation links hidden on mobile/tablet using `hidden lg:flex`
- Grid columns adjust based on breakpoint: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Clarifications

### Session 2025-12-15

- Q: The spec mentions that blog posts display "Author information (if available)" but doesn't specify the fallback behavior when author data is missing. How should the UI handle missing author information? → A: use blog card component that already implemented. so follow existing compnent specification.
- Q: When a user clicks on a category filter, should the URL update to reflect the selected category (e.g., `/?category=technology`) to allow direct linking and browser back/forward navigation? → A: Yes, update URL with query parameter for shareable links
- Q: The mobile navigation menu breakpoint is specified as 768px, but tablet behavior (768px-1024px) is ambiguous. Should tablets display the mobile collapsible menu or horizontal desktop navigation? → A: Tablets use mobile collapsible menu (breakpoint at 1024px)
- Q: Should the top page (`/`) include pagination for the blog listing, or should it display all blog posts without pagination? → A: Display limited initial posts (e.g., 6) with "View More" button
- Q: When the user clicks "View More", how many additional posts should be loaded each time? → A: Load 6 more posts (same as initial)
- Q: Category Filter Behavior: When filtering by category and clicking "View More", what should happen? → A: Load 6 more posts from the SELECTED category only (maintain filter)
- Q: Error Handling: How should the application handle scenarios when the microCMS API request fails (network error, API down, timeout)? → A: Display error message with retry button
- Q: Loading State: How should the UI indicate that content is being loaded when the user clicks "View More" or changes category filters? → A: Show loading spinner on button
- Q: Empty State: When a selected category has no blog posts, what should be displayed to the user? → A: Show friendly message with illustration
- Q: SEO & Meta Should the top page have specific meta tags for SEO (title, description, Open Graph tags)? → A: Yes, include SEO metadata
- Q: When a user has already clicked "View More" to load 12 posts (initial 6 + 6 more), then applies a category filter, how should the displayed posts be handled? → A: Reset to initial 6 posts of the selected category
- Q: Should the mobile navigation menu automatically close when the user navigates to a new page (e.g., clicks "Home" from the /blog page), or should it remain open for the new page load? → A: Close menu on navigation
- Q: When the "View More" button is loading additional posts, should the button remain clickable (allowing multiple simultaneous requests) or be disabled until the current load completes? → A: Disable button during load
- Q: When a category filter button is clicked and is loading the filtered posts, should other category filter buttons remain clickable or be disabled during the loading state? → A: Disable all category buttons during load
- Q: When browser back/forward navigation changes the category filter (via URL query parameter), should the page scroll to the top of the blog listing or maintain the current scroll position? → A: Scroll to top of blog listing

## Open Questions

*None - all clarifications have been addressed through user feedback.*

---

## Notes

- This specification focuses on **what** the feature should do and **why**, not **how** to implement it
- The existing blog infrastructure at `/blog` provides a solid foundation for reuse
- Mobile-first approach ensures good user experience across all devices
- Navigation menu items (About, Contact) are placeholders for future development
- Design should maintain consistency with existing blog page styling
