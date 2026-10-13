import type { MarsCoordinate } from '../types/route';

/**
 * Mars Volumetric Mean Radius according to IAU/IAG Working Group Cartographic Coordinates.
 * Approximated at 3,389.5 km.
 */
export const MARS_MEAN_RADIUS_KM = 3389.5;

/**
 * Standard walking speed for an astronaut in a pressurized planetary EVA suit.
 * Reference: Apollo lunar EVA data & NASA Mars EVA Human Integration Design Handbook (HIDH).
 * Baseline average: 0.5 km/h to 1.2 km/h depending on slope and regolith.
 */
export const DEFAULT_ASTRONAUT_WALK_SPEED_KMH = 0.5;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function isValidMarsCoordinate(coord: unknown): coord is MarsCoordinate {
  if (!coord || typeof coord !== 'object') return false;
  const c = coord as MarsCoordinate;
  return (
    Number.isFinite(c.latitude) &&
    Number.isFinite(c.longitude) &&
    c.latitude >= -90 &&
    c.latitude <= 90 &&
    c.longitude >= -180 &&
    c.longitude <= 360
  );
}

/**
 * Normalizes longitude to [-180, 180] degrees.
 */
export function normalizeLongitude(lon: number): number {
  let normalized = ((lon + 180) % 360);
  if (normalized < 0) normalized += 360;
  normalized -= 180;
  if (normalized === -180 && lon > 0) return 180;
  return normalized;
}

/**
 * Calculates great-circle distance between two Mars coordinates in kilometres
 * using the spherical Haversine formulation.
 */
export function calculateMarsDistanceKm(
  start: MarsCoordinate,
  end: MarsCoordinate
): number {
  if (!isValidMarsCoordinate(start) || !isValidMarsCoordinate(end)) {
    throw new Error('Invalid Martian coordinates provided for distance calculation.');
  }

  const lat1 = toRadians(start.latitude);
  const lat2 = toRadians(end.latitude);
  const lon1 = toRadians(normalizeLongitude(start.longitude));
  const lon2 = toRadians(normalizeLongitude(end.longitude));

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const sinLat = Math.sin(deltaLat / 2);
  const sinLon = Math.sin(deltaLon / 2);

  const a = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  const boundedA = Math.max(0, Math.min(1, a));
  const angularDistance = 2 * Math.atan2(Math.sqrt(boundedA), Math.sqrt(1 - boundedA));

  return MARS_MEAN_RADIUS_KM * angularDistance;
}

/**
 * Estimates EVA Marswalk travel duration in hours based on distance and assumed speed.
 */
export function estimateTravelHours(
  distanceKm: number,
  averageSpeedKmh: number = DEFAULT_ASTRONAUT_WALK_SPEED_KMH
): number | null {
  if (
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(averageSpeedKmh) ||
    distanceKm < 0 ||
    averageSpeedKmh <= 0
  ) {
    return null;
  }
  return distanceKm / averageSpeedKmh;
}

/**
 * Interpolates intermediate great-circle waypoints between start and end.
 * Useful for drawing curved arcs on planetary maps over longer distances.
 */
export function interpolateGreatCircleWaypoints(
  start: MarsCoordinate,
  end: MarsCoordinate,
  numSegments: number = 20
): MarsCoordinate[] {
  if (numSegments <= 1) return [start, end];

  const lat1 = toRadians(start.latitude);
  const lon1 = toRadians(normalizeLongitude(start.longitude));
  const lat2 = toRadians(end.latitude);
  const lon2 = toRadians(normalizeLongitude(end.longitude));

  const d = calculateMarsDistanceKm(start, end) / MARS_MEAN_RADIUS_KM; // angular distance in radians

  if (d < 1e-6) {
    return [start, end];
  }

  const waypoints: MarsCoordinate[] = [];

  for (let i = 0; i <= numSegments; i++) {
    const f = i / numSegments;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);

    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    waypoints.push({
      latitude: toDegrees(lat),
      longitude: toDegrees(lon)
    });
  }

  return waypoints;
}
