'use client';

import Link from 'next/link';
import { Menu, Home, BookOpen, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { NavigationLink } from '@/types/navigation';

const defaultLinks: NavigationLink[] = [
  { label: 'Home', href: '/', icon: <Home className='h-5 w-5' /> },
  { label: 'Blog', href: '/blog', icon: <BookOpen className='h-5 w-5' /> },
  { label: 'About', href: '/about', icon: <User className='h-5 w-5' /> },
  { label: 'Contact', href: '/contact', icon: <Mail className='h-5 w-5' /> },
];

interface MobileNavigationProps {
  links?: NavigationLink[];
}

export function MobileNavigation({
  links = defaultLinks,
}: MobileNavigationProps) {
  return (
    <header className='border-b bg-background'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo/Brand */}
        <Link href='/' className='text-xl font-bold'>
          Moment Works
        </Link>

        {/* Mobile Menu (< 1024px) */}
        <div className='lg:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Open navigation menu'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-80'>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4 mt-8'>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors'
                  >
                    {link.icon}
                    <span className='text-lg'>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation (≥ 1024px) */}
        <nav className='hidden lg:flex gap-6'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-foreground hover:text-primary transition-colors font-medium'
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
