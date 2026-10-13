export interface DataSourceMetadata {
  id: string;
  name: string;
  provider: string;
  sourceUrl: string;
  datasetType: 'WMTS Tile Service' | 'WMS Service' | 'PDS Archive' | 'Instrument Telemetry' | 'Topographic Model';
  units?: string;
  coordinateReferenceSystem: string;
  spatialResolution: string;
  temporalCoverage?: string;
  attribution: string;
  knownLimitations: string[];
}

export const NASA_DATA_SOURCES: Record<string, DataSourceMetadata> = {
  viking_mosaic: {
    id: 'viking_mosaic',
    name: 'Mars Viking MDIM2.1 Color Mosaic Global 232m',
    provider: 'NASA Solar System Treks / USGS Astrogeology',
    sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/',
    datasetType: 'WMTS Tile Service',
    coordinateReferenceSystem: 'IAU2000:Mars (Equirectangular / Web Mercator tile schema)',
    spatialResolution: '232 meters/pixel',
    temporalCoverage: '1976 - 1980 (Viking Orbiter 1 & 2)',
    attribution: 'NASA / JPL-Caltech / USGS Astrogeology Science Center',
    knownLimitations: [
      'Variable illumination angles across different orbit swaths.',
      'Atmospheric hazes in certain quadrangle regions.',
      'Coarse spatial resolution unsuitable for meter-scale obstacle detection.'
    ]
  },
  mola_shaded_relief: {
    id: 'mola_shaded_relief',
    name: 'MGS MOLA Shaded Relief Merge Global 463m',
    provider: 'NASA Mars Trek / Goddard Space Flight Center',
    sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/',
    datasetType: 'WMTS Tile Service',
    coordinateReferenceSystem: 'IAU2000:Mars',
    spatialResolution: '463 meters/pixel (~128 pixels/degree)',
    temporalCoverage: '1997 - 2001 (Mars Global Surveyor)',
    attribution: 'NASA / GSFC / MOLA Science Team',
    knownLimitations: [
      'Topographic shaded relief illustrates macro-scale morphology; not a direct quantitative slope raster.',
      'Interpolated between laser altimeter ground tracks; interpolation artifacts present in high latitudes.'
    ]
  },
  mola_mep_topography: {
    id: 'mola_mep_topography',
    name: 'Mars MOLA Global Topography (Planetary DEM)',
    provider: 'NASA Planetary Data System (PDS) Geosciences Node',
    sourceUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg016/',
    datasetType: 'Topographic Model',
    units: 'Meters relative to Mars areoid (datum at 6.1 mbar)',
    coordinateReferenceSystem: 'Areocentric Longitude (East positive, 0-360°)',
    spatialResolution: '1/128 degree (~463 meters at equator)',
    attribution: 'NASA / PDS Geosciences / Washington University in St. Louis',
    knownLimitations: [
      'Vertical accuracy +/- 1 meter over regional baselines, but shot spacing leaves unmeasured inter-track gaps.',
      'Cannot resolve human-scale terrain hazards.'
    ]
  },
  curiosity_rems: {
    id: 'curiosity_rems',
    name: 'Rover Environmental Monitoring Station (REMS)',
    provider: 'NASA / JPL-Caltech / Centro de Astrobiología (CAB)',
    sourceUrl: 'https://mars.nasa.gov/msl/mission/weather/',
    datasetType: 'Instrument Telemetry',
    units: 'Celsius (°C), Pascals (Pa), m/s, Solar Longitude Ls',
    coordinateReferenceSystem: 'Mars Gale Crater (4.5895°S, 137.4417°E)',
    spatialResolution: 'In-situ point measurement (Gale Crater floor)',
    temporalCoverage: 'August 2012 - Active Mission Operations',
    attribution: 'NASA / JPL-Caltech / CAB / CSIC-INTA',
    knownLimitations: [
      'Measurements are strictly localized to Gale Crater; microclimate within the crater does not reflect global planetary conditions.',
      'Wind sensors have experienced partial degradation over multi-year operations.'
    ]
  },
  insight_twins: {
    id: 'insight_twins',
    name: 'InSight Auxiliary Payload Sensor Suite (APSS / TWINS)',
    provider: 'NASA InSight Mission / JPL-Caltech / CAB',
    sourceUrl: 'https://production.mars.jpllab.net/insight/mission/weather/',
    datasetType: 'PDS Archive',
    units: 'Celsius (°C), Pascals (Pa), m/s',
    coordinateReferenceSystem: 'Elysium Planitia (4.502°N, 135.623°E)',
    spatialResolution: 'In-situ point measurement (Elysium Planitia)',
    temporalCoverage: 'November 2018 - December 2022 (Mission Concluded)',
    attribution: 'NASA / JPL-Caltech / CNES / DLR',
    knownLimitations: [
      'InSight mission concluded in December 2022 due to dust accumulation on solar arrays.',
      'Historical archive data only; must not be portrayed as real-time ambient conditions.'
    ]
  },
  perseverance_meda: {
    id: 'perseverance_meda',
    name: 'Mars Environmental Dynamics Analyzer (MEDA)',
    provider: 'NASA Mars 2020 Mission / CAB (CSIC-INTA)',
    sourceUrl: 'https://mars.nasa.gov/mars2020/mission/instruments/meda/',
    datasetType: 'Instrument Telemetry',
    units: 'Celsius (°C), Pascals (Pa), m/s, Optical Depth (tau)',
    coordinateReferenceSystem: 'Jezero Crater (18.38°N, 77.58°E)',
    spatialResolution: 'In-situ point measurement (Jezero Crater)',
    temporalCoverage: 'February 2021 - Active Mission Operations',
    attribution: 'NASA / JPL-Caltech / Centro de Astrobiología',
    knownLimitations: [
      'Localized to Jezero Crater floor and delta fan.',
      'Thermal inertia and convective dust plumes produce localized deviations.'
    ]
  },
  hirise_dtm: {
    id: 'hirise_dtm',
    name: 'High Resolution Imaging Science Experiment (HiRISE) Stereo DTM',
    provider: 'University of Arizona / NASA JPL / PDS Cartography',
    sourceUrl: 'https://www.uahirise.org/dtm/',
    datasetType: 'Topographic Model',
    units: 'Meters elevation, derived slope in degrees',
    coordinateReferenceSystem: 'Equirectangular / Mars 2000 Sphere',
    spatialResolution: '1.0 meter/pixel spatial resolution, 0.2m vertical precision',
    temporalCoverage: '2006 - Present',
    attribution: 'NASA / JPL / University of Arizona',
    knownLimitations: [
      'Sparse targeted spatial coverage (less than 3% of Martian surface).',
      'Stereo correlation errors in uniform sandy or shadowed terrains.'
    ]
  }
};
