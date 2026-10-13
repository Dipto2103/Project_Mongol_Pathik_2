import { useState, useCallback, useMemo } from 'react';
import type { MarsCoordinate, PlannedRoute, RouteMethod } from '../types/route';
import { planRouteUnified } from '../services/backendApi';
import { planDirectMarsRoute } from '../algorithms/routeSearch';
import { calculateMarsDistanceKm } from '../algorithms/distance';
import { assessRouteHazards, RouteHazardAssessment } from '../algorithms/hazardAssessment';
import { HAZARDS_CATALOG } from '../data/hazardsCatalog';
import { SCIENCE_CATALOG } from '../data/scienceCatalog';
import {
  CURIOSITY_TRAVERSE,
  PERSEVERANCE_TRAVERSE,
  calculateDistanceToRoverTraverse
} from '../data/roverTraverses';
import type { ScienceObservation } from '../types/science';

export function useRoutePlanner() {
  const [startCoord, setStartCoord] = useState<MarsCoordinate | null>({
    latitude: 18.4447,
    longitude: 77.4508
  }); // Octavia Butler Landing site
  const [destCoord, setDestCoord] = useState<MarsCoordinate | null>({
    latitude: 18.3970,
    longitude: 77.4120
  }); // Kodiak Butte Delta Remnant

  const [method, setMethod] = useState<RouteMethod>('terrain-aware');
  const [walkingSpeedKmh, setWalkingSpeedKmh] = useState<number>(0.5);
  const [maxSlopeDeg, setMaxSlopeDeg] = useState<number>(20.0);

  const [primaryRoute, setPrimaryRoute] = useState<PlannedRoute | null>(null);
  const [alternativeRoute, setAlternativeRoute] = useState<PlannedRoute | null>(null);
  const [planningError, setPlanningError] = useState<string | null>(null);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);

  const generateRoute = useCallback(async () => {
    if (!startCoord || !destCoord) {
      setPlanningError('Please specify both starting location and destination coordinates.');
      return;
    }

    setIsPlanning(true);
    setPlanningError(null);

    try {
      // 1. Calculate primary route
      const mainRoute = await planRouteUnified(
        startCoord,
        destCoord,
        method,
        walkingSpeedKmh,
        maxSlopeDeg
      );

      // 2. Calculate alternative comparison route (Direct vs Terrain-aware)
      let altRoute: PlannedRoute | null = null;
      if (method === 'terrain-aware' || method === 'historical-rover-reference') {
        const directBase = planDirectMarsRoute(startCoord, destCoord, walkingSpeedKmh);
        const refTraverse = startCoord.latitude < 0 ? CURIOSITY_TRAVERSE : PERSEVERANCE_TRAVERSE;
        const prox = calculateDistanceToRoverTraverse(directBase.waypoints, refTraverse);
        altRoute = {
          ...directBase,
          roverProximity: {
            nearestRover: refTraverse.roverName,
            minDistanceKm: prox.minDistanceKm,
            closestSol: prox.closestRoverSol,
            closestSite: prox.closestRoverSite
          }
        };
      } else {
        // Direct mode selected: calculate terrain-aware as alternative
        altRoute = await planRouteUnified(
          startCoord,
          destCoord,
          'terrain-aware',
          walkingSpeedKmh,
          maxSlopeDeg
        );
      }

      setPrimaryRoute(mainRoute);
      setAlternativeRoute(altRoute);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown route calculation error';
      setPlanningError(msg);
    } finally {
      setIsPlanning(false);
    }
  }, [startCoord, destCoord, method, walkingSpeedKmh, maxSlopeDeg]);

  const hazardAssessment = useMemo<RouteHazardAssessment | null>(() => {
    if (!primaryRoute) return null;
    return assessRouteHazards(primaryRoute, HAZARDS_CATALOG);
  }, [primaryRoute]);

  const nearbyScienceTargets = useMemo<ScienceObservation[]>(() => {
    if (!primaryRoute) return [];
    const thresholdKm = 15.0; // 15 km exploration radius
    return SCIENCE_CATALOG.filter((poi) => {
      return primaryRoute.waypoints.some((pt) => {
        const d = calculateMarsDistanceKm(pt, poi.coordinates);
        return d <= thresholdKm;
      });
    });
  }, [primaryRoute]);

  const swapLocations = useCallback(() => {
    setStartCoord(destCoord);
    setDestCoord(startCoord);
    setPrimaryRoute(null);
    setAlternativeRoute(null);
  }, [startCoord, destCoord]);

  const clearRoute = useCallback(() => {
    setPrimaryRoute(null);
    setAlternativeRoute(null);
    setPlanningError(null);
  }, []);

  return {
    startCoord,
    destCoord,
    setStartCoord,
    setDestCoord,
    method,
    setMethod,
    walkingSpeedKmh,
    setWalkingSpeedKmh,
    maxSlopeDeg,
    setMaxSlopeDeg,
    primaryRoute,
    alternativeRoute,
    hazardAssessment,
    nearbyScienceTargets,
    planningError,
    isPlanning,
    generateRoute,
    swapLocations,
    clearRoute
  };
}
