import type { MarsCoordinate } from '../types/route';

export interface MarsLocationBookmark {
  id: string;
  name: string;
  mission: string;
  landingDate?: string;
  category: 'landing_site' | 'outpost_candidate' | 'geological_feature';
  coordinates: MarsCoordinate;
  elevationMeters: number;
  description: string;
  operationalNotes: string;
}

export const DEMO_LOCATIONS: MarsLocationBookmark[] = [
  {
    id: 'site-octavia-butler',
    name: 'Octavia E. Butler Landing Site',
    mission: 'Mars 2020 / Perseverance Rover',
    landingDate: '2021-02-18',
    category: 'landing_site',
    coordinates: {
      latitude: 18.4447,
      longitude: 77.4508,
      elevationMeters: -2570
    },
    elevationMeters: -2570,
    description: 'Touchdown point of the Perseverance rover on the floor of Jezero Crater, approximately 2 km east of the ancient delta escarpment.',
    operationalNotes: 'Relatively flat basaltic floor with scattered ventifacts. Excellent candidate for an initial habitat landing pad.'
  },
  {
    id: 'site-bradbury-landing',
    name: 'Bradbury Landing Site',
    mission: 'Mars Science Laboratory (MSL) / Curiosity',
    landingDate: '2012-08-06',
    category: 'landing_site',
    coordinates: {
      latitude: -4.5895,
      longitude: 137.4417,
      elevationMeters: -4501
    },
    elevationMeters: -4501,
    description: 'Touchdown location of the Curiosity rover in northern Gale Crater, near the alluvial fan deposits derived from Peace Vallis.',
    operationalNotes: 'Paving stones of conglomerate rock. Good bearing strength for crew rovers.'
  },
  {
    id: 'site-insight-elysium',
    name: 'InSight Touchdown Point',
    mission: 'InSight Lander',
    landingDate: '2018-11-26',
    category: 'landing_site',
    coordinates: {
      latitude: 4.5024,
      longitude: 135.6234,
      elevationMeters: -2613
    },
    elevationMeters: -2613,
    description: 'Ultra-smooth lava plain in Elysium Planitia, chosen specifically for low rock abundance to deploy seismic sensors.',
    operationalNotes: 'Homogeneous sand-gravel regolith with minimal slopes (< 3°). High landing safety margin.'
  },
  {
    id: 'site-viking-1',
    name: 'Viking 1 Landing Site (Thomas Mutch Memorial)',
    mission: 'Viking 1 Lander',
    landingDate: '1976-07-20',
    category: 'landing_site',
    coordinates: {
      latitude: 22.27,
      longitude: -47.95,
      elevationMeters: -2690
    },
    elevationMeters: -2690,
    description: 'First successful soft landing on Mars in western Chryse Planitia, a vast outflow channel plain.',
    operationalNotes: 'High abundance of angular basalt boulders up to 3 meters across. Walking requires caution.'
  },
  {
    id: 'site-neretva-breach',
    name: 'Neretva Vallis Inflow Gorge',
    mission: 'Jezero Geological Survey Candidate',
    category: 'outpost_candidate',
    coordinates: {
      latitude: 18.52,
      longitude: 77.29,
      elevationMeters: -2380
    },
    elevationMeters: -2380,
    description: 'Canyon breach where the ancient Neretva Vallis breached the western crater rim of Jezero to deposit the fan.',
    operationalNotes: 'Protected canyon walls provide shielding from galactic cosmic rays (GCRs) and micro-meteorites.'
  },
  {
    id: 'site-carl-sagan-station',
    name: 'Carl Sagan Memorial Station (Mars Pathfinder)',
    mission: 'Mars Pathfinder / Sojourner',
    landingDate: '1997-07-04',
    category: 'landing_site',
    coordinates: {
      latitude: 19.13,
      longitude: -33.22,
      elevationMeters: -3650
    },
    elevationMeters: -3650,
    description: 'Ares Vallis flood plain filled with rounded cobblestones deposited by catastrophic ancient mega-floods.',
    operationalNotes: 'Cobblestone regolith suitable for tracked mobility, difficult for wheeled carts.'
  }
];
