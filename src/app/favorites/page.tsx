'use client';

import React from 'react';
import { useUserStore } from '@/lib/store/useUserStore';
import { useSessionStore } from '@/lib/store/useSessionStore';
import { ExerciseCard } from '@/components/breathing/ExerciseCard';
import { Card } from '@/components/ui/Card';
import { Heart, Wind } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const { profile } = useUserStore();
  const { getAllExercises } = useSessionStore();

  const allExercises = getAllExercises();
  const favoriteExercises = allExercises.filter((e) => profile.favorites.includes(e.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Personal Collection
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Your Favorite Exercises
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Quick 1-click access to saved breathing techniques and routines.
        </p>
      </div>

      {favoriteExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <Heart className="w-10 h-10 text-zen-400 mx-auto" />
          <h3 className="text-lg font-semibold text-zen-900 dark:text-zen-100">
            No saved favorites yet
          </h3>
          <p className="text-xs text-zen-500 max-w-sm mx-auto">
            Click the heart icon on any breathing exercise card to save it here for fast access.
          </p>
          <Link href="/breathing">
            <Button variant="primary">Explore Exercises</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
