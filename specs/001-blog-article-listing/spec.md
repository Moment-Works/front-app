# Feature Specification: Blog Article Listing and Detail Pages

**Feature Branch**: `001-blog-article-listing`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "ブログ記事の一覧表示機能を実装。記事一覧ページ（タイトル、サムネイル、公開日、タグ表示、インフィニットスクロール、タグ絞り込み）と記事詳細ページ（タイトル、本文、サムネイル、公開日、タグ、Markdown表示、目次自動生成、前後記事リンク）"

## User Scenarios & Testing

### User Story 1 - Basic Article List Viewing (Priority: P1)

Users can view a paginated list of blog articles with essential information to decide which articles to read.

**Why this priority**: This is the core MVP functionality. Without the ability to view articles, no other features matter. This delivers immediate value by making content accessible.

**Independent Test**: Navigate to the blog listing page and verify that articles are displayed with title, thumbnail, publication date, and tags. Can be tested independently by creating a few sample articles and confirming they appear in the list.

**Acceptance Scenarios**:

1. **Given** a user visits the blog listing page, **When** the page loads, **Then** they see a list of published articles sorted by publication date (newest first)
2. **Given** multiple articles exist, **When** viewing the list, **Then** each article displays its title, thumbnail image, publication date, and associated tags
3. **Given** an article has no thumbnail, **When** displayed in the list, **Then** a default placeholder image is shown
4. **Given** more than 10 articles exist, **When** the user navigates to page 2, **Then** the next batch of articles is displayed (client-side pagination)

---

### User Story 2 - Article Detail Viewing (Priority: P1)

Users can read full article content with proper formatting and navigation context.

**Why this priority**: Reading articles is the primary user goal. This story is equally critical as the listing and can be developed/tested independently.

**Independent Test**: Create a sample article with markdown content, navigate to its detail page, and verify proper rendering with table of contents, formatted content, and metadata display.

**Acceptance Scenarios**:

1. **Given** a user clicks an article from the list, **When** the detail page loads, **Then** they see the full article with title, thumbnail, publication date, tags, and formatted content
2. **Given** article content is in Markdown format, **When** displayed, **Then** it renders with proper HTML formatting (headings, lists, links, code blocks, etc.)
3. **Given** an article has multiple headings, **When** the detail page loads, **Then** a table of contents is automatically generated from the headings
4. **Given** a user is viewing an article, **When** they scroll through the content, **Then** the current section is highlighted in the table of contents
5. **Given** other articles exist, **When** viewing an article detail, **Then** links to the previous and next articles (by publication date) are displayed at the bottom

---

### User Story 3 - Tag-based Filtering (Priority: P2)

Users can filter articles by selecting specific tags to find related content.

**Why this priority**: Enhances discoverability and user experience but the blog is still functional without it. This can be added after the core viewing functionality is stable.

**Independent Test**: Create articles with various tags, click on a tag, and verify that only articles with that tag are displayed. Clear the filter and verify all articles reappear.

**Acceptance Scenarios**:

1. **Given** a user is on the blog listing page, **When** they click on a tag, **Then** the list filters to show only articles with that tag
2. **Given** a tag filter is active, **When** displayed, **Then** the active tag is visually highlighted and a "clear filter" option is available
3. **Given** multiple tags are clicked, **When** filtering, **Then** articles matching ANY of the selected tags are shown (OR logic)
4. **Given** a tag filter is active, **When** the user clears the filter, **Then** all articles are displayed again
5. **Given** a user applies a tag filter, **When** paginating, **Then** pagination continues to show only filtered articles

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

- What happens when an article has no tags? Display without tags section
- What happens when there are no articles to display? Show an empty state message
- What happens when user reaches the last page of articles? Disable "next" button and show "End of articles" message
- How does the system handle articles with extremely long titles? Truncate with ellipsis after 2 lines
- What happens when markdown contains invalid or malicious content? Sanitize HTML output to prevent XSS
- How does the system handle images that fail to load? Display broken image placeholder with retry option
- What happens when a user directly accesses a non-existent article URL? Show 404 page with link back to blog listing
- How does the system handle articles with no content? Display minimum required fields and indicate draft status
- What happens when TOC has deeply nested headings (5+ levels)? Limit TOC display to 3 levels maximum
- How does the system handle very long article URLs? Use slug-based URLs with maximum 100 character limit

## Requirements

### Functional Requirements

#### Article Listing Page

- **FR-001**: System MUST display a list of published blog articles ordered by publication date (newest first)
- **FR-002**: System MUST display for each article: title, thumbnail image, publication date, and tags
- **FR-003**: System MUST implement client-side pagination displaying 10 articles per page
- **FR-004**: System MUST provide pagination controls (page numbers, previous/next buttons)
- **FR-005**: System MUST display a default placeholder image for articles without thumbnails
- **FR-006**: System MUST implement tag filtering allowing users to filter articles by one or more tags
- **FR-007**: System MUST visually indicate active tag filters with clear removal options
- **FR-008**: System MUST maintain filter state during pagination navigation
- **FR-009**: System MUST display an empty state message when no articles match current filters
- **FR-010**: System MUST make article cards clickable, navigating to the detail page

