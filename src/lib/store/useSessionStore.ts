import { create } from 'zustand';
import { BreathingExercise } from '@/types';
import { PRESET_EXERCISES } from '../data/exercises';

interface SessionStore {
  customExercises: BreathingExercise[];
  activeExercise: BreathingExercise | null;
  activeRounds: number;
  
  addCustomExercise: (exercise: BreathingExercise) => void;
  deleteCustomExercise: (id: string) => void;
  setActiveExercise: (exercise: BreathingExercise, rounds?: number) => void;
  clearActiveExercise: () => void;
  getAllExercises: () => BreathingExercise[];
}

// Load custom exercises from localStorage if available
const getStoredCustom = (): BreathingExercise[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('zenpulse_custom_exercises');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  customExercises: getStoredCustom(),
  activeExercise: null,
  activeRounds: 4,

  addCustomExercise: (exercise) => {
    const updated = [exercise, ...get().customExercises];
    set({ customExercises: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenpulse_custom_exercises', JSON.stringify(updated));
    }
  },

  deleteCustomExercise: (id) => {
    const updated = get().customExercises.filter(e => e.id !== id);
    set({ customExercises: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenpulse_custom_exercises', JSON.stringify(updated));
    }
  },

  setActiveExercise: (exercise, rounds) => {
    set({
      activeExercise: exercise,
      activeRounds: rounds || exercise.defaultRounds,
    });
  },

  clearActiveExercise: () => {
    set({ activeExercise: null });
  },

  getAllExercises: () => {
    return [...get().customExercises, ...PRESET_EXERCISES];
  },
}));
