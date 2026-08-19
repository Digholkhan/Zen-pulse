import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zen-200/50 dark:border-zen-800/50 py-10 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-zen-950/30 backdrop-blur-md mt-16 text-zen-600 dark:text-zen-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-zen-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-sm text-zen-900 dark:text-zen-100">ZenPulse</span>
          <span className="text-[11px] text-zen-400 dark:text-zen-500 ml-2">
            © {new Date().getFullYear()} ZenPulse Wellness. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-zen-500 dark:text-zen-400 font-medium">
          <Link href="/breathing" className="hover:text-zen-900 dark:hover:text-zen-100 transition-colors">
            Breathing Library
          </Link>
          <Link href="/meditation" className="hover:text-zen-900 dark:hover:text-zen-100 transition-colors">
            Meditation
          </Link>
          <Link href="/yoga" className="hover:text-zen-900 dark:hover:text-zen-100 transition-colors">
            Yoga
          </Link>
          <Link href="/progress" className="hover:text-zen-900 dark:hover:text-zen-100 transition-colors">
            Progress
          </Link>
          <Link href="/settings" className="hover:text-zen-900 dark:hover:text-zen-100 transition-colors">
            Safety Disclaimer
          </Link>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-zen-400" />
          <span>Non-medical wellness tool. Practice responsibly.</span>
        </div>
      </div>
    </footer>
  );
};
