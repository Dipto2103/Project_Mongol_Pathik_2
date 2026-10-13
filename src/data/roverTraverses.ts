import type { MarsCoordinate } from '../types/route';
import { calculateMarsDistanceKm } from '../algorithms/distance';

export interface RoverDriveEndpoint {
  sol: number;
  site: string;
  coordinate: MarsCoordinate;
  elevationMeters: number;
  notes: string;
}

export interface HistoricalRoverTraverse {
  id: string;
  roverName: string;
  mission: string;
  landingSiteName: string;
  totalDistanceKm: number;
  solRange: string;
  pdsSourceUrl: string;
  datasetName: string;
  waypoints: MarsCoordinate[];
  endpoints: RoverDriveEndpoint[];
  scientificCaveat: string;
}

export const CURIOSITY_TRAVERSE: HistoricalRoverTraverse = {
  id: 'curiosity-historical',
  roverName: 'Curiosity (MSL)',
  mission: 'Mars Science Laboratory',
  landingSiteName: 'Bradbury Landing (Gale Crater)',
  totalDistanceKm: 32.84,
  solRange: 'Sol 0 to Sol 4120+',
  pdsSourceUrl: 'https://pds.nasa.gov/ds-view/pds/viewProfile.jsp?dsid=MSL-M-ROVER-6-RDR-PLACES-V1.0',
  datasetName: 'NASA Planetary Data System (PDS) PLACES Archive (MSL-M-ROVER-6-RDR-PLACES-V1.0)',
  scientificCaveat: 'Traverse reflects robotic rover scientific sampling objectives; does not certify human astronaut traversability.',
  waypoints: [
    { latitude: -4.5895, longitude: 137.4417, elevationMeters: -4501 },
    { latitude: -4.5932, longitude: 137.4580, elevationMeters: -4512 },
    { latitude: -4.5901, longitude: 137.4725, elevationMeters: -4520 },
    { latitude: -4.5920, longitude: 137.4680, elevationMeters: -4516 },
    { latitude: -4.6110, longitude: 137.4490, elevationMeters: -4508 },
    { latitude: -4.6285, longitude: 137.4245, elevationMeters: -4495 },
    { latitude: -4.6390, longitude: 137.4120, elevationMeters: -4488 },
    { latitude: -4.6720, longitude: 137.3820, elevationMeters: -4462 },
    { latitude: -4.6850, longitude: 137.3750, elevationMeters: -4445 },
    { latitude: -4.7150, longitude: 137.3680, elevationMeters: -4410 },
    { latitude: -4.7410, longitude: 137.3620, elevationMeters: -4360 },
    { latitude: -4.7520, longitude: 137.3700, elevationMeters: -4295 },
    { latitude: -4.7610, longitude: 137.3780, elevationMeters: -4250 },
    { latitude: -4.7820, longitude: 137.3950, elevationMeters: -4205 },
    { latitude: -4.8150, longitude: 137.3810, elevationMeters: -4130 },
    { latitude: -4.8450, longitude: 137.3720, elevationMeters: -4020 },
    { latitude: -4.8620, longitude: 137.3660, elevationMeters: -3950 },
    { latitude: -4.8820, longitude: 137.3610, elevationMeters: -3890 }
  ],
  endpoints: [
    { sol: 0, site: 'Bradbury Landing', coordinate: { latitude: -4.5895, longitude: 137.4417 }, elevationMeters: -4501, notes: 'Touchdown site in northern Gale Crater' },
    { sol: 60, site: 'Rocknest', coordinate: { latitude: -4.5932, longitude: 137.4580 }, elevationMeters: -4512, notes: 'First windblown sand scoop for CheMin/SAM' },
    { sol: 125, site: 'Yellowknife Bay (John Klein)', coordinate: { latitude: -4.5901, longitude: 137.4725 }, elevationMeters: -4520, notes: 'Mudstone drill site; confirmed ancient habitable lake' },
    { sol: 270, site: 'Point Lake', coordinate: { latitude: -4.5920, longitude: 137.4680 }, elevationMeters: -4516, notes: 'Cross-bedded sandstone units' },
    { sol: 395, site: 'Darwin Outcrop', coordinate: { latitude: -4.6110, longitude: 137.4490 }, elevationMeters: -4508, notes: 'Conglomerate gravel pavement' },
    { sol: 540, site: 'Dingo Gap', coordinate: { latitude: -4.6285, longitude: 137.4245 }, elevationMeters: -4495, notes: 'Sand dune ridge crossing' },
    { sol: 630, site: 'The Kimberley', coordinate: { latitude: -4.6390, longitude: 137.4120 }, elevationMeters: -4488, notes: 'Major sandstone buttress intersection' },
    { sol: 750, site: 'Pahrump Hills', coordinate: { latitude: -4.6720, longitude: 137.3820 }, elevationMeters: -4462, notes: 'Basal boundary layer of Mount Sharp' },
    { sol: 940, site: 'Garden City', coordinate: { latitude: -4.6850, longitude: 137.3750 }, elevationMeters: -4445, notes: 'Dense mineral vein network' },
    { sol: 1180, site: 'Bagnold Dunes North', coordinate: { latitude: -4.7150, longitude: 137.3680 }, elevationMeters: -4410, notes: 'Active dark barchan dune studies' },
    { sol: 1310, site: 'Naukluft Plateau', coordinate: { latitude: -4.7410, longitude: 137.3620 }, elevationMeters: -4360, notes: 'Rugged bedrock fractured terrain' },
    { sol: 1550, site: 'Murray Buttes', coordinate: { latitude: -4.7520, longitude: 137.3700 }, elevationMeters: -4295, notes: 'Eroded sandstone mesas and towers' },
    { sol: 1810, site: 'Vera Rubin Ridge (Hematite)', coordinate: { latitude: -4.7610, longitude: 137.3780 }, elevationMeters: -4250, notes: 'Prominent crystalline hematite ridge' },
    { sol: 2300, site: 'Glen Torridon (Clay Unit)', coordinate: { latitude: -4.7820, longitude: 137.3950 }, elevationMeters: -4205, notes: 'Clay-bearing sedimentary trough' },
    { sol: 2720, site: 'Greenheugh Pediment Base', coordinate: { latitude: -4.8150, longitude: 137.3810 }, elevationMeters: -4130, notes: 'Steep slope ascent onto pediment cap' },
    { sol: 3250, site: 'Mount Sharp Sulfate Unit', coordinate: { latitude: -4.8450, longitude: 137.3720 }, elevationMeters: -4020, notes: 'Transition from clay to magnesium sulfate' },
    { sol: 3650, site: 'Marker Band Valley', coordinate: { latitude: -4.8620, longitude: 137.3660 }, elevationMeters: -3950, notes: 'Rippled rock textures formed by ancient waves' },
    { sol: 4120, site: 'Gediz Vallis Ridge', coordinate: { latitude: -4.8820, longitude: 137.3610 }, elevationMeters: -3890, notes: 'Debris flow channel recording late-stage water surges' }
  ]
};

