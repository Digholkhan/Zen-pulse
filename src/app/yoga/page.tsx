'use client';

import React, { useState } from 'react';
import { PRESET_YOGA_ROUTINES } from '@/lib/data/yogaRoutines';
import { YogaPosePreview, YogaRoutineView } from '@/components/yoga/YogaRoutineView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Activity, Clock, Play, Sparkles } from 'lucide-react';
import { YogaPose, YogaRoutine } from '@/types';

export default function YogaPage() {
  const [selectedRoutine, setSelectedRoutine] = useState<YogaRoutine | null>(null);
  const postureLibrary = Array.from(
    new Map(PRESET_YOGA_ROUTINES.flatMap((routine) => routine.poses).map((pose) => [pose.illustrationKey, pose])).values()
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Movement & Mobility
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Yoga & Stretching Routines
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Simple office desk resets, posture mobility routines, and morning awakening movements.
        </p>
      </div>

      {/* Active Routine Runner or Catalog */}
      {selectedRoutine ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedRoutine(null)} className="text-xs">
            ← Back to All Routines
          </Button>
          <YogaRoutineView routine={selectedRoutine} onFinish={() => setSelectedRoutine(null)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRESET_YOGA_ROUTINES.map((routine) => (
            <Card key={routine.id} className="p-6 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="accent">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{routine.category}</span>
                  </Badge>
                  <span className="text-xs font-semibold text-zen-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{routine.durationMins} min
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
                  {routine.title}
                </h3>
                <p className="text-xs text-zen-600 dark:text-zen-400 mt-2 leading-relaxed">
                  {routine.description}
                </p>

                {/* Pose Summary List */}
                <div className="space-y-2 mt-4 pt-3 border-t border-zen-200/50 dark:border-zen-800/50">
                  <span className="text-[10px] font-bold uppercase text-zen-500">
                    Poses ({routine.poses.length} Movements):
                  </span>
                  {routine.poses.map((pose, idx) => (
                    <div key={pose.id} className="text-[11px] font-medium text-zen-700 dark:text-zen-300 flex items-center justify-between">
                      <span>{idx + 1}. {pose.name}</span>
                      <span className="text-zen-400 text-[10px]">{pose.durationSec}s</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setSelectedRoutine(routine)}
                className="w-full gap-2 mt-4 shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Routine</span>
              </Button>
            </Card>
          ))}
        </div>
      )}

      {!selectedRoutine && (
        <section className="space-y-4" aria-labelledby="posture-library-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                Live posture library
              </span>
              <h2 id="posture-library-heading" className="text-2xl font-display font-bold text-zen-900 dark:text-zen-100">
                Choose a movement to explore
              </h2>
              <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
                Every card shows the posture in motion so you can preview the shape before starting a routine.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zen-500">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {postureLibrary.length} postures
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {postureLibrary.map((pose: YogaPose) => (
              <article key={pose.id} className="rounded-3xl border border-zen-200/70 dark:border-zen-800/70 bg-white/70 dark:bg-zen-950/45 p-3 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-lg">
                <YogaPosePreview pose={pose} />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
