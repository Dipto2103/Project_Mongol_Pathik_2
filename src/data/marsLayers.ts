import type { MarsMapLayer } from '../types/map';

export const MARS_LAYERS: MarsMapLayer[] = [
  {
    id: 'opm-mars-basemap',
    name: 'OpenPlanetary Mars Global Basemap',
    category: 'base',
    provider: 'OpenPlanetary',
    url: 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-1/all/{z}/{x}/{y}.png',
    maxZoom: 8,
    minZoom: 1,
    attribution: 'CartoDB / OpenPlanetary / USGS Astrogeology / NASA Viking MDIM 2.1',
    description: 'Blended global planetary basemap utilizing USGS Viking Orbiter MDIM 2.1 color mosaic, optimized for web cartography.',
    spatialResolution: '~232 meters/pixel at equator',
    projection: 'Web Mercator EPSG:3857 (Planetary adaptation)',
    active: true,
    opacity: 1.0,
    status: 'OPERATIONAL',
    limitations: [
      'Adapted to standard web map tile projection; high polar distortions beyond +/- 70 degrees.',
      'Global resolution adequate for macro features, insufficient for sub-100m rover/astronaut obstacle avoidance.'
    ]
  },
  {
    id: 'nasa-trek-viking',
    name: 'NASA Mars Trek — Viking MDIM2.1 Color',
    category: 'base',
    provider: 'NASA Mars Trek',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    maxZoom: 7,
    minZoom: 0,
    attribution: 'NASA / JPL-Caltech / USGS Astrogeology Science Center',
    description: 'Official NASA Mars Trek tile service for Viking Orbiter MDIM2.1 color mosaic.',
    spatialResolution: '232 meters/pixel',
    projection: 'Equirectangular / Mars Trek standard WMTS',
    active: false,
    opacity: 1.0,
    status: 'OPERATIONAL',
    limitations: [
      'Requires compatible tile indexing.',
      'Lighting seamlines noticeable across adjacent Viking orbit stripes.'
    ]
  },
  {
    id: 'nasa-trek-mola-shade',
    name: 'NASA Mars Trek — MOLA Shaded Relief',
    category: 'terrain',
    provider: 'NASA Mars Trek',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    maxZoom: 7,
    minZoom: 0,
    attribution: 'NASA / GSFC / MGS MOLA Science Team',
    description: 'Topographic shaded relief overlay generated from Mars Global Surveyor MOLA laser altimetry.',
    spatialResolution: '463 meters/pixel (~128 pixels/degree)',
    projection: 'Equirectangular / Mars Trek WMTS',
    active: true,
    opacity: 0.75,
    status: 'OPERATIONAL',
    limitations: [
      'Shading highlights large crater rims and canyons, but does not represent quantitative slope values directly in RGB.',
      'Interpolation between orbital ground tracks may soften sharp terrain breaks.'
    ]
  },
  {
    id: 'nasa-hirise-highres-regional',
    name: 'MRO HiRISE Regional Detailed Imagery (Jezero/Gale)',
    category: 'imagery',
    provider: 'NASA Mars Trek',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_HiRISE_JezeroDelta_composite/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    maxZoom: 14,
    minZoom: 8,
    attribution: 'NASA / JPL-Caltech / University of Arizona',
    description: 'Sub-meter targeted imagery covering Jezero Crater fan delta and Gale Crater rover traverses.',
    spatialResolution: '0.25 to 0.50 meters/pixel',
    projection: 'High-resolution regional projection',
    active: false,
    opacity: 0.9,
    status: 'EXPERIMENTAL',
    limitations: [
      'Coverage is strictly regional and sparse; unavailable outside specific scientific landing sites.',
      'Interface switches to global base when zooming out.'
    ]
  }
];
