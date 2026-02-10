/**
 * audio.js - Sound Effects and Music System
 * "The harmonious sounds of snoot cultivation."
 */

/**
 * AudioSystem - Manages game audio using Web Audio API
 */
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.3;
    this.isMuted = false;
    this.currentMusic = null;
    this.initialized = false;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = this.sfxVolume;

      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = this.musicVolume;

      this.initialized = true;
      console.log('Audio system initialized');
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  /**
   * Resume audio context if suspended
   */
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Play a synthesized sound effect
   */
  playSFX(type) {
    if (!this.initialized || this.isMuted) return;
    this.resume();

    switch (type) {
      case 'boop':
        this.playBoopSound();
        break;
      case 'critical':
        this.playCriticalSound();
        break;
      case 'levelup':
        this.playLevelUpSound();
        break;
      case 'achievement':
        this.playAchievementSound();
        break;
      case 'goose':
        this.playGooseSound();
        break;
      case 'goose_hit':
        this.playGooseHitSound();
        break;
      case 'purchase':
        this.playPurchaseSound();
        break;
      case 'error':
        this.playErrorSound();
        break;
      case 'cat_recruit':
        this.playCatRecruitSound();
        break;
      case 'event':
        this.playEventSound();
        break;
    }
  }

  /**
   * Boop sound - soft, satisfying pop
   */
  playBoopSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Critical hit sound - dramatic rising tone
   */
  playCriticalSound() {
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.15);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(450, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.2);
    osc2.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Level up / upgrade sound - triumphant arpeggio
   */
  playLevelUpSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.1;

    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.audioContext.currentTime + (i * duration);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 2);

      osc.start(startTime);
      osc.stop(startTime + duration * 2);
    });
  }

  /**
   * Achievement sound - fanfare
   */
  playAchievementSound() {
    // Two-note fanfare
    const notes = [
      { freq: 523.25, time: 0, dur: 0.15 },     // C5
      { freq: 659.25, time: 0.1, dur: 0.15 },   // E5
      { freq: 783.99, time: 0.2, dur: 0.3 }     // G5
    ];

    notes.forEach(note => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.type = 'square';
      osc.frequency.value = note.freq;

      const startTime = this.audioContext.currentTime + note.time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.setValueAtTime(0.15, startTime + note.dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
    });
  }

  /**
   * Goose appearance - HONK!
   */
  playGooseSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    // Honk is a harsh, nasal sound
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(280, this.audioContext.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 0.3);

    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.35);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.35);
  }

  /**
   * Goose hit sound
   */
  playGooseHitSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Purchase sound - coin/register
   */
  playPurchaseSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2400, this.audioContext.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Error/fail sound
   */
  playErrorSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Cat recruit sound - happy meow-like sound
   */
  playCatRecruitSound() {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.25);
  }

  /**
   * Event notification sound
   */
  playEventSound() {
    const notes = [659.25, 783.99]; // E5, G5
    const duration = 0.12;

    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.audioContext.currentTime + (i * duration);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  /**
   * Set master volume
   */
  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(value) {
    this.sfxVolume = Math.max(0, Math.min(1, value));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  /**
   * Set music volume
   */
  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, value));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  setSFXEnabled(enabled) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = enabled ? this.sfxVolume : 0;
    }
  }

  setMusicEnabled(enabled) {
    if (enabled) {
      if (this.musicGain) this.musicGain.gain.value = this.musicVolume;
      if (!this.currentMusic) this.playMusic('main');
    } else {
      if (this.musicGain) this.musicGain.gain.value = 0;
      this.stopMusic();
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
    }
    return this.isMuted;
  }

  // ===================================
  // MUSIC SYSTEM
  // ===================================

  /**
   * Play procedural background music
   * Uses pentatonic scale for a Chinese/Wuxia feel
   */
  playMusic(theme = 'main') {
    if (!this.initialized || this.isMuted) return;
    this.resume();
    this.stopMusic();

    const themes = {
      main: { tempo: 120, scale: 'pentatonic', mood: 'calm' },
      dungeon: { tempo: 140, scale: 'minor_pentatonic', mood: 'tense' },
      boss: { tempo: 160, scale: 'minor_pentatonic', mood: 'intense' },
      menu: { tempo: 100, scale: 'pentatonic', mood: 'peaceful' }
    };

    const config = themes[theme] || themes.main;
    this.currentMusic = { theme, config, playing: true, nextNoteTime: 0, noteIndex: 0 };
    this._scheduleMusicLoop();
  }

  /**
   * Stop background music with fade-out
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.playing = false;
    }
    if (this._musicTimer) {
      clearTimeout(this._musicTimer);
      this._musicTimer = null;
    }
    this.currentMusic = null;
  }

  /**
   * Internal music scheduler - plays notes in sequence
   */
  _scheduleMusicLoop() {
    if (!this.currentMusic || !this.currentMusic.playing || !this.initialized) return;

    const music = this.currentMusic;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Pentatonic scale frequencies (Chinese/Wuxia feel)
    const scales = {
      pentatonic: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
      minor_pentatonic: [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 698.46]
    };

    const scale = scales[music.config.scale] || scales.pentatonic;
    const beatDuration = 60 / music.config.tempo;

    // Melodic patterns (index into scale)
    const patterns = {
      calm: [
        [0, 2], [2, 4], [4, null], [3, 2],
        [2, 0], [0, null], [4, 3], [2, null],
        [0, 3], [3, 5], [5, null], [4, 2],
        [3, 0], [0, null], [2, 4], [3, null]
      ],
      tense: [
        [0, 1], [1, 3], [3, null], [4, 3],
        [3, 1], [0, null], [1, 4], [3, null],
        [4, 5], [5, 3], [3, null], [1, 0],
        [0, null], [3, 4], [4, 1], [0, null]
      ],
      intense: [
        [0, 3], [3, 5], [5, 4], [4, 3],
        [3, 1], [1, 0], [0, 3], [5, null],
        [4, 3], [3, 5], [5, 7], [7, 5],
        [4, 3], [3, 1], [1, 0], [0, null]
      ],
      peaceful: [
        [0, null], [2, null], [4, null], [2, null],
        [0, null], [3, null], [2, null], [0, null],
        [4, null], [5, null], [4, null], [2, null],
        [3, null], [2, null], [0, null], [null, null]
      ]
    };

    const pattern = patterns[music.config.mood] || patterns.calm;
    const step = pattern[music.noteIndex % pattern.length];

    // Play melody note
    if (step[0] !== null) {
      this._playMusicNote(scale[step[0]], beatDuration * 0.8, 0.12);
    }

    // Play harmony note (softer, lower octave)
    if (step[1] !== null) {
      this._playMusicNote(scale[step[1]] * 0.5, beatDuration * 0.6, 0.06);
    }

    music.noteIndex++;

    // Schedule next beat
    this._musicTimer = setTimeout(() => {
      this._scheduleMusicLoop();
    }, beatDuration * 1000);
  }

  /**
   * Play a single music note using triangle wave (soft, chiptune-like)
   */
  _playMusicNote(freq, duration, volume) {
    if (!this.audioContext || !this.musicGain) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(volume * 0.6, ctx.currentTime + duration * 0.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  /**
   * Serialize settings for saving
   */
  serialize() {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      isMuted: this.isMuted
    };
  }

  /**
   * Load settings from save
   */
  deserialize(data) {
    if (data.masterVolume !== undefined) this.masterVolume = data.masterVolume;
    if (data.sfxVolume !== undefined) this.sfxVolume = data.sfxVolume;
    if (data.musicVolume !== undefined) this.musicVolume = data.musicVolume;
    if (data.isMuted !== undefined) this.isMuted = data.isMuted;

    // Apply loaded settings
    if (this.initialized) {
      this.setMasterVolume(this.masterVolume);
      this.setSFXVolume(this.sfxVolume);
      this.setMusicVolume(this.musicVolume);
    }
  }
}

// Export
window.AudioSystem = AudioSystem;
