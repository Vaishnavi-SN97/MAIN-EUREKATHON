export interface Point {
  x: number;
  y: number;
}

export type Shape = 'circle' | 'triangle' | 'square' | 'unknown';

export class ShapeDetector {
  private static normalizePoints(points: Point[]): Point[] {
    if (points.length === 0) return [];

    // Find bounding box
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const width = maxX - minX;
    const height = maxY - minY;

    if (width === 0 || height === 0) return points;

    // Normalize to 0-1 range
    return points.map(p => ({
      x: (p.x - minX) / width,
      y: (p.y - minY) / height
    }));
  }

  private static calculateDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  private static isClosedShape(points: Point[], threshold = 0.15): boolean {
    if (points.length < 10) return false;
    const first = points[0];
    const last = points[points.length - 1];
    return this.calculateDistance(first, last) < threshold;
  }

  private static detectCorners(points: Point[]): number {
    if (points.length < 20) return 0;

    const smoothed = this.smoothPoints(points, 5);
    let corners = 0;
    const angleThreshold = Math.PI / 4; // 45 degrees

    for (let i = 10; i < smoothed.length - 10; i++) {
      const prev = smoothed[i - 10];
      const curr = smoothed[i];
      const next = smoothed[i + 10];

      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
      
      let angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }

      if (angleDiff > angleThreshold) {
        corners++;
      }
    }

    return corners;
  }

  private static smoothPoints(points: Point[], windowSize: number): Point[] {
    const smoothed: Point[] = [];
    
    for (let i = 0; i < points.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let j = -windowSize; j <= windowSize; j++) {
        const idx = i + j;
        if (idx >= 0 && idx < points.length) {
          sumX += points[idx].x;
          sumY += points[idx].y;
          count++;
        }
      }

      smoothed.push({
        x: sumX / count,
        y: sumY / count
      });
    }

    return smoothed;
  }

  private static calculateCircularity(points: Point[]): number {
    if (points.length < 10) return 0;

    // Calculate center
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const center = { x: centerX, y: centerY };

    // Calculate distances from center
    const distances = points.map(p => this.calculateDistance(p, center));
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;

    // Calculate variance
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
    const stdDev = Math.sqrt(variance);

    // Circularity: low standard deviation = more circular
    return 1 - (stdDev / avgDistance);
  }

  static detectShape(points: Point[]): Shape {
    if (points.length < 10) return 'unknown';

    const normalized = this.normalizePoints(points);
    const isClosed = this.isClosedShape(normalized);

    if (!isClosed) return 'unknown';

    const corners = this.detectCorners(normalized);
    const circularity = this.calculateCircularity(normalized);

    // Circle detection
    if (circularity > 0.7 && corners < 3) {
      return 'circle';
    }

    // Triangle detection (2-4 corners, accounting for noise)
    if (corners >= 2 && corners <= 4 && circularity < 0.6) {
      return 'triangle';
    }

    // Square detection (3-5 corners, accounting for noise)
    if (corners >= 3 && corners <= 6 && circularity < 0.7) {
      return 'square';
    }

    return 'unknown';
  }
}
