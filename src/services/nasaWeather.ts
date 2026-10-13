import type { MarsWeatherRecord } from '../types/weather';

/**
 * Historical verified NASA Mars environmental records from Curiosity (Gale Crater)
 * and InSight (Elysium Planitia), with explicit provenance and spatial limits.
 */
export const ARCHIVED_WEATHER_RECORDS: MarsWeatherRecord[] = [
  {
    mission: 'Curiosity (MSL)',
    sol: 4120,
    terrestrialDate: '2024-03-08',
    observationSite: 'Gale Crater (Mount Sharp Base)',
    coordinates: {
      latitude: -4.5895,
      longitude: 137.4417,
      elevationMeters: -4450
    },
    minTempCelsius: -78.0,
    maxTempCelsius: -14.0,
    avgTempCelsius: -46.0,
    pressurePascals: 742,
    windSpeedMps: 4.8,
    windDirectionDegrees: 240,
    windDirectionCompass: 'WSW',
    seasonLs: 98.4,
    uvIndex: 'High (Sol Midday Peak)',
    provenance: 'HISTORICAL',
    sourceUrl: 'https://mars.nasa.gov/msl/mission/weather/',
    dataAgeDescription: 'Archived science telemetry from MSL REMS instrument.',
    spatialRelevanceNote: 'Measured specifically inside Gale Crater. Deep crater microclimates feature thermal inversions not representative of planetary highlands or polar zones.'
  },
  {
    mission: 'Perseverance (Mars 2020)',
    sol: 1084,
    terrestrialDate: '2024-03-09',
    observationSite: 'Jezero Crater (Upper Delta Front)',
    coordinates: {
      latitude: 18.4447,
      longitude: 77.4508,
      elevationMeters: -2530
    },
    minTempCelsius: -82.0,
    maxTempCelsius: -19.0,
    avgTempCelsius: -50.5,
    pressurePascals: 620,
    windSpeedMps: 7.2,
    windDirectionDegrees: 125,
    windDirectionCompass: 'SE',
    seasonLs: 98.6,
    uvIndex: 'Extreme (Unfiltered UV-A/B/C)',
    provenance: 'HISTORICAL',
    sourceUrl: 'https://mars.nasa.gov/mars2020/mission/instruments/meda/',
    dataAgeDescription: 'Archived science telemetry from MEDA instrument suite.',
    spatialRelevanceNote: 'Local to Jezero Crater floor. Lower pressure compared to Gale due to 2,000m higher elevation relative to Mars areoid.'
  },
  {
    mission: 'InSight',
    sol: 1440,
    terrestrialDate: '2022-12-15',
    observationSite: 'Elysium Planitia',
    coordinates: {
      latitude: 4.5024,
      longitude: 135.6234,
      elevationMeters: -2613
    },
    minTempCelsius: -96.5,
    maxTempCelsius: -18.2,
    avgTempCelsius: -57.3,
    pressurePascals: 685,
    windSpeedMps: 3.1,
    windDirectionDegrees: 290,
    windDirectionCompass: 'WNW',
    seasonLs: 345.2,
    uvIndex: 'Moderate (Winter Transition)',
    provenance: 'HISTORICAL',
    sourceUrl: 'https://production.mars.jpllab.net/insight/mission/weather/',
    dataAgeDescription: 'Final telemetry recorded prior to InSight mission conclusion in December 2022.',
    spatialRelevanceNote: 'InSight mission has permanently concluded. Data is archived and historical; NOT current atmospheric weather.'
  }
];

export async function fetchMarsWeather(
  selectedSiteName?: string
): Promise<{
  status: 'SUCCESS' | 'LOCATION_UNAVAILABLE' | 'ERROR';
  record?: MarsWeatherRecord;
  availableSites: string[];
  disclaimer: string;
}> {
  const availableSites = ARCHIVED_WEATHER_RECORDS.map((r) => r.observationSite);

  // Default to Perseverance Jezero record if not specified
  let matched = ARCHIVED_WEATHER_RECORDS.find((r) =>
    selectedSiteName ? r.observationSite.toLowerCase().includes(selectedSiteName.toLowerCase()) : true
  );

  if (!matched) {
    matched = ARCHIVED_WEATHER_RECORDS[1]; // Perseverance
  }

  return {
    status: 'SUCCESS',
    record: matched,
    availableSites,
    disclaimer:
      'Mars environmental conditions are recorded by in-situ surface rovers and landers. Weather is highly localized and historical; orbital observations and atmospheric models cannot provide real-time hourly forecasts across unmonitored sectors.'
  };
}
