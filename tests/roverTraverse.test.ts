import { describe, it, expect } from 'vitest';
import {
  CURIOSITY_TRAVERSE,
  PERSEVERANCE_TRAVERSE,
  ALL_ROVER_TRAVERSES,
  calculateDistanceToRoverTraverse
} from '../src/data/roverTraverses';
import type { MarsCoordinate } from '../src/types/route';

describe('Historical Rover Traverses & PDS Dataset Integrity', () => {
  it('validates Curiosity traverse data from PDS PLACES', () => {
    expect(CURIOSITY_TRAVERSE.id).toBe('curiosity-historical');
    expect(CURIOSITY_TRAVERSE.roverName).toContain('Curiosity');
    expect(CURIOSITY_TRAVERSE.endpoints.length).toBeGreaterThanOrEqual(18);
    expect(CURIOSITY_TRAVERSE.pdsSourceUrl).toContain('pds.nasa.gov');
    expect(CURIOSITY_TRAVERSE.scientificCaveat).toContain('does not certify human');

    // Gale crater coordinates boundary checks: Lat [-5.2, -4.2], Lon [137.1, 137.6]
    CURIOSITY_TRAVERSE.endpoints.forEach((ep) => {
      expect(ep.coordinate.latitude).toBeLessThan(-4.0);
      expect(ep.coordinate.latitude).toBeGreaterThan(-5.5);
      expect(ep.coordinate.longitude).toBeGreaterThan(137.0);
      expect(ep.coordinate.longitude).toBeLessThan(138.0);
      expect(ep.sol).toBeGreaterThanOrEqual(0);
    });
  });

  it('validates Perseverance traverse data from Mars 2020', () => {
    expect(PERSEVERANCE_TRAVERSE.id).toBe('perseverance-historical');
    expect(PERSEVERANCE_TRAVERSE.roverName).toContain('Perseverance');
    expect(PERSEVERANCE_TRAVERSE.endpoints.length).toBeGreaterThanOrEqual(9);
    expect(PERSEVERANCE_TRAVERSE.scientificCaveat).toContain('does not guarantee unassisted suited astronaut safety');

    // Jezero crater coordinates boundary checks: Lat [18.0, 19.0], Lon [77.0, 78.0]
    PERSEVERANCE_TRAVERSE.endpoints.forEach((ep) => {
      expect(ep.coordinate.latitude).toBeGreaterThan(18.0);
      expect(ep.coordinate.latitude).toBeLessThan(19.0);
      expect(ep.coordinate.longitude).toBeGreaterThan(77.0);
      expect(ep.coordinate.longitude).toBeLessThan(78.0);
      expect(ep.sol).toBeGreaterThanOrEqual(0);
    });
  });

  it('correctly calculates distance to nearest rover endpoint', () => {
    // Bradbury landing coordinate
    const routeWaypoints: MarsCoordinate[] = [
      { latitude: -4.5895, longitude: 137.4417 }
    ];

    const result = calculateDistanceToRoverTraverse(routeWaypoints, CURIOSITY_TRAVERSE);

    expect(result.minDistanceKm).toBe(0);
    expect(result.closestRoverSol).toBe(0);
    expect(result.closestRoverSite).toBe('Bradbury Landing');
  });

  it('ensures all rovers have explicit scientific caveats preventing human safety assumptions', () => {
    ALL_ROVER_TRAVERSES.forEach((traverse) => {
      expect(traverse.scientificCaveat).toBeDefined();
      expect(traverse.scientificCaveat.length).toBeGreaterThan(20);
      expect(traverse.pdsSourceUrl).toMatch(/^https?:\/\//);
    });
  });
});
