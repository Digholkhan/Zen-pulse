'use client';

import React from 'react';
import { MeditationTimer } from '@/components/meditation/MeditationTimer';
import { PRESET_MEDITATIONS } from '@/lib/data/meditations';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Brain, Clock, Sparkles } from 'lucide-react';

export default function MeditationPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Mindfulness & Presence
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Meditation Studio
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Customizable meditation timer with interval bells, 432Hz ambient drone soundscapes, and guided topics.
        </p>
      </div>

      {/* Main Interactive Timer */}
      <MeditationTimer />

      {/* Guided Meditation Topics Catalog */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="font-display font-bold text-xl text-zen-900 dark:text-zen-100">
            Guided Meditation Practices
          </h2>
          <p className="text-xs text-zen-500">Structured mindfulness, sleep scans, and anxiety relief techniques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRESET_MEDITATIONS.map((med) => (
            <Card key={med.id} className="p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple">
                    <Brain className="w-3.5 h-3.5" />
                    <span>{med.category.replace('_', ' ')}</span>
                  </Badge>
                  <span className="text-xs font-semibold text-zen-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {med.durationMins} min
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
                  {med.title}
                </h3>
                <p className="text-xs text-zen-600 dark:text-zen-400 mt-2 leading-relaxed">
                  {med.description}
                </p>

                {/* Instructions */}
                <div className="space-y-1.5 mt-4 pt-3 border-t border-zen-200/50 dark:border-zen-800/50">
                  <span className="text-[10px] font-bold uppercase text-zen-500">Key Steps:</span>
                  {med.instructions.map((inst, idx) => (
                    <div key={idx} className="text-[11px] text-zen-600 dark:text-zen-300 flex items-start gap-2">
                      <span className="text-zen-400 font-bold">•</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
