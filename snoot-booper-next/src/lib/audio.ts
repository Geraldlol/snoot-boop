/**
 * SnootAudio — WebAudio synth for SFX.
 *
 * Browser-only. Lazy-initialized on first user gesture (Chrome blocks
 * AudioContext until then). Uses pure oscillator synth — no external
 * samples — so we ship without any audio assets.
 *
 * Public surface:
 *   audio.unlock()           — call once on first user click/keypress
 *   audio.playBoop(combo?)   — soft thump, pitch rises with combo
 *   audio.playCrit()         — bright chime
 *   audio.playHonk()         — nasty buzz (goose appears / hit)
 *   audio.playVictory()      — short fanfare (run cleared)
 *   audio.playAscend()       — long ethereal swell (rebirth / ascension)
 *   audio.setMuted(bool)
 *   audio.setVolume(0..1)
 */

export class SnootAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private volume = 0.6;
  private unlocked = false;

  unlock(): void {
    if (this.unlocked) return;
    if (typeof window === 'undefined') return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
      // Resume if suspended
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.unlocked = true;
    } catch {
      // Audio unavailable — silent failure is fine.
    }
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.volume;
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && !this.muted) this.master.gain.value = this.volume;
  }

  // ── Tone helpers ────────────────────────────────────────────

  private tone(opts: {
    freq: number;
    duration: number;       // seconds
    type?: OscillatorType;
    attack?: number;        // seconds
    release?: number;       // seconds
    peak?: number;          // 0..1, scaled by master
    detune?: number;        // cents
    sweepTo?: number;       // optional end frequency for slide
  }): void {
    if (!this.ctx || !this.master || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(opts.freq, now);
    if (typeof opts.detune === 'number') osc.detune.setValueAtTime(opts.detune, now);
    if (typeof opts.sweepTo === 'number') {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, opts.sweepTo),
        now + opts.duration
      );
    }
    const peak = opts.peak ?? 0.4;
    const a = opts.attack ?? 0.005;
    const r = opts.release ?? 0.08;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + a);
    gain.gain.linearRampToValueAtTime(peak, now + Math.max(a, opts.duration - r));
    gain.gain.linearRampToValueAtTime(0, now + opts.duration);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + opts.duration + 0.05);
  }

  private noiseBurst(opts: { duration: number; peak?: number; lpFreq?: number }): void {
    if (!this.ctx || !this.master || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const bufSize = Math.floor(ctx.sampleRate * opts.duration);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const peak = opts.peak ?? 0.25;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
    if (opts.lpFreq) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = opts.lpFreq;
      src.connect(lp).connect(gain).connect(this.master);
    } else {
      src.connect(gain).connect(this.master);
    }
    src.start(now);
    src.stop(now + opts.duration);
  }

  // ── Public SFX ──────────────────────────────────────────────

  playBoop(combo = 0): void {
    if (!this.unlocked) return;
    const baseFreq = 320;
    // Pitch rises with combo (capped); subtle so it stays musical.
    const c = Math.min(combo, 50);
    const freq = baseFreq + c * 6;
    this.tone({
      freq,
      duration: 0.18,
      type: 'sine',
      peak: 0.32,
      attack: 0.005,
      release: 0.10,
      sweepTo: freq * 0.7,
    });
    // Add a soft body — gives it weight.
    this.tone({
      freq: freq * 0.5,
      duration: 0.14,
      type: 'triangle',
      peak: 0.18,
      attack: 0.005,
      release: 0.08,
    });
  }

  playCrit(): void {
    if (!this.unlocked) return;
    // Major triad chime: G5, B5, D6
    const now = this.ctx?.currentTime ?? 0;
    [784, 988, 1175].forEach((f, i) => {
      setTimeout(() => {
        this.tone({
          freq: f,
          duration: 0.45,
          type: 'sine',
          peak: 0.30,
          attack: 0.01,
          release: 0.30,
        });
      }, i * 35);
    });
    // Bright top-end shimmer
    this.tone({
      freq: 2400,
      duration: 0.25,
      type: 'sine',
      peak: 0.10,
      attack: 0.01,
      release: 0.20,
    });
    void now;
  }

  playHonk(): void {
    if (!this.unlocked) return;
    // Square wave with downward sweep + filtered noise = goose buzz.
    this.tone({
      freq: 280,
      duration: 0.30,
      type: 'sawtooth',
      peak: 0.40,
      attack: 0.01,
      release: 0.10,
      sweepTo: 180,
    });
    this.noiseBurst({ duration: 0.18, peak: 0.18, lpFreq: 1500 });
  }

  playVictory(): void {
    if (!this.unlocked) return;
    // Rising arpeggio: C5, E5, G5, C6
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => {
        this.tone({
          freq: f,
          duration: 0.30,
          type: 'triangle',
          peak: 0.32,
          attack: 0.01,
          release: 0.20,
        });
      }, i * 90);
    });
  }

  playAscend(): void {
    if (!this.unlocked) return;
    // Long ethereal swell — ascending fifths.
    this.tone({
      freq: 220,
      duration: 1.6,
      type: 'sine',
      peak: 0.35,
      attack: 0.40,
      release: 0.60,
      sweepTo: 660,
    });
    setTimeout(() => {
      this.tone({
        freq: 330,
        duration: 1.4,
        type: 'sine',
        peak: 0.28,
        attack: 0.30,
        release: 0.60,
        sweepTo: 990,
      });
    }, 200);
    setTimeout(() => {
      this.tone({
        freq: 440,
        duration: 1.2,
        type: 'sine',
        peak: 0.22,
        attack: 0.20,
        release: 0.60,
        sweepTo: 1320,
      });
    }, 400);
  }
}

export const audio = new SnootAudio();
