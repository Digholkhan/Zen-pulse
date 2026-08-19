import React from 'react';
import { Card } from '../ui/Card';
import { Flame, Clock, Award, Target, Sparkles } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';

export const StreakStats: React.FC = () => {
  const { profile } = useUserStore();

  const goalPercent = Math.min(100, Math.round((profile.totalMinutes / (profile.dailyGoalMins * 7)) * 100));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Streak */}
      <Card className="p-5 flex items-center gap-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
          <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zen-500">
            Current Streak
          </span>
          <div className="text-2xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            {profile.currentStreak} <span className="text-xs font-normal">Days</span>
          </div>
          <span className="text-[11px] text-zen-500">Longest: {profile.longestStreak} days</span>
        </div>
      </Card>

      {/* Total Minutes */}
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zen-500/10 text-zen-500 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zen-500">
            Total Mindful Mins
          </span>
          <div className="text-2xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            {profile.totalMinutes} <span className="text-xs font-normal">Mins</span>
          </div>
          <span className="text-[11px] text-zen-500">Across all exercises</span>
        </div>
      </Card>

      {/* Total Sessions */}
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zen-500">
            Completed Sessions
          </span>
          <div className="text-2xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            {profile.totalSessions} <span className="text-xs font-normal">Sessions</span>
          </div>
          <span className="text-[11px] text-zen-500">Habit in progress</span>
        </div>
      </Card>

      {/* Daily Goal */}
      <Card className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zen-500">
            Daily Goal ({profile.dailyGoalMins}m)
          </span>
          <div className="text-2xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            {goalPercent}%
          </div>
          <div className="w-24 h-1.5 rounded-full bg-zen-200 dark:bg-zen-800 mt-1 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
