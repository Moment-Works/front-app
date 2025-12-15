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

  headings.forEach((heading) => {
    const id = slugify(heading.text);
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
  const usedIds = new Set<string>();

  const tocHeadings: TocHeading[] = headings.map((heading, index) => {
    let id = heading.getAttribute('id') || slugify(heading.text);

    // Ensure unique IDs by appending index if duplicate
    if (usedIds.has(id)) {
      id = `${id}-${index}`;
    }
    usedIds.add(id);

    return {
      id,
      text: heading.text,
      level: parseInt(heading.tagName[1]) as 1 | 2 | 3,
    };
  });

  return { headings: tocHeadings };
}