export const PERSEVERANCE_TRAVERSE: HistoricalRoverTraverse = {
  id: 'perseverance-historical',
  roverName: 'Perseverance (Mars 2020)',
  mission: 'Mars 2020',
  landingSiteName: 'Octavia E. Butler Landing (Jezero Crater)',
  totalDistanceKm: 27.65,
  solRange: 'Sol 0 to Sol 1050+',
  pdsSourceUrl: 'https://mars.nasa.gov/mars2020/mission/science/traverse-map/',
  datasetName: 'NASA Mars 2020 Traverse Localization Catalog',
  scientificCaveat: 'Traverse follows rover mobility paths across delta front; does not guarantee unassisted suited astronaut safety.',
  waypoints: [
    { latitude: 18.4447, longitude: 77.4508, elevationMeters: -2570 },
    { latitude: 18.4380, longitude: 77.4410, elevationMeters: -2565 },
    { latitude: 18.4310, longitude: 77.4350, elevationMeters: -2560 },
    { latitude: 18.4375, longitude: 77.4210, elevationMeters: -2535 },
    { latitude: 18.4290, longitude: 77.4130, elevationMeters: -2510 },
    { latitude: 18.4260, longitude: 77.4080, elevationMeters: -2485 },
    { latitude: 18.4390, longitude: 77.3870, elevationMeters: -2460 },
    { latitude: 18.4520, longitude: 77.3650, elevationMeters: -2435 },
    { latitude: 18.4810, longitude: 77.3320, elevationMeters: -2390 }
  ],
  endpoints: [
    { sol: 0, site: 'Octavia E. Butler Landing', coordinate: { latitude: 18.4447, longitude: 77.4508 }, elevationMeters: -2570, notes: 'Touchdown site on Jezero Crater floor' },
    { sol: 120, site: 'Séítah Scarp Overlook', coordinate: { latitude: 18.4380, longitude: 77.4410 }, elevationMeters: -2565, notes: 'Survey of active ripple terrain' },
    { sol: 210, site: 'South Séítah (Brac)', coordinate: { latitude: 18.4310, longitude: 77.4350 }, elevationMeters: -2560, notes: 'Igneous olivine-cumulate bedrock coring' },
    { sol: 380, site: 'Hawksbill Gap', coordinate: { latitude: 18.4375, longitude: 77.4210 }, elevationMeters: -2535, notes: 'Delta front entrance corridor' },
    { sol: 470, site: 'Cape Nukshak Base', coordinate: { latitude: 18.4290, longitude: 77.4130 }, elevationMeters: -2510, notes: 'Ascending delta front talus ramp' },
    { sol: 580, site: 'Wildcat Ridge', coordinate: { latitude: 18.4260, longitude: 77.4080 }, elevationMeters: -2485, notes: 'Sulfate-rich mudstones containing organic molecules' },
    { sol: 720, site: 'Tenby Delta Top', coordinate: { latitude: 18.4390, longitude: 77.3870 }, elevationMeters: -2460, notes: 'Curvilinear topset river channel beds' },
    { sol: 890, site: 'Mandu Wall', coordinate: { latitude: 18.4520, longitude: 77.3650 }, elevationMeters: -2435, notes: 'Upper fan mega-conglomerates' },
    { sol: 1050, site: 'Neretva Vallis Inflow Channel', coordinate: { latitude: 18.4810, longitude: 77.3320 }, elevationMeters: -2390, notes: 'Gorge where river breached western crater rim' }
  ]
};

