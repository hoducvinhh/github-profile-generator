// Zero-asset procedural Vietnamese pastoral ambient synthesizer using Web Audio API
// Generates gentle morning river breeze and occasional singing birds

class PastoralAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private noiseNode: AudioNode | null = null;
  private masterGain: GainNode | null = null;
  private birdTimer: NodeJS.Timeout | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    const ctx = this.ctx;

    // Master volume
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 2);
    this.masterGain.connect(ctx.destination);

    // 1. Gentle morning wind/breeze (soft filtered noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.11;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low-pass warm filter for countryside breeze
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(320, ctx.currentTime);

    // Subtle LFO for wind gust breathing
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(80, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    whiteNoise.connect(lowpass);
    lowpass.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // 2. Procedural morning birds chirping (Chim hót buổi sớm)
    this.scheduleBirdChirp();
  }

  private scheduleBirdChirp() {
    if (!this.isPlaying) return;

    // Trigger a chirp every 3 to 7 seconds
    const nextInterval = 3000 + Math.random() * 4000;
    this.birdTimer = setTimeout(() => {
      this.playBirdChirp();
      this.scheduleBirdChirp();
    }, nextInterval);
  }

  private playBirdChirp() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Random base frequency for songbird (2200Hz - 3400Hz)
    const baseFreq = 2200 + Math.random() * 1000;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);

    setTimeout(() => {
      if (this.noiseNode) {
        try {
          (this.noiseNode as AudioBufferSourceNode).stop();
        } catch {
          // ignore already stopped
        }
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.isPlaying = false;
    }, 1000);
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const pastoralAudio =
  typeof window !== "undefined" ? new PastoralAudioSynthesizer() : null;

