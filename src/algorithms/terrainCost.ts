import type { MarsCoordinate } from '../types/route';
import { calculateMarsDistanceKm } from './distance';

export interface TerrainCell {
  x: number; // grid column
  y: number; // grid row
  coordinate: MarsCoordinate;
  elevationMeters: number | null; // null represents unmeasured/unknown
  slopeDeg: number | null;
  roughness: number | null; // 0 to 1
  hazardPenalty: number; // additional penalty from mapped hazards
  isImpassable?: boolean;
}

export interface TerrainGrid {
  name: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  cols: number;
  rows: number;
  resolutionMeters: number; // e.g. 50m CTX/HiRISE derived DEM cell size
  cells: TerrainCell[][];
}

export interface TerrainCostWeights {
  distanceWeight: number;    // wd
  slopeWeight: number;       // ws
  roughnessWeight: number;   // wr
  hazardWeight: number;      // wh
  uncertaintyWeight: number; // wu
  maxTraversableSlopeDeg: number; // e.g. 20 degrees
}

export const DEFAULT_COST_WEIGHTS: TerrainCostWeights = {
  distanceWeight: 1.0,
  slopeWeight: 2.5,
  roughnessWeight: 1.8,
  hazardWeight: 4.0,
  uncertaintyWeight: 3.0,
  maxTraversableSlopeDeg: 22.0
};

/**
 * Calculates local slope angle in degrees from elevation gradient dz/dx, dz/dy:
 * theta = atan( sqrt( (dz/dx)^2 + (dz/dy)^2 ) )
 */
export function calculateSlopeDeg(
  dzDx: number,
  dzDy: number
): number {
  const gradient = Math.sqrt(dzDx * dzDx + dzDy * dzDy);
  return (Math.atan(gradient) * 180) / Math.PI;
}

/**
 * Calculates transition edge cost between two adjacent terrain cells C(e).
 * C(e) = wd*D(e) + ws*S(e) + wr*R(e) + wh*H(e) + wu*U(e)
 */
export function calculateEdgeCost(
  from: TerrainCell,
  to: TerrainCell,
  weights: TerrainCostWeights = DEFAULT_COST_WEIGHTS
): { cost: number; traversable: boolean; reason?: string } {
  // Check if either cell is permanently marked impassable
  if (from.isImpassable || to.isImpassable) {
    return { cost: Infinity, traversable: false, reason: 'Impassable obstacle / cliff edge' };
  }

  // Handle Unknown / Missing Terrain (Never treat missing data as zero hazard)
  const hasUnknownElevation = from.elevationMeters === null || to.elevationMeters === null;
  const hasUnknownSlope = from.slopeDeg === null || to.slopeDeg === null;
  const isUncertain = hasUnknownElevation || hasUnknownSlope;

  const distKm = calculateMarsDistanceKm(from.coordinate, to.coordinate);
  const baseDistanceCost = weights.distanceWeight * distKm;

  // Slope check
  const effectiveSlope = to.slopeDeg ?? (from.slopeDeg ?? 0);
  if (effectiveSlope > weights.maxTraversableSlopeDeg) {
    return {
      cost: Infinity,
      traversable: false,
      reason: `Slope ${effectiveSlope.toFixed(1)}° exceeds astronaut safety limit of ${weights.maxTraversableSlopeDeg}°`
    };
  }

  // Slope cost: progressive nonlinear penalty as slope increases
  const slopeRatio = Math.max(0, effectiveSlope / weights.maxTraversableSlopeDeg);
  const slopeCost = weights.slopeWeight * Math.pow(slopeRatio, 1.8) * distKm * 10;

  // Roughness cost
  const effectiveRoughness = to.roughness ?? 0.2;
  const roughnessCost = weights.roughnessWeight * effectiveRoughness * distKm * 5;

  // Hazard cost
  const hazardCost = weights.hazardWeight * Math.max(from.hazardPenalty, to.hazardPenalty);

  // Uncertainty cost: penalize routing through unmapped or incomplete terrain
  const uncertaintyCost = isUncertain ? weights.uncertaintyWeight * distKm * 8 : 0;

  const totalCost = baseDistanceCost + slopeCost + roughnessCost + hazardCost + uncertaintyCost;

  return {
    cost: totalCost,
    traversable: true
  };
}
