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
- **Then**: User sees all blog posts listed in reverse chronological order (newest first)
- **And**: Posts display title, excerpt, publish date, and associated categories

**Scenario 2: Filtering by Category**

- **Given**: User is viewing the blog listing
- **When**: User clicks on a specific category filter
- **Then**: The list updates to show only posts in that category
- **And**: The selected category is visually highlighted
- **And**: User can see how many posts belong to each category

**Scenario 3: Resetting Category Filter**

- **Given**: User has a category filter applied
- **When**: User clicks "All Articles" or deselects the current category
- **Then**: The full list of blog posts is displayed again

**Scenario 4: Using Mobile Navigation Menu**

- **Given**: User accesses the site on a mobile device
- **When**: User taps the menu trigger control
- **Then**: A navigation menu appears
- **And**: Menu displays links to Home, Blog, About, and Contact pages
- **And**: User can close the menu by tapping the control again or selecting a link

**Scenario 5: Desktop Navigation**

- **Given**: User accesses the site on a desktop device
- **When**: The page loads
- **Then**: Navigation links (Home, Blog, About, Contact) are visible in the header
- **And**: No mobile menu control is displayed

---

## Functional Requirements

### FR1: Blog Post Display

- Display all blog posts on the top page
- Each post must show:
  - Title (clickable link to full article)
  - Excerpt or preview text
  - Publish date
  - Category badges/tags
  - Author information (if available)
- Posts must be ordered by publish date, newest first
- Use existing blog listing components from `/app/blog/page.tsx`

### FR2: Category Filtering

- Display all available categories as filter buttons
- Show post count for each category (e.g., "Technology (5)")
- Include an "All Articles" option to show unfiltered results
- No category should be selected by default
- When a category is selected:
  - Only posts in that category are displayed
  - The selected category button is visually highlighted
  - Pagination resets to page 1
- Category filter uses the existing [`CategoryFilter`](components/category-filter.tsx) component

### FR3: Mobile Navigation Menu

- Mobile menu control appears on screens below 768px width (mobile/tablet breakpoint)
- Menu contains navigation links:
  - Home (links to `/`)
  - Blog (links to `/blog`)
  - About (links to `/about` - placeholder for future implementation)
  - Contact (links to `/contact` - placeholder for future implementation)
- Menu can be opened and closed by clicking/tapping the control
- When menu is open, clicking a link navigates to that page and closes the menu
- Smooth open/close transition for better user experience

### FR4: Desktop Navigation

- On screens 768px and wider, display navigation links horizontally in the header
- No mobile menu control shown on desktop
- Links remain accessible and properly styled for hover states

### FR5: Responsive Layout

- Layout adapts to different screen sizes:
  - Mobile (< 768px): Single column, collapsible menu
  - Tablet (768px - 1024px): Two-column grid, collapsible menu or horizontal nav
  - Desktop (> 1024px): Three-column grid, horizontal navigation
- Category filters wrap appropriately on smaller screens
- Blog post cards stack vertically on mobile

### FR6: Integration with Existing Blog System

- Reuse existing data fetching from [`lib/microcms.ts`](lib/microcms.ts)
  - [`fetchAllArticles()`](lib/microcms.ts:32)
  - [`fetchCategoryFilters()`](lib/microcms.ts:100)
- Reuse existing components:
  - [`BlogListingClient`](components/blog-listing-client.tsx:22)
  - [`ArticleGrid`](components/article-grid.tsx:14)
  - [`CategoryFilter`](components/category-filter.tsx:17)
  - [`Pagination`](components/pagination.tsx) (if exists)

---

## Success Criteria

### Measurable Outcomes

1. **Page Load Performance**: Top page loads and displays blog posts within 2 seconds on standard broadband connection
2. **Category Filter Responsiveness**: Filtering updates the blog list within 200ms of user interaction
3. **Mobile Menu Usability**: Mobile navigation menu opens/closes within 300ms with smooth transition
4. **Cross-Device Compatibility**: Layout renders correctly on mobile (320px+), tablet (768px+), and desktop (1024px+) screens
5. **Navigation Accessibility**: All navigation links are keyboard-accessible and screen-reader friendly

### Qualitative Outcomes

- Users can quickly browse and filter blog content without confusion
- Category filtering provides immediate visual feedback
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
2. **Component Reusability**: Existing blog components ([`BlogListingClient`](components/blog-listing-client.tsx), [`ArticleGrid`](components/article-grid.tsx), [`CategoryFilter`](components/category-filter.tsx)) can be reused without modification
3. **Navigation Placeholders**: About and Contact pages will be implemented later; links can point to placeholder routes
4. **Styling Framework**: Project uses Tailwind CSS and shadcn/ui components (based on existing [`components/ui/`](components/ui/) directory)
5. **Responsive Breakpoints**: Standard Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
6. **Default Category State**: No category filter is pre-selected, showing all articles initially
7. **Pagination**: If existing pagination component exists, it will be reused; otherwise, will be implemented as needed
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

- Existing blog listing functionality at [`/app/blog/page.tsx`](app/blog/page.tsx)
- microCMS API client and data fetching functions ([`lib/microcms.ts`](lib/microcms.ts))
- UI components ([`components/ui/button.tsx`](components/ui/button.tsx), [`components/ui/card.tsx`](components/ui/card.tsx))
- Type definitions ([`types/article.ts`](types/article.ts), [`types/filters.ts`](types/filters.ts))

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
  ├─ Header/Navigation Component (Client Component)
  │   └─ MobileMenu Component (Client Component for mobile)
  └─ BlogListingClient (Client Component - existing)
      ├─ CategoryFilter (Client Component - existing)
      ├─ ArticleGrid (Client Component - existing)
      │   └─ ArticleCard (existing)
      └─ Pagination (Client Component - existing)
```

### State Management

- Navigation menu open/closed state managed in client component
- Category filter state managed in existing [`BlogListingClient`](components/blog-listing-client.tsx:26-29)
- No global state management needed

### Responsive Design Strategy

- Use Tailwind CSS responsive utilities (`md:`, `lg:` prefixes)
- Mobile menu control hidden on desktop using `md:hidden`
- Desktop navigation links hidden on mobile using `hidden md:flex`
- Grid columns adjust based on breakpoint: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Open Questions

*None - all clarifications have been addressed through user feedback.*

---

## Notes

- This specification focuses on **what** the feature should do and **why**, not **how** to implement it
- The existing blog infrastructure at `/blog` provides a solid foundation for reuse
- Mobile-first approach ensures good user experience across all devices
- Navigation menu items (About, Contact) are placeholders for future development
- Design should maintain consistency with existing blog page styling
