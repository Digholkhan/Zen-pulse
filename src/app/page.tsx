'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { ExerciseCard } from '@/components/breathing/ExerciseCard';
import { StreakStats } from '@/components/progress/StreakStats';
import { PRESET_EXERCISES } from '@/lib/data/exercises';
import { PRESET_ROUTINES } from '@/lib/data/routines';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Wind, Brain, Activity, Compass, Clock, ArrowRight, Sparkles, ShieldAlert, Heart } from 'lucide-react';
import { getGreeting } from '@/lib/utils';
import { useUserStore } from '@/lib/store/useUserStore';

export default function HomePage() {
  const { profile } = useUserStore();
  const greeting = getGreeting();

  const quickResets = [
    { title: '1 Min Reset', slug: 'quick-1min-reset', time: '1 min', desc: 'Instant acute stress release' },
    { title: '4-7-8 Calm', slug: '4-7-8-breathing', time: '4 min', desc: 'Natural tranquilizer' },
    { title: '5 Min Box', slug: 'box-breathing', time: '5 min', desc: 'Navy SEAL focus reset' },
    { title: 'Resonance 5-5', slug: 'coherent-breathing', time: '5 min', desc: 'HRV emotional harmony' },
  ];

  return (
    <div className="space-y-10">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            {greeting}, {profile.name.split(' ')[0]} 👋
          </h2>
        </div>

        <Link href="/breathing/custom">
          <Button variant="secondary" className="gap-2 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-zen-500" />
            <span>Create Custom Breath</span>
          </Button>
        </Link>
      </div>

      {/* Hero Showcase Banner */}
      <HeroBanner />

      {/* Quick Access Resets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-zen-900 dark:text-zen-100">
              Quick Micro-Resets
            </h3>
            <p className="text-xs text-zen-500">Fast 1-5 minute exercises for immediate relief</p>
          </div>
          <Link href="/breathing" className="text-xs font-semibold text-zen-500 hover:text-zen-900 dark:hover:text-zen-100 flex items-center gap-1">
            <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickResets.map((reset) => (
            <Link key={reset.slug} href={`/breathing/${reset.slug}`}>
              <Card className="p-4 hover:shadow-lg hover:border-zen-400/50 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-zen-500/10 text-zen-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zen-100 dark:bg-zen-900 text-zen-700 dark:text-zen-300">
                    {reset.time}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-zen-900 dark:text-zen-100 group-hover:text-zen-600 transition-colors">
                  {reset.title}
                </h4>
                <p className="text-[11px] text-zen-500 mt-1 line-clamp-1">{reset.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress & Habits Overview */}
      <StreakStats />

      {/* Recommended Breathing Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-zen-900 dark:text-zen-100">
              Recommended Breathing Techniques
            </h3>
            <p className="text-xs text-zen-500">Curated patterns for stress, sleep, focus, and Wim Hof retention</p>
          </div>
          <Link href="/breathing" className="text-xs font-semibold text-zen-500 hover:text-zen-900 dark:hover:text-zen-100 flex items-center gap-1">
            <span>Library</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESET_EXERCISES.slice(0, 3).map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>

      {/* Daily Multi-Step Routines Showcase */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display font-bold text-xl text-zen-900 dark:text-zen-100">
            Daily Guided Routines
          </h3>
          <p className="text-xs text-zen-500">Multi-step journeys combining breathwork, stretching, and meditation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESET_ROUTINES.map((routine) => (
            <Card key={routine.id} className="p-6 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="zen">
                    <Compass className="w-3 h-3" />
                    <span>{routine.category}</span>
                  </Badge>
                  <span className="text-xs text-zen-500 font-medium">~{routine.totalDurationMins} min journey</span>
                </div>

                <h4 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
                  {routine.title}
                </h4>

                <p className="text-xs text-zen-600 dark:text-zen-400 mt-2 line-clamp-2">
                  {routine.description}
                </p>

                <div className="space-y-1.5 mt-4">
                  {routine.steps.map((step, idx) => (
                    <div key={step.id} className="text-[11px] font-medium text-zen-600 dark:text-zen-300 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-zen-200 dark:bg-zen-800 text-[9px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/routines" className="mt-6">
                <Button variant="secondary" className="w-full text-xs font-semibold">
                  Start Journey
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Wellness Studio Navigation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meditation Shortcut Card */}
        <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-purple-500/20 flex flex-col justify-between">
          <div className="space-y-2">
            <Brain className="w-8 h-8 text-purple-500" />
            <h3 className="text-xl font-display font-bold text-zen-900 dark:text-zen-100">
              Meditation Studio
            </h3>
            <p className="text-xs text-zen-600 dark:text-zen-400">
              Mindful breath awareness, body scans, 432Hz ambient drone soundscapes, and customizable interval bell chimes.
            </p>
          </div>
          <Link href="/meditation" className="mt-6">
            <Button variant="outline" className="w-full text-xs font-semibold">
              Open Meditation Studio
            </Button>
          </Link>
        </Card>

        {/* Yoga Shortcut Card */}
        <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20 flex flex-col justify-between">
          <div className="space-y-2">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h3 className="text-xl font-display font-bold text-zen-900 dark:text-zen-100">
              Yoga & Mobility Stretches
            </h3>
            <p className="text-xs text-zen-600 dark:text-zen-400">
              Desk worker neck & shoulder decompression, morning awakening stretches, pose timers, and alignment tips.
            </p>
          </div>
          <Link href="/yoga" className="mt-6">
            <Button variant="outline" className="w-full text-xs font-semibold">
              Explore Yoga Routines
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
