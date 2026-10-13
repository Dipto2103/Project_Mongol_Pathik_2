import { MarsCoordinate } from './route';

export type LayerProvider = 'NASA Mars Trek' | 'USGS Astrogeology' | 'OpenPlanetary' | 'ESA / DLR';

export type LayerStatus = 'OPERATIONAL' | 'EXPERIMENTAL' | 'OFFLINE';

export interface MarsMapLayer {
  id: string;
  name: string;
  category: 'base' | 'elevation' | 'terrain' | 'imagery' | 'hazards';
  provider: LayerProvider;
  url: string;
  subdomains?: string[];
  maxZoom: number;
  minZoom: number;
  attribution: string;
  description: string;
  spatialResolution: string;
  projection: string;
  active: boolean;
  opacity: number;
  status: LayerStatus;
  limitations: string[];
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface SelectedLocationInfo {
  name?: string;
  coordinates: MarsCoordinate;
  region?: string;
  elevationMeters?: number;
  estimatedSlopeDeg?: number;
  geologicalContext?: string;
  imageryResolution?: string;
  nearestSciencePoiId?: string;
}
