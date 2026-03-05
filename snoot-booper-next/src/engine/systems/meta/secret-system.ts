// secret-system.ts - Easter eggs and hidden discoveries
// "The masters hid many treasures for the worthy."

// --- Types ---

interface SecretDefinition {
  id: string;
  name: string;
  triggerType: string;
  description: string;
  reward?: {
    cosmetic?: string;
    cat?: string;
    achievement?: string;
    effect?: string;
  };
}

interface MysteryCatData {
  id: string;
  name: string;
  title: string;
  description: string;
  realm: string;
  rarity: string;
  stats: {
    snootMeridians: number;
    innerPurr: number;
    floofArmor: number;
    zoomieSteps: number;
    loafMastery: number;
    courage: number;
  };
}

interface SecretGameState {
  bp: number;
  catIds: string[];
  gooseAlly: string | null;
  catCount: number;
  masterPlaytime: Record<string, number>;
  sessionTime?: number;
}

interface SecretDiscovery {
  secretId: string;
  name: string;
  reward?: SecretDefinition['reward'];
}

interface StolenUIResult {
  stolenElement: string;
  duration: number;
  message: string;
}

interface SecretStats {
  totalDiscovered: number;
  moonClicks: number;
  konamiAttempts: number;
  lastDiscoveryTime: number | null;
}

interface SecretSerializedData {
  moonClicks: number;
  discoveredSecrets: string[];
  lastBoopTime: number;
  stats: SecretStats;
}

// --- Data ---

const SECRETS: Record<string, SecretDefinition> = {
  moonSecret: {
    id: 'moonSecret',
    name: 'Luna Noticed You',
    triggerType: 'moonClicks',
    description: 'Click the moon 100 times to earn Luna\'s attention.',
    reward: { cosmetic: 'moonbeam_aura' },
  },
  nyanCat: {
    id: 'nyanCat',
    name: 'Nyan Discovery',
    triggerType: 'catName',
    description: 'Name a cat "nyan" to unlock a rainbow trail.',
    reward: { cosmetic: 'rainbow_trail', achievement: 'nyan_easter_egg' },
  },
  konamiCode: {
    id: 'konamiCode',
    name: 'Retro Mode',
    triggerType: 'keySequence',
    description: 'Enter the legendary code to unlock retro visuals.',
    reward: { effect: 'retro_mode' },
  },
  niceNumber: {
    id: 'niceNumber',
    name: 'Nice.',
    triggerType: 'bpValue',
    description: 'Reach exactly 69420 BP.',
    reward: { achievement: 'nice' },
  },
  afkMystery: {
    id: 'afkMystery',
    name: 'The Patient One',
    triggerType: 'afkTime',
    description: 'Wait 10 minutes without booping to attract a mysterious cat.',
    reward: { cat: 'mystery_cat' },
  },
  nikFourthWall: {
    id: 'nikFourthWall',
    name: 'Nik Sees You',
    triggerType: 'random',
    description: 'Nik briefly looks directly at you.',
    reward: { achievement: 'nik_stare' },
  },
  mochiWarning: {
    id: 'mochiWarning',
    name: "Mochi's Concern",
    triggerType: 'sessionTime',
    description: 'Play for 5 hours straight to trigger Mochi\'s care message.',
    reward: { cosmetic: 'mochi_care_package' },
  },
  gooseStealUI: {
    id: 'gooseStealUI',
    name: 'HONK! (UI Theft)',
    triggerType: 'random',
    description: 'A goose steals part of your interface.',
    reward: { achievement: 'ui_theft_victim' },
  },
  ceilingBasement: {
    id: 'ceilingBasement',
    name: 'Above and Below',
    triggerType: 'catCollection',
    description: 'Own both Ceiling Cat and Basement Cat.',
    reward: { cosmetic: 'cosmic_duality_aura', achievement: 'above_and_below' },
  },
  allMastersBond: {
    id: 'allMastersBond',
    name: 'True Sect Member',
    triggerType: 'masterPlaytime',
    description: 'Play at least 1 hour with each of the seven masters.',
    reward: { cosmetic: 'seven_masters_emblem', achievement: 'true_sect_member' },
  },
  gooseAlliance: {
    id: 'gooseAlliance',
    name: 'Chaotic Neutral',
    triggerType: 'gameState',
    description: 'Have a Goose Ally and 50 cats simultaneously.',
    reward: { achievement: 'chaotic_neutral' },
  },
  speedBoop: {
    id: 'speedBoop',
    name: 'THOUSAND BOOP BARRAGE',
    triggerType: 'boopSpeed',
    description: 'Perform 100 boops in 10 seconds.',
    reward: { achievement: 'speed_demon', cosmetic: 'lightning_paws' },
  },
  slowBoop: {
    id: 'slowBoop',
    name: 'The Measured Boop',
    triggerType: 'boopTiming',
    description: 'Wait exactly 60 seconds between two consecutive boops.',
    reward: { achievement: 'patience_master', cosmetic: 'zen_aura' },
  },
};

