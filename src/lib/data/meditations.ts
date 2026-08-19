import { MeditationSession } from '@/types';

export const PRESET_MEDITATIONS: MeditationSession[] = [
  {
    id: 'mindful-awareness',
    title: 'Mindful Breath & Present Awareness',
    category: 'mindfulness',
    durationMins: 10,
    description: 'Anchor yourself in the present moment by noticing sensations in your chest, shoulders, and breath without judgment.',
    ambience: 'binaural',
    instructions: [
      'Find a soft, upright seat with hands resting comfortably on your lap.',
      'Allow your eyes to gently close or hold a soft downward gaze.',
      'Observe each incoming and outgoing breath as an anchor to the present moment.',
      'When thoughts drift, gently escort your focus back to the sensation of air flowing through your nostrils.',
    ],
  },
  {
    id: 'deep-sleep-sanctuary',
    title: 'Deep Sleep Body Scan & Unwinding',
    category: 'sleep',
    durationMins: 15,
    description: 'A soothing evening body scan that releases physical tension from forehead to toes for restful, restorative sleep.',
    ambience: 'rain',
    instructions: [
      'Lie comfortably on your back with blankets covering you.',
      'Take 3 slow deep breaths into your belly.',
      'Bring gentle awareness to your scalp, forehead, jaw, and drop all micro-tensions.',
      'Progressively travel down through shoulders, heart, hips, legs, down to the soles of your feet.',
    ],
  },
  {
    id: 'stress-release-sanctuary',
    title: 'Anxiety Dissolver & Calming Sanctuary',
    category: 'stress',
    durationMins: 5,
    description: 'Quick emotional reset designed to soothe the amygdala during intense moments of overwhelm or stress.',
    ambience: 'ocean',
    instructions: [
      'Place one hand over your heart and one hand over your stomach.',
      'Acknowledge any tightness without pushing it away.',
      'Visualize breathing in cool blue clarity and exhaling warm heavy tension.',
    ],
  },
  {
    id: 'gratitude-heart-opening',
    title: 'Morning Heart Opening & Gratitude',
    category: 'gratitude',
    durationMins: 7,
    description: 'Start your morning by connecting with appreciation for simple life blessings, enhancing positivity and resilience.',
    ambience: 'forest',
    instructions: [
      'Inhale deeply into your heart center.',
      'Bring to mind three things you feel genuinely thankful for today.',
      'Feel the warmth of appreciation spreading through your chest.',
    ],
  },
];
