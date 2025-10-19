import { generateNormalPair } from './random';
import { isPointInPolygon, type Point } from './geometry';

/**
 * Represents a bomb with its impact coordinates and hit status
 */
export interface Bomb {
  id: number;
  x: number;
  y: number;
  isHit: boolean;
  timestamp: number;
}

/**
 * Simulation parameters
 */
export interface SimulationParams {
  numBombers: number;
  sigmaX: number;
  sigmaY: number;
  depotCoords: [number, number][];
}

/**
 * Simulation results
 */
export interface SimulationResults {
  bombs: Bomb[];
  hits: number;
  misses: number;
  hitPercentage: number;
  totalBombs: number;
}

/**
 * Default ammunition depot coordinates based on the problem description
 */
export const DEFAULT_DEPOT_COORDS: [number, number][] = [
  [-504, 198],
  [-504, -200],
  [-250, -400],
  [552, 18],
  [552, 950],
  [-200, 950]
];

/**
 * Simulates bomb drops for a squadron
 * @param params - Simulation parameters
 * @returns Array of bomb results
 */
export function simulateBombs(params: SimulationParams): Bomb[] {
  const { numBombers, sigmaX, sigmaY, depotCoords } = params;
  const bombs: Bomb[] = [];
  
  for (let i = 0; i < numBombers; i++) {
    // Generate normally distributed coordinates around origin (0, 0)
    const [x, y] = generateNormalPair(0, 0, sigmaX, sigmaY);
    
    // Check if bomb hits the depot
    const isHit = isPointInPolygon({ x, y }, depotCoords);
    
    bombs.push({
      id: i,
      x,
      y,
      isHit,
      timestamp: Date.now() + i * 100 // Stagger for animation
    });
  }
  
  return bombs;
}

/**
 * Calculates simulation results from bomb data
 * @param bombs - Array of bomb results
 * @returns Simulation statistics
 */
export function calculateResults(bombs: Bomb[]): SimulationResults {
  const hits = bombs.filter(bomb => bomb.isHit).length;
  const misses = bombs.length - hits;
  const hitPercentage = bombs.length > 0 ? (hits / bombs.length) * 100 : 0;
  
  return {
    bombs,
    hits,
    misses,
    hitPercentage,
    totalBombs: bombs.length
  };
}

/**
 * Runs a complete simulation
 * @param params - Simulation parameters
 * @returns Complete simulation results
 */
export function runSimulation(params: SimulationParams): SimulationResults {
  const bombs = simulateBombs(params);
  return calculateResults(bombs);
}