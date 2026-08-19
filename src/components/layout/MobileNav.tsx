'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wind, PlusCircle, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/breathing', label: 'Breathe', icon: Wind },
    { href: '/breathing/custom', label: 'Custom', icon: PlusCircle },
    { href: '/meditation', label: 'Meditate', icon: Brain },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-zen-950/80 backdrop-blur-xl border-t border-zen-200/50 dark:border-zen-800/50 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[10px] font-semibold transition-all',
                isActive
                  ? 'text-zen-600 dark:text-zen-400 font-bold'
                  : 'text-zen-500 dark:text-zen-400 hover:text-zen-800 dark:hover:text-zen-200'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-xl transition-all',
                  isActive ? 'bg-zen-500/10 dark:bg-zen-400/20 scale-110' : ''
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
