import { Achievement } from '@/types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_breath',
    title: 'First Step',
    description: 'Completed your first breathing or wellness session.',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_3',
    title: '3-Day Harmony',
    description: 'Maintained a 3-day consecutive practice streak.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_7',
    title: '7-Day Zen Master',
    description: 'Practiced mindfully for 7 straight days.',
    icon: 'Award',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'mins_50',
    title: '50 Minutes of Mind',
    description: 'Accumulated 50 total minutes of breathwork & meditation.',
    icon: 'Clock',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'mins_200',
    title: '200 Minutes Deep Calm',
    description: 'Accumulated 200 total practice minutes.',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'custom_creator',
    title: 'Architect of Calm',
    description: 'Created and saved your own custom breathing exercise.',
    icon: 'Sliders',
    unlocked: false,
    progress: 0,
  },
];
