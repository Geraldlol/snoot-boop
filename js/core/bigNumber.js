/**
 * BigNumber - Late-game number handling for Snoot Booper
 *
 * "In the realm of the Heavenly Sovereign, numbers become meaningless.
 *  Only the Dao remains."
 * — The Celestial Snoot Scripture
 *
 * Handles formatting and parsing of very large numbers (up to 1e30+)
 * using Wuxia-themed suffixes for immersion.
 */

// Wuxia-themed number suffixes
// Each suffix represents 10^(index * 3)
const CULTIVATION_SUFFIXES = [
  '',      // 10^0  - Base
  'K',     // 10^3  - Thousand
  'M',     // 10^6  - Million
  'B',     // 10^9  - Billion
  'T',     // 10^12 - Trillion
  'Qi',    // 10^15 - Quadrillion (Qi = Energy/Life Force)
  'Dao',   // 10^18 - Quintillion (Dao = The Way)
  'Xian',  // 10^21 - Sextillion (Xian = Immortal)
  'Tian',  // 10^24 - Septillion (Tian = Heaven)
  'Shen',  // 10^27 - Octillion (Shen = Divine/Spirit)
  'Yuan',  // 10^30 - Nonillion (Yuan = Origin/Primordial)
  'Hun',   // 10^33 - Decillion (Hun = Soul)
  'Ling',  // 10^36 - Undecillion (Ling = Spirit/Essence)
  'Wu',    // 10^39 - Duodecillion (Wu = Void/Nothingness)
  'Ji'     // 10^42 - Tredecillion (Ji = Ultimate/Extreme)
];

// Suffix to power mapping for parsing
const SUFFIX_VALUES = {};
CULTIVATION_SUFFIXES.forEach((suffix, index) => {
  if (suffix) {
    SUFFIX_VALUES[suffix.toLowerCase()] = Math.pow(10, index * 3);
  }
});

/**
 * Format a number with Wuxia-themed suffixes
 * @param {number|string} n - The number to format
 * @param {Object} [options] - Formatting options
 * @param {number} [options.decimals=1] - Number of decimal places
 * @param {boolean} [options.forceDecimals=false] - Always show decimals
 * @param {boolean} [options.shortFormat=false] - Use minimal format (no space)
 * @returns {string} Formatted number string
 */
function formatNumber(n, options = {}) {
  const {
    decimals = 1,
    forceDecimals = false,
    shortFormat = false
  } = options;

  // Handle invalid input
  if (n === null || n === undefined || isNaN(n)) {
    return '0';
  }

  // Convert to number if string
  n = Number(n);

  // Handle special cases
  if (!isFinite(n)) {
    return n > 0 ? 'Infinity' : '-Infinity';
  }

  // Handle negative numbers
  const isNegative = n < 0;
  n = Math.abs(n);

  // Small numbers don't need suffixes
  if (n < 1000) {
    const formatted = forceDecimals ? n.toFixed(decimals) : Math.floor(n).toString();
    return isNegative ? `-${formatted}` : formatted;
  }

  // Calculate the tier (which suffix to use)
  const logValue = n > 0 ? Math.log10(n) : 0;
  const tier = Math.min(
    Math.floor(logValue / 3),
    CULTIVATION_SUFFIXES.length - 1
  );

  // Scale the number
  const scaled = n / Math.pow(10, tier * 3);

  // Format with decimals
  let formatted;
  if (forceDecimals || scaled < 100) {
    formatted = scaled.toFixed(decimals);
  } else {
    // For larger scaled values, reduce decimals
    formatted = scaled.toFixed(Math.max(0, decimals - 1));
  }

  // Remove trailing zeros if not forcing decimals
  if (!forceDecimals) {
    formatted = parseFloat(formatted).toString();
    // Ensure at least one decimal for readability on large numbers
    if (scaled >= 10 && !formatted.includes('.')) {
      formatted = parseFloat(formatted).toFixed(1);
    }
  }

  const suffix = CULTIVATION_SUFFIXES[tier];
  const separator = shortFormat ? '' : ' ';

  const result = `${formatted}${separator}${suffix}`;
  return isNegative ? `-${result}` : result;
}

/**
 * Format a number for compact display (e.g., UI elements)
 * @param {number} n - The number to format
 * @returns {string} Compact formatted string
 */
function formatCompact(n) {
  return formatNumber(n, { decimals: 1, shortFormat: true });
}

/**
 * Format a number for detailed display (e.g., tooltips)
 * @param {number} n - The number to format
 * @returns {string} Detailed formatted string with full number in parentheses for small values
 */
function formatDetailed(n) {
  const formatted = formatNumber(n, { decimals: 2 });

  // For smaller numbers, show exact value
  if (Math.abs(n) < 1e6 && n === Math.floor(n)) {
    return n.toLocaleString();
  }

  return formatted;
}

/**
 * Format a number as a percentage
 * @param {number} n - The number (0.5 = 50%)
 * @param {number} [decimals=1] - Decimal places
 * @returns {string} Formatted percentage
 */