#### Article Detail Page

- **FR-011**: System MUST display full article content including title, thumbnail, publication date, tags, and body
- **FR-012**: System MUST render Markdown content to properly formatted HTML
- **FR-013**: System MUST sanitize rendered HTML to prevent XSS attacks
- **FR-014**: System MUST auto-generate a table of contents from article headings (H1-H3)
- **FR-015**: System MUST implement smooth scrolling when TOC items are clicked
- **FR-016**: System MUST highlight the current section in the TOC based on scroll position
- **FR-017**: System MUST update the browser URL with section anchors when navigating via TOC
- **FR-018**: System MUST display links to previous and next articles (by publication date)
- **FR-019**: System MUST handle articles without previous or next articles gracefully
- **FR-020**: System MUST support common Markdown syntax: headings, bold, italic, links, images, code blocks, lists, blockquotes, tables

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
  - Slug (for URL routing and SSG path generation)
  - Title (required, 1-200 characters)
  - Body content (required, Markdown format - CommonMark specification)
  - Thumbnail image URL (optional, from microCMS media)
  - Publication date (required, ISO 8601 format)
  - Tags (array of tag objects, 0-10 tags per article)
  - Status (published only - drafts filtered at build time)
  - Author information (if provided by microCMS)
  - Created/updated timestamps from microCMS

- **Tag**: Represents a categorization label with:
  - Tag name (unique, 1-50 characters)
  - Display color or styling (optional)
  - Article count (derived)

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
- **SC-004**: Markdown content renders correctly with 100% accuracy for CommonMark specification
- **SC-005**: Table of contents is automatically generated for 100% of articles containing 2 or more headings
- **SC-006**: Tag filtering returns filtered results within 500ms
- **SC-007**: Table of contents remains sticky/visible while scrolling article content
- **SC-008**: All pages are responsive and fully functional on mobile devices (375px width minimum)
- **SC-009**: Previous/next article navigation is available on 100% of article detail pages (except first/last)
- **SC-010**: Static pages are generated successfully for 1000+ articles at build time
- **SC-011**: All article pages are fully pre-rendered with no client-side data fetching required
- **SC-012**: Zero XSS vulnerabilities in rendered Markdown content (verified by security testing)

### User Experience Goals

- **UX-001**: Users can easily discover new content through browsing and tag filtering
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
- Tag filtering also client-side using pre-fetched data
- Instant page transitions and filtering

**Content Updates:**

- New articles or updates require rebuilding the site
- Consider implementing webhook-triggered builds from microCMS for automated updates
- ISR (Incremental Static Regeneration) can be added later if needed

**Required Setup:**

- microCMS API endpoint URL (environment variable: `MICROCMS_API_ENDPOINT`)
- API key for build-time authentication (environment variable: `MICROCMS_API_KEY`)
- Content model definition matching BlogArticle entity

**Note:** Please provide the microCMS API response types/schema for accurate integration.

### Markdown Processing

- Use **CommonMark** specification for markdown parsing
- Recommended libraries:
  - `react-markdown` for rendering (CommonMark compatible)
  - `remark-gfm` for additional features if needed
  - `react-syntax-highlighter` for code syntax highlighting
- Ensure proper HTML sanitization to prevent XSS attacks
- Markdown rendering can happen at build time or client-side

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
2. ✅ **Markdown Flavor**: CommonMark specification
3. ✅ **Table of Contents**: Sticky/fixed positioning while scrolling
4. ✅ **Data Source**: microCMS headless CMS with SSG approach
5. ✅ **Pagination**: Client-side pagination (not infinite scroll) with pre-fetched data
6. ✅ **Search Functionality**: Not in this branch (future enhancement)

## Remaining Open Questions

1. Should tag names be case-sensitive?
2. What is the desired behavior for articles with no publication date?
3. What analytics should be tracked (page views, reading time, etc.)?
4. Should articles support multiple authors in the future?
5. What is the microCMS content model structure and API response format?
6. Should we implement ISR (Incremental Static Regeneration) for content updates without full rebuilds?
7. How many articles per page for pagination? (Currently spec says 10)

## Next Steps

1. ✅ Confirm data source approach: microCMS with SSG (build-time fetching)
2. ✅ Select Markdown processing: CommonMark with react-markdown
3. ✅ Confirm pagination strategy: Client-side with pre-fetched data
4. Obtain microCMS API schema and response types for BlogArticle
5. Set up environment variables for microCMS API access
6. Design component hierarchy for listing and detail pages
7. Implement Next.js SSG functions (`generateStaticParams`, data fetching at build time)
8. Create microCMS API client for build-time data fetching
9. Implement P1 user stories first (basic listing and detail viewing)
10. Add P2 features (client-side tag filtering) after core functionality is stable
11. Enhance with P3 features (sticky TOC, smooth scrolling) as time permits
