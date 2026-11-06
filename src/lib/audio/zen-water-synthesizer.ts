// Zen Water & Japanese Garden Bamboo Water Droplet (Suikinkutsu) Synthesizer using Web Audio API
// 100% Procedural - Zero MP3 assets required

class ZenWaterSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private dropTimer: NodeJS.Timeout | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  // Japanese pentatonic water drop pitches: A5, D6, E6, A6 (Zen tranquil bell-like water tones)
  private readonly dropFrequencies = [880.0, 1174.66, 1318.51, 1760.0];

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

    // Master Gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 1.5);
    this.masterGain.connect(ctx.destination);

    // 1. Gentle Pond Water Lapping (Resonant Bandpass Filtered Noise)
    this.startWaterCurrent();

    // 2. Scheduled Zen Water Droplets (Suikinkutsu plings)
    this.scheduleNextWaterDrop();
  }

  private startWaterCurrent() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastVal = lastVal * 0.94 + white * 0.06;
      output[i] = lastVal * 0.25;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Dual bandpass filters to mimic water bubbling
    const filter1 = ctx.createBiquadFilter();
    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(450, ctx.currentTime);
    filter1.Q.setValueAtTime(3.0, ctx.currentTime);

    // LFO for gentle water surge
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);
    lfo.start();

    noise.connect(filter1);
    filter1.connect(this.masterGain);
    noise.start();
    this.noiseSource = noise;
  }

  private scheduleNextWaterDrop() {
    if (!this.isPlaying) return;

    const interval = 3500 + Math.random() * 4500;
    this.dropTimer = setTimeout(() => {
      this.playWaterDrop();
      this.scheduleNextWaterDrop();
    }, interval);
  }

  public playWaterDrop(customPitch?: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freq =
      customPitch ||
      this.dropFrequencies[Math.floor(Math.random() * this.dropFrequencies.length)];

    // Pure crystal sine tone with fast pitch bend down
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.08, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    if (this.dropTimer) {
      clearTimeout(this.dropTimer);
      this.dropTimer = null;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    setTimeout(() => {
      if (this.noiseSource) {
        try {
          this.noiseSource.stop();
        } catch {
          // ignore
        }
        this.noiseSource.disconnect();
        this.noiseSource = null;
      }
      this.isPlaying = false;
    }, 850);
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const zenWaterAudio =
  typeof window !== "undefined" ? new ZenWaterSynthesizer() : null;

