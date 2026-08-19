import React from 'react';
import { Card } from '../ui/Card';
import { useUserStore } from '@/lib/store/useUserStore';
import { Sparkles, Flame, Award, Clock, Zap, Sliders, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BadgeGrid: React.FC = () => {
  const { achievements } = useUserStore();

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Sparkles,
    Flame,
    Award,
    Clock,
    Zap,
    Sliders,
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
          Mindfulness Milestones & Badges
        </h3>
        <p className="text-xs text-zen-500">Earn badges as you maintain daily practice habits</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        {achievements.map((ach) => {
          const IconComponent = iconMap[ach.icon] || Award;
          const isUnlocked = ach.unlocked;

          return (
            <div
              key={ach.id}
              className={cn(
                'p-4 rounded-3xl border transition-all text-center flex flex-col items-center justify-between space-y-2',
                isUnlocked
                  ? 'bg-gradient-to-br from-zen-500/10 to-teal-500/10 border-zen-500/30 dark:border-zen-400/30 shadow-sm'
                  : 'bg-zen-100/40 dark:bg-zen-900/30 border-zen-200/50 dark:border-zen-800/50 opacity-60'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center relative',
                  isUnlocked
                    ? 'bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950 shadow-md'
                    : 'bg-zen-200 dark:bg-zen-800 text-zen-500'
                )}
              >
                <IconComponent className="w-6 h-6" />
                {!isUnlocked && (
                  <div className="absolute -top-1 -right-1 p-1 rounded-full bg-zen-900 text-white text-[9px]">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zen-900 dark:text-zen-100">{ach.title}</h4>
                <p className="text-[10px] text-zen-500 line-clamp-2 mt-0.5">{ach.description}</p>
              </div>

              <div className="w-full pt-1">
                {isUnlocked ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Unlocked ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-zen-400">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
