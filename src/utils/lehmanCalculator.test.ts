import { describe, it, expect } from 'vitest';
import {
  calculateLehmanFee,
  validateInput,
  formatCurrency,
  type CalculationInput,
} from './lehmanCalculator';

describe('Lehman Calculator', () => {
  describe('calculateLehmanFee', () => {
    it('should calculate single Lehman fee for TEV < 1M', () => {
      const input: CalculationInput = {
        ebitda: 0.5,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(0.5);
      expect(result.fee).toBe(25000); // 0.5M * 5% = $25,000
    });

    it('should calculate single Lehman fee for TEV = 3M (legacy test case)', () => {
      const input: CalculationInput = {
        ebitda: 3,
        multiple: 5,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(15);
      // Tier 1: 1M * 5% = 50,000
      // Tier 2: 1M * 4% = 40,000
      // Tier 3: 1M * 3% = 30,000
      // Tier 4: 1M * 2% = 20,000
      // Tier 5: 11M * 1% = 110,000
      // Total = 250,000
      expect(result.fee).toBe(250000);
    });

    it('should calculate double Lehman fee correctly', () => {
      const input: CalculationInput = {
        ebitda: 3,
        multiple: 5,
        lehmanType: 'double',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(15);
      expect(result.fee).toBe(500000); // Double the single Lehman = 500,000
    });

    it('should calculate fee for TEV between 1-2M', () => {
      const input: CalculationInput = {
        ebitda: 1.5,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(1.5);
      // Tier 1: 1M * 5% = 50,000
      // Tier 2: 0.5M * 4% = 20,000
      // Total = 70,000
      expect(result.fee).toBe(70000);
    });

    it('should calculate fee for TEV between 2-3M', () => {
      const input: CalculationInput = {
        ebitda: 2.5,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(2.5);
      // Tier 1: 1M * 5% = 50,000
      // Tier 2: 1M * 4% = 40,000
      // Tier 3: 0.5M * 3% = 15,000
      // Total = 105,000
      expect(result.fee).toBe(105000);
    });

    it('should calculate fee for TEV between 3-4M', () => {
      const input: CalculationInput = {
        ebitda: 3.5,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(3.5);
      // Tier 1: 1M * 5% = 50,000
      // Tier 2: 1M * 4% = 40,000
      // Tier 3: 1M * 3% = 30,000
      // Tier 4: 0.5M * 2% = 10,000
      // Total = 130,000
      expect(result.fee).toBe(130000);
    });

    it('should handle zero EBITDA', () => {
      const input: CalculationInput = {
        ebitda: 0,
        multiple: 5,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(0);
      expect(result.fee).toBe(0);
    });

    it('should handle zero multiple', () => {
      const input: CalculationInput = {
        ebitda: 5,
        multiple: 0,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.tev).toBe(0);
      expect(result.fee).toBe(0);
    });

    it('should throw error for negative EBITDA', () => {
      const input: CalculationInput = {
        ebitda: -1,
        multiple: 5,
        lehmanType: 'single',
      };

      expect(() => calculateLehmanFee(input)).toThrow(
        'EBITDA and multiple must be positive numbers'
      );
    });

    it('should throw error for negative multiple', () => {
      const input: CalculationInput = {
        ebitda: 3,
        multiple: -5,
        lehmanType: 'single',
      };

      expect(() => calculateLehmanFee(input)).toThrow(
        'EBITDA and multiple must be positive numbers'
      );
    });

    it('should generate fee breakdown with correct number of tiers', () => {
      const input: CalculationInput = {
        ebitda: 10,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.feeBreakdown).toHaveLength(5);
    });

    it('should format TEV correctly', () => {
      const input: CalculationInput = {
        ebitda: 3,
        multiple: 5,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.formattedTev).toBe('15.00');
    });

    it('should format fee correctly', () => {
      const input: CalculationInput = {
        ebitda: 1,
        multiple: 1,
        lehmanType: 'single',
      };

      const result = calculateLehmanFee(input);

      expect(result.formattedFee).toBe('50,000.00');
    });
  });

  describe('validateInput', () => {
    it('should validate correct positive number', () => {
      const result = validateInput('5.5');

      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(5.5);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const result = validateInput('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should reject whitespace', () => {
      const result = validateInput('   ');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    it('should reject non-numeric input', () => {
      const result = validateInput('abc');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid number');
    });

    it('should reject negative numbers', () => {
      const result = validateInput('-5');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Value must be positive');
    });

    it('should reject unreasonably large numbers', () => {
      const result = validateInput('99999');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Value seems unreasonably large (max 10,000)');
    });

    it('should accept zero', () => {
      const result = validateInput('0');

      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(0);
    });

    it('should accept numbers with leading/trailing spaces', () => {
      const result = validateInput('  5.5  ');

      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(5.5);
    });
  });

  describe('formatCurrency', () => {
    it('should format whole numbers with commas', () => {
      expect(formatCurrency(1000000)).toBe('1,000,000.00');
    });

    it('should format decimals to 2 places', () => {
      expect(formatCurrency(1234.567)).toBe('1,234.57');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0.00');
    });

    it('should handle small decimals', () => {
      expect(formatCurrency(0.5)).toBe('0.50');
    });
  });
});
