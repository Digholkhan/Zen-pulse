import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  themeColor: '#10ef9c',
};

export const metadata: Metadata = {
  title: 'ZenPulse - Deep Wim Hof & Guided Breathing Engine',
  description:
    'Guided Wim Hof and box breathing exercises, meditation studio, movement routines, and habit streak tracking with browser-generated voice guidance.',
  keywords: [
    'Breathing exercises',
    'Wim Hof breathing',
    'Box breathing',
    '4-7-8 breathing',
    'Meditation timer',
    'Mindfulness app',
    'Yoga stretches',
    'Relaxation sounds',
  ],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zen-950 antialiased text-zen-900 dark:text-zen-100 selection:bg-neon-500 selection:text-zen-950 relative">
        <Navbar />
        <div className="flex-1 flex w-full relative z-10">
          {/* Sidebar pinned directly to the absolute left edge of the screen */}
          <Sidebar />

          {/* Main content area offset by sidebar width on desktop */}
          <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
        <Footer />
      </body>
    </html>
  );
}