function formatPercent(n, decimals = 1) {
  if (n === null || n === undefined || isNaN(n)) {
    return '0%';
  }
  return `${(n * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as a multiplier
 * @param {number} n - The multiplier value
 * @param {number} [decimals=2] - Decimal places
 * @returns {string} Formatted multiplier (e.g., "1.5x")
 */
function formatMultiplier(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) {
    return '1x';
  }
  return `${n.toFixed(decimals)}x`;
}

/**
 * Format a duration in milliseconds to human-readable string
 * @param {number} ms - Milliseconds
 * @param {boolean} [shortFormat=false] - Use short format (1h 30m vs 1 hour 30 minutes)
 * @returns {string} Formatted duration
 */
function formatDuration(ms, shortFormat = false) {
  if (ms < 0) ms = 0;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (shortFormat) {
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}

/**
 * Parse a formatted number string back to a number
 * @param {string} str - The formatted string (e.g., "1.5 Qi", "100K")
 * @returns {number} The parsed number, or NaN if invalid
 */
function parseNumber(str) {
  if (typeof str === 'number') {
    return str;
  }

  if (!str || typeof str !== 'string') {
    return NaN;
  }

  // Remove whitespace and convert to lowercase for suffix matching
  str = str.trim();

  // Try to parse as plain number first
  const plainNumber = Number(str);
  if (!isNaN(plainNumber)) {
    return plainNumber;
  }

  // Try to extract number and suffix
  const match = str.match(/^(-?[\d.]+)\s*([a-zA-Z]+)?$/);
  if (!match) {
    return NaN;
  }

  const numPart = parseFloat(match[1]);
  const suffix = match[2]?.toLowerCase() || '';

  if (isNaN(numPart)) {
    return NaN;
  }

  // No suffix means plain number
  if (!suffix) {
    return numPart;
  }

  // Look up suffix multiplier
  const multiplier = SUFFIX_VALUES[suffix];
  if (multiplier === undefined) {
    // Unknown suffix
    return NaN;
  }

  return numPart * multiplier;
}

/**
 * Compare two numbers with tolerance for floating point errors
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} [tolerance=1e-9] - Acceptable difference
 * @returns {number} -1 if a < b, 0 if equal, 1 if a > b
 */
function compareNumbers(a, b, tolerance = 1e-9) {
  const diff = a - b;
  if (Math.abs(diff) < tolerance) {
    return 0;
  }
  return diff < 0 ? -1 : 1;
}

/**
 * Safely add two potentially very large numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum
 */
function safeAdd(a, b) {
  // For very large numbers, use logarithmic addition to avoid overflow
  if (a > 1e300 || b > 1e300) {
    // If one is much larger, just return the larger one
    if (a > b * 1e10) return a;
    if (b > a * 1e10) return b;
  }
  return a + b;
}

/**
 * Safely multiply two potentially very large numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product
 */
function safeMultiply(a, b) {
  const result = a * b;
  if (!isFinite(result)) {
    // Return Infinity with correct sign
    return (a > 0) === (b > 0) ? Infinity : -Infinity;
  }
  return result;
}

/**
 * Clamp a number to a min/max range
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Get a random number in a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random value between min and max
 */
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Get a random integer in a range (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer between min and max
 */
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate the order of magnitude (power of 10)
 * @param {number} n - The number
 * @returns {number} Order of magnitude
 */
function orderOfMagnitude(n) {
  if (n === 0) return 0;
  return Math.floor(Math.log10(Math.abs(n)));
}

/**
 * Get the tier index for a number (which suffix it would use)
 * @param {number} n - The number
 * @returns {number} Tier index (0 = no suffix, 1 = K, etc.)
 */
function getTier(n) {
  if (Math.abs(n) < 1000) return 0;
  return Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    CULTIVATION_SUFFIXES.length - 1
  );
}

/**
 * Get all available suffixes
 * @returns {string[]} Array of suffix strings
 */
function getSuffixes() {
  return [...CULTIVATION_SUFFIXES];
}

/**
 * Get the name/description of a suffix
 * @param {string} suffix - The suffix
 * @returns {string} Description of the suffix
 */
function getSuffixDescription(suffix) {
  const descriptions = {
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
    'Ji': 'Ji - Ultimate limit transcended'
  };
  return descriptions[suffix] || 'Unknown';
}

// Export for use in other modules
const BigNumber = {
  formatNumber,
  formatCompact,
  formatDetailed,
  formatPercent,
  formatMultiplier,
  formatDuration,
  parseNumber,
  compareNumbers,
  safeAdd,
  safeMultiply,
  clamp,
  lerp,
  randomRange,
  randomInt,
  orderOfMagnitude,
  getTier,
  getSuffixes,
  getSuffixDescription,
  CULTIVATION_SUFFIXES,
  SUFFIX_VALUES
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BigNumber;
} else {
  // Browser global
  window.BigNumber = BigNumber;
  // Also expose commonly used functions directly
  window.formatNumber = formatNumber;
  window.formatCompact = formatCompact;
  window.formatDuration = formatDuration;
  window.parseNumber = parseNumber;
}
