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
  categoryNames?: string[]; // Array of category names
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
  categoryNames?: string[]; // Array of category names
  publishedAt: string;
  tableOfContents: TableOfContents;
  navigation: ArticleNavigation;
}
