import React from 'react';
import Link from 'next/link';
import { BreathingExercise } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Play, Heart, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: BreathingExercise;
  onSelect?: (exercise: BreathingExercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect }) => {
  const { isFavorite, toggleFavorite } = useUserStore();
  const favorite = isFavorite(exercise.id);

  const difficultyVariant =
    exercise.difficulty === 'Beginner'
      ? 'accent'
      : exercise.difficulty === 'Intermediate'
      ? 'blue'
      : 'purple';

  return (
    <Card className="group relative flex flex-col justify-between hover:shadow-xl hover:border-zen-400/40 dark:hover:border-zen-400/40 transition-all duration-300">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={difficultyVariant}>{exercise.difficulty}</Badge>
            {exercise.requiresSafetyWarning && (
              <Badge variant="warning">
                <ShieldAlert className="w-3 h-3" />
                <span>Safety Notice</span>
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleFavorite(exercise.id);
            }}
            className="p-1.5 rounded-full text-zen-400 hover:text-red-500 transition-colors"
            aria-label="Toggle favorite"
          >
            <Heart className={cn('w-4 h-4', favorite ? 'fill-red-500 text-red-500' : '')} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100 group-hover:text-zen-600 dark:group-hover:text-zen-300 transition-colors">
          {exercise.title}
        </h3>

        <p className="text-xs text-zen-600 dark:text-zen-400 mt-2 line-clamp-2 leading-relaxed">
          {exercise.description}
        </p>

        {/* Phase Summary Pill */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {exercise.phases.map((p, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zen-100 dark:bg-zen-900/80 text-zen-700 dark:text-zen-300 border border-zen-200/50 dark:border-zen-800/50"
            >
              {p.type.replace('_', ' ')}: {p.duration}s
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Action CTA */}
      <div className="flex items-center justify-between pt-5 mt-4 border-t border-zen-200/50 dark:border-zen-800/50">
        <div className="flex items-center gap-1.5 text-xs text-zen-500 dark:text-zen-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{exercise.durationMins} min</span>
        </div>

        {onSelect ? (
          <button
            onClick={() => onSelect(exercise)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-zen-500 text-white hover:bg-zen-600 dark:bg-zen-400 dark:text-zen-950 dark:hover:bg-zen-300 shadow-md transition-all group-hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice</span>
          </button>
        ) : (
          <Link
            href={`/breathing/${exercise.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-zen-500 text-white hover:bg-zen-600 dark:bg-zen-400 dark:text-zen-950 dark:hover:bg-zen-300 shadow-md transition-all group-hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice</span>
          </Link>
        )}
      </div>
    </Card>
  );
};
