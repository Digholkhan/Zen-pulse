import { BreathingExercise, BreathingPhase } from '@/types';
import { audioEngine } from '../audio/AudioEngine';

export type EngineStatus = 'idle' | 'preparing' | 'running' | 'paused' | 'completed';

export interface EngineTickState {
  status: EngineStatus;
  exercise: BreathingExercise | null;
  currentRound: number;
  totalRounds: number;
  currentPhaseIndex: number;
  currentPhase: BreathingPhase | null;
  phaseElapsedSec: number;
  phaseRemainingSec: number;
  totalElapsedSec: number;
  totalRemainingSec: number;
  progressPercent: number;
  visualScale: number;
  wimHofBreathCount?: number; // 1 to 30 for Wim Hof
}

export type EngineCallback = (state: EngineTickState) => void;

export class BreathingEngine {
  private exercise: BreathingExercise | null = null;
  private status: EngineStatus = 'idle';

  private currentRound: number = 1;
  private totalRounds: number = 3;
  private currentPhaseIndex: number = 0;

  private phaseStartTime: number = 0;
  private phaseDurationSec: number = 4;
  private phaseElapsedSec: number = 0;

  private sessionStartTime: number = 0;
  private totalElapsedSec: number = 0;
  private totalDurationSec: number = 0;

  private pausedTime: number = 0;
  private pauseAccumulatedMs: number = 0;

  private wimHofBreathCount: number = 0;

  private rafId: number | null = null;
  private listeners: Set<EngineCallback> = new Set();

  constructor() {}

  public loadExercise(exercise: BreathingExercise, customRounds?: number) {
    this.stop();
    this.exercise = exercise;
    this.totalRounds = customRounds || exercise.defaultRounds;
    this.currentRound = 1;
    this.currentPhaseIndex = 0;
    this.wimHofBreathCount = 0;
    this.status = 'idle';

    this.totalDurationSec = this.getTotalDurationSec();

    this.notify();
  }

