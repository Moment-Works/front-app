import { MobileNavigation } from '@/components/mobile-navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Moment Works',
  description: 'Get in touch with Moment Works',
};

export default function ContactPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <MobileNavigation />
      <main className='flex-1 container mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-4'>Contact</h1>
        <p className='text-lg text-muted-foreground'>
          This page is coming soon.
        </p>
      </main>
    </div>
  );
}
