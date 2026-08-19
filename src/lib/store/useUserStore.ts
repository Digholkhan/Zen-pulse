import { create } from 'zustand';
import { SessionRecord, UserProfile, Achievement } from '@/types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

interface UserStore {
  profile: UserProfile;
  history: SessionRecord[];
  achievements: Achievement[];
  
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  recordCompletedSession: (type: 'breathing' | 'meditation' | 'yoga' | 'routine', exerciseId: string, title: string, durationSec: number) => void;
  updateDailyGoal: (mins: number) => void;
  toggleReminder: () => void;
  addReminderTime: (time: string) => void;
  removeReminderTime: (time: string) => void;
}

const STORAGE_KEY_PROFILE = 'zenpulse_user_profile';
const STORAGE_KEY_HISTORY = 'zenpulse_session_history';
const STORAGE_KEY_ACHIEVEMENTS = 'zenpulse_achievements';

const loadProfile = (): UserProfile => {
  if (typeof window === 'undefined') {
    return {
      name: 'Mindful Practitioner',
      email: 'user@zenpulse.app',
      dailyGoalMins: 10,
      currentStreak: 3,
      longestStreak: 7,
      totalMinutes: 45,
      totalSessions: 8,
      favorites: ['box-breathing', 'mindful-awareness'],
      remindersEnabled: true,
      reminderTimes: ['08:00', '21:00'],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {}

  return {
    name: 'Mindful Practitioner',
    email: 'user@zenpulse.app',
    dailyGoalMins: 10,
    currentStreak: 3,
    longestStreak: 7,
    totalMinutes: 45,
    totalSessions: 8,
    favorites: ['box-breathing', 'mindful-awareness'],
    remindersEnabled: true,
    reminderTimes: ['08:00', '21:00'],
  };
};

const loadHistory = (): SessionRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
};

export const useUserStore = create<UserStore>((set, get) => ({
  profile: loadProfile(),
  history: loadHistory(),
  achievements: loadAchievements(),

  toggleFavorite: (itemId) => {
    const currentFavs = get().profile.favorites;
    const exists = currentFavs.includes(itemId);
    const updatedFavs = exists ? currentFavs.filter(id => id !== itemId) : [...currentFavs, itemId];

    const updatedProfile = { ...get().profile, favorites: updatedFavs };
    set({ profile: updatedProfile });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    }
  },

  isFavorite: (itemId) => {
    return get().profile.favorites.includes(itemId);
  },

  recordCompletedSession: (type, exerciseId, title, durationSec) => {
    const minutesAdded = Math.max(1, Math.round(durationSec / 60));
    const nowISO = new Date().toISOString();

    const newRecord: SessionRecord = {
      id: `rec_${Date.now()}`,
      type,
      exerciseId,
      title,
      durationSec,
      completedAt: nowISO,
    };

    const updatedHistory = [newRecord, ...get().history];
    const prevProf = get().profile;

    const newTotalMinutes = prevProf.totalMinutes + minutesAdded;
    const newTotalSessions = prevProf.totalSessions + 1;
    const newStreak = prevProf.currentStreak + 1;
    const newLongest = Math.max(newStreak, prevProf.longestStreak);

    const updatedProfile: UserProfile = {
      ...prevProf,
      totalMinutes: newTotalMinutes,
      totalSessions: newTotalSessions,
      currentStreak: newStreak,
      longestStreak: newLongest,
    };

    // Update Achievements
    const updatedAchievements = get().achievements.map(ach => {
      if (ach.id === 'first_breath') return { ...ach, unlocked: true, progress: 100, unlockedAt: nowISO };
      if (ach.id === 'streak_3' && newStreak >= 3) return { ...ach, unlocked: true, progress: 100, unlockedAt: nowISO };
      if (ach.id === 'streak_7' && newStreak >= 7) return { ...ach, unlocked: true, progress: 100, unlockedAt: nowISO };
      if (ach.id === 'mins_50' && newTotalMinutes >= 50) return { ...ach, unlocked: true, progress: 100, unlockedAt: nowISO };
      if (ach.id === 'mins_200' && newTotalMinutes >= 200) return { ...ach, unlocked: true, progress: 100, unlockedAt: nowISO };
      return ach;
    });

    set({
      profile: updatedProfile,
      history: updatedHistory,
      achievements: updatedAchievements,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
      localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(updatedAchievements));
    }
  },

  updateDailyGoal: (mins) => {
    const updatedProfile = { ...get().profile, dailyGoalMins: mins };
    set({ profile: updatedProfile });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    }
  },

  toggleReminder: () => {
    const updatedProfile = { ...get().profile, remindersEnabled: !get().profile.remindersEnabled };
    set({ profile: updatedProfile });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    }
  },

  addReminderTime: (time) => {
    const current = get().profile.reminderTimes;
    if (current.includes(time)) return;
    const updatedProfile = { ...get().profile, reminderTimes: [...current, time] };
    set({ profile: updatedProfile });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    }
  },

  removeReminderTime: (time) => {
    const updatedProfile = { ...get().profile, reminderTimes: get().profile.reminderTimes.filter(t => t !== time) };
    set({ profile: updatedProfile });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    }
  },
}));
