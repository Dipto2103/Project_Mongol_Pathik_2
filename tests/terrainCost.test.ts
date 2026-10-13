import { describe, it, expect } from 'vitest';
import {
  calculateSlopeDeg,
  calculateEdgeCost,
  DEFAULT_COST_WEIGHTS,
  TerrainCell
} from '../src/algorithms/terrainCost';

describe('Terrain Cost and Slope Algorithms', () => {
  it('correctly calculates slope in degrees from elevation gradient dz/dx, dz/dy', () => {
    // Example from specification: 20m vertical rise over 100m horizontal distance -> dz/dx = 0.2, dz/dy = 0
    // theta = atan(0.2) * 180 / pi = 11.31 deg
    const slope = calculateSlopeDeg(0.2, 0);
    expect(slope).toBeCloseTo(11.31, 2);

    // Flat terrain: dz/dx = 0, dz/dy = 0 -> slope = 0 deg
    expect(calculateSlopeDeg(0, 0)).toBe(0);

    // 45 degree slope: rise = run -> gradient = 1.0 -> theta = 45 deg
    expect(calculateSlopeDeg(1.0, 0)).toBeCloseTo(45.0, 2);
  });

  it('declares edge impassable if slope exceeds max safety threshold', () => {
    const fromCell: TerrainCell = {
      x: 0,
      y: 0,
      coordinate: { latitude: 18.4, longitude: 77.4 },
      elevationMeters: -2500,
      slopeDeg: 5,
      roughness: 0.1,
      hazardPenalty: 0
    };

    const steepCell: TerrainCell = {
      x: 0,
      y: 1,
      coordinate: { latitude: 18.41, longitude: 77.4 },
      elevationMeters: -2450,
      slopeDeg: 25.0, // Exceeds default limit of 22 deg
      roughness: 0.2,
      hazardPenalty: 0
    };

    const result = calculateEdgeCost(fromCell, steepCell, DEFAULT_COST_WEIGHTS);
    expect(result.traversable).toBe(false);
    expect(result.cost).toBe(Infinity);
  });

  it('penalizes cells with unknown elevation or slope data without treating them as zero hazard', () => {
    const fromCell: TerrainCell = {
      x: 0,
      y: 0,
      coordinate: { latitude: 18.4, longitude: 77.4 },
      elevationMeters: -2500,
      slopeDeg: 4,
      roughness: 0.1,
      hazardPenalty: 0
    };

    const knownCell: TerrainCell = {
      x: 0,
      y: 1,
      coordinate: { latitude: 18.405, longitude: 77.4 },
      elevationMeters: -2495,
      slopeDeg: 4,
      roughness: 0.1,
      hazardPenalty: 0
    };

    const unknownCell: TerrainCell = {
      x: 0,
      y: 1,
      coordinate: { latitude: 18.405, longitude: 77.4 },
      elevationMeters: null, // missing elevation data
      slopeDeg: null,        // missing slope data
      roughness: 0.1,
      hazardPenalty: 0
    };

    const costKnown = calculateEdgeCost(fromCell, knownCell);
    const costUnknown = calculateEdgeCost(fromCell, unknownCell);

    // Missing data must be penalized higher than known gentle terrain
    expect(costUnknown.cost).toBeGreaterThan(costKnown.cost);
  });
});
