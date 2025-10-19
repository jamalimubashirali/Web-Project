/**
 * Point interface for 2D coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Checks if a point is inside a polygon using the ray-casting algorithm
 * @param point - The point to test
 * @param polygon - Array of polygon vertices as [x, y] tuples
 * @returns true if point is inside polygon, false otherwise
 */
export function isPointInPolygon(point: Point, polygon: [number, number][]): boolean {
  const { x, y } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Gets the bounding box of a polygon
 * @param polygon - Array of polygon vertices
 * @returns Object with min/max x and y coordinates
 */
export function getPolygonBounds(polygon: [number, number][]) {
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

/**
 * Calculates the optimal scale factor for a polygon to fit in viewport
 * @param bounds - Polygon bounds
 * @param viewportWidth - Target viewport width
 * @param viewportHeight - Target viewport height
 * @param padding - Padding around the polygon
 * @returns Scale factor
 */
export function calculateOptimalScale(
  bounds: ReturnType<typeof getPolygonBounds>,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 100
): number {
  // Calculate the maximum extent from origin to ensure everything fits
  const maxExtentX = Math.max(Math.abs(bounds.minX), Math.abs(bounds.maxX));
  const maxExtentY = Math.max(Math.abs(bounds.minY), Math.abs(bounds.maxY));

  // Add some buffer for bomb impacts (typically 2-3 sigma)
  const bufferX = maxExtentX * 0.5; // 50% buffer for bomb spread
  const bufferY = maxExtentY * 0.5;

  const totalExtentX = maxExtentX + bufferX;
  const totalExtentY = maxExtentY + bufferY;

  // Calculate scale to fit the maximum extent with padding
  const scaleX = (viewportWidth - 2 * padding) / (2 * totalExtentX);
  const scaleY = (viewportHeight - 2 * padding) / (2 * totalExtentY);

  return Math.min(scaleX, scaleY);
}

/**
 * Scales coordinates to fit within a viewport with origin (0,0) at center
 * @param coords - Original coordinates
 * @param bounds - Polygon bounds
 * @param viewportWidth - Target viewport width
 * @param viewportHeight - Target viewport height
 * @param padding - Padding around the polygon
 * @param zoomLevel - Zoom multiplier (default 1)
 * @param panOffset - Pan offset in screen coordinates
 * @returns Scaled coordinates
 */
export function scaleToViewport(
  coords: Point,
  bounds: ReturnType<typeof getPolygonBounds>,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 100,
  zoomLevel: number = 1,
  panOffset: Point = { x: 0, y: 0 }
): Point {
  const baseScale = calculateOptimalScale(bounds, viewportWidth, viewportHeight, padding);
  const scale = baseScale * zoomLevel;

  // Always center the coordinate system at viewport center
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  return {
    x: centerX + coords.x * scale + panOffset.x,
    y: centerY - coords.y * scale + panOffset.y  // Flip Y axis for screen coordinates
  };
}