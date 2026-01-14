/**
 * Lehman Formula Calculator
 * Calculates M&A advisory fees based on the traditional Lehman Formula
 */

export type LehmanType = 'single' | 'double';

export interface CalculationInput {
  ebitda: number;
  multiple: number;
  lehmanType: LehmanType;
}

export interface CalculationResult {
  tev: number; // Total Enterprise Value
  fee: number; // Total fee
  feeBreakdown: FeeTier[];
  formattedTev: string;
  formattedFee: string;
}

export interface FeeTier {
  tier: number;
  rangeStart: number;
  rangeEnd: number;
  percentage: number;
  amount: number;
}

// Single Lehman percentages (5-4-3-2-1)
const SINGLE_LEHMAN_RATES = [0.05, 0.04, 0.03, 0.02, 0.01];

// TEV thresholds in millions (0-1M, 1-2M, 2-3M, 3-4M, 4M+)
const TIER_THRESHOLDS = [0, 1, 2, 3, 4];

/**
 * Format number with commas and 2 decimal places
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate fee for a specific tier
 */
function calculateTierFee(
  tevAmount: number,
  tierIndex: number,
  multiplier: number
): FeeTier {
  const rate = SINGLE_LEHMAN_RATES[tierIndex];
  const rangeStart = TIER_THRESHOLDS[tierIndex];
  const rangeEnd = tierIndex < TIER_THRESHOLDS.length - 1
    ? TIER_THRESHOLDS[tierIndex + 1]
    : Infinity;

  let amount = 0;

  if (tevAmount > rangeStart) {
    const tierAmount = Math.min(tevAmount - rangeStart, rangeEnd - rangeStart);
    amount = tierAmount * rate * multiplier;
  }

  return {
    tier: tierIndex + 1,
    rangeStart,
    rangeEnd,
    percentage: rate * 100 * multiplier,
    amount,
  };
}

/**
 * Calculate Lehman fee with breakdown by tier
 */
export function calculateLehmanFee(input: CalculationInput): CalculationResult {
  const { ebitda, multiple, lehmanType } = input;

  // Validate inputs
  if (ebitda < 0 || multiple < 0) {
    throw new Error('EBITDA and multiple must be positive numbers');
  }

  // Calculate TEV (Total Enterprise Value)
  const tev = ebitda * multiple;

  // Determine multiplier (1x for single, 2x for double Lehman)
  const multiplier = lehmanType === 'double' ? 2 : 1;

  // Calculate fee breakdown by tier
  const feeBreakdown: FeeTier[] = [];
  let totalFee = 0;

  // Calculate each tier
  for (let i = 0; i < SINGLE_LEHMAN_RATES.length; i++) {
    const tierFee = calculateTierFee(tev, i, multiplier);
    feeBreakdown.push(tierFee);
    totalFee += tierFee.amount;
  }

  return {
    tev: parseFloat(tev.toFixed(3)),
    fee: totalFee * 1000000, // Convert to actual dollars (tev is in millions)
    feeBreakdown,
    formattedTev: formatCurrency(tev),
    formattedFee: formatCurrency(totalFee * 1000000),
  };
}

/**
 * Validate user input
 */
export function validateInput(value: string): {
  isValid: boolean;
  error?: string;
  numericValue?: number;
} {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: 'This field is required',
    };
  }

  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      error: 'Please enter a valid number',
    };
  }

  if (numericValue < 0) {
    return {
      isValid: false,
      error: 'Value must be positive',
    };
  }

  if (numericValue > 10000) {
    return {
      isValid: false,
      error: 'Value seems unreasonably large (max 10,000)',
    };
  }

  return {
    isValid: true,
    numericValue,
  };
}
