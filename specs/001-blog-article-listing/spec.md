# Feature Specification: Blog Article Listing and Detail Pages

**Feature Branch**: `001-blog-article-listing`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "ブログ記事の一覧表示機能を実装。記事一覧ページ（タイトル、サムネイル、公開日、カテゴリ表示、ページネーション、カテゴリ絞り込み）と記事詳細ページ（タイトル、本文、サムネイル、公開日、カテゴリ、HTML表示、目次自動生成、前後記事リンク）"

**Note**: Original request mentioned "tags" and "infinite scroll". Implementation uses "categories" (multiple categories per article) and client-side pagination for better SSG performance.

## User Scenarios & Testing

### User Story 1 - Basic Article List Viewing (Priority: P1)

Users can view a paginated list of blog articles with essential information to decide which articles to read.

**Why this priority**: This is the core MVP functionality. Without the ability to view articles, no other features matter. This delivers immediate value by making content accessible.

**Independent Test**: Navigate to the blog listing page and verify that articles are displayed with title, thumbnail, publication date, and category. Can be tested independently by creating a few sample articles and confirming they appear in the list.

**Acceptance Scenarios**:

1. **Given** a user visits the blog listing page, **When** the page loads, **Then** they see a list of published articles sorted by publication date (newest first)
2. **Given** multiple articles exist, **When** viewing the list, **Then** each article displays its title, thumbnail image, publication date, and associated categories
3. **Given** an article has no thumbnail, **When** displayed in the list, **Then** a default placeholder image is shown
4. **Given** more than 10 articles exist, **When** the user navigates to page 2, **Then** the next batch of articles is displayed (client-side pagination)

---

### User Story 2 - Article Detail Viewing (Priority: P1)

Users can read full article content with proper formatting and navigation context.

**Why this priority**: Reading articles is the primary user goal. This story is equally critical as the listing and can be developed/tested independently.

**Independent Test**: Create a sample article with HTML content, navigate to its detail page, and verify proper rendering with table of contents, formatted content, and metadata display.

**Acceptance Scenarios**:

1. **Given** a user clicks an article from the list, **When** the detail page loads, **Then** they see the full article with title, thumbnail, publication date, categories, and formatted content
2. **Given** article content is in HTML format (richEditorV2), **When** displayed, **Then** it renders with proper formatting (headings, lists, links, code blocks, etc.)
3. **Given** an article has multiple headings, **When** the detail page loads, **Then** a table of contents is automatically generated from the headings
4. **Given** a user is viewing an article, **When** they scroll through the content, **Then** the current section is highlighted in the table of contents
5. **Given** other articles exist, **When** viewing an article detail, **Then** links to the previous and next articles (by publication date) are displayed at the bottom

---

### User Story 3 - Category-based Filtering (Priority: P2)

Users can filter articles by selecting specific categories to find related content.

**Why this priority**: Enhances discoverability and user experience but the blog is still functional without it. This can be added after the core viewing functionality is stable.

**Independent Test**: Create articles with various categories, click on a category filter button, and verify that only articles with that category are displayed. Clear the filter and verify all articles reappear.

**Acceptance Scenarios**:

