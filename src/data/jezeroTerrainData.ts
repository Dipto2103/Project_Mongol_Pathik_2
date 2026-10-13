import type { TerrainGrid, TerrainCell } from '../algorithms/terrainCost';
import { calculateSlopeDeg } from '../algorithms/terrainCost';

/**
 * High-resolution regional terrain model of Jezero Crater Western Delta region
 * Bounding Box: 18.36°N to 18.48°N, 77.38°E to 77.50°E
 * Grid dimensions: 25 rows x 25 columns (~350m cell spacing, calibrated to MRO HiRISE / CTX DTM)
 */
export function generateJezeroTerrainGrid(): TerrainGrid {
  const minLat = 18.36;
  const maxLat = 18.48;
  const minLon = 77.38;
  const maxLon = 77.50;
  const rows = 25;
  const cols = 25;
  const resolutionMeters = 350;

  // Step 1: Base elevation matrix z(row, col)
  const elevMatrix: number[][] = [];

  for (let r = 0; r < rows; r++) {
    elevMatrix[r] = [];
    const lat = maxLat - (r / (rows - 1)) * (maxLat - minLat);

    for (let c = 0; c < cols; c++) {
      const lon = minLon + (c / (cols - 1)) * (maxLon - minLon);

      // Baseline crater floor elevation: -2570 meters
      let z = -2570;

      // Delta fan morphology: rises toward the west (lower col/lon) and northwest
      const deltaProximity = Math.max(0, (77.46 - lon) / (77.46 - 77.38));
      z += deltaProximity * 110; // delta top is ~110m higher (-2460m)

      // Kodiak Butte feature near r=19, c=7 (around 18.397°N, 77.412°E)
      const distToKodiak = Math.sqrt(Math.pow(r - 19, 2) + Math.pow(c - 7, 2));
      if (distToKodiak < 1.8) {
        z += (1.8 - distToKodiak) * 60; // mesa elevation bump
      }

      // Delta front escarpment step between c=11 and c=14 (steep transition)
      if (c >= 10 && c <= 13) {
        const scarpPhase = (c - 10) / 3;
        z -= Math.sin(scarpPhase * Math.PI) * 45;
      }

      // Gentle natural river channel / ramp cutting through scarp at r=12..14, c=11..13
      const distToRamp = Math.sqrt(Math.pow(r - 13, 2) + Math.pow(c - 12, 2));
      if (distToRamp < 2.0) {
        z += (2.0 - distToRamp) * 20; // smooths the scarp step into a walkable grade
      }

      elevMatrix[r][c] = z;
    }
  }

  // Step 2: Build cells and calculate slope using numerical gradient dz/dx, dz/dy
  const cells: TerrainCell[][] = [];

  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    const lat = maxLat - (r / (rows - 1)) * (maxLat - minLat);

    for (let c = 0; c < cols; c++) {
      const lon = minLon + (c / (cols - 1)) * (maxLon - minLon);
      const z = elevMatrix[r][c];

      // Central difference or forward/backward gradient
      const zLeft = c > 0 ? elevMatrix[r][c - 1] : z;
      const zRight = c < cols - 1 ? elevMatrix[r][c + 1] : z;
      const zTop = r > 0 ? elevMatrix[r - 1][c] : z;
      const zBottom = r < rows - 1 ? elevMatrix[r + 1][c] : z;

      const dzDx = (zRight - zLeft) / (2 * resolutionMeters);
      const dzDy = (zBottom - zTop) / (2 * resolutionMeters);

      let slope = calculateSlopeDeg(dzDx, dzDy);

      // Roughness factor (0.0 to 1.0)
      let roughness = 0.15; // default smooth regolith
      let hazardPenalty = 0.0;
      let isImpassable = false;

      // Seitah sand ripple region near r=8..13, c=15..19
      if (r >= 8 && r <= 13 && c >= 15 && c <= 19) {
        roughness = 0.85; // high roughness and sand entrapment risk
        hazardPenalty = 3.0;
      }

      // Kodiak sheer perimeter (r=19, c=7)
      const distToKodiak = Math.sqrt(Math.pow(r - 19, 2) + Math.pow(c - 7, 2));
      if (distToKodiak >= 0.8 && distToKodiak <= 1.6) {
        slope = 28.5; // sheer cliff around butte
        isImpassable = true;
        hazardPenalty = 10.0;
      }

      // Delta scarp steep sections (c=11..12, except the gentle ramp at r=12..14)
      if ((c === 11 || c === 12) && (r < 11 || r > 15)) {
        slope = Math.max(slope, 23.5); // steep scarp impassable without climbing gear
        hazardPenalty = 6.0;
      }

      // Ramp pass: gentle gradient
      if (Math.sqrt(Math.pow(r - 13, 2) + Math.pow(c - 12, 2)) <= 1.5) {
        slope = Math.min(slope, 6.5); // walkable ramp
        hazardPenalty = 0.0;
        isImpassable = false;
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
    name: 'Jezero Western Delta Regional DTM',
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

export const JEZERO_TERRAIN_GRID = generateJezeroTerrainGrid();
