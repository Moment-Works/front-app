# Moment Works - Blog Application

A modern blog application built with Next.js 16, featuring article listing, detail pages, category filtering, and table of contents navigation.

## Features

- 📝 Blog article listing with pagination (10 articles per page)
- 📖 Full article detail pages with formatted content
- 🏷️ Category-based filtering
- 📑 Automatic table of contents generation with scroll spy
- 🔍 SEO-optimized with proper metadata
- ⚡ Static Site Generation (SSG) for optimal performance
- 🎨 Styled with Tailwind CSS and shadcn/ui components
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **CMS**: microCMS (headless CMS)
- **Content Format**: richEditorV2 (HTML)

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- microCMS account with blog API configured

## Environment Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create `.env.local` file in the project root:

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

Replace `your-service-domain` and `your-api-key` with your actual microCMS credentials from the dashboard.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

Build the application:

```bash
npm run build
```

This will generate static pages for all articles at build time.

Start the production server:

```bash
npm start
```

## Project Structure

```
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx          # Article detail page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── article-card.tsx          # Article card component
│   ├── article-grid.tsx          # Grid layout for articles
│   ├── article-navigation.tsx    # Prev/next navigation
│   ├── blog-listing-client.tsx   # Client-side listing logic
│   ├── category-filter.tsx       # Category filter UI
│   ├── pagination.tsx            # Pagination controls
│   └── table-of-contents.tsx     # TOC with scroll spy
├── lib/
│   ├── microcms.ts              # microCMS API client
│   ├── transforms.ts            # Data transformations
│   ├── html-processing.ts       # HTML parsing and TOC generation
│   └── utils.ts                 # Utility functions
├── types/
│   ├── microcms.ts              # microCMS API types
│   ├── article.ts               # Article domain types
│   └── filters.ts               # Filter types
└── schema/                       # microCMS schema definitions
```

## Features Implementation

### Blog Listing (User Story 1 - P1)

- ✅ Paginated article list (10 per page)
- ✅ Article cards with thumbnail, title, date, excerpt, and category
- ✅ Responsive grid layout (1/2/3 columns)
- ✅ Empty state handling

### Article Detail (User Story 2 - P1)

- ✅ Full article content with HTML rendering
- ✅ Hero image with proper optimization
- ✅ Article metadata (title, date, category)
- ✅ Prev/next article navigation
- ✅ Back to listing link
- ✅ SEO metadata generation

### Category Filtering (User Story 3 - P2)

- ✅ Filter articles by category
- ✅ Show article count per category
- ✅ Reset filter to show all articles
- ✅ Pagination resets on filter change

### Table of Contents (User Story 4 - P3)

- ✅ Automatic TOC generation from headings (h1-h3)
- ✅ Sticky positioning on desktop
- ✅ Scroll spy with active section highlighting
- ✅ Smooth scrolling to sections
- ✅ URL hash updates

## Performance Targets

All constitution-mandated performance targets are met:

- ✅ Static Site Generation (SSG) - all pages pre-rendered
- ✅ Image optimization with next/image
- ✅ Code splitting via dynamic imports
- ✅ Lighthouse Performance Score target: ≥90
- ✅ Core Web Vitals targets:
  - LCP ≤ 2.5s
  - FCP ≤ 1.8s
  - CLS ≤ 0.1

## Constitution Compliance

This project adheres to the project constitution:

- ✅ Next.js 14+ App Router (using 16.0.7)
- ✅ TypeScript strict mode enabled
- ✅ Tailwind CSS + shadcn/ui exclusive
- ✅ Performance-first architecture (SSG)
- ✅ Simplicity and best practices (minimal state management)

## License

Private project

## Support

For issues or questions, please refer to the project documentation in `/specs/001-blog-article-listing/`.
