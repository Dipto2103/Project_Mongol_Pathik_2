import { describe, it, expect } from 'vitest';
import {
  calculateMarsDistanceKm,
  estimateTravelHours,
  normalizeLongitude,
  isValidMarsCoordinate,
  MARS_MEAN_RADIUS_KM
} from '../src/algorithms/distance';

describe('Mars Distance Algorithms', () => {
  it('correctly calculates distance for identical coordinates as 0 km', () => {
    const loc = { latitude: 18.4447, longitude: 77.4508 };
    const dist = calculateMarsDistanceKm(loc, loc);
    expect(dist).toBeCloseTo(0, 5);
  });

  it('calculates great-circle distance on Mars with R = 3389.5 km', () => {
    // 1 degree of latitude on Mars = (2 * pi * 3389.5) / 360 = 59.159 km
    const p1 = { latitude: 0, longitude: 0 };
    const p2 = { latitude: 1, longitude: 0 };
    const dist = calculateMarsDistanceKm(p1, p2);
    const expected = (Math.PI * MARS_MEAN_RADIUS_KM) / 180;
    expect(dist).toBeCloseTo(expected, 2);
  });

  it('handles longitude wrapping (e.g. 179° and -179°)', () => {
    const p1 = { latitude: 0, longitude: 179 };
    const p2 = { latitude: 0, longitude: -179 };
    const dist = calculateMarsDistanceKm(p1, p2);
    // 2 degrees longitude separation at the equator
    const expected = ((2 * Math.PI * MARS_MEAN_RADIUS_KM) / 360) * 2;
    expect(dist).toBeCloseTo(expected, 1);
  });

  it('normalizes longitude correctly', () => {
    expect(normalizeLongitude(0)).toBe(0);
    expect(normalizeLongitude(180)).toBe(180);
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-190)).toBe(170);
    expect(normalizeLongitude(360)).toBe(0);
  });

  it('validates Martian coordinate boundaries', () => {
    expect(isValidMarsCoordinate({ latitude: 18.5, longitude: 77.4 })).toBe(true);
    expect(isValidMarsCoordinate({ latitude: 91, longitude: 0 })).toBe(false);
    expect(isValidMarsCoordinate({ latitude: -95, longitude: 0 })).toBe(false);
    expect(isValidMarsCoordinate(null)).toBe(false);
  });

  it('calculates travel duration with configurable astronaut walking speeds', () => {
    // 4 km at 0.5 km/h = 8 hours
    const hours = estimateTravelHours(4.0, 0.5);
    expect(hours).toBeCloseTo(8.0, 2);

    // 4 km at 1.0 km/h = 4 hours
    const fastHours = estimateTravelHours(4.0, 1.0);
    expect(fastHours).toBeCloseTo(4.0, 2);

    // Negative or 0 speed returns null
    expect(estimateTravelHours(4.0, 0)).toBeNull();
    expect(estimateTravelHours(4.0, -1)).toBeNull();
  });
});
