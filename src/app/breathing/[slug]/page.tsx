'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { breathingEngine, EngineTickState } from '@/lib/breathing/BreathingEngine';
import { BreathingVisualizer } from '@/components/breathing/BreathingVisualizer';
import { BreathingControls } from '@/components/breathing/BreathingControls';
import { SafetyModal } from '@/components/breathing/SafetyModal';
import { CompletionModal } from '@/components/breathing/CompletionModal';
import { SoundMixerModal } from '@/components/audio/SoundMixerModal';
import { PRESET_EXERCISES } from '@/lib/data/exercises';
import { useSessionStore } from '@/lib/store/useSessionStore';
import { useUserStore } from '@/lib/store/useUserStore';
import { ArrowLeft, Sparkles, Wind } from 'lucide-react';
import Link from 'next/link';

export default function ActiveBreathingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { getAllExercises } = useSessionStore();
  const { recordCompletedSession, profile } = useUserStore();

  const [engineState, setEngineState] = useState<EngineTickState>(breathingEngine.getState());
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Find exercise by slug
  const allExercises = getAllExercises();
  const exercise = allExercises.find((e) => e.slug === slug) || PRESET_EXERCISES[0];

  useEffect(() => {
    if (!exercise) return;

    // Load exercise into engine
    breathingEngine.loadExercise(exercise);

    // Subscribe to engine tick loop
    const unsubscribe = breathingEngine.subscribe((state) => {
      setEngineState(state);

      // Handle session completed event
      if (state.status === 'completed') {
        recordCompletedSession('breathing', exercise.id, exercise.title, state.totalElapsedSec);
        setIsCompletionOpen(true);
      }
    });

    // Check if safety warning required
    if (exercise.requiresSafetyWarning) {
      setIsSafetyOpen(true);
    } else {
      breathingEngine.start();
    }

    return () => {
      unsubscribe();
      breathingEngine.stop();
    };
  }, [slug, exercise]);

  const handleSafetyConfirm = () => {
    setIsSafetyOpen(false);
    breathingEngine.start();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[calc(100vh-6rem)] flex flex-col justify-between items-center transition-colors ${
        isFullscreen ? 'fixed inset-0 z-50 bg-zen-950 p-6 overflow-hidden' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 py-2">
        <button
          onClick={() => {
            breathingEngine.stop();
            router.back();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-zen-100/70 dark:bg-zen-900/60 text-zen-800 dark:text-zen-200 hover:bg-zen-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="text-center">
          <h1 className="font-display font-bold text-base sm:text-lg text-zen-900 dark:text-zen-100">
            {exercise.title}
          </h1>
          <span className="text-[10px] font-semibold tracking-wider text-zen-500 uppercase">
            {exercise.category.replace('_', ' ')} • {exercise.difficulty}
          </span>
        </div>

        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Main Breathing Visualization Core */}
      <div className="w-full max-w-xl flex-1 flex items-center justify-center">
        <BreathingVisualizer state={engineState} />
      </div>

      {/* Control Bar Footer */}
      <div className="w-full max-w-md pb-6 z-10">
        <BreathingControls
          status={engineState.status}
          onPause={() => breathingEngine.pause()}
          onResume={() => breathingEngine.resume()}
          onRestart={() => {
            breathingEngine.stop();
            breathingEngine.start();
          }}
          onSkipPhase={() => breathingEngine.skipPhase()}
          onSkipRound={() => breathingEngine.skipRound()}
          onEnd={() => {
            breathingEngine.stop();
            router.push('/breathing');
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenMixer={() => setIsMixerOpen(true)}
        />
      </div>

      {/* Modals */}
      <SafetyModal
        isOpen={isSafetyOpen}
        onConfirm={handleSafetyConfirm}
        onCancel={() => router.push('/breathing')}
        noticeText={exercise.safetyNotice}
      />

      <CompletionModal
        isOpen={isCompletionOpen}
        onClose={() => {
          setIsCompletionOpen(false);
          router.push('/progress');
        }}
        title={exercise.title}
        totalDurationSec={engineState.totalElapsedSec}
        roundsCompleted={engineState.currentRound}
        currentStreak={profile.currentStreak}
      />

      <SoundMixerModal isOpen={isMixerOpen} onClose={() => setIsMixerOpen(false)} />
    </div>
  );
}
