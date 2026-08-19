import React from 'react';
import { Modal } from '../ui/Modal';
import { useAudioStore } from '@/lib/store/useAudioStore';
import { Volume2, VolumeX, Mic, MicOff, CloudRain, Waves, Trees, Wind, Sparkles, Disc, Droplets, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundMixerModal: React.FC<SoundMixerModalProps> = ({ isOpen, onClose }) => {
  const {
    masterVol,
    ambienceVol,
    cueVol,
    voiceVol,
    isMuted,
    voiceGuidanceEnabled,
    currentAmbience,
    setMasterVol,
    setAmbienceVol,
    setCueVol,
    setVoiceVol,
    toggleMute,
    toggleVoiceGuidance,
    setAmbience,
  } = useAudioStore();

  const ambientTracks = [
    { id: 'ocean', label: 'Ocean Waves', icon: Waves },
    { id: 'rain', label: 'Soft Rain', icon: CloudRain },
    { id: 'forest', label: 'Forest Canopy', icon: Trees },
    { id: 'brown_noise', label: 'Deep Brown Noise', icon: Wind },
    { id: 'binaural', label: '432Hz Binaural Drone', icon: Sparkles },
    { id: 'cosmic', label: 'Cosmic Space', icon: Disc },
    { id: 'tibetan', label: 'Tibetan Bowls', icon: Sparkles },
    { id: 'waterfall', label: 'Waterfall Stream', icon: Droplets },
    { id: 'night', label: 'Night Crickets', icon: Moon },
    { id: 'silent', label: 'Silent Mode', icon: VolumeX },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Soundscape & Audio Mixer" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Quick Mute & Voice Guidance Switches */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zen-100/70 dark:bg-zen-900/60 border border-zen-200/50 dark:border-neon-500/20">
          <button
            onClick={toggleMute}
            className="flex items-center gap-3 font-medium text-sm text-zen-800 dark:text-zen-200"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-neon-400" />}
            <span>{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          <button
            onClick={toggleVoiceGuidance}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              voiceGuidanceEnabled
                ? 'bg-neon-500 text-zen-950 shadow-neon'
                : 'bg-zen-200 text-zen-600 dark:bg-zen-800 dark:text-zen-400'
            )}
          >
            {voiceGuidanceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>Wim Hof Voice Cues</span>
          </button>
        </div>

        {/* Ambient Sound Selection Grid */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-zen-500 dark:text-neon-400 uppercase mb-3">
            Soothing Background Ambience
          </label>
          <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {ambientTracks.map((track) => {
              const Icon = track.icon;
              const isActive = currentAmbience === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setAmbience(track.id)}
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition-all text-left border',
                    isActive
                      ? 'bg-neon-500/20 border-neon-400 text-neon-400 shadow-neon'
                      : 'bg-white/40 dark:bg-zen-900/40 border-zen-200/60 dark:border-zen-800/60 text-zen-600 dark:text-zen-400 hover:border-neon-400/50'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-neon-400' : 'opacity-60')} />
                  <span className="truncate">{track.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2 border-t border-zen-200/50 dark:border-zen-800/50">
          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-zen-600 dark:text-zen-300 mb-1.5">
              <span>Master Volume</span>
              <span className="text-neon-400">{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVol}
              onChange={(e) => setMasterVol(parseFloat(e.target.value))}
              className="w-full accent-neon-400 cursor-pointer"
            />
          </div>

          {/* Ambience Volume */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-zen-600 dark:text-zen-300 mb-1.5">
              <span>Ambience Volume</span>
              <span className="text-neon-400">{Math.round(ambienceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambienceVol}
              onChange={(e) => setAmbienceVol(parseFloat(e.target.value))}
              className="w-full accent-neon-400 cursor-pointer"
            />
          </div>

          {/* Voice Volume */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-zen-600 dark:text-zen-300 mb-1.5">
              <span>Deep Male Voice Volume</span>
              <span className="text-neon-400">{Math.round(voiceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceVol}
              onChange={(e) => setVoiceVol(parseFloat(e.target.value))}
              className="w-full accent-neon-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