  public subscribe(cb: EngineCallback) {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  public start() {
    if (!this.exercise || this.status === 'running') return;

    if (this.status === 'paused') {
      this.resume();
      return;
    }

    this.status = 'preparing';
    this.currentRound = 1;
    this.currentPhaseIndex = -1;
    this.wimHofBreathCount = 0;
    this.pauseAccumulatedMs = 0;

    const now = performance.now();
    this.sessionStartTime = now;
    this.phaseStartTime = now;
    this.phaseDurationSec = 4;

    if (this.exercise.category === 'wim_hof') {
      audioEngine.speak("Welcome to the Wim Hof Method guided session. Get comfortable. Sit or lie down. Are you ready? Let's go!");
    } else {
      audioEngine.speak('Get comfortable. Prepare to breathe.');
    }
    audioEngine.playPhaseCue('prep');

    this.tickLoop();
  }

  public pause() {
    if (this.status !== 'running' && this.status !== 'preparing') return;
    this.status = 'paused';
    this.pausedTime = performance.now();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.notify();
  }

  public resume() {
    if (this.status !== 'paused') return;
    const now = performance.now();
    const pausedDuration = now - this.pausedTime;
    this.pauseAccumulatedMs += pausedDuration;
    this.phaseStartTime += pausedDuration;
    this.status = 'running';
    this.tickLoop();
  }

  public stop() {
    this.status = 'idle';
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.currentRound = 1;
    this.currentPhaseIndex = 0;
    this.wimHofBreathCount = 0;
    this.phaseElapsedSec = 0;
    this.totalElapsedSec = 0;
    audioEngine.stopAmbience();
    this.notify();
  }

  public skipPhase() {
    if (!this.exercise || (this.status !== 'running' && this.status !== 'preparing')) return;
    this.advancePhase();
  }

  public skipRound() {
    if (!this.exercise || this.status !== 'running') return;
    if (this.currentRound < this.totalRounds) {
      this.currentRound++;
      this.currentPhaseIndex = 0;
      this.wimHofBreathCount = 0;
      this.startPhase(0);
    } else {
      this.completeSession();
    }
  }

  private tickLoop = () => {
    if (this.status !== 'running' && this.status !== 'preparing') return;

    const now = performance.now();
    const phaseDeltaMs = now - this.phaseStartTime;
    const phaseElapsed = Math.min(phaseDeltaMs / 1000, this.phaseDurationSec);
    this.phaseElapsedSec = phaseElapsed;

    const totalDeltaMs = now - this.sessionStartTime - this.pauseAccumulatedMs;
    this.totalElapsedSec = Math.max(0, totalDeltaMs / 1000);

    // Provide a couple of original reminders during the long retention phase.
    if (this.exercise?.category === 'wim_hof') {
      const currentPhase = this.exercise.phases[this.currentPhaseIndex];
      if (currentPhase?.type === 'hold_out') {
        const remaining = Math.ceil(this.phaseDurationSec - phaseElapsed);
        if (remaining === 30 && Math.floor(phaseElapsed) === 30) {
          audioEngine.speak('Relax into the moment... Feel your heart beating.');
        } else if (remaining === 5 && Math.floor(phaseElapsed) === Math.floor(this.phaseDurationSec - 5)) {
          audioEngine.speak('3... 2... 1... Prepare for deep recovery inhale.');
        }
      }
    }

    if (phaseElapsed >= this.phaseDurationSec) {
      if (this.status === 'preparing') {
        this.status = 'running';
        if (this.exercise && this.exercise.recommendedSound) {
          audioEngine.setAmbience(this.exercise.recommendedSound);
        }
        this.startPhase(0);
      } else {
        this.advancePhase();
      }
    } else {
      this.notify();
    }

    if (this.status === 'running' || this.status === 'preparing') {
      this.rafId = requestAnimationFrame(this.tickLoop);
    }
  };

  private startPhase(index: number) {
    if (!this.exercise) return;

    this.currentPhaseIndex = index;
    const phase = this.exercise.phases[index];
    this.phaseDurationSec = this.getPhaseDuration(phase, this.currentRound);
    this.phaseStartTime = performance.now();
    this.phaseElapsedSec = 0;

    // Track Wim Hof breath counts
    if (phase.type === 'inhale') {
      this.wimHofBreathCount++;
    }

    // Trigger Audio Cues
    audioEngine.playPhaseCue(phase.type);

    // Use original browser-generated guidance for this protocol.
    if (this.exercise.category === 'wim_hof') {
      if (phase.type === 'inhale') {
        if (this.wimHofBreathCount === 1) {
          audioEngine.speak('Breath 1. Fully in... and let go.');
        } else if (this.wimHofBreathCount === 5) {
          audioEngine.speak('5 breaths. Deeply in... let go.');
        } else if (this.wimHofBreathCount === 10) {
          audioEngine.speak('10 breaths. Keep the rhythm going!');
        } else if (this.wimHofBreathCount === 15) {
          audioEngine.speak('Halfway there. Belly, chest, and head.');
        } else if (this.wimHofBreathCount === 20) {
          audioEngine.speak('20 breaths. 10 more to go!');
        } else if (this.wimHofBreathCount === 25) {
          audioEngine.speak('5 more! Give it all you got!');
        } else if (this.wimHofBreathCount === 30) {
          audioEngine.speak('Last one... Deep breath in... and let go completely.');
        } else {
          audioEngine.speak(phase.label || 'Inhale');
        }
      } else if (phase.type === 'hold_out') {
        audioEngine.speak('Hold your breath. Stop breathing. Relax.');
      } else if (phase.type === 'recovery_inhale') {
        audioEngine.speak('Take a deep breath in... INHALE FULLY... and HOLD for 15 seconds!');
      } else if (phase.type === 'recovery_hold') {
        audioEngine.speak('Squeeze to your head... relax...');
      } else if (phase.type === 'rest') {
        audioEngine.speak('And let go. Beautiful work.');
      } else {
        audioEngine.speak(phase.label);
      }
    } else {
      if (phase.label) {
        audioEngine.speak(phase.label);
      }
    }

    this.notify();
  }

  private getPhaseDuration(phase: BreathingPhase, round: number) {
    if (this.exercise?.category === 'wim_hof' && phase.type === 'hold_out') {
      return [60, 90, 120][Math.min(round - 1, 2)] ?? phase.duration;
    }
    return phase.duration;
  }

  private getTotalDurationSec() {
    if (!this.exercise) return 0;

    return Array.from({ length: this.totalRounds }, (_, index) =>
      this.exercise!.phases.reduce(
        (total, phase) => total + this.getPhaseDuration(phase, index + 1),
        0
      )
    ).reduce((total, roundDuration) => total + roundDuration, 3);
  }

  private advancePhase() {
    if (!this.exercise) return;

    const nextIndex = this.currentPhaseIndex + 1;
    if (nextIndex < this.exercise.phases.length) {
      this.startPhase(nextIndex);
    } else {
      if (this.currentRound < this.totalRounds) {
        this.currentRound++;
        this.wimHofBreathCount = 0;
        audioEngine.playBell(523.25, 2.5);
        audioEngine.speak(`Round ${this.currentRound - 1} completed. Starting Round ${this.currentRound}...`);
        this.startPhase(0);
      } else {
        this.completeSession();
      }
    }
  }

  private completeSession() {
    this.status = 'completed';
    if (this.rafId) cancelAnimationFrame(this.rafId);
    audioEngine.stopAmbience();
    audioEngine.playBell(432, 5.0);
    audioEngine.speak('All rounds completed. You did fantastic. Relax and feel the energy in your body.');
    this.notify();
  }

  public getState(): EngineTickState {
    const currentPhase =
      this.status === 'preparing'
        ? { id: 'prep', type: 'preparation' as const, duration: 4, label: 'Get Ready' }
        : this.exercise && this.currentPhaseIndex >= 0 && this.currentPhaseIndex < this.exercise.phases.length
        ? this.exercise.phases[this.currentPhaseIndex]
        : null;

    const phaseRemainingSec = Math.max(0, Math.ceil(this.phaseDurationSec - this.phaseElapsedSec));
    const totalRemainingSec = Math.max(0, Math.ceil(this.totalDurationSec - this.totalElapsedSec));
    const progressPercent = this.phaseDurationSec > 0 ? (this.phaseElapsedSec / this.phaseDurationSec) * 100 : 0;

    let visualScale = 0.5;
    const progress = this.phaseDurationSec > 0 ? this.phaseElapsedSec / this.phaseDurationSec : 0;

    if (currentPhase) {
      switch (currentPhase.type) {
        case 'inhale':
        case 'recovery_inhale':
          visualScale = progress;
          break;
        case 'hold_in':
        case 'recovery_hold':
          visualScale = 1.0;
          break;
        case 'exhale':
          visualScale = 1 - progress;
          break;
        case 'hold_out':
        case 'rest':
        case 'preparation':
          visualScale = 0.15;
          break;
      }
    }

    return {
      status: this.status,
      exercise: this.exercise,
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      currentPhaseIndex: this.currentPhaseIndex,
      currentPhase,
      phaseElapsedSec: this.phaseElapsedSec,
      phaseRemainingSec,
      totalElapsedSec: Math.floor(this.totalElapsedSec),
      totalRemainingSec,
      progressPercent,
      visualScale,
      wimHofBreathCount: this.wimHofBreathCount,
    };
  }
}

export const breathingEngine = new BreathingEngine();
