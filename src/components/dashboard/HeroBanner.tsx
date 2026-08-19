'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Sparkles, Play, Compass, Wind, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neon-500/20 via-zen-900/90 to-zen-950  p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
      {/* Soft Neon Radial Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-neon-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

      {/* Hero Text Content */}
      <div className="relative z-10 max-w-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-500/15 text-neon-400 text-xs font-extrabold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-neon-400" />
          <span>Wim Hof-Inspired Heavy Voice & Retention Engine</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-zen-900 dark:text-zen-100 leading-tight">
          Find Your Calm. <br />
          <span className="text-neon-400 text-neon-glow">
            One Breath at a Time.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zen-600 dark:text-zen-300 leading-relaxed font-medium">
          Guided Wim Hof power breathing, deep masculine voice guidance, meditation studio, movement routines, and mindful habits to help you reset instantly.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
          <Link href="/breathing/wim-hof-session">
            <Button size="lg" variant="primary" className="gap-2.5 shadow-neon">
              <Play className="w-4 h-4 fill-current" />
              <span>Start Wim Hof Session</span>
            </Button>
          </Link>

          <Link href="/breathing">
            <Button size="lg" variant="secondary" className="gap-2">
              <Compass className="w-4 h-4" />
              <span>Explore Library</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 text-xs text-zen-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neon-400" /> Safe & Non-Invasive
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-neon-400" /> Tab-Resistant Precision
          </span>
        </div>
      </div>

      {/* Dynamic Animated Soft Neon Visual Core Preview */}
      <div className="relative z-10 shrink-0">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-neon-400 via-neon-500 to-emerald-400 text-zen-950 flex flex-col items-center justify-center shadow-neon-lg breathing-ring p-6 text-center border-2 border-neon-300 cursor-pointer"
        >
          <Wind className="w-8 h-8 mb-2 animate-bounce text-zen-950" />
          <span className="font-display font-black text-xl text-zen-950">Breathe In</span>
          <span className="text-[11px] font-bold text-zen-950/80 mt-0.5">Deep Voice Guided</span>
        </motion.div>
      </div>
    </div>
  );
};
