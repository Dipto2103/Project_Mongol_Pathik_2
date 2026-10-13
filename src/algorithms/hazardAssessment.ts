import type { PlannedRoute } from '../types/route';
import type { HazardRecord } from '../types/hazards';
import { calculateMarsDistanceKm } from './distance';

export interface MissionRecommendation {
  id: string;
  title: string;
  category: 'terrain' | 'environment' | 'science' | 'data_quality';
  explanation: string;
  supportingSources: string[];
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  action: string;
}

export interface RouteHazardAssessment {
  routeId: string;
  overallRiskLevel: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'UNASSESSED';
  detectedHazards: {
    hazard: HazardRecord;
    closestDistanceKm: number;
  }[];
  recommendations: MissionRecommendation[];
  dataConfidenceNotes: string[];
}

/**
 * Evaluates environmental and terrain hazards in proximity to a planned Martian route.
 */
export function assessRouteHazards(
  route: PlannedRoute,
  catalogHazards: HazardRecord[],
  proximityThresholdKm: number = 2.0
): RouteHazardAssessment {
  const detected: { hazard: HazardRecord; closestDistanceKm: number }[] = [];
  const recommendations: MissionRecommendation[] = [];
  const dataConfidenceNotes: string[] = [];

  // Check proximity of each waypoint to known hazard zones
  for (const hazard of catalogHazards) {
    let minDistance = Infinity;

    for (const pt of route.waypoints) {
      const d = calculateMarsDistanceKm(pt, hazard.location);
      if (d < minDistance) {
        minDistance = d;
      }
    }

    const hazardRadius = hazard.radiusKm ?? 1.0;
    const effectiveThreshold = hazardRadius + proximityThresholdKm;

    if (minDistance <= effectiveThreshold) {
      detected.push({
        hazard,
        closestDistanceKm: parseFloat(minDistance.toFixed(2))
      });
    }
  }

  // 1. Terrain slope assessment
  if (route.terrainAssessmentAvailable && route.maxSlopeDeg !== undefined) {
    if (route.maxSlopeDeg > 18.0) {
      recommendations.push({
        id: 'rec-slope-high',
        title: `Steep Slope Exceedance Detected (${route.maxSlopeDeg.toFixed(1)}°)`,
        category: 'terrain',
        explanation: `Route traverses terrain segments where the elevation gradient exceeds typical planetary rover and EVA suit stability thresholds (18°). Risk of traction loss and regolith slippage.`,
        supportingSources: ['MRO HiRISE / CTX Digital Terrain Model', 'NASA HIDH Martian Surface Mobility Standards'],
        confidence: 'high',
        action: 'Inspect slope contours along the highlighted route segment or activate terrain-aware detours.'
      });
    } else if (route.maxSlopeDeg > 12.0) {
      recommendations.push({
        id: 'rec-slope-moderate',
        title: `Moderate Elevation Gradient (${route.maxSlopeDeg.toFixed(1)}°)`,
        category: 'terrain',
        explanation: `Sustained moderate slopes will increase metabolic work rates and oxygen consumption for suited crew members.`,
        supportingSources: ['MRO CTX Regional Topography', 'Mars Global Surveyor MOLA'],
        confidence: 'medium',
        action: 'Schedule tactical rest intervals every 45 minutes of uphill traverse.'
      });
    }
  } else if (!route.terrainAssessmentAvailable) {
    recommendations.push({
      id: 'rec-terrain-unassessed',
      title: 'Unverified Terrain Traversability',
      category: 'data_quality',
      explanation: 'Route was calculated using direct great-circle geometry. Numerical elevation, slope steepness, and boulder fields are currently unverified along this path.',
      supportingSources: ['USGS Planetary GIS', 'NASA Mars Trek Catalog'],
      confidence: 'unknown',
      action: 'Do NOT rely on this trajectory as an astronaut-safe route. Switch to a region with verified DTM elevation coverage.'
    });
  }

  // 2. Specific hazard proximity recommendations
  for (const item of detected) {
    const h = item.hazard;
    if (h.category === 'steep_terrain') {
      recommendations.push({
        id: `rec-hazard-${h.id}`,
        title: `Proximity to ${h.name} (${item.closestDistanceKm} km)`,
        category: 'terrain',
        explanation: `${h.description}. Minimum distance to escarpment/rim is ${item.closestDistanceKm} km.`,
        supportingSources: [h.datasetName, h.sourceUrl],
        confidence: h.confidence,
        action: h.operationalRecommendation
      });
    } else if (h.category === 'dust' || h.category === 'surface_roughness') {
      recommendations.push({
        id: `rec-hazard-${h.id}`,
        title: `Terrain Surface Warning: ${h.name}`,
        category: 'terrain',
        explanation: `${h.description}. Surface roughness can conceal crevices and cause wheel/boot entrapment.`,
        supportingSources: [h.datasetName, h.sourceUrl],
        confidence: h.confidence,
        action: h.operationalRecommendation
      });
    }
  }

  // 3. Travel time and life-support margin recommendations
  if (route.estimatedDurationHours && route.estimatedDurationHours > 6.0) {
    recommendations.push({
      id: 'rec-eva-duration',
      title: 'Extended Spacewalk Duration Warning',
      category: 'environment',
      explanation: `Estimated route travel duration (${route.estimatedDurationHours.toFixed(1)} hrs) approaches or exceeds the nominal 8-hour maximum life-support consumable limit for NASA Extravehicular Mobility Units (EMU/xEMU).`,
      supportingSources: ['NASA EVA Exploration Operations Concept', 'Apollo Surface Operations Post-Mission Reports'],
      confidence: 'high',
      action: 'Establish intermediate pressurized habitat shelter points or employ a pressurized rover escort.'
    });
  }

  // 4. Data gaps and limitations
  dataConfidenceNotes.push(
    'Orbital datasets cannot resolve hazards smaller than 25-50 cm (e.g. sharp shatter-cones, perched boulders, or micro-crater lips).'
  );
  dataConfidenceNotes.push(
    'Atmospheric pressure and ambient temperatures fluctuate substantially between diurnal and seasonal sol cycles.'
  );

  // Overall Risk Level calculation
  let overallRisk: RouteHazardAssessment['overallRiskLevel'] = 'LOW';
  if (!route.terrainAssessmentAvailable) {
    overallRisk = 'UNASSESSED';
  } else if (
    (route.maxSlopeDeg && route.maxSlopeDeg > 22) ||
    detected.some((d) => d.hazard.severity === 'critical')
  ) {
    overallRisk = 'CRITICAL';
  } else if (
    (route.maxSlopeDeg && route.maxSlopeDeg > 16) ||
    detected.some((d) => d.hazard.severity === 'high')
  ) {
    overallRisk = 'HIGH';
  } else if (
    (route.maxSlopeDeg && route.maxSlopeDeg > 10) ||
    detected.some((d) => d.hazard.severity === 'moderate')
  ) {
    overallRisk = 'ELEVATED';
  }

  return {
    routeId: route.id,
    overallRiskLevel: overallRisk,
    detectedHazards: detected,
    recommendations,
    dataConfidenceNotes
  };
}
