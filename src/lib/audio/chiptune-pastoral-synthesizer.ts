// Authentic 8-bit / Chiptune Pastoral Ambient Synthesizer using Web Audio API
// Generates nostalgic retro square wave morning melodies, 8-bit wind, and chiptune bird chirps

class ChiptunePastoralSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private melodyTimer: NodeJS.Timeout | null = null;
  private birdTimer: NodeJS.Timeout | null = null;
  private noiseNode: AudioNode | null = null;

  // Pentatonic pastoral folk scale in C Major / G Major (nostalgic retro RPG village feel)
  // C4, D4, E4, G4, A4, C5, D5, E5, G5
  private readonly scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

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

    // Master volume with smooth ramp
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 1.5);
    this.masterGain.connect(ctx.destination);

    // 1. 8-Bit Wind (Stepped Bitcrushed Noise)
    this.start8BitWind();

    // 2. Chiptune Gentle Arpeggios / Pastoral Melody (Square Wave)
    this.scheduleNextMelodyNote();

    // 3. 8-Bit Retro Bird Chirps
    this.scheduleNextBirdChirp();
  }

  private start8BitWind() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // 8-bit quantized noise (stepped amplitude)
    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      if (i % 6 === 0) {
        // Sample & hold bitcrush
        const raw = Math.random() * 2 - 1;
        // Quantize to 4-bit steps
        lastVal = Math.round(raw * 8) / 8;
      }
      output[i] = lastVal * 0.12;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for soft warm wind
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    // LFO for slow breathing breeze
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  private scheduleNextMelodyNote() {
    if (!this.isPlaying) return;

    // Peaceful slow arpeggio note every 600ms - 1400ms
    const interval = 800 + Math.random() * 600;
    this.melodyTimer = setTimeout(() => {
      this.playChiptuneNote();
      this.scheduleNextMelodyNote();
    }, interval);
  }

  private playChiptuneNote() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freq = this.scale[Math.floor(Math.random() * this.scale.length)];

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Classic 8-bit Square wave sound
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);

    // 8-bit rapid envelope: immediate attack, slight decay, sustain, fast release
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.045, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.02, now + 0.3);
    noteGain.gain.linearRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  private scheduleNextBirdChirp() {
    if (!this.isPlaying) return;

    const nextChirp = 3500 + Math.random() * 5000;
    this.birdTimer = setTimeout(() => {
      this.play8BitBird();
      this.scheduleNextBirdChirp();
    }, nextChirp);
  }

  private play8BitBird() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const baseFreq = 1800 + Math.random() * 800;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 8-bit frequency modulated chirp
    osc.type = "square";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.25, now + 0.04);
    osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.08);
    osc.frequency.setValueAtTime(baseFreq * 1.1, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    setTimeout(() => {
      if (this.noiseNode) {
        try {
          (this.noiseNode as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.isPlaying = false;
    }, 850);
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const chiptunePastoralAudio =
  typeof window !== "undefined" ? new ChiptunePastoralSynthesizer() : null;

