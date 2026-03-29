import { describe, it, expect } from 'vitest';
import {
  calculateShoelaceArea,
  calculateDistance,
  pixelsToFeet,
  calculateGrade,
  inchesToFeet,
} from '../utils';

describe('Math Utilities', () => {
  describe('calculateShoelaceArea', () => {
    it('calculates area of a square', () => {
      // 10x10 square
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      expect(calculateShoelaceArea(points)).toBe(100);
    });

    it('calculates area of a triangle', () => {
      // Right triangle with base=10, height=10
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 10 },
      ];
      expect(calculateShoelaceArea(points)).toBe(50);
    });

    it('returns 0 for less than 3 points', () => {
      expect(calculateShoelaceArea([])).toBe(0);
      expect(calculateShoelaceArea([{ x: 0, y: 0 }])).toBe(0);
      expect(calculateShoelaceArea([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBe(0);
    });

    it('handles complex polygons', () => {
      // L-shaped polygon
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 10 },
        { x: 0, y: 10 },
      ];
      expect(calculateShoelaceArea(points)).toBe(75);
    });
  });

  describe('calculateDistance', () => {
    it('calculates horizontal distance', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 10, y: 0 };
      expect(calculateDistance(p1, p2)).toBe(10);
    });

    it('calculates vertical distance', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 0, y: 10 };
      expect(calculateDistance(p1, p2)).toBe(10);
    });

    it('calculates diagonal distance (Pythagorean)', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 3, y: 4 };
      expect(calculateDistance(p1, p2)).toBe(5);
    });

    it('returns 0 for same points', () => {
      const p = { x: 5, y: 5 };
      expect(calculateDistance(p, p)).toBe(0);
    });
  });

  describe('pixelsToFeet', () => {
    it('converts pixels to feet using scale', () => {
      // If 100 pixels = 10 feet, then 50 pixels = 5 feet
      expect(pixelsToFeet(50, 100, 10)).toBe(5);
    });

    it('handles zero scale pixels', () => {
      expect(pixelsToFeet(50, 0, 10)).toBe(0);
    });

    it('handles fractional results', () => {
      // If 100 pixels = 10 feet, then 25 pixels = 2.5 feet
      expect(pixelsToFeet(25, 100, 10)).toBe(2.5);
    });
  });

  describe('calculateGrade', () => {
    it('calculates grade percentage', () => {
      // 1 foot rise over 10 feet run = 10% grade
      expect(calculateGrade(1, 10)).toBe(10);
    });

    it('handles zero run', () => {
      expect(calculateGrade(1, 0)).toBe(0);
    });

    it('handles negative grade', () => {
      expect(calculateGrade(-1, 10)).toBe(-10);
    });

    it('calculates steep grade', () => {
      // 5 feet rise over 10 feet run = 50% grade
      expect(calculateGrade(5, 10)).toBe(50);
    });
  });

  describe('inchesToFeet', () => {
    it('converts inches to feet', () => {
      expect(inchesToFeet(12)).toBe(1);
      expect(inchesToFeet(24)).toBe(2);
      expect(inchesToFeet(6)).toBe(0.5);
    });

    it('handles zero', () => {
      expect(inchesToFeet(0)).toBe(0);
    });
  });
});
