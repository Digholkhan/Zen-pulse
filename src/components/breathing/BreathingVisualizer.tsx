import React from 'react';
import { motion } from 'framer-motion';
import { EngineTickState } from '@/lib/breathing/BreathingEngine';
import { formatTime } from '@/lib/utils';
import { Sparkles, Wind } from 'lucide-react';

interface BreathingVisualizerProps {
  state: EngineTickState;
}

export const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({ state }) => {
  const {
    currentPhase,
    phaseRemainingSec,
    currentRound,
    totalRounds,
    totalRemainingSec,
    visualScale,
    status,
    wimHofBreathCount,
    exercise,
  } = state;

  const isWimHof = exercise?.category === 'wim_hof';
  const baseSize = 220;
  const currentSize = baseSize + visualScale * 120;

  const phaseTitle = currentPhase?.label || (status === 'preparing' ? 'Get Comfortable' : 'Breathe');
  const phaseType = currentPhase?.type || 'prep';

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[440px] sm:min-h-[520px] w-full py-8">
      {/* Session Progress Header */}
      <div className="text-center mb-8 z-10 space-y-1">
        <span className="text-xs font-black uppercase tracking-widest text-neon-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Round {currentRound} of {totalRounds}</span>
        </span>
        <div className="text-sm font-semibold text-zen-300">
          {formatTime(totalRemainingSec)} remaining
        </div>

        {/* Wim Hof Breath Counter Pill */}
        {isWimHof && wimHofBreathCount && wimHofBreathCount > 0 && phaseType !== 'hold_out' && (
          <div className="inline-block px-3 py-1 mt-2 rounded-full bg-neon-500/20 border border-neon-400 text-neon-400 text-xs font-extrabold shadow-neon animate-pulse">
            Breath {wimHofBreathCount} / 30
          </div>
        )}
      </div>

      {/* Concentric Soft Neon Green Visualization Rings */}
      <div className="relative flex items-center justify-center w-[350px] h-[350px] sm:w-[420px] sm:h-[420px]">
        {/* Outermost Pulsing Soft Neon Ambient Glow */}
        <motion.div
          animate={{
            scale: 0.85 + visualScale * 0.4,
            opacity: 0.25 + visualScale * 0.45,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-500 via-emerald-400 to-teal-300 blur-3xl"
        />

        {/* Outer Ring */}
        <motion.div
          animate={{
            width: currentSize + 45,
            height: currentSize + 45,
            opacity: 0.4 + visualScale * 0.45,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute rounded-full border border-neon-400/40 shadow-neon"
        />

        {/* Middle Soft Ring */}
        <motion.div
          animate={{
            width: currentSize + 18,
            height: currentSize + 18,
            opacity: 0.6 + visualScale * 0.35,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute rounded-full border-2 border-neon-400/60 bg-neon-500/10 backdrop-blur-md"
        />

        {/* Central Breathing Core Circle */}
        <motion.div
          animate={{
            width: currentSize,
            height: currentSize,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-neon-400 via-zen-600 to-zen-950 text-zen-950 dark:text-zen-950 font-bold shadow-neon-lg breathing-ring p-6 text-center cursor-default select-none border-2 border-neon-300"
        >
          {/* Phase Countdown Seconds */}
          <motion.span
            key={phaseRemainingSec}
            initial={{ scale: 1.15, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display font-black text-6xl sm:text-7xl tracking-tight text-zen-950 drop-shadow-md"
          >
            {phaseRemainingSec}
          </motion.span>

          {/* Phase Instruction Label */}
          <motion.span
            key={phaseTitle}
            initial={{ y: 5, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display font-extrabold text-base sm:text-lg tracking-wider uppercase mt-2 text-zen-950 drop-shadow"
          >
            {phaseTitle}
          </motion.span>
        </motion.div>
      </div>

      {/* Dynamic Subtext Instruction */}
      <div className="mt-8 text-center z-10 max-w-xs">
        <p className="text-xs sm:text-sm font-semibold text-zen-300">
          {phaseType === 'inhale' || phaseType === 'recovery_inhale'
            ? '↗ Inhale deeply into your chest & lower belly'
            : phaseType === 'hold_in' || phaseType === 'hold_out' || phaseType === 'recovery_hold'
            ? '⏸ Hold softly without chest tension'
            : phaseType === 'exhale'
            ? '↘ Release smoothly through relaxed mouth'
            : 'Get ready for the Wim Hof session'}
        </p>
      </div>
    </div>
  );
};
