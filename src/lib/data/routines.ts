import { WellnessRoutine } from '@/types';

export const PRESET_ROUTINES: WellnessRoutine[] = [
  {
    id: 'morning-reset-journey',
    title: 'Complete Morning Reset',
    category: 'morning',
    description: 'A 10-minute guided 3-stage morning ritual combining energizing breathwork, movement stretches, and positive intention setting.',
    totalDurationMins: 10,
    steps: [
      { id: 's1', type: 'breathing', referenceId: 'morning-energizer', title: 'Awakening Breathwork', durationMins: 3 },
      { id: 's2', type: 'stretching', referenceId: 'desk-stretching-reset', title: 'Full Spine Mobility', durationMins: 4 },
      { id: 's3', type: 'meditation', referenceId: 'gratitude-heart-opening', title: 'Gratitude Meditation', durationMins: 3 },
    ],
  },
  {
    id: 'stress-melt-journey',
    title: 'Midday Stress Reset Routine',
    category: 'stress',
    description: 'Feeling overwhelmed? Melt tension away with 10 minutes of Box Breathing, posture release, and calming mindfulness.',
    totalDurationMins: 10,
    steps: [
      { id: 'st1', type: 'breathing', referenceId: 'box-breathing', title: 'Box Breathing Focus', durationMins: 4 },
      { id: 'st2', type: 'stretching', referenceId: 'desk-stretching-reset', title: 'Shoulder Strain Release', durationMins: 3 },
      { id: 'st3', type: 'meditation', referenceId: 'stress-release-sanctuary', title: 'Anxiety Dissolver', durationMins: 3 },
    ],
  },
  {
    id: 'deep-sleep-routine',
    title: 'Evening Sanctuary & Deep Sleep Journey',
    category: 'sleep',
    description: 'Prepare your mind and body for restorative REM sleep with extended exhales, bedtime body scan, and rain ambience.',
    totalDurationMins: 15,
    steps: [
      { id: 'sl1', type: 'breathing', referenceId: 'deep-sleep-breath', title: '4-8 Sleep Breathwork', durationMins: 5 },
      { id: 'sl2', type: 'meditation', referenceId: 'deep-sleep-sanctuary', title: 'Bedtime Body Scan', durationMins: 10 },
    ],
  },
];
