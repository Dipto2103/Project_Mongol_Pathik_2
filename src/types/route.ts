export interface MarsCoordinate {
  latitude: number;   // -90 to 90 degrees
  longitude: number;  // -180 to 180 degrees (or 0-360 mapped)
  elevationMeters?: number;
}

export type RouteMethod = 'direct' | 'terrain-aware' | 'historical-rover-reference' | 'science-optimized';

export interface RoverProximityInfo {
  nearestRover: string;
  minDistanceKm: number;
  closestSol: number;
  closestSite: string;
}

export interface PlannedRoute {
  id: string;
  name: string;
  start: MarsCoordinate;
  destination: MarsCoordinate;
  waypoints: MarsCoordinate[];
  distanceKm: number;
  estimatedDurationHours: number | null;
  method: RouteMethod;
  terrainAssessmentAvailable: boolean;
  averageSlopeDeg?: number;
  maxSlopeDeg?: number;
  cumulativeElevationGainMeters?: number;
  dataLimitations: string[];
  hazardsIntersected: string[];
  scienceTargetsNear: string[];
  elevationProfile?: {
    distanceKm: number;
    elevationMeters: number;
    slopeDeg: number;
  }[];
  roverProximity?: RoverProximityInfo;
}

export interface RoutePlanningOptions {
  walkingSpeedKmh: number; // default 0.5 km/h for Mars EVA suit
  method: RouteMethod;
  maxAllowedSlopeDeg: number; // slope threshold, e.g. 15-20 deg
  avoidRoughness: boolean;
  preferSciencePOIs: boolean;
}
