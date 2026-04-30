/**
 * BigNumber - Wuxia-themed number formatting
 *
 * "In the realm of the Heavenly Sovereign, numbers become meaningless.
 *  Only the Dao remains."
 * — The Celestial Snoot Scripture
 */

const CULTIVATION_SUFFIXES = [
  '',      // 10^0
  'K',     // 10^3
  'M',     // 10^6
  'B',     // 10^9
  'T',     // 10^12
  'Qi',    // 10^15
  'Dao',   // 10^18
  'Xian',  // 10^21
  'Tian',  // 10^24
  'Shen',  // 10^27
  'Yuan',  // 10^30
  'Hun',   // 10^33
  'Ling',  // 10^36
  'Wu',    // 10^39
  'Ji',    // 10^42
];

const SUFFIX_VALUES: Record<string, number> = {};
CULTIVATION_SUFFIXES.forEach((suffix, index) => {
  if (suffix) {
    SUFFIX_VALUES[suffix.toLowerCase()] = Math.pow(10, index * 3);
  }
});

export interface FormatOptions {
  decimals?: number;
  forceDecimals?: boolean;
  shortFormat?: boolean;
}

export function formatNumber(n: number | string | null | undefined, options: FormatOptions = {}): string {
  const { decimals = 1, forceDecimals = false, shortFormat = false } = options;

  if (n === null || n === undefined || isNaN(Number(n))) return '0';

  let num = Number(n);
  if (!isFinite(num)) {
    num = num > 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER;
  }

  const isNegative = num < 0;
  num = Math.abs(num);

  if (num < 1000) {
    const formatted = forceDecimals ? num.toFixed(decimals) : Math.floor(num).toString();
    return isNegative ? `-${formatted}` : formatted;
  }

  const logValue = num > 0 ? Math.log10(num) : 0;
  const tier = Math.min(Math.floor(logValue / 3), CULTIVATION_SUFFIXES.length - 1);
  const scaled = num / Math.pow(10, tier * 3);

  let formatted: string;
  if (forceDecimals || scaled < 100) {
    formatted = scaled.toFixed(decimals);
  } else {
    formatted = scaled.toFixed(Math.max(0, decimals - 1));
  }

  if (!forceDecimals) {
    formatted = parseFloat(formatted).toString();
    if (scaled >= 10 && !formatted.includes('.')) {
      formatted = parseFloat(formatted).toFixed(1);
    }
  }

  const suffix = CULTIVATION_SUFFIXES[tier];
  const separator = shortFormat ? '' : ' ';
  const result = `${formatted}${separator}${suffix}`;
  return isNegative ? `-${result}` : result;
}

export function formatCompact(n: number): string {
  return formatNumber(n, { decimals: 1, shortFormat: true });
}

export function formatDetailed(n: number): string {
  const formatted = formatNumber(n, { decimals: 2 });
  if (Math.abs(n) < 1e6 && n === Math.floor(n)) {
    return n.toLocaleString();
  }
  return formatted;
}

export function formatPercent(n: number | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || isNaN(n)) return '0%';
  return `${(n * 100).toFixed(decimals)}%`;
}

export function formatMultiplier(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined || isNaN(n)) return '1x';
  return `${n.toFixed(decimals)}x`;
}

export function formatDuration(ms: number, shortFormat = false): string {
  if (ms < 0) ms = 0;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (shortFormat) {
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);
  }
  return parts.join(' ');
}

export function parseNumber(str: string | number): number {
  if (typeof str === 'number') return str;
  if (!str || typeof str !== 'string') return NaN;

  str = str.trim();
  const plain = Number(str);
  if (!isNaN(plain)) return plain;

  const match = str.match(/^(-?[\d.]+)\s*([a-zA-Z]+)?$/);
  if (!match) return NaN;

  const numPart = parseFloat(match[1]);
  const suffix = match[2]?.toLowerCase() || '';
  if (isNaN(numPart)) return NaN;
  if (!suffix) return numPart;

  const multiplier = SUFFIX_VALUES[suffix];
  if (multiplier === undefined) return NaN;
  return numPart * multiplier;
}

export function compareNumbers(a: number, b: number, tolerance = 1e-9): number {
  const diff = a - b;
  if (Math.abs(diff) < tolerance) return 0;
  return diff < 0 ? -1 : 1;
}

const GAME_MAX = 1e45; // Ji tier ceiling (10^42 is highest suffix)

export function safeAdd(a: number, b: number): number {
  if (a > 1e300 || b > 1e300) {
    if (a > b * 1e10) return Math.min(a, GAME_MAX);
    if (b > a * 1e10) return Math.min(b, GAME_MAX);
  }
  const result = a + b;
  if (!isFinite(result)) return (a > 0) === (b > 0) ? GAME_MAX : -GAME_MAX;
  return result;
}

export function safeMultiply(a: number, b: number): number {
  const result = a * b;
  if (!isFinite(result)) return (a > 0) === (b > 0) ? GAME_MAX : -GAME_MAX;
  return Math.abs(result) > GAME_MAX ? (result > 0 ? GAME_MAX : -GAME_MAX) : result;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function orderOfMagnitude(n: number): number {
  if (n === 0) return 0;
  return Math.floor(Math.log10(Math.abs(n)));
}

export function getTier(n: number): number {
  if (Math.abs(n) < 1000) return 0;
  return Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), CULTIVATION_SUFFIXES.length - 1);
}

export function getSuffixes(): string[] {
  return [...CULTIVATION_SUFFIXES];
}

export function getSuffixDescription(suffix: string): string {
  const descriptions: Record<string, string> = {
    '': 'Base',
    'K': 'Thousand - The first step on the path',
    'M': 'Million - A notable achievement',
    'B': 'Billion - True cultivation begins',
    'T': 'Trillion - The mortal limit',
    'Qi': 'Qi - Life force made manifest',
    'Dao': 'Dao - Touching the eternal Way',
    'Xian': 'Xian - Immortal realm achieved',
    'Tian': 'Tian - Heavenly power attained',
    'Shen': 'Shen - Divine spirit awakened',
    'Yuan': 'Yuan - Primordial origin touched',
    'Hun': 'Hun - Soul cultivation mastered',
    'Ling': 'Ling - Essence perfected',
    'Wu': 'Wu - The void comprehended',
    'Ji': 'Ji - Ultimate limit transcended',
  };
  return descriptions[suffix] || 'Unknown';
}
