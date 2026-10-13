import type { MarsCoordinate, PlannedRoute, RoutePlanningOptions } from '../types/route';
import { calculateMarsDistanceKm, estimateTravelHours, interpolateGreatCircleWaypoints } from './distance';
import {
  TerrainGrid,
  TerrainCell,
  calculateEdgeCost,
  DEFAULT_COST_WEIGHTS,
  TerrainCostWeights
} from './terrainCost';

interface AStarNode {
  cell: TerrainCell;
  gScore: number;
  fScore: number;
  parent: AStarNode | null;
}

/**
 * Finds the closest grid cell to a given MarsCoordinate in a TerrainGrid.
 */
export function findNearestGridCell(grid: TerrainGrid, coord: MarsCoordinate): TerrainCell | null {
  if (
    coord.latitude < grid.minLat ||
    coord.latitude > grid.maxLat ||
    coord.longitude < grid.minLon ||
    coord.longitude > grid.maxLon
  ) {
    return null; // outside region
  }

  const latSpan = grid.maxLat - grid.minLat;
  const lonSpan = grid.maxLon - grid.minLon;

  const rowFraction = (grid.maxLat - coord.latitude) / latSpan;
  const colFraction = (coord.longitude - grid.minLon) / lonSpan;

  const row = Math.min(grid.rows - 1, Math.max(0, Math.round(rowFraction * (grid.rows - 1))));
  const col = Math.min(grid.cols - 1, Math.max(0, Math.round(colFraction * (grid.cols - 1))));

  return grid.cells[row][col] || null;
}

/**
 * Executes A* route search across a terrain grid.
 */
export function planTerrainAwareRoute(
  startCoord: MarsCoordinate,
  destCoord: MarsCoordinate,
  grid: TerrainGrid,
  options?: Partial<RoutePlanningOptions>,
  customWeights?: Partial<TerrainCostWeights>
): {
  success: boolean;
  route?: PlannedRoute;
  errorMessage?: string;
  evaluatedNodesCount: number;
} {
  const walkingSpeed = options?.walkingSpeedKmh ?? 0.5;
  const maxSlope = options?.maxAllowedSlopeDeg ?? 20.0;

  const weights: TerrainCostWeights = {
    ...DEFAULT_COST_WEIGHTS,
    maxTraversableSlopeDeg: maxSlope,
    ...customWeights
  };

  const startCell = findNearestGridCell(grid, startCoord);
  const destCell = findNearestGridCell(grid, destCoord);

  if (!startCell || !destCell) {
    return {
      success: false,
      evaluatedNodesCount: 0,
      errorMessage: `Selected coordinates lie outside the high-resolution terrain analysis grid (${grid.name}).`
    };
  }

  if (startCell.x === destCell.x && startCell.y === destCell.y) {
    return {
      success: true,
      evaluatedNodesCount: 1,
      route: {
        id: `route-${Date.now()}`,
        name: `Stationary / Base Operation (${grid.name})`,
        start: startCoord,
        destination: destCoord,
        waypoints: [startCoord, destCoord],
        distanceKm: 0,
        estimatedDurationHours: 0,
        method: 'terrain-aware',
        terrainAssessmentAvailable: true,
        averageSlopeDeg: startCell.slopeDeg ?? 0,
        maxSlopeDeg: startCell.slopeDeg ?? 0,
        cumulativeElevationGainMeters: 0,
        dataLimitations: ['Start and destination are identical within grid cell resolution.'],
        hazardsIntersected: [],
        scienceTargetsNear: [],
        elevationProfile: [
          { distanceKm: 0, elevationMeters: startCell.elevationMeters ?? 0, slopeDeg: startCell.slopeDeg ?? 0 }
        ]
      }
    };
  }

  const openSet: Map<string, AStarNode> = new Map();
  const closedSet: Set<string> = new Set();

  const key = (c: TerrainCell) => `${c.x},${c.y}`;

  // Heuristic: Euclidean Mars distance
  const heuristic = (c: TerrainCell) => calculateMarsDistanceKm(c.coordinate, destCell.coordinate);

  const startNode: AStarNode = {
    cell: startCell,
    gScore: 0,
    fScore: heuristic(startCell),
    parent: null
  };

  openSet.set(key(startCell), startNode);
  let evaluatedCount = 0;

  while (openSet.size > 0) {
    // Select lowest fScore node
    let current: AStarNode | null = null;
    let lowestF = Infinity;

    for (const node of openSet.values()) {
      if (node.fScore < lowestF) {
        lowestF = node.fScore;
        current = node;
      }
    }

    if (!current) break;

    evaluatedCount++;
    if (current.cell.x === destCell.x && current.cell.y === destCell.y) {
      // Reconstruct route
      return {
        success: true,
        evaluatedNodesCount: evaluatedCount,
        route: buildRouteFromAStar(current, startCoord, destCoord, grid, walkingSpeed)
      };
    }

    const currentKey = key(current.cell);
    openSet.delete(currentKey);
    closedSet.add(currentKey);

    // 8-neighbor exploration
    const neighbors: TerrainCell[] = [];
    const dxList = [-1, 0, 1, -1, 1, -1, 0, 1];
    const dyList = [-1, -1, -1, 0, 0, 1, 1, 1];

    for (let i = 0; i < 8; i++) {
      const nx = current.cell.x + dxList[i];
      const ny = current.cell.y + dyList[i];

      if (ny >= 0 && ny < grid.rows && nx >= 0 && nx < grid.cols) {
        neighbors.push(grid.cells[ny][nx]);
      }
    }

    for (const neighbor of neighbors) {
      const nKey = key(neighbor);
      if (closedSet.has(nKey)) continue;

      const edge = calculateEdgeCost(current.cell, neighbor, weights);
      if (!edge.traversable) continue;

      const tentativeG = current.gScore + edge.cost;
      const existing = openSet.get(nKey);

      if (!existing || tentativeG < existing.gScore) {
        const neighborNode: AStarNode = {
          cell: neighbor,
          gScore: tentativeG,
          fScore: tentativeG + heuristic(neighbor),
          parent: current
        };
        openSet.set(nKey, neighborNode);
      }
    }
  }

  return {
    success: false,
    evaluatedNodesCount: evaluatedCount,
    errorMessage: `No safe traversable route found within ${maxSlope}° slope constraints. The terrain contains impassable escarpments or hazard barriers.`
  };
}

