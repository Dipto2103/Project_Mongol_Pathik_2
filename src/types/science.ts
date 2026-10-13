import { MarsCoordinate } from './route';

export type ScienceCategory =
  | 'crater'
  | 'ancient_delta'
  | 'volcano'
  | 'chasma'
  | 'rover_site'
  | 'mineral_deposit'
  | 'ice_deposit';

export interface ScienceObservation {
  id: string;
  name: string;
  category: ScienceCategory;
  description: string;
  scientificRelevance: string;
  coordinates: MarsCoordinate;
  elevationMeters: number;
  mission: string;
  instrument?: string;
  sourceUrl: string;
  datasetId?: string;
  observationDate?: string;
  pdsRecordId?: string;
  limitations: string[];
  imageUrl?: string;
  keyMineralsOrFeatures?: string[];
}
