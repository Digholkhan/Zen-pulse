/**
 * ZenPulse Web Audio API Synthesizer & Voice Guidance Engine
 * Uses pure Web Audio API synthesis for background soundscapes, bells, and cue tones,
 * with browser-generated voice guidance for breathing protocols.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private cueGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  // Active ambient noise source nodes
  private activeAmbienceNodes: { stop: () => void }[] = [];

  // Settings
  private isMuted: boolean = false;
  private masterVol: number = 0.85;
  private ambienceVol: number = 0.5;
  private cueVol: number = 0.7;
  private voiceVol: number = 0.95;
  private voiceGuidanceEnabled: boolean = true;
  private currentAmbience: string = 'ocean';

  constructor() {}

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.ambienceGain = this.ctx.createGain();
      this.cueGain = this.ctx.createGain();
      this.voiceGain = this.ctx.createGain();

      this.masterGain.gain.value = this.masterVol;
      this.ambienceGain.gain.value = this.ambienceVol;
      this.cueGain.gain.value = this.cueVol;
      this.voiceGain.gain.value = this.voiceVol;

      this.ambienceGain.connect(this.masterGain);
      this.cueGain.connect(this.masterGain);
      this.voiceGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVol = val;
    if (this.masterGain) this.masterGain.gain.value = this.isMuted ? 0 : val;
  }

  public setAmbienceVolume(val: number) {
    this.ambienceVol = val;
    if (this.ambienceGain) this.ambienceGain.gain.value = val;
  }

  public setCueVolume(val: number) {
    this.cueVol = val;
    if (this.cueGain) this.cueGain.gain.value = val;
  }

  public setVoiceVolume(val: number) {
    this.voiceVol = val;
    if (this.voiceGain) this.voiceGain.gain.value = val;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVol;
    }
    return this.isMuted;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceGuidanceEnabled = enabled;
  }

  /** Browser-generated voice guidance with a calm, low cadence. */
  public speak(text: string) {
    if (!this.voiceGuidanceEnabled || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any queued speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.7;
      utterance.rate = 0.82;
      utterance.volume = this.voiceVol;

      const voices = window.speechSynthesis.getVoices();
      
      // Select a low English voice when the browser exposes one.
      const deepMaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (name.includes('male') || name.includes('david') || name.includes('daniel') || name.includes('uk english male') || name.includes('george') || name.includes('james') || name.includes('wavenet-d') || name.includes('natural'))
        );
      }) || voices.find(v => v.lang.startsWith('en'));

      if (deepMaleVoice) {
        utterance.voice = deepMaleVoice;
      }

      window.speechSynthesis.speak(utterance);

      // Play soft deep warm grounding sub-bass tone under voice
      this.playVoiceSubBass();
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Warm sub-bass resonance tone (55Hz) under spoken cues
   */
  private playVoiceSubBass() {
    this.initCtx();
    if (!this.ctx || !this.voiceGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, now); // Deep A1 grounding note

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.voiceGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  /**
   * Synthesize Tibetan Singing Bowl Bell Chime
   */
  public playBell(frequency = 432, duration = 4.5) {
    this.initCtx();
    if (!this.ctx || !this.cueGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2.76, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.01, now);
    gain2.gain.exponentialRampToValueAtTime(0.15, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.cueGain);
    gain2.connect(this.cueGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Breath phase audio cues
   */
  public playPhaseCue(phaseType: string) {
    this.initCtx();
    if (!this.ctx || !this.cueGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';

    if (phaseType === 'inhale' || phaseType === 'recovery_inhale') {
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.9);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.9);
    } else if (phaseType === 'hold' || phaseType === 'hold_in' || phaseType === 'hold_out' || phaseType === 'recovery_hold') {
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.7);
    } else if (phaseType === 'exhale') {
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.9);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.9);
    } else {
      osc.frequency.setValueAtTime(432, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    }

    osc.connect(gain);
    gain.connect(this.cueGain);

    osc.start(now);
    osc.stop(now + 1.0);
  }

  /**
   * Set ambient background sound generator
   */
  public setAmbience(type: string) {
    this.currentAmbience = type;
    this.stopAmbience();

    if (type === 'silent' || this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.ambienceGain) return;

    if (type === 'rain') {
      this.startRainSynth();
    } else if (type === 'ocean') {
      this.startOceanSynth();
    } else if (type === 'noise' || type === 'brown_noise') {
      this.startBrownNoiseSynth();
    } else if (type === 'forest' || type === 'wind') {
      this.startWindSynth();
    } else if (type === 'meditation' || type === 'binaural') {
      this.startBinauralDroneSynth();
    } else if (type === 'cosmic') {
      this.startCosmicSpaceSynth();
    } else if (type === 'tibetan') {
      this.startTibetanBowlsSynth();
    } else if (type === 'waterfall') {
      this.startWaterfallSynth();
    } else if (type === 'night') {
      this.startNightCricketsSynth();
    }
  }

  public stopAmbience() {
    this.activeAmbienceNodes.forEach(node => node.stop());
    this.activeAmbienceNodes = [];
  }

  // --- Synthetic Soothing Soundscapes ---

  private startBrownNoiseSynth() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 350;

    whiteNoise.connect(lowpass);
    lowpass.connect(this.ambienceGain);
    whiteNoise.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { whiteNoise.stop(); } catch {}
      }
    });
  }

  private startOceanSynth() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.ambienceGain);

    noise.start();
    lfo.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { noise.stop(); lfo.stop(); } catch {}
      }
    });
  }

  private startRainSynth() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 1.0;

    noise.connect(bandpass);
    bandpass.connect(this.ambienceGain);
    noise.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { noise.stop(); } catch {}
      }
    });
  }

  private startWindSynth() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 3.0;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 400;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.ambienceGain);

    noise.start();
    lfo.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { noise.stop(); lfo.stop(); } catch {}
      }
    });
  }

  private startBinauralDroneSynth() {
    if (!this.ctx || !this.ambienceGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 108;
    gain1.gain.value = 0.2;

    osc2.type = 'sine';
    osc2.frequency.value = 114;
    gain2.gain.value = 0.2;

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.ambienceGain);
    gain2.connect(this.ambienceGain);

    osc1.start();
    osc2.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { osc1.stop(); osc2.stop(); } catch {}
      }
    });
  }

  private startCosmicSpaceSynth() {
    if (!this.ctx || !this.ambienceGain) return;

    // Ethereal low frequency synth pad with chorus effect
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.value = 65.41; // C2 note
    gain1.gain.value = 0.15;

    osc2.type = 'sine';
    osc2.frequency.value = 196.0; // G3 fifth harmony
    gain2.gain.value = 0.1;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.ambienceGain);

    osc1.start();
    osc2.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { osc1.stop(); osc2.stop(); } catch {}
      }
    });
  }

  private startTibetanBowlsSynth() {
    if (!this.ctx || !this.ambienceGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 216; // Harmonic sub 432
    osc2.type = 'sine';
    osc2.frequency.value = 432;

    gain.gain.value = 0.18;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ambienceGain);

    osc1.start();
    osc2.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { osc1.stop(); osc2.stop(); } catch {}
      }
    });
  }

  private startWaterfallSynth() {
    if (!this.ctx || !this.ambienceGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;

    noise.connect(lowpass);
    lowpass.connect(this.ambienceGain);
    noise.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { noise.stop(); } catch {}
      }
    });
  }

  private startNightCricketsSynth() {
    if (!this.ctx || !this.ambienceGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 4500; // High cricket chirp frequency

    // Modulation LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.05;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    gain.gain.value = 0.02;

    osc.connect(gain);
    gain.connect(this.ambienceGain);

    osc.start();
    lfo.start();

    this.activeAmbienceNodes.push({
      stop: () => {
        try { osc.stop(); lfo.stop(); } catch {}
      }
    });
  }
}

export const audioEngine = new AudioEngine();
