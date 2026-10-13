import type { MarsCoordinate } from '../types/route';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMarsCoordinate(coord: Partial<MarsCoordinate>): ValidationResult {
  const errors: string[] = [];

  if (coord.latitude === undefined || !Number.isFinite(coord.latitude)) {
    errors.push('Latitude must be a valid number.');
  } else if (coord.latitude < -90 || coord.latitude > 90) {
    errors.push(`Latitude must be between -90° and +90° (received ${coord.latitude}°).`);
  }

  if (coord.longitude === undefined || !Number.isFinite(coord.longitude)) {
    errors.push('Longitude must be a valid number.');
  } else if (coord.longitude < -180 || coord.longitude > 360) {
    errors.push(`Longitude must be between -180° and +360° (received ${coord.longitude}°).`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateSpeed(speedKmh: number): ValidationResult {
  const errors: string[] = [];
  if (!Number.isFinite(speedKmh) || speedKmh <= 0) {
    errors.push('Walking speed must be greater than 0 km/h.');
  } else if (speedKmh > 5.0) {
    errors.push('Suited astronaut walking speed exceeds maximum nominal human EVA envelope (5.0 km/h).');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
