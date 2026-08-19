import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Maximize2, Minimize2, X, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { EngineStatus } from '@/lib/breathing/BreathingEngine';

interface BreathingControlsProps {
  status: EngineStatus;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onSkipPhase: () => void;
  onSkipRound: () => void;
  onEnd: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenMixer: () => void;
}

export const BreathingControls: React.FC<BreathingControlsProps> = ({
  status,
  onPause,
  onResume,
  onRestart,
  onSkipPhase,
  onSkipRound,
  onEnd,
  isFullscreen,
  onToggleFullscreen,
  onOpenMixer,
}) => {
  const isRunning = status === 'running' || status === 'preparing';

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 rounded-full glass-card border border-white/30 dark:border-zen-800/80 shadow-2xl backdrop-blur-2xl">
      {/* Sound Mixer */}
      <button
        onClick={onOpenMixer}
        className="p-3 rounded-full text-zen-700 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-900/60 transition-colors"
        title="Adjust Audio & Ambience"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* Skip Phase */}
      <button
        onClick={onSkipPhase}
        className="p-3 rounded-full text-zen-700 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-900/60 transition-colors"
        title="Skip Current Phase"
      >
        <FastForward className="w-5 h-5" />
      </button>

      {/* Main Play / Pause Button */}
      {isRunning ? (
        <Button
          onClick={onPause}
          size="lg"
          className="w-14 h-14 !p-0 rounded-full bg-zen-500 hover:bg-zen-600 text-white dark:bg-zen-400 dark:hover:bg-zen-300 dark:text-zen-950 shadow-xl"
          title="Pause Session"
        >
          <Pause className="w-6 h-6 fill-current" />
        </Button>
      ) : (
        <Button
          onClick={onResume}
          size="lg"
          className="w-14 h-14 !p-0 rounded-full bg-zen-500 hover:bg-zen-600 text-white dark:bg-zen-400 dark:hover:bg-zen-300 dark:text-zen-950 shadow-xl"
          title="Resume Session"
        >
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </Button>
      )}

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className="p-3 rounded-full text-zen-700 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-900/60 transition-colors"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>

      {/* End Session */}
      <button
        onClick={onEnd}
        className="p-3 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
        title="End Session"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