1. **Given** a user is on the blog listing page, **When** they click on a category filter, **Then** the list filters to show only articles with that category (matching any of the article's categories)
2. **Given** a category filter is active, **When** displayed, **Then** the active category is visually highlighted and a "clear filter" option is available
3. **Given** a user selects a different category, **When** filtering, **Then** the list updates to show articles containing the newly selected category
4. **Given** a category filter is active, **When** the user clears the filter, **Then** all articles are displayed again
5. **Given** a user applies a category filter, **When** paginating, **Then** pagination continues to show only filtered articles

---

### User Story 4 - Table of Contents Navigation (Priority: P3)

Users can quickly navigate to specific sections within long articles using an interactive table of contents.

**Why this priority**: Improves UX for longer articles but is not critical for MVP. The article content is still readable without this feature.

**Independent Test**: Create an article with multiple heading levels, verify the TOC is generated, click on TOC items, and confirm smooth scrolling to the target section.

**Acceptance Scenarios**:

1. **Given** a user views an article with headings, **When** they click a TOC item, **Then** the page smoothly scrolls to that section
2. **Given** the TOC is clicked, **When** navigating, **Then** the browser URL updates with the section anchor for sharing
3. **Given** a user scrolls manually, **When** passing section boundaries, **Then** the TOC highlights the current section being viewed

---

### Edge Cases

- What happens when an article has no categories? Display without category badges
- What happens when there are no articles to display? Show an empty state message
- What happens when user reaches the last page of articles? Disable "next" button and show "End of articles" message
- How does the system handle articles with extremely long titles? Truncate with ellipsis after 2 lines
- What happens when HTML content contains malicious code? microCMS richEditorV2 sanitizes content (trusted single-author environment)
- How does the system handle images that fail to load? Display broken image placeholder with retry option
- What happens when a user directly accesses a non-existent article URL? Show 404 page with link back to blog listing
- How does the system handle articles with no content? Display minimum required fields and indicate draft status
- What happens when TOC has deeply nested headings (5+ levels)? Limit TOC display to 3 levels maximum
- How does the system handle very long article URLs? Use slug-based URLs with maximum 100 character limit

## Requirements

### Functional Requirements

#### Article Listing Page

- **FR-001**: System MUST display a list of published blog articles ordered by publication date (newest first)
- **FR-002**: System MUST display for each article: title, thumbnail image, publication date, and categories
- **FR-003**: System MUST implement client-side pagination displaying 10 articles per page
- **FR-004**: System MUST provide pagination controls (page numbers, previous/next buttons)
- **FR-005**: System MUST display a default placeholder image for articles without thumbnails
- **FR-006**: System MUST implement category filtering allowing users to filter articles by one or more categories
- **FR-007**: System MUST visually indicate active category filter with clear removal option
- **FR-008**: System MUST maintain filter state during pagination navigation
- **FR-009**: System MUST display an empty state message when no articles match current filters
- **FR-010**: System MUST make article cards clickable, navigating to the detail page

#### Article Detail Page

- **FR-011**: System MUST display full article content including title, thumbnail, publication date, categories, and body
- **FR-012**: System MUST render richEditorV2 HTML content with proper formatting
- **FR-013**: System relies on microCMS richEditorV2 sanitization (trusted single-author environment)
- **FR-014**: System MUST auto-generate a table of contents from article headings (H1-H3)
- **FR-015**: System MUST implement smooth scrolling when TOC items are clicked
- **FR-016**: System MUST highlight the current section in the TOC based on scroll position
- **FR-017**: System MUST update the browser URL with section anchors when navigating via TOC
- **FR-018**: System MUST display links to previous and next articles (by publication date)
- **FR-019**: System MUST handle articles without previous or next articles gracefully
- **FR-020**: System MUST support richEditorV2 HTML features: headings, bold, italic, links, images, code blocks, lists, blockquotes, tables

#### Data Integration

- **FR-021**: System MUST fetch article data from microCMS API at build time using SSG
- **FR-022**: System MUST generate static pages for all published articles during build
- **FR-023**: System MUST only display articles with "published" status (no draft articles)
- **FR-024**: System MUST handle API errors during build process with appropriate fallbacks

#### Performance & UX

- **FR-025**: System MUST load initial article list within 2 seconds (served as static HTML)
- **FR-026**: System MUST implement lazy loading for article thumbnail images
- **FR-027**: System MUST provide visual feedback during client-side pagination
- **FR-028**: System MUST implement client-side pagination (not infinite scroll) since all data is available at build time
- **FR-029**: System MUST be responsive and functional on mobile, tablet, and desktop devices
- **FR-030**: Table of contents MUST be sticky/fixed positioned while scrolling the article

#### Error Handling

- **FR-031**: System MUST handle build-time API failures gracefully (log errors, use cached data if available)
- **FR-032**: System MUST show 404 page for non-existent article URLs
- **FR-033**: System MUST handle missing or corrupted article data gracefully during build
- **FR-034**: System MUST provide fallback content for failed image loads

### Key Entities

- **BlogArticle**: Represents a blog post fetched from microCMS at build time with the following attributes:
  - Unique identifier (ID from microCMS)
  - Slug (uses microCMS ID for URL routing and SSG path generation)
  - Title (required, 1-200 characters)
  - Body content (required, HTML format from richEditorV2)
  - Thumbnail image URL (optional, from microCMS media - called "eyecatch")
  - Publication date (required, ISO 8601 format; falls back to createdAt if not set)
  - Categories (array of category objects, 0 or more per article)
  - Status (published only - drafts filtered at build time)
  - Author information (if provided by microCMS)
  - Created/updated timestamps from microCMS

- **Category**: Represents a categorization label with:
  - Category ID (unique identifier from microCMS)
  - Category name (unique, 1-50 characters)
  - Article count (derived at build time)

- **TableOfContents**: Derived structure from article content with:
  - Heading text
  - Heading level (H1, H2, H3)
  - Anchor ID for navigation
  - Nested structure reflecting document hierarchy

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully view a list of articles and navigate to article details within 3 clicks from the homepage
- **SC-002**: Article list page loads and displays the first 10 articles within 2 seconds on a standard broadband connection
- **SC-003**: Page navigation transitions occur instantly (client-side only, no server requests)
- **SC-004**: HTML content renders correctly with proper formatting from richEditorV2
- **SC-005**: Table of contents is automatically generated for 100% of articles containing 2 or more headings
- **SC-006**: Category filtering returns filtered results within 500ms (client-side filtering)
- **SC-007**: Table of contents remains sticky/visible while scrolling article content
- **SC-008**: All pages are responsive and fully functional on mobile devices (375px width minimum)
- **SC-009**: Previous/next article navigation is available on 100% of article detail pages (except first/last)
- **SC-010**: Static pages are generated successfully for 1000+ articles at build time
- **SC-011**: All article pages are fully pre-rendered with no client-side data fetching required
- **SC-012**: Content security handled by microCMS richEditorV2 sanitization (trusted single-author environment)

### User Experience Goals

- **UX-001**: Users can easily discover new content through browsing and category filtering
- **UX-002**: Long-form article reading is comfortable with proper typography and spacing
- **UX-003**: Navigation between related articles is intuitive and seamless
- **UX-004**: Mobile reading experience is optimized for small screens
- **UX-005**: Loading states provide clear feedback, never leaving users uncertain

## Technical Considerations

### Data Source: microCMS with Static Site Generation (SSG)

The implementation will use **microCMS as the headless CMS** with **Next.js SSG** for optimal performance.

**Build-Time Architecture:**

- Fetch all published articles from microCMS API during `next build`
- Generate static HTML pages for article listing (with all article data embedded)
- Generate individual static pages for each article detail using `generateStaticParams`
- Pre-render all content at build time for instant page loads

**Benefits of SSG Approach:**

- Near-instant page loads (static HTML served from CDN)
- No runtime API calls to microCMS (better reliability)
- Improved SEO (fully rendered HTML)
- Lower microCMS API usage costs
- Better performance and user experience

**Pagination Strategy:**

- All article data fetched at build time and embedded in listing page
- Pagination handled entirely client-side (no additional network requests)
- Category filtering also client-side using pre-fetched data
- Instant page transitions and filtering

**Architecture Decision - Pagination over Infinite Scroll:**
The original request mentioned infinite scroll, but client-side pagination was chosen instead because:

- SSG architecture pre-fetches all data at build time
- Pagination provides better UX control (users can jump to specific pages)
- Instant page transitions without loading states
- Better accessibility and navigation clarity
- Simpler state management with pre-fetched data

**Content Updates:**

- New articles or updates require rebuilding the site
- Consider implementing webhook-triggered builds from microCMS for automated updates
- ISR (Incremental Static Regeneration) can be added later if needed

**Required Setup:**

- microCMS API endpoint URL (environment variable: `MICROCMS_API_ENDPOINT`)
- API key for build-time authentication (environment variable: `MICROCMS_API_KEY`)
- Content model definition matching BlogArticle entity

**Note:** Please provide the microCMS API response types/schema for accurate integration.

### HTML Content Processing

- Content is stored as **HTML** from microCMS richEditorV2 editor
- No Markdown processing libraries needed
- HTML parsing library for TOC generation:
  - `node-html-parser` for extracting headings and injecting anchor IDs
- Content sanitization:
  - microCMS richEditorV2 provides built-in HTML sanitization
  - Trusted single-author environment (only you create content)
  - No additional XSS protection needed beyond microCMS defaults

### SEO Considerations

- Generate proper meta tags for each article
- Implement Open Graph tags for social sharing
- Create XML sitemap including all published articles
- Use semantic HTML structure
- Implement proper heading hierarchy

### Performance Optimization

- Implement Next.js Image component for optimized thumbnails
- Use Static Site Generation (SSG) for all article pages
- Leverage CDN for instant global delivery of static assets
- Minimize JavaScript bundle size for pagination/filtering logic
- Implement lazy loading for images
- Pre-load critical resources
- Optimize for Core Web Vitals (LCP, FID, CLS)

## Resolved Design Decisions

1. ✅ **Article Status**: Only published articles (drafts filtered at build time from microCMS)
2. ✅ **Content Format**: richEditorV2 HTML (not Markdown) to match existing microCMS schema
3. ✅ **Categorization**: Multiple categories per article (relationList) per microCMS schema
4. ✅ **Table of Contents**: Sticky/fixed positioning while scrolling, extracted from HTML headings
5. ✅ **Data Source**: microCMS headless CMS with SSG approach
6. ✅ **Pagination Strategy**: Client-side pagination (changed from infinite scroll) for optimal SSG performance
7. ✅ **Search Functionality**: Not in this branch (future enhancement)

## Remaining Open Questions

### Resolved Questions

1. ✅ **Category filtering**: Uses category ID matching (case sensitivity N/A - users select from UI)
2. ✅ **Articles without publication date**: Use `createdAt` as fallback (already handled in implementation)
3. ✅ **Analytics**: Out of scope for this feature (future enhancement)
4. ✅ **Multiple authors**: Not supported in v1 (single author only)
5. ✅ **microCMS schema**: Confirmed via schema files in `schema/` directory
6. ✅ **ISR**: Pure SSG for v1 (rebuild required for content updates), ISR can be added later if needed
7. ✅ **Articles per page**: Confirmed 10 articles per page

## Next Steps

1. ✅ Confirm data source approach: microCMS with SSG (build-time fetching)
2. ✅ Select content processing: richEditorV2 HTML with node-html-parser for TOC
3. ✅ Confirm pagination strategy: Client-side with pre-fetched data
4. ✅ Obtain microCMS API schema and response types for BlogArticle (in `schema/` directory)
5. Set up environment variables for microCMS API access
6. Design component hierarchy for listing and detail pages
7. Implement Next.js SSG functions (`generateStaticParams`, data fetching at build time)
8. Create microCMS API client for build-time data fetching
9. Implement P1 user stories first (basic listing and detail viewing)
10. Add P2 features (client-side category filtering) after core functionality is stable
11. Enhance with P3 features (sticky TOC, smooth scrolling) as time permits
