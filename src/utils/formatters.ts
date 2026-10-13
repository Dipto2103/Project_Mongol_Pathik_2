/**
 * Formats distance with appropriate units (m or km).
 */
export function formatDistance(km: number): string {
  if (!Number.isFinite(km)) return 'N/A';
  if (km < 1.0) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(2)} km`;
}

/**
 * Formats duration in hours and minutes (e.g. "4h 25m" or "45m").
 */
export function formatDuration(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return 'Unavailable';
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

/**
 * Formats elevation relative to Mars datum (datum is 6.1 mbar pressure surface).
 */
export function formatElevation(meters: number | undefined): string {
  if (meters === undefined || !Number.isFinite(meters)) return 'Unmeasured';
  return `${meters > 0 ? '+' : ''}${meters.toLocaleString()} m`;
}

/**
 * Formats slope angle in degrees.
 */
export function formatSlope(deg: number | undefined): string {
  if (deg === undefined || !Number.isFinite(deg)) return 'Unknown';
  return `${deg.toFixed(1)}°`;
}
