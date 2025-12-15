/**
 * Application domain types for articles
 */

export interface TocHeading {
  id: string; // Anchor ID (slugified heading text)
  text: string; // Heading text content
  level: 1 | 2 | 3; // Heading level (h1, h2, h3)
}

export interface TableOfContents {
  headings: TocHeading[];
}

export interface AdjacentArticle {
  slug: string;
  title: string;
}

export interface ArticleNavigation {
  previous: AdjacentArticle | null;
  next: AdjacentArticle | null;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string; // Optional: first 150 chars of content
  eyecatchUrl?: string;
  categoryName?: string;
  publishedAt: string; // ISO 8601
}

export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  content: string; // Processed HTML with anchor IDs
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  categoryName?: string;
  publishedAt: string;
  tableOfContents: TableOfContents;
  navigation: ArticleNavigation;
}
