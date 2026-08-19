import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, RotateCcw, Bell, Sparkles, Volume2 } from 'lucide-react';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { formatTime } from '@/lib/utils';
import { useUserStore } from '@/lib/store/useUserStore';
import confetti from 'canvas-confetti';

export const MeditationTimer: React.FC = () => {
  const { recordCompletedSession } = useUserStore();

  const [selectedDurationMins, setSelectedDurationMins] = useState(10);
  const [remainingSec, setRemainingSec] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalBellMins, setIntervalBellMins] = useState(5);
  const [ambience, setAmbience] = useState('binaural');

  useEffect(() => {
    setRemainingSec(selectedDurationMins * 60);
  }, [selectedDurationMins]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && remainingSec > 0) {
      timer = setInterval(() => {
        setRemainingSec((prev) => {
          const next = prev - 1;

          // Check interval bells
          if (intervalBellMins > 0 && next > 0 && next % (intervalBellMins * 60) === 0) {
            audioEngine.playBell(523.25, 3.0);
          }

          // Check completion
          if (next <= 0) {
            setIsRunning(false);
            audioEngine.stopAmbience();
            audioEngine.playBell(432, 6.0);
            recordCompletedSession('meditation', 'custom-meditation', 'Guided Meditation Session', selectedDurationMins * 60);
            try {
              confetti({ particleCount: 40, spread: 50 });
            } catch {}
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, remainingSec, intervalBellMins, selectedDurationMins, recordCompletedSession]);

  const toggleStart = () => {
    if (!isRunning) {
      audioEngine.playBell(432, 4.0);
      audioEngine.setAmbience(ambience);
      setIsRunning(true);
    } else {
      audioEngine.stopAmbience();
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    audioEngine.stopAmbience();
    setRemainingSec(selectedDurationMins * 60);
  };

  const presets = [5, 10, 15, 20, 30];

  return (
    <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          Meditation Studio
        </span>
        <h2 className="text-2xl font-display font-semibold text-zen-900 dark:text-zen-100">
          Mindful Silence & Ambience
        </h2>
      </div>

      {/* Preset Duration Selector */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {presets.map((mins) => (
          <button
            key={mins}
            onClick={() => {
              setSelectedDurationMins(mins);
              setIsRunning(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedDurationMins === mins
                ? 'bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950 shadow-md'
                : 'bg-zen-100/70 dark:bg-zen-900/60 text-zen-700 dark:text-zen-300 hover:bg-zen-200'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Big Crisp Countdown Display */}
      <div className="py-8">
        <div className="font-display font-extrabold text-6xl sm:text-7xl tracking-tight text-zen-900 dark:text-zen-100">
          {formatTime(remainingSec)}
        </div>
        <p className="text-xs text-zen-500 mt-2">
          {isRunning ? 'Relax deeply and focus on your breath...' : 'Select your duration and press Start'}
        </p>
      </div>

      {/* Ambience & Interval Bells Settings */}
      <div className="grid grid-cols-2 gap-4 text-left p-4 rounded-2xl bg-zen-100/60 dark:bg-zen-900/40 border border-zen-200/50 dark:border-zen-800/50 text-xs">
        <div>
          <label className="block font-semibold uppercase text-zen-500 mb-1">
            Soundscape Ambience
          </label>
          <select
            value={ambience}
            onChange={(e) => {
              setAmbience(e.target.value);
              if (isRunning) audioEngine.setAmbience(e.target.value);
            }}
            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zen-900 border border-zen-200 dark:border-zen-800 font-medium"
          >
            <option value="binaural">Binaural 432Hz Drone</option>
            <option value="ocean">Ocean Waves</option>
            <option value="rain">Soft Rain</option>
            <option value="forest">Forest Birds</option>
            <option value="brown_noise">Brown Noise</option>
            <option value="silent">Silent Bell Only</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold uppercase text-zen-500 mb-1">
            Interval Bell Chime
          </label>
          <select
            value={intervalBellMins}
            onChange={(e) => setIntervalBellMins(parseInt(e.target.value))}
            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zen-900 border border-zen-200 dark:border-zen-800 font-medium"
          >
            <option value={0}>Off (Start & End only)</option>
            <option value={2}>Every 2 minutes</option>
            <option value={5}>Every 5 minutes</option>
            <option value={10}>Every 10 minutes</option>
          </select>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Button variant="ghost" onClick={handleReset} title="Reset Timer">
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={toggleStart}
          size="lg"
          className="px-8 bg-zen-500 hover:bg-zen-600 text-white dark:bg-zen-400 dark:hover:bg-zen-300 dark:text-zen-950 gap-2 shadow-xl"
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause Meditation' : 'Start Meditation'}</span>
        </Button>
      </div>
    </Card>
  );
};