export const ALL_ROVER_TRAVERSES: HistoricalRoverTraverse[] = [
  CURIOSITY_TRAVERSE,
  PERSEVERANCE_TRAVERSE
];

/**
 * Calculates the minimum distance from a candidate route to a historical rover traverse.
 */
export function calculateDistanceToRoverTraverse(
  routeWaypoints: MarsCoordinate[],
  traverse: HistoricalRoverTraverse
): {
  minDistanceKm: number;
  closestRoverSol: number;
  closestRoverSite: string;
  closestRouteCoordinate: MarsCoordinate;
} {
  let minD = Infinity;
  let closestSol = traverse.endpoints[0].sol;
  let closestSite = traverse.endpoints[0].site;
  let closestRouteCoord = routeWaypoints[0];

  for (const pt of routeWaypoints) {
    for (const ep of traverse.endpoints) {
      const d = calculateMarsDistanceKm(pt, ep.coordinate);
      if (d < minD) {
        minD = d;
        closestSol = ep.sol;
        closestSite = ep.site;
        closestRouteCoord = pt;
      }
    }
  }

  return {
    minDistanceKm: parseFloat(minD.toFixed(2)),
    closestRoverSol: closestSol,
    closestRoverSite: closestSite,
    closestRouteCoordinate: closestRouteCoord
  };
}
