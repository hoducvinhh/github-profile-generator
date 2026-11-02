"use client";

// Procedural blizzard wind synthesizer using Web Audio API (Zero external assets needed)
class WindSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private subFilterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;
  private lfoTimer: any = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
  }

  public start(severity: 1 | 2 | 3 = 1) {
    this.init();
    if (!this.ctx || this.isRunning) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // 1. Generate 5 seconds of looped Pink Noise buffer for realistic natural sound
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // normalise volume
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    // 2. Resonant bandpass filter (howling frequency of wind)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "bandpass";
    this.filterNode.Q.value = 3.5;

    // 3. Lowpass filter for deep sub-zero rumble
    this.subFilterNode = this.ctx.createBiquadFilter();
    this.subFilterNode.type = "lowpass";
    this.subFilterNode.frequency.value = 180;

    // 4. Master gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.08;

    this.noiseNode.connect(this.filterNode);
    this.noiseNode.connect(this.subFilterNode);
    this.filterNode.connect(this.gainNode);
    this.subFilterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.noiseNode.start();
    this.isRunning = true;
    this.setSeverity(severity);

    // Natural wind gust modulation loop
    this.lfoTimer = setInterval(() => {
      if (!this.filterNode || !this.ctx || !this.isRunning) return;
      const baseFreq = severity === 1 ? 260 : severity === 2 ? 440 : 680;
      const variation = Math.sin(Date.now() / 1500) * 120 + Math.random() * 80;
      this.filterNode.frequency.setTargetAtTime(
        Math.max(100, baseFreq + variation),
        this.ctx.currentTime,
        0.8
      );
    }, 400);
  }

  public setSeverity(severity: 1 | 2 | 3) {
    if (!this.filterNode || !this.gainNode || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (severity === 1) {
      this.filterNode.frequency.setTargetAtTime(260, now, 1.2);
      this.filterNode.Q.setTargetAtTime(2.5, now, 1.0);
      this.gainNode.gain.setTargetAtTime(0.06, now, 1.0);
    } else if (severity === 2) {
      this.filterNode.frequency.setTargetAtTime(450, now, 1.0);
      this.filterNode.Q.setTargetAtTime(4.0, now, 0.8);
      this.gainNode.gain.setTargetAtTime(0.12, now, 0.8);
    } else {
      this.filterNode.frequency.setTargetAtTime(750, now, 0.8);
      this.filterNode.Q.setTargetAtTime(5.5, now, 0.6);
      this.gainNode.gain.setTargetAtTime(0.22, now, 0.6);
    }
  }

  public stop() {
    if (!this.isRunning) return;
    if (this.lfoTimer) clearInterval(this.lfoTimer);
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
    }
    this.isRunning = false;
  }

  public active(): boolean {
    return this.isRunning;
  }
}

export const windAudio = typeof window !== "undefined" ? new WindSynthesizer() : (null as any);

