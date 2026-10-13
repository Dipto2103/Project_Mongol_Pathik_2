import { describe, it, expect } from 'vitest';
import { planTerrainAwareRoute, planDirectMarsRoute } from '../src/algorithms/routeSearch';
import { JEZERO_TERRAIN_GRID } from '../src/data/jezeroTerrainData';

describe('Route Search Algorithms', () => {
  it('generates a direct great-circle route with explicit disclaimer', () => {
    const start = { latitude: 18.4447, longitude: 77.4508 };
    const dest = { latitude: 18.3970, longitude: 77.4120 };

    const route = planDirectMarsRoute(start, dest, 0.5);

    expect(route.method).toBe('direct');
    expect(route.terrainAssessmentAvailable).toBe(false);
    expect(route.distanceKm).toBeGreaterThan(0);
    expect(route.estimatedDurationHours).toBeGreaterThan(0);
    expect(route.dataLimitations.length).toBeGreaterThan(0);
    expect(route.dataLimitations[1]).toContain('Must NOT be treated as a verified safe');
  });

  it('runs A* terrain-aware pathfinding on Jezero grid successfully', () => {
    // Start at Octavia Butler landing site on Jezero crater floor
    const start = { latitude: 18.4447, longitude: 77.4508 };
    // Destination on delta top (requires finding route through gentle ramp)
    const dest = { latitude: 18.4200, longitude: 77.4000 };

    const result = planTerrainAwareRoute(start, dest, JEZERO_TERRAIN_GRID, {
      walkingSpeedKmh: 0.5,
      maxAllowedSlopeDeg: 22.0
    });

    expect(result.success).toBe(true);
    expect(result.route).toBeDefined();
    if (result.route) {
      expect(result.route.method).toBe('terrain-aware');
      expect(result.route.terrainAssessmentAvailable).toBe(true);
      expect(result.route.waypoints.length).toBeGreaterThan(2);
      expect(result.route.maxSlopeDeg).toBeLessThanOrEqual(22.0);
      expect(result.route.elevationProfile?.length).toBeGreaterThan(0);
    }
  });

  it('handles coordinate points identical within cell resolution', () => {
    const loc = { latitude: 18.4447, longitude: 77.4508 };
    const result = planTerrainAwareRoute(loc, loc, JEZERO_TERRAIN_GRID);
    expect(result.success).toBe(true);
    expect(result.route?.distanceKm).toBe(0);
  });

  it('rejects coordinates outside the regional grid with an informative error', () => {
    const outCoord = { latitude: 0, longitude: 0 };
    const insideCoord = { latitude: 18.44, longitude: 77.45 };
    const result = planTerrainAwareRoute(outCoord, insideCoord, JEZERO_TERRAIN_GRID);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('outside the high-resolution terrain analysis grid');
  });
});
