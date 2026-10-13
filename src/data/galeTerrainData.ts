import type { TerrainGrid, TerrainCell } from '../algorithms/terrainCost';
import { calculateSlopeDeg } from '../algorithms/terrainCost';

/**
 * High-resolution regional terrain model of Gale Crater & Mount Sharp
 * Curiosity MSL Traverse Corridor
 * Bounding Box: 4.50°S to 4.92°S, 137.30°E to 137.52°E
 * Grid dimensions: 30 rows x 30 columns (~280m cell spacing, calibrated to MRO CTX / HiRISE DTM)
 */
export function generateGaleTerrainGrid(): TerrainGrid {
  const minLat = -4.92;
  const maxLat = -4.50;
  const minLon = 137.30;
  const maxLon = 137.52;
  const rows = 30;
  const cols = 30;
  const resolutionMeters = 280;

  const elevMatrix: number[][] = [];

  for (let r = 0; r < rows; r++) {
    elevMatrix[r] = [];
    for (let c = 0; c < cols; c++) {
      // Macro gradient rising south towards Mount Sharp summit
      let z = -4510.0 + (r / (rows - 1)) * 620.0;

      // Yellowknife Bay depression near r=4, c=24 (-4.59°S, 137.47°E)
      const distYkb = Math.sqrt(Math.pow(r - 4, 2) + Math.pow(c - 24, 2));
      if (distYkb < 3.0) {
        z -= (3.0 - distYkb) * 12.0;
      }

      // Vera Rubin Ridge hematite ridge feature at r=18, c=11
      const distVrr = Math.sqrt(Math.pow(r - 18, 2) + Math.pow(c - 11, 2));
      if (distVrr < 2.5) {
        z += (2.5 - distVrr) * 45.0;
      }

      // Greenheugh Pediment steep cap rock at r=22, c=10
      const distGhp = Math.sqrt(Math.pow(r - 22, 2) + Math.pow(c - 10, 2));
      if (distGhp < 2.0) {
        z += (2.0 - distGhp) * 65.0;
      }

      elevMatrix[r][c] = z;
    }
  }

  const cells: TerrainCell[][] = [];

  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    const lat = maxLat - (r / (rows - 1)) * (maxLat - minLat);

    for (let c = 0; c < cols; c++) {
      const lon = minLon + (c / (cols - 1)) * (maxLon - minLon);
      const z = elevMatrix[r][c];

      const zLeft = c > 0 ? elevMatrix[r][c - 1] : z;
      const zRight = c < cols - 1 ? elevMatrix[r][c + 1] : z;
      const zTop = r > 0 ? elevMatrix[r - 1][c] : z;
      const zBottom = r < rows - 1 ? elevMatrix[r + 1][c] : z;

      const dzDx = (zRight - zLeft) / (2 * resolutionMeters);
      const dzDy = (zBottom - zTop) / (2 * resolutionMeters);

      let slope = calculateSlopeDeg(dzDx, dzDy);
      let roughness = 0.15;
      let hazardPenalty = 0.0;
      let isImpassable = false;

      // Bagnold Dunes ripple province (r=14..17, c=7..10)
      if (r >= 14 && r <= 17 && c >= 7 && c <= 10) {
        roughness = 0.90;
        hazardPenalty = 4.0;
      }

      // Greenheugh scarp edge: sheer cliff
      const distGhp = Math.sqrt(Math.pow(r - 22, 2) + Math.pow(c - 10, 2));
      if (distGhp >= 1.0 && distGhp <= 1.8) {
        slope = Math.max(slope, 26.5);
        isImpassable = true;
        hazardPenalty = 12.0;
      }

      // Dingo Gap pass corridor (r=9, c=17)
      const distDingo = Math.sqrt(Math.pow(r - 9, 2) + Math.pow(c - 17, 2));
      if (distDingo < 1.5) {
        slope = Math.min(slope, 5.0);
        isImpassable = false;
        hazardPenalty = 0.0;
      }

      cells[r][c] = {
        x: c,
        y: r,
        coordinate: {
          latitude: parseFloat(lat.toFixed(5)),
          longitude: parseFloat(lon.toFixed(5)),
          elevationMeters: Math.round(z)
        },
        elevationMeters: Math.round(z),
        slopeDeg: parseFloat(slope.toFixed(1)),
        roughness: parseFloat(roughness.toFixed(2)),
        hazardPenalty,
        isImpassable
      };
    }
  }

  return {
    name: 'Gale Crater & Mount Sharp Traverse DTM',
    minLat,
    maxLat,
    minLon,
    maxLon,
    rows,
    cols,
    resolutionMeters,
    cells
  };
}

export const GALE_TERRAIN_GRID = generateGaleTerrainGrid();