function buildRouteFromAStar(
  goalNode: AStarNode,
  startCoord: MarsCoordinate,
  destCoord: MarsCoordinate,
  grid: TerrainGrid,
  walkingSpeed: number
): PlannedRoute {
  const pathCells: TerrainCell[] = [];
  let curr: AStarNode | null = goalNode;

  while (curr) {
    pathCells.unshift(curr.cell);
    curr = curr.parent;
  }

  const waypoints: MarsCoordinate[] = [
    startCoord,
    ...pathCells.map((c) => c.coordinate),
    destCoord
  ];

  // Calculate cumulative distance and slope profile
  let totalDistKm = 0;
  let slopeSum = 0;
  let maxSlope = 0;
  let elevationGain = 0;

  const elevationProfile: { distanceKm: number; elevationMeters: number; slopeDeg: number }[] = [];

  for (let i = 0; i < pathCells.length; i++) {
    const cell = pathCells[i];
    const elev = cell.elevationMeters ?? 0;
    const slope = cell.slopeDeg ?? 0;

    if (i > 0) {
      const prev = pathCells[i - 1];
      const stepDist = calculateMarsDistanceKm(prev.coordinate, cell.coordinate);
      totalDistKm += stepDist;

      const elevDiff = (cell.elevationMeters ?? 0) - (prev.elevationMeters ?? 0);
      if (elevDiff > 0) elevationGain += elevDiff;
    }

    slopeSum += slope;
    if (slope > maxSlope) maxSlope = slope;

    elevationProfile.push({
      distanceKm: parseFloat(totalDistKm.toFixed(3)),
      elevationMeters: Math.round(elev),
      slopeDeg: parseFloat(slope.toFixed(1))
    });
  }

  const avgSlope = pathCells.length > 0 ? slopeSum / pathCells.length : 0;
  const estimatedHours = estimateTravelHours(totalDistKm, walkingSpeed);

  return {
    id: `route-${Date.now()}`,
    name: `ARES Optimized EVA (${grid.name})`,
    start: startCoord,
    destination: destCoord,
    waypoints,
    distanceKm: parseFloat(totalDistKm.toFixed(3)),
    estimatedDurationHours: estimatedHours ? parseFloat(estimatedHours.toFixed(2)) : null,
    method: 'terrain-aware',
    terrainAssessmentAvailable: true,
    averageSlopeDeg: parseFloat(avgSlope.toFixed(1)),
    maxSlopeDeg: parseFloat(maxSlope.toFixed(1)),
    cumulativeElevationGainMeters: Math.round(elevationGain),
    dataLimitations: [
      `Calculated against ${grid.name} regional elevation model (${grid.resolutionMeters}m spatial cell resolution).`,
      'Sub-meter boulders, micro-fissures, and regolith bearing strength cannot be resolved from orbital elevation models.'
    ],
    hazardsIntersected: [],
    scienceTargetsNear: [],
    elevationProfile
  };
}

/**
 * Fallback / Mode A planner: Direct Great-Circle Route
 */
export function planDirectMarsRoute(
  start: MarsCoordinate,
  destination: MarsCoordinate,
  walkingSpeedKmh: number = 0.5
): PlannedRoute {
  const distanceKm = calculateMarsDistanceKm(start, destination);
  const waypoints = interpolateGreatCircleWaypoints(start, destination, 24);
  const estimatedHours = estimateTravelHours(distanceKm, walkingSpeedKmh);

  return {
    id: `direct-${Date.now()}`,
    name: 'Direct Spherical Great-Circle Connection',
    start,
    destination,
    waypoints,
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    estimatedDurationHours: estimatedHours ? parseFloat(estimatedHours.toFixed(2)) : null,
    method: 'direct',
    terrainAssessmentAvailable: false,
    dataLimitations: [
      'Direct-distance estimate only. Does not verify terrain traversability, slope steepness, or surface obstacles.',
      'Must NOT be treated as a verified safe astronaut walking route.'
    ],
    hazardsIntersected: [],
    scienceTargetsNear: []
  };
}
