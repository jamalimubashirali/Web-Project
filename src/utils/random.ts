/**
 * Generates a random number following normal distribution using Box-Muller transform
 * @param mean - The mean of the distribution
 * @param stdDev - The standard deviation of the distribution
 * @returns A normally distributed random number
 */
export function generateNormalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();

  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

/**
 * Generates a pair of normally distributed random numbers
 * @param meanX - Mean for X coordinate
 * @param meanY - Mean for Y coordinate
 * @param stdDevX - Standard deviation for X coordinate
 * @param stdDevY - Standard deviation for Y coordinate
 * @returns Tuple of [x, y] coordinates
 */
export function generateNormalPair(
  meanX: number,
  meanY: number,
  stdDevX: number,
  stdDevY: number
): [number, number] {
  return [
    generateNormalRandom(meanX, stdDevX),
    generateNormalRandom(meanY, stdDevY)
  ];
}