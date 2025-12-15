/**
 * HTML processing utilities for article content
 */

import { parse } from 'node-html-parser';
import type { TableOfContents, TocHeading } from '@/types/article';

/**
 * Convert text to URL-safe slug
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Inject anchor IDs into heading elements for navigation
 * @param html - Raw HTML content
 * @returns HTML with anchor IDs injected into headings
 */
export function injectHeadingAnchors(html: string): string {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');
  const idCounts = new Map<string, number>();

  headings.forEach((heading) => {
    const baseId = slugify(heading.text);
    const count = idCounts.get(baseId) || 0;
    idCounts.set(baseId, count + 1);

    // Always append counter for consistency (1-based indexing)
    const id = `${baseId}-${count + 1}`;
    heading.setAttribute('id', id);
  });

  return root.toString();
}

/**
 * Extract table of contents from HTML content
 * @param html - HTML content with anchor IDs
 * @returns Table of contents structure
 */
export function extractTableOfContents(html: string): TableOfContents {
  const root = parse(html);
  const headings = root.querySelectorAll('h1, h2, h3');

  const tocHeadings: TocHeading[] = headings.map((heading) => {
    // IDs should already be set by injectHeadingAnchors
    const id = heading.getAttribute('id') || slugify(heading.text);

    return {
      id,
      text: heading.text,
      level: parseInt(heading.tagName[1]) as 1 | 2 | 3,
    };
  });

  return { headings: tocHeadings };
}
