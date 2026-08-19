# ZenPulse - Premium Guided Breathing, Meditation, Yoga & Mindfulness Web Application

ZenPulse is a commercial-grade web application focused on **Breathing Exercises, Meditation, Yoga, and Mindfulness Habits**. Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts, and Web Audio API synthesis.

---

## 🌟 Key Features

### 1. High-Precision Breathing Engine
- **Tab-Throttle-Resistant:** Utilizes `requestAnimationFrame` + `performance.now()` delta calculation to eliminate timer drift when browser tabs are backgrounded.
- **Visual Breathing Visualizer:** Concentric multi-ring Framer Motion animation expanding on Inhale, pulsing on Hold, and contracting on Exhale.
- **Multi-Phase & Multi-Round Support:** Inhale, Hold, Exhale, Hold Out, Preparation, Rest, Recovery Inhale, and Retention Holds.

### 2. Guided Wim Hof & Exercise Library
- **Wim Hof-Inspired Power Breath:** Multi-round rhythmic deep breathing + empty-lung retention hold + recovery hold, equipped with safety disclaimers and user confirmation locks.
- **Box Breathing (Navy SEAL 4-4-4-4):** Instant stress relief under pressure.
- **4-7-8 Relaxing Breath:** Natural nervous system tranquilizer for sleep.
- **Coherent 5-5 Resonance:** Maximizes Heart Rate Variability (HRV).
- **Custom Breathing Builder:** Drag, duplicate, reorder, adjust phase durations, set ambient soundscapes, and test with live interactive preview.

### 3. Pure Web Audio API Soundscapes & Voice Guidance
- **No External Media Dependencies:** All chimes, Tibetan singing bowl bells, and binaural phase cues are synthesized in real-time via Web Audio API.
- **Soundscapes:** Ocean Waves, Soft Rain, Forest Canopy, Deep Brown Noise, 432Hz Binaural Drone, and Silent mode.
- **Web Speech API:** Spoken voice cues ("Inhale", "Hold", "Release", "Great work") synchronized with breathing phases.

### 4. Meditation & Yoga Studios
- **Meditation Studio:** Customizable timer (5, 10, 15, 20, 30 min), interval bells, ambient soundscapes, and guided mindfulness topics.
- **Yoga & Movement:** Step-by-step stretch cards, pose timers, alignment tips, target muscle indicators, and rest intervals.
- **Daily Multi-Step Routines:** Guided journeys (Morning Reset, Midday Stress Reset, Deep Sleep Prep).

### 5. Habit Tracking & Analytics
- **Streak Counter:** Flame counter, daily goal progress ring, total mindful minutes, and completed sessions counter.
- **Weekly Practice Bar Chart:** Interactive Recharts visual breakdown.
- **Milestone Badges:** Unlockable achievement system.

### 6. Commercial UX & PWA
- **Theme Support:** Dark & Light natural wellness palette.
- **Mobile Responsive:** Desktop glass sidebar + Mobile bottom navigation bar.
- **PWA:** Installable Web App with offline basic exercise support.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
