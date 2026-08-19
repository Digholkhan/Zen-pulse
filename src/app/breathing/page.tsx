'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/lib/store/useSessionStore';
import { ExerciseCard } from '@/components/breathing/ExerciseCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Plus, SlidersHorizontal, Wind, Sparkles } from 'lucide-react';

export default function BreathingPage() {
  const { getAllExercises } = useSessionStore();
  const allExercises = getAllExercises();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Techniques' },
    { id: 'box', label: 'Box Breathing' },
    { id: 'relaxing', label: 'Relaxing (4-7-8)' },
    { id: 'wim_hof', label: 'Wim Hof Guided' },
    { id: 'energizing', label: 'Energizing' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'custom', label: 'My Custom Patterns' },
  ];

  const filteredExercises = allExercises.filter((ex) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
            Breathing Engine Library
          </span>
          <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            Explore Breathing Exercises
          </h1>
          <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
            Choose from science-backed breath patterns or build your own custom sequence.
          </p>
        </div>

        <Link href="/breathing/custom">
          <Button variant="primary" className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Create Custom Pattern</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zen-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search exercise name or benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-xs font-medium focus:ring-2 focus:ring-zen-400 outline-none"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-zen-400 shrink-0" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-xs font-medium outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950 shadow-md'
                  : 'bg-zen-100/60 dark:bg-zen-900/60 text-zen-700 dark:text-zen-300 hover:bg-zen-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <Wind className="w-10 h-10 text-zen-400 mx-auto" />
          <h3 className="text-lg font-semibold text-zen-900 dark:text-zen-100">
            No matching exercises found
          </h3>
          <p className="text-xs text-zen-500 max-w-sm mx-auto">
            Try adjusting your search criteria or create a custom pattern matching your needs.
          </p>
          <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all'); }}>
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
