import { MarsCoordinate } from './route';

export type HazardCategory =
  | 'steep_terrain'
  | 'surface_roughness'
  | 'dust'
  | 'environmental'
  | 'unknown_terrain';

export type HazardSeverity = 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface HazardRecord {
  id: string;
  category: HazardCategory;
  name: string;
  location: MarsCoordinate;
  radiusKm?: number; // approximate affected footprint
  boundaryPolygon?: MarsCoordinate[]; // optional polygon boundary
  severity: HazardSeverity;
  slopeAngleDeg?: number;
  roughnessIndex?: number; // 0 to 1 scale
  description: string;
  operationalRecommendation: string;
  sourceUrl: string;
  datasetName: string;
  observedAt?: string;
  confidence: ConfidenceLevel;
  limitations: string[];
}
