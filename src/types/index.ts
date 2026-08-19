export type PhaseType =
  | 'preparation'
  | 'inhale'
  | 'hold_in'
  | 'exhale'
  | 'hold_out'
  | 'recovery_inhale'
  | 'recovery_hold'
  | 'rest';

export interface BreathingPhase {
  id: string;
  type: PhaseType;
  duration: number; // in seconds
  label: string; // e.g. "Breathe In", "Hold", "Release slowly"
  description?: string;
  cueAudio?: string;
}

export interface BreathingExercise {
  id: string;
  slug: string;
  title: string;
  category: 'box' | 'relaxing' | 'energizing' | 'wim_hof' | 'focus' | 'sleep' | 'beginner' | 'custom';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMins: number;
  description: string;
  benefits: string[];
  phases: BreathingPhase[];
  defaultRounds: number;
  requiresSafetyWarning?: boolean;
  safetyNotice?: string;
  recommendedSound?: string;
  isCustom?: boolean;
}

export interface MeditationSession {
  id: string;
  title: string;
  category: 'mindfulness' | 'sleep' | 'stress' | 'focus' | 'gratitude' | 'body_scan';
  durationMins: number;
  description: string;
  ambience: string;
  guidedVoice?: boolean;
  instructions: string[];
}

export interface YogaPose {
  id: string;
  name: string;
  durationSec: number;
  instructions: string;
  targetArea: string;
  tips: string;
  illustrationKey: string;
}

export interface YogaRoutine {
  id: string;
  title: string;
  category: 'morning' | 'desk' | 'neck_shoulder' | 'beginner' | 'evening' | 'mobility';
  durationMins: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  poses: YogaPose[];
  restBetweenPosesSec: number;
}

export interface WellnessRoutineStep {
  id: string;
  type: 'breathing' | 'stretching' | 'meditation';
  referenceId: string; // exercise or routine or meditation id
  title: string;
  durationMins: number;
}

export interface WellnessRoutine {
  id: string;
  title: string;
  category: 'morning' | 'stress' | 'sleep' | 'focus';
  description: string;
  steps: WellnessRoutineStep[];
  totalDurationMins: number;
}

export interface SessionRecord {
  id: string;
  type: 'breathing' | 'meditation' | 'yoga' | 'routine';
  exerciseId: string;
  title: string;
  durationSec: number;
  completedAt: string; // ISO date string
}

export interface UserProfile {
  name: string;
  email: string;
  dailyGoalMins: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  totalSessions: number;
  favorites: string[]; // item IDs
  remindersEnabled: boolean;
  reminderTimes: string[]; // ["08:00", "21:00"]
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface SoundTrack {
  id: string;
  name: string;
  category: 'nature' | 'noise' | 'music' | 'silent';
  icon: string;
}