const MYSTERY_CAT: MysteryCatData = {
  id: 'mystery_cat',
  name: '??? Cat',
  title: 'The Patient One',
  description: 'This cat only appears to those who wait. Its presence is a reward for stillness.',
  realm: 'divine',
  rarity: 'secret',
  stats: {
    snootMeridians: 4.0,
    innerPurr: 8.0,
    floofArmor: 4.0,
    zoomieSteps: 2.0,
    loafMastery: 10.0,
    courage: 1.0,
  },
};

const KONAMI_SEQUENCE = [
  'up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a',
];

const ALL_MASTERS = ['gerald', 'rusty', 'steve', 'andrew', 'nik', 'yuelin', 'scott'];

const STEALABLE_ELEMENTS = [
  'boop_button',
  'resource_counter',
  'settings_icon',
  'cat_panel',
  'waifu_portrait',
];

// --- Class ---

export class SecretSystem {
  moonClicks: number;
  discoveredSecrets: string[];
  lastBoopTime: number;
  boopTimestamps: number[];
  konamiProgress: number;
  stats: SecretStats;

  constructor() {
    this.moonClicks = 0;
    this.discoveredSecrets = [];
    this.lastBoopTime = Date.now();
    this.boopTimestamps = [];
    this.konamiProgress = 0;
    this.stats = {
      totalDiscovered: 0,
      moonClicks: 0,
      konamiAttempts: 0,
      lastDiscoveryTime: null,
    };
  }

  private discover(secretId: string): SecretDiscovery | null {
    if (this.discoveredSecrets.includes(secretId)) {
      return null;
    }
    const secret = SECRETS[secretId];
    if (!secret) return null;

    this.discoveredSecrets.push(secretId);
    this.stats.totalDiscovered++;
    this.stats.lastDiscoveryTime = Date.now();

    return {
      secretId: secret.id,
      name: secret.name,
      reward: secret.reward,
    };
  }

  onMoonClick(): SecretDiscovery | null {
    this.moonClicks++;
    this.stats.moonClicks++;

    if (this.moonClicks >= 100) {
      return this.discover('moonSecret');
    }
    return null;
  }

  onCatNamed(catId: string, name: string): SecretDiscovery | null {
    if (name.toLowerCase() === 'nyan') {
      return this.discover('nyanCat');
    }
    return null;
  }

  checkKonamiCode(key: string): SecretDiscovery | null {
    if (key === KONAMI_SEQUENCE[this.konamiProgress]) {
      this.konamiProgress++;
      if (this.konamiProgress >= KONAMI_SEQUENCE.length) {
        this.konamiProgress = 0;
        this.stats.konamiAttempts++;
        return this.discover('konamiCode');
      }
    } else {
      this.konamiProgress = 0;
    }
    return null;
  }

  checkNiceNumber(bp: number): SecretDiscovery | null {
    if (bp === 69420) {
      return this.discover('niceNumber');
    }
    return null;
  }

  checkAFKCat(now: number): SecretDiscovery | null {
    const elapsed = now - this.lastBoopTime;
    if (elapsed >= 600000) {
      return this.discover('afkMystery');
    }
    return null;
  }

