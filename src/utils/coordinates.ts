import type { MarsCoordinate } from '../types/route';

/**
 * Formats a coordinate into clean planetary string (e.g. "18.4447°N, 77.4508°E").
 */
export function formatMarsCoordinate(coord: MarsCoordinate, decimals: number = 4): string {
  const latStr = `${Math.abs(coord.latitude).toFixed(decimals)}°${coord.latitude >= 0 ? 'N' : 'S'}`;
  const lonNorm = ((coord.longitude + 180) % 360) - 180;
  const lonStr = `${Math.abs(lonNorm).toFixed(decimals)}°${lonNorm >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

/**
 * Returns Areocentric East-Positive longitude (0° to 360°E) commonly used in NASA PDS archives.
 */
export function toEastPositiveLongitude(lon: number): number {
  let east = lon % 360;
  if (east < 0) east += 360;
  return parseFloat(east.toFixed(4));
}

/**
 * Parses user coordinate text input into a MarsCoordinate.
 * Supports "18.4447, 77.4508" or "18.44N, 77.45E".
 */
export function parseCoordinateInput(input: string): MarsCoordinate | null {
  if (!input || typeof input !== 'string') return null;

  const clean = input.trim();
  const parts = clean.split(/[,;\s]+/).filter(Boolean);

  if (parts.length !== 2) return null;

  const parsePart = (val: string, posChar: string, negChar: string): number | null => {
    val = val.toUpperCase().trim();
    let mult = 1;
    if (val.endsWith(negChar) || val.startsWith(negChar)) {
      mult = -1;
      val = val.replace(negChar, '');
    } else if (val.endsWith(posChar) || val.startsWith(posChar)) {
      mult = 1;
      val = val.replace(posChar, '');
    }
    const num = parseFloat(val);
    return Number.isFinite(num) ? num * mult : null;
  };

  const lat = parsePart(parts[0], 'N', 'S');
  const lon = parsePart(parts[1], 'E', 'W');

  if (lat === null || lon === null) return null;
  if (lat < -90 || lat > 90) return null;

  return {
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lon.toFixed(6))
  };
}
