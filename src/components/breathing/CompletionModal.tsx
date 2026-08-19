import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Flame, Clock, Award, CheckCircle2 } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalDurationSec: number;
  roundsCompleted: number;
  currentStreak: number;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  title,
  totalDurationSec,
  roundsCompleted,
  currentStreak,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire subtle celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#52887e', '#70a49a', '#9ec4bc', '#f59e0b'],
        });
      } catch {}
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center space-y-6 py-2">
        {/* Animated Celebration Header */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-zen-500 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-zen-500/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-zen-900 dark:text-zen-100">
            Beautiful Work.
          </h2>
          <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
            You successfully completed <span className="font-semibold text-zen-800 dark:text-zen-200">{title}</span>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-zen-100/70 dark:bg-zen-900/60 border border-zen-200/60 dark:border-zen-800/60">
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-zen-500 mb-1" />
            <span className="text-lg font-bold text-zen-900 dark:text-zen-100">
              {formatTime(totalDurationSec)}
            </span>
            <span className="text-[10px] text-zen-500 uppercase font-semibold">Duration</span>
          </div>

          <div className="flex flex-col items-center border-x border-zen-200/60 dark:border-zen-800/60">
            <Sparkles className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-lg font-bold text-zen-900 dark:text-zen-100">
              {roundsCompleted}
            </span>
            <span className="text-[10px] text-zen-500 uppercase font-semibold">Rounds</span>
          </div>

          <div className="flex flex-col items-center">
            <Flame className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-lg font-bold text-zen-900 dark:text-zen-100">
              +{currentStreak} Days
            </span>
            <span className="text-[10px] text-zen-500 uppercase font-semibold">Streak</span>
          </div>
        </div>

        {/* Affirmation */}
        <p className="text-xs italic text-zen-600 dark:text-zen-400">
          "Deep breathing is your body's natural built-in stress reset button."
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Done
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            View Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
};
