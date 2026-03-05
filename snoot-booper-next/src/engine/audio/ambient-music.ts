/**
 * AmbientMusic - Procedural pentatonic ambient music generator.
 * Random notes from pentatonic scale with a low drone underneath.
 *
 * Day: bright C-major pentatonic, shorter intervals
 * Night: lower, dreamier with slight detune, longer intervals
 */

import { audioEngine } from './audio-engine';

// Pentatonic notes (C4 to A5)
const PENTATONIC_DAY = [262, 294, 330, 392, 440, 523, 587, 659, 784, 880];
const PENTATONIC_NIGHT = [196, 220, 262, 294, 330, 392, 440, 523];

export class AmbientMusic {
  private playing = false;
  private noteTimer: ReturnType<typeof setTimeout> | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isNight = false;

  start(): void {
    if (this.playing) return;
    const ctx = audioEngine.getContext();
    const musicGain = audioEngine.getMusicGain();
    if (!ctx || !musicGain) return;

    this.playing = true;

    // Start low drone (C3 triangle)
    this.droneOsc = ctx.createOscillator();
    this.droneGain = ctx.createGain();
    this.droneOsc.type = 'triangle';
    this.droneOsc.frequency.value = 131; // C3
    this.droneGain.gain.value = 0.08;
    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(musicGain);
    this.droneOsc.start();

    // Schedule random notes
    this.scheduleNextNote();
  }

  stop(): void {
    this.playing = false;
    if (this.noteTimer) {
      clearTimeout(this.noteTimer);
      this.noteTimer = null;
    }
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
      } catch {
        /* already stopped */
      }
      this.droneOsc = null;
    }
    this.droneGain = null;
  }

  setNightMode(isNight: boolean): void {
    this.isNight = isNight;
    // Adjust drone pitch and volume
    if (this.droneOsc) {
      this.droneOsc.frequency.value = isNight ? 98 : 131; // G2 at night, C3 during day
    }
    if (this.droneGain) {
      this.droneGain.gain.value = isNight ? 0.05 : 0.08;
    }
  }

  private scheduleNextNote(): void {
    if (!this.playing) return;

    // Random delay: 3-7s during day, 5-10s at night
    const minDelay = this.isNight ? 5000 : 3000;
    const maxDelay = this.isNight ? 10000 : 7000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    this.noteTimer = setTimeout(() => {
      this.playRandomNote();
      this.scheduleNextNote();
    }, delay);
  }

  private playRandomNote(): void {
    const ctx = audioEngine.getContext();
    const musicGain = audioEngine.getMusicGain();
    if (!ctx || !musicGain) return;

    const scale = this.isNight ? PENTATONIC_NIGHT : PENTATONIC_DAY;
    const freq = scale[Math.floor(Math.random() * scale.length)];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Slight detune at night for dreamy feel
    if (this.isNight) {
      osc.detune.value = (Math.random() - 0.5) * 10;
    }

    // ADSR: 50ms attack, 500ms sustain, 2s release
    const attackEnd = now + 0.05;
    const sustainEnd = attackEnd + 0.5;
    const releaseEnd = sustainEnd + 2.0;
    const peakVol = this.isNight ? 0.08 : 0.12;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakVol, attackEnd);
    gain.gain.setValueAtTime(peakVol, sustainEnd);
    gain.gain.exponentialRampToValueAtTime(0.001, releaseEnd);

    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(releaseEnd + 0.1);
  }
}

export const ambientMusic = new AmbientMusic();
