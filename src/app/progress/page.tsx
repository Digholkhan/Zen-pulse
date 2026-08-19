'use client';

import React from 'react';
import { StreakStats } from '@/components/progress/StreakStats';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { BadgeGrid } from '@/components/progress/BadgeGrid';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/lib/store/useUserStore';
import { formatTime } from '@/lib/utils';
import { Clock, History, Calendar } from 'lucide-react';

export default function ProgressPage() {
  const { history } = useUserStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Analytics & Habit Insights
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Your Mindful Progress
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Track session volume, streak continuity, and unlocked achievements over time.
        </p>
      </div>

      {/* Streak Summary */}
      <StreakStats />

      {/* Recharts Practice Volume Chart & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart />
        <BadgeGrid />
      </div>

      {/* Session History Log */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-zen-500" />
            <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
              Recent Session History
            </h3>
          </div>
          <span className="text-xs text-zen-500">{history.length} logged sessions</span>
        </div>

        {history.length > 0 ? (
          <div className="space-y-2">
            {history.slice(0, 8).map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-2xl bg-white/40 dark:bg-zen-900/40 border border-zen-200/50 dark:border-zen-800/50 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-zen-900 dark:text-zen-100">{rec.title}</h4>
                  <span className="text-[10px] text-zen-500 capitalize">{rec.type} • {new Date(rec.completedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-zen-700 dark:text-zen-300">
                  <Clock className="w-3.5 h-3.5 text-zen-500" />
                  <span>{formatTime(rec.durationSec)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zen-500 text-center py-6">
            No completed sessions recorded yet. Complete your first exercise to start tracking!
          </p>
        )}
      </Card>
    </div>
  );
}
