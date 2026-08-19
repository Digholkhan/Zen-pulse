import { create } from 'zustand';
import { audioEngine } from '../audio/AudioEngine';

interface AudioStore {
  masterVol: number;
  ambienceVol: number;
  cueVol: number;
  voiceVol: number;
  isMuted: boolean;
  voiceGuidanceEnabled: boolean;
  currentAmbience: string;

  setMasterVol: (val: number) => void;
  setAmbienceVol: (val: number) => void;
  setCueVol: (val: number) => void;
  setVoiceVol: (val: number) => void;
  toggleMute: () => void;
  toggleVoiceGuidance: () => void;
  setAmbience: (type: string) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  masterVol: 0.8,
  ambienceVol: 0.5,
  cueVol: 0.7,
  voiceVol: 0.8,
  isMuted: false,
  voiceGuidanceEnabled: true,
  currentAmbience: 'ocean',

  setMasterVol: (val) => {
    audioEngine.setMasterVolume(val);
    set({ masterVol: val });
  },

  setAmbienceVol: (val) => {
    audioEngine.setAmbienceVolume(val);
    set({ ambienceVol: val });
  },

  setCueVol: (val) => {
    audioEngine.setCueVolume(val);
    set({ cueVol: val });
  },

  setVoiceVol: (val) => {
    audioEngine.setVoiceVolume(val);
    set({ voiceVol: val });
  },

  toggleMute: () => {
    const muted = audioEngine.toggleMute();
    set({ isMuted: muted });
  },

  toggleVoiceGuidance: () => {
    const next = !get().voiceGuidanceEnabled;
    audioEngine.setVoiceEnabled(next);
    set({ voiceGuidanceEnabled: next });
  },

  setAmbience: (type) => {
    audioEngine.setAmbience(type);
    set({ currentAmbience: type });
  },
}));
