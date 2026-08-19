'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Wind,
  PlusCircle,
  Brain,
  Activity,
  Compass,
  Heart,
  BarChart3,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home Dashboard', icon: Home },
    { href: '/breathing', label: 'Breathing Exercises', icon: Wind },
    { href: '/breathing/custom', label: 'Custom Builder', icon: PlusCircle },
    { href: '/meditation', label: 'Meditation Studio', icon: Brain },
    { href: '/yoga', label: 'Yoga & Movement', icon: Activity },
    { href: '/routines', label: 'Daily Routines', icon: Compass },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/progress', label: 'Progress & Badges', icon: BarChart3 },
    { href: '/settings', label: 'Profile & Settings', icon: Settings },
    { href: '/admin', label: 'Admin Dashboard', icon: ShieldAlert },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-4 border-r border-zen-200/50 dark:border-neon-500/15 bg-white/80 dark:bg-zen-950/95 backdrop-blur-2xl fixed left-0 top-16 bottom-0 z-30 overflow-y-auto shadow-2xl">
      <div className="space-y-1.5 py-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zen-500 dark:text-neon-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-neon-400" />
          <span>Practice Engine</span>
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group relative',
                isActive
                  ? 'bg-neon-500 text-zen-950 font-bold shadow-neon shadow-neon-500/30'
                  : 'text-zen-700 dark:text-zen-300 hover:bg-zen-100/70 dark:hover:bg-zen-900/60 hover:text-zen-900 dark:hover:text-neon-300'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform group-hover:scale-110 shrink-0',
                  isActive ? 'text-zen-950' : 'text-zen-500 dark:text-zen-400 group-hover:text-neon-400'
                )}
              />
              <span className="truncate">{item.label}</span>

              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-zen-950" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Side Shortcut Card */}
      <div className="mt-auto p-4 rounded-3xl bg-gradient-to-br from-neon-500/15 via-zen-900/80 to-zen-950 border border-neon-500/25 text-center shadow-lg">
        <Wind className="w-6 h-6 text-neon-400 mx-auto mb-2 animate-bounce" />
        <h4 className="text-xs font-bold text-zen-900 dark:text-zen-100">Wim Hof Guided Session</h4>
        <p className="text-[10px] text-zen-600 dark:text-zen-400 mt-1 mb-3">Heavy deep male voice guided breath retention.</p>
        <Link
          href="/breathing/wim-hof-session"
          className="inline-block w-full py-2 px-3 rounded-full text-xs font-bold bg-neon-500 text-zen-950 hover:bg-neon-400 transition-colors shadow-neon"
        >
          Start Wim Hof
        </Link>
      </div>
    </aside>
  );
};