  onBoop(): SecretDiscovery | null {
    const now = Date.now();
    const previousBoopTime = this.lastBoopTime;
    this.lastBoopTime = now;

    this.boopTimestamps.push(now);

    // Keep only timestamps from the last 10 seconds
    const cutoff = now - 10000;
    this.boopTimestamps = this.boopTimestamps.filter((t) => t >= cutoff);

    // Speed boop: 100 boops in 10 seconds
    if (this.boopTimestamps.length >= 100) {
      const speedResult = this.discover('speedBoop');
      if (speedResult) return speedResult;
    }

    // Slow boop: exactly 60 seconds between two consecutive boops (within 500ms tolerance)
    const gap = now - previousBoopTime;
    if (Math.abs(gap - 60000) <= 500) {
      const slowResult = this.discover('slowBoop');
      if (slowResult) return slowResult;
    }

    return null;
  }

  checkNikFourthWall(): SecretDiscovery | null {
    if (Math.random() < 0.01) {
      return this.discover('nikFourthWall');
    }
    return null;
  }

  checkGooseStealUI(): StolenUIResult | null {
    if (Math.random() >= 0.001) {
      return null;
    }

    // Try to discover the secret
    this.discover('gooseStealUI');

    const element = STEALABLE_ELEMENTS[Math.floor(Math.random() * STEALABLE_ELEMENTS.length)];
    return {
      stolenElement: element,
      duration: 5000,
      message: `HONK! *waddles away with your ${element.replace(/_/g, ' ')}*`,
    };
  }

  checkMochiWarning(sessionTimeMs: number): SecretDiscovery | null {
    if (sessionTimeMs >= 5 * 3600000) {
      return this.discover('mochiWarning');
    }
    return null;
  }

  update(gameState: SecretGameState): SecretDiscovery | null {
    // Check ceiling + basement cat
    if (
      gameState.catIds.includes('ceiling_god') &&
      gameState.catIds.includes('basement_cat')
    ) {
      const result = this.discover('ceilingBasement');
      if (result) return result;
    }

    // Check all masters bond (1 hour = 3600 seconds each)
    const allMastersPlayed = ALL_MASTERS.every(
      (m) => (gameState.masterPlaytime[m] || 0) >= 3600
    );
    if (allMastersPlayed) {
      const result = this.discover('allMastersBond');
      if (result) return result;
    }

    // Check goose alliance
    if (gameState.gooseAlly && gameState.catCount >= 50) {
      const result = this.discover('gooseAlliance');
      if (result) return result;
    }

    // Check nice number
    const niceResult = this.checkNiceNumber(gameState.bp);
    if (niceResult) return niceResult;

    // Check mochi warning
    if (gameState.sessionTime !== undefined) {
      const mochiResult = this.checkMochiWarning(gameState.sessionTime);
      if (mochiResult) return mochiResult;
    }

    return null;
  }

  isDiscovered(secretId: string): boolean {
    return this.discoveredSecrets.includes(secretId);
  }

  getDiscoveredCount(): number {
    return this.discoveredSecrets.length;
  }

  getTotalSecrets(): number {
    return Object.keys(SECRETS).length;
  }

  serialize(): SecretSerializedData {
    return {
      moonClicks: this.moonClicks,
      discoveredSecrets: [...this.discoveredSecrets],
      lastBoopTime: this.lastBoopTime,
      stats: { ...this.stats },
    };
  }

  deserialize(data: SecretSerializedData): void {
    this.moonClicks = data.moonClicks ?? 0;
    this.discoveredSecrets = data.discoveredSecrets ?? [];
    this.lastBoopTime = data.lastBoopTime ?? Date.now();
    this.boopTimestamps = [];
    this.konamiProgress = 0;
    this.stats = data.stats ?? {
      totalDiscovered: 0,
      moonClicks: 0,
      konamiAttempts: 0,
      lastDiscoveryTime: null,
    };
  }
}

export { SECRETS, MYSTERY_CAT, KONAMI_SEQUENCE };
export type {
  SecretDefinition,
  MysteryCatData,
  SecretGameState,
  SecretDiscovery,
  StolenUIResult,
  SecretStats,
  SecretSerializedData,
};
