import type { ReactNode } from 'react';

export interface NavigationLink {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: ReactNode;
}
