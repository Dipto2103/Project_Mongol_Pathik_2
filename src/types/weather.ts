import { MarsCoordinate } from './route';

export type ProvenanceStatus = 'LIVE' | 'CACHED' | 'HISTORICAL' | 'DEMO' | 'UNAVAILABLE';

export interface MarsWeatherRecord {
  mission: 'Curiosity (MSL)' | 'Perseverance (Mars 2020)' | 'InSight' | 'Viking 1' | 'Viking 2';
  sol: number; // Martian solar day
  terrestrialDate: string; // YYYY-MM-DD
  observationSite: string; // e.g. "Gale Crater"
  coordinates: MarsCoordinate;
  minTempCelsius: number | null;
  maxTempCelsius: number | null;
  avgTempCelsius: number | null;
  pressurePascals: number | null;
  windSpeedMps: number | null;
  windDirectionDegrees: number | null;
  windDirectionCompass?: string;
  seasonLs: number; // Solar Longitude Ls (0-360 deg)
  uvIndex?: string;
  provenance: ProvenanceStatus;
  sourceUrl: string;
  dataAgeDescription: string;
  spatialRelevanceNote: string;
}
