import type { MarsCoordinate, PlannedRoute, RouteMethod } from '../types/route';
import { planTerrainAwareRoute, planDirectMarsRoute } from '../algorithms/routeSearch';
import { JEZERO_TERRAIN_GRID } from '../data/jezeroTerrainData';
import { GALE_TERRAIN_GRID } from '../data/galeTerrainData';
import {
  ALL_ROVER_TRAVERSES,
  CURIOSITY_TRAVERSE,
  calculateDistanceToRoverTraverse
} from '../data/roverTraverses';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface BackendStatus {
  isOnline: boolean;
  terrainAvailable: boolean;
  datasetName?: string;
  region?: string;
  roverTraversesAvailable: boolean;
}

/**
 * Checks if the local FastAPI backend is active.
 */
export async function checkBackendStatus(): Promise<BackendStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2000)
    });

    if (!res.ok) throw new Error('Health check non-200');

    const terrainRes = await fetch(`${API_BASE_URL}/api/terrain/status`, {
      signal: AbortSignal.timeout(2000)
    });
    const terrainData = terrainRes.ok ? await terrainRes.json() : null;

    return {
      isOnline: true,
      terrainAvailable: !!terrainData?.available,
      datasetName: terrainData?.dataset,
      region: terrainData?.region,
      roverTraversesAvailable: true
    };
  } catch {
    return {
      isOnline: false,
      terrainAvailable: true, // Local in-browser grids available as fallback
      datasetName: 'Local High-Resolution DTM (Jezero & Gale Grids)',
      region: 'Jezero & Gale Craters (Client-side Engine)',
      roverTraversesAvailable: true
    };
  }
}

/**
 * Executes route planning using backend API if available, or seamless client-side DTM engine.
 */
export async function planRouteUnified(
  start: MarsCoordinate,
  destination: MarsCoordinate,
  mode: RouteMethod,
  walkingSpeedKmh: number,
  maxSlopeDeg: number
): Promise<PlannedRoute> {
  // Try remote backend first
  try {
    const res = await fetch(`${API_BASE_URL}/api/routes/terrain-aware`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start: {
          latitude: start.latitude,
          longitude: start.longitude
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude
        },
        mode,
        walkingSpeedKmh,
        maxSlopeDeg
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        const waypoints: MarsCoordinate[] = data.waypoints.map((w: any) => ({
          latitude: w.latitude,
          longitude: w.longitude,
          elevationMeters: w.elevationMeters
        }));

        return {
          id: `route-${Date.now()}`,
          name:
            mode === 'historical-rover-reference'
              ? 'ARES Historical Rover Reference Traverse'
              : mode === 'terrain-aware'
              ? 'ARES Terrain-Aware Candidate Route (FastAPI Engine)'
              : 'Direct Spherical Great-Circle Connection',
          start,
          destination,
          waypoints,
          distanceKm: data.distanceKm,
          estimatedDurationHours: data.estimatedDurationHours,
          method: mode,
          terrainAssessmentAvailable: data.terrainCoveragePercent > 0,
          averageSlopeDeg: data.averageSlopeDeg,
          maxSlopeDeg: data.maxSlopeDeg,
          cumulativeElevationGainMeters: data.elevationGainMeters,
          dataLimitations: data.limitations,
          hazardsIntersected: [],
          scienceTargetsNear: [],
          elevationProfile: data.elevationProfile,
          roverProximity: data.roverProximity
        };
      }
    }
  } catch {
    // Backend offline or timed out: seamless client-side fallback
  }

  // --- Client-side deterministic fallback engine ---
  if (mode === 'direct') {
    const directRoute = planDirectMarsRoute(start, destination, walkingSpeedKmh);
    const prox = calculateDistanceToRoverTraverse(directRoute.waypoints, CURIOSITY_TRAVERSE);
    return {
      ...directRoute,
      roverProximity: {
        nearestRover: CURIOSITY_TRAVERSE.roverName,
        minDistanceKm: prox.minDistanceKm,
        closestSol: prox.closestRoverSol,
        closestSite: prox.closestRoverSite
      }
    };
  }

  // Select appropriate client grid (Gale vs Jezero)
  let activeGrid = JEZERO_TERRAIN_GRID;
  let activeTraverse = ALL_ROVER_TRAVERSES[1]; // Perseverance

  if (start.latitude < 0 || destination.latitude < 0) {
    // Gale Crater
    activeGrid = GALE_TERRAIN_GRID;
    activeTraverse = CURIOSITY_TRAVERSE;
  }

  const result = planTerrainAwareRoute(start, destination, activeGrid, {
    walkingSpeedKmh,
    maxAllowedSlopeDeg: maxSlopeDeg
  });

  if (result.success && result.route) {
    const prox = calculateDistanceToRoverTraverse(result.route.waypoints, activeTraverse);
    return {
      ...result.route,
      method: mode,
      roverProximity: {
        nearestRover: activeTraverse.roverName,
        minDistanceKm: prox.minDistanceKm,
        closestSol: prox.closestRoverSol,
        closestSite: prox.closestRoverSite
      },
      dataLimitations: [
        ...result.route.dataLimitations,
        `Historical ${activeTraverse.roverName} traverse was evaluated as a reference benchmark (${prox.minDistanceKm} km minimum separation). Rover routes are historical context; they do not certify human suit safety.`
      ]
    };
  }

  // Fallback to direct route if out-of-grid with explanation
  const fallbackDirect = planDirectMarsRoute(start, destination, walkingSpeedKmh);
  return {
    ...fallbackDirect,
    dataLimitations: [
      `Coordinates lie outside local high-resolution DEM grids (${activeGrid.name}). Direct spherical mode activated.`,
      ...fallbackDirect.dataLimitations
    ]
  };
}
