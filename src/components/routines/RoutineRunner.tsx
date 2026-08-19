import React, { useState } from 'react';
import { WellnessRoutine } from '@/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Compass, CheckCircle2, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PRESET_EXERCISES } from '@/lib/data/exercises';
import { PRESET_YOGA_ROUTINES } from '@/lib/data/yogaRoutines';
import { useSessionStore } from '@/lib/store/useSessionStore';

interface RoutineRunnerProps {
  routine: WellnessRoutine;
}

export const RoutineRunner: React.FC<RoutineRunnerProps> = ({ routine }) => {
  const router = useRouter();
  const { setActiveExercise } = useSessionStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const currentStep = routine.steps[currentStepIdx];

  const handleStartStep = () => {
    if (currentStep.type === 'breathing') {
      const match = PRESET_EXERCISES.find((e) => e.id === currentStep.referenceId) || PRESET_EXERCISES[0];
      setActiveExercise(match);
      router.push(`/breathing/${match.slug}`);
    } else if (currentStep.type === 'stretching') {
      router.push('/yoga');
    } else if (currentStep.type === 'meditation') {
      router.push('/meditation');
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-zen-200/50 dark:border-zen-800/50 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-zen-500/10 text-zen-500 flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zen-500">
            Wellness Journey
          </span>
          <h2 className="text-xl font-display font-semibold text-zen-900 dark:text-zen-100">
            {routine.title}
          </h2>
        </div>
      </div>

      <p className="text-xs text-zen-600 dark:text-zen-400 leading-relaxed">
        {routine.description}
      </p>

      {/* Steps Checklist Timeline */}
      <div className="space-y-3">
        {routine.steps.map((step, idx) => {
          const isCurrent = idx === currentStepIdx;
          const isDone = idx < currentStepIdx;

          return (
            <div
              key={step.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-zen-500/10 border-zen-500 dark:bg-zen-400/15 dark:border-zen-400 shadow-sm'
                  : isDone
                  ? 'bg-zen-100/60 dark:bg-zen-900/60 border-zen-200 dark:border-zen-800 opacity-80'
                  : 'bg-white/40 dark:bg-zen-900/40 border-zen-200/60 dark:border-zen-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950'
                      : 'bg-zen-200 dark:bg-zen-800 text-zen-600 dark:text-zen-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zen-900 dark:text-zen-100">
                    {step.title}
                  </h4>
                  <span className="text-[11px] text-zen-500 capitalize">{step.type} • {step.durationMins} mins</span>
                </div>
              </div>

              {isCurrent && <ArrowRight className="w-4 h-4 text-zen-500" />}
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <Button onClick={handleStartStep} variant="primary" className="w-full gap-2 py-3.5">
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Step {currentStepIdx + 1}: {currentStep.title}</span>
        </Button>
      </div>
    </Card>
  );
};
