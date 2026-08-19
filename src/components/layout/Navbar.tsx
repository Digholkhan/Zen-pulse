'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Volume2, Flame, Sparkles, User } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { SoundMixerModal } from '../audio/SoundMixerModal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { profile } = useUserStore();
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/80 dark:bg-zen-950/90 border-b border-zen-200/50 dark:border-neon-500/15 transition-colors shadow-sm">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo - Navigates to Landing Page / Home */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-neon-500 to-emerald-400 flex items-center justify-center shadow-neon group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-zen-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-zen-900 dark:text-zen-100 group-hover:text-neon-400 transition-colors">
                Zen<span className="text-neon-400">Pulse</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-zen-500 dark:text-neon-400/80 -mt-1">
                Mindfulness Engine
              </span>
            </div>
          </Link>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Badge */}
            <Link
              href="/progress"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{profile.currentStreak} Day Streak</span>
            </Link>

            {/* Soundscape Mixer Toggle */}
            <button
              onClick={() => setIsMixerOpen(true)}
              className="p-2 rounded-full text-zen-700 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-900/60 hover:text-neon-400 transition-colors relative"
              title="Soundscape & Audio Mixer"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zen-700 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-900/60 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile Quick Link */}
            <Link
              href="/settings"
              className="p-1.5 rounded-full bg-zen-100 dark:bg-zen-900/80 text-zen-700 dark:text-neon-400 border border-zen-200 dark:border-neon-500/30 hover:border-neon-400 transition-colors"
              title="Profile & Settings"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <SoundMixerModal isOpen={isMixerOpen} onClose={() => setIsMixerOpen(false)} />
    </>
  );
};
