/**
 * microCMS API response types
 * Based on schema: schema/api-blogs-20251206155310.json
 */

export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

export interface MicroCMSCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MicroCMSBlog {
  id: string;
  title: string;
  content: string; // HTML from richEditorV2
  eyecatch?: MicroCMSImage;
  category?: MicroCMSCategory;
  publishedAt?: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
