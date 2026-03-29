import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate area using the Shoelace formula
 * @param points Array of {x, y} coordinates forming a polygon
 * @returns Area in square units (pixels)
 */
export function calculateShoelaceArea(points: { x: number; y: number }[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert pixels to real-world units based on scale
 */
export function pixelsToFeet(pixels: number, scalePixels: number, scaleFeet: number): number {
  if (scalePixels === 0) return 0;
  return (pixels / scalePixels) * scaleFeet;
}

/**
 * Calculate slope grade percentage
 * @param rise Vertical rise (in same units as run)
 * @param run Horizontal distance
 * @returns Grade as percentage
 */
export function calculateGrade(rise: number, run: number): number {
  if (run === 0) return 0;
  return (rise / run) * 100;
}

/**
 * Convert inches to feet
 */
export function inchesToFeet(inches: number): number {
  return inches / 12;
}

/**
 * Get grade color based on percentage
 */
export function getGradeColor(grade: number): string {
  const absGrade = Math.abs(grade);
  if (absGrade < 2) return 'grade-green';
  if (absGrade <= 6) return 'grade-yellow';
  return 'grade-red';
}

/**
 * Get grade emoji based on percentage
 */
export function getGradeEmoji(grade: number): string {
  const absGrade = Math.abs(grade);
  if (absGrade < 2) return '🟢';
  if (absGrade <= 6) return '🟡';
  return '🔴';
}
