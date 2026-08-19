import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingExercise, BreathingPhase, PhaseType } from '@/types';
import { useSessionStore } from '@/lib/store/useSessionStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, Play, Save, Sparkles, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomBuilder: React.FC = () => {
  const router = useRouter();
  const { addCustomExercise, setActiveExercise } = useSessionStore();

  const [title, setTitle] = useState('My Custom Reset Breath');
  const [description, setDescription] = useState('Personalized breathing pattern created in ZenPulse.');
  const [rounds, setRounds] = useState(5);
  const [recommendedSound, setRecommendedSound] = useState('ocean');

  const [phases, setPhases] = useState<BreathingPhase[]>([
    { id: '1', type: 'inhale', duration: 4, label: 'Breathe In' },
    { id: '2', type: 'hold_in', duration: 4, label: 'Hold' },
    { id: '3', type: 'exhale', duration: 6, label: 'Breathe Out' },
    { id: '4', type: 'hold_out', duration: 2, label: 'Hold' },
  ]);

  // Live preview current phase index
  const [previewPhaseIndex, setPreviewPhaseIndex] = useState(0);

  const addPhase = (type: PhaseType = 'inhale') => {
    const labels: Record<PhaseType, string> = {
      preparation: 'Get Ready',
      inhale: 'Breathe In',
      hold_in: 'Hold Breath',
      exhale: 'Breathe Out',
      hold_out: 'Hold Breath',
      recovery_inhale: 'Deep Recovery Inhale',
      recovery_hold: 'Hold In',
      rest: 'Rest & Reset',
    };

    const newPhase: BreathingPhase = {
      id: `p_${Date.now()}_${Math.random()}`,
      type,
      duration: 4,
      label: labels[type] || 'Breathe',
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (index: number) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter((_, i) => i !== index));
  };

  const duplicatePhase = (index: number) => {
    const target = phases[index];
    const copy: BreathingPhase = {
      ...target,
      id: `p_${Date.now()}_${Math.random()}`,
    };
    const updated = [...phases];
    updated.splice(index + 1, 0, copy);
    setPhases(updated);
  };

  const movePhase = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === phases.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...phases];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPhases(updated);
  };

  const updatePhase = (index: number, field: keyof BreathingPhase, value: unknown) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const singleRoundSec = phases.reduce((acc, p) => acc + p.duration, 0);
  const totalDurationMins = Math.max(1, Math.round((singleRoundSec * rounds) / 60));

  const handleSaveAndLaunch = () => {
    const newEx: BreathingExercise = {
      id: `custom_${Date.now()}`,
      slug: `custom-${Date.now()}`,
      title,
      description,
      category: 'custom',
      difficulty: 'Intermediate',
      durationMins: totalDurationMins,
      benefits: ['Personalized pace', 'Tailored nervous system reset'],
      phases,
      defaultRounds: rounds,
      recommendedSound,
      isCustom: true,
    };

    addCustomExercise(newEx);
    setActiveExercise(newEx, rounds);
    router.push(`/breathing/${newEx.slug}`);
  };

  // Preview phase scale
  const currentPreviewPhase = phases[previewPhaseIndex] || phases[0];
  const previewScale =
    currentPreviewPhase.type === 'inhale'
      ? 1.0
      : currentPreviewPhase.type === 'exhale'
      ? 0.3
      : currentPreviewPhase.type === 'hold_in'
      ? 0.95
      : 0.4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Builder Form Controls */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center gap-3 border-b border-zen-200/50 dark:border-zen-800/50 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-zen-500/10 text-zen-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-zen-900 dark:text-zen-100">
                Custom Exercise Builder
              </h2>
              <p className="text-xs text-zen-600 dark:text-zen-400">
                Design your own inhale, hold, exhale, and rest sequences.
              </p>
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zen-500 mb-1.5">
                Exercise Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-sm font-medium focus:ring-2 focus:ring-zen-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zen-500 mb-1.5">
                  Number of Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={rounds}
                  onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-sm font-medium focus:ring-2 focus:ring-zen-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zen-500 mb-1.5">
                  Background Ambience
                </label>
                <select
                  value={recommendedSound}
                  onChange={(e) => setRecommendedSound(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-sm font-medium focus:ring-2 focus:ring-zen-400 outline-none"
                >
                  <option value="ocean">Ocean Waves</option>
                  <option value="rain">Soft Rain</option>
                  <option value="forest">Forest Canopy</option>
                  <option value="brown_noise">Brown Noise</option>
                  <option value="binaural">Binaural Drone</option>
                  <option value="silent">Silent Mode</option>
                </select>
              </div>
            </div>
          </div>

          {/* Phase Manager */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase text-zen-500">
                Phase Sequence ({phases.length} Phases)
              </label>

              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => addPhase('inhale')}>
                  + Inhale
                </Button>
                <Button size="sm" variant="ghost" onClick={() => addPhase('hold_in')}>
                  + Hold
                </Button>
                <Button size="sm" variant="ghost" onClick={() => addPhase('exhale')}>
                  + Exhale
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  onClick={() => setPreviewPhaseIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    previewPhaseIndex === idx
                      ? 'bg-zen-500/10 border-zen-500 dark:bg-zen-400/10 dark:border-zen-400'
                      : 'bg-white/40 dark:bg-zen-900/40 border-zen-200/60 dark:border-zen-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="w-6 h-6 rounded-full bg-zen-200 dark:bg-zen-800 text-[11px] font-bold text-zen-700 dark:text-zen-300 flex items-center justify-center">
                      {idx + 1}
                    </span>

                    {/* Phase Type Select */}
                    <select
                      value={phase.type}
                      onChange={(e) => updatePhase(idx, 'type', e.target.value as PhaseType)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-zen-900 border border-zen-200 dark:border-zen-800 text-xs font-semibold"
                    >
                      <option value="inhale">Inhale</option>
                      <option value="hold_in">Hold (In)</option>
                      <option value="exhale">Exhale</option>
                      <option value="hold_out">Hold (Out)</option>
                      <option value="rest">Rest</option>
                    </select>

                    {/* Duration Input */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-zen-700 dark:text-zen-300">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={phase.duration}
                        onChange={(e) =>
                          updatePhase(idx, 'duration', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-14 px-2 py-1 rounded-xl bg-white dark:bg-zen-900 border border-zen-200 dark:border-zen-800 text-center text-xs"
                      />
                      <span>sec</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => movePhase(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-zen-400 hover:text-zen-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => movePhase(idx, 'down')}
                      disabled={idx === phases.length - 1}
                      className="p-1.5 rounded-lg text-zen-400 hover:text-zen-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicatePhase(idx)}
                      className="p-1.5 rounded-lg text-zen-400 hover:text-zen-700"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => removePhase(idx)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zen-200/50 dark:border-zen-800/50 flex items-center justify-between">
            <div className="text-xs text-zen-600 dark:text-zen-400">
              Single Round: <span className="font-bold text-zen-900 dark:text-zen-100">{singleRoundSec}s</span> | Total Session: ~<span className="font-bold text-zen-900 dark:text-zen-100">{totalDurationMins} mins</span>
            </div>

            <Button variant="primary" onClick={handleSaveAndLaunch} className="gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>Save & Start Exercise</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Live Interactive Visualization Preview Side Card */}
      <div className="lg:col-span-5 sticky top-24">
        <Card className="text-center p-8 space-y-6 flex flex-col items-center justify-center min-h-[420px]">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zen-500">
            Live Preview Visualizer
          </span>

          <div className="relative flex items-center justify-center w-64 h-64 my-4">
            <motion.div
              animate={{
                scale: previewScale,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-44 h-44 rounded-full bg-gradient-to-br from-zen-400 to-zen-600 dark:from-zen-300 dark:to-zen-500 text-white dark:text-zen-950 flex flex-col items-center justify-center shadow-2xl breathing-ring p-4"
            >
              <span className="text-3xl font-extrabold font-display">
                {currentPreviewPhase.duration}s
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase mt-1">
                {currentPreviewPhase.label}
              </span>
            </motion.div>
          </div>

          <p className="text-xs text-zen-500 max-w-xs">
            Select a phase on the left to inspect scale response and timing parameters.
          </p>
        </Card>
      </div>
    </div>
  );
};
