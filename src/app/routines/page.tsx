'use client';

import React, { useState } from 'react';
import { PRESET_ROUTINES } from '@/lib/data/routines';
import { RoutineRunner } from '@/components/routines/RoutineRunner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Compass, Clock, Play } from 'lucide-react';
import { WellnessRoutine } from '@/types';

export default function RoutinesPage() {
  const [activeRoutine, setActiveRoutine] = useState<WellnessRoutine | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Curated Daily Journeys
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Guided Wellness Routines
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Multi-step daily habits combining breathing exercises, physical movement, and meditation.
        </p>
      </div>

      {activeRoutine ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setActiveRoutine(null)} className="text-xs">
            ← Back to All Routines
          </Button>
          <RoutineRunner routine={activeRoutine} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESET_ROUTINES.map((routine) => (
            <Card key={routine.id} className="p-6 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="zen">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{routine.category}</span>
                  </Badge>
                  <span className="text-xs font-semibold text-zen-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{routine.totalDurationMins} min
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
                  {routine.title}
                </h3>
                <p className="text-xs text-zen-600 dark:text-zen-400 mt-2 leading-relaxed">
                  {routine.description}
                </p>

                {/* Steps List */}
                <div className="space-y-2 mt-4 pt-3 border-t border-zen-200/50 dark:border-zen-800/50">
                  <span className="text-[10px] font-bold uppercase text-zen-500">Sequence Steps:</span>
                  {routine.steps.map((step, idx) => (
                    <div key={step.id} className="text-[11px] font-medium text-zen-700 dark:text-zen-300 flex items-center justify-between">
                      <span>{idx + 1}. {step.title}</span>
                      <span className="text-zen-400 text-[10px] capitalize">{step.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setActiveRoutine(routine)}
                className="w-full gap-2 mt-6 shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Routine</span>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
