/**
 * Table of Contents component with scroll spy
 * Interactive navigation for article sections
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TableOfContents } from '@/types/article';

interface TableOfContentsProps {
  toc: TableOfContents;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0.5,
      }
    );

    // Observe all heading elements
    toc.headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });

    // Update URL hash
    window.history.pushState(null, '', `#${id}`);
  };

  if (toc.headings.length === 0) {
    return null;
  }

  return (
    <nav className='sticky top-4 h-fit hidden lg:block'>
      <h2 className='font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground'>
        Table of Contents
      </h2>
      <ul className='space-y-2 text-sm border-l-2 border-border pl-4'>
        {toc.headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'text-left hover:text-primary transition-colors block w-full',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
