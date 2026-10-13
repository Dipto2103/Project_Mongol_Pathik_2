# NASA Planetary Data Sources & Provenance Registry
**ARES // Astronaut Route & Exploration System**  
*NASA Space Apps Challenge 2026 — Interplanetary Survival Guide: Martian Map*

---

## 1. Integrated Datasets Summary

| Dataset Name | Mission / Provider | Data Type | Spatial Resolution | CRS / Projection |
| :--- | :--- | :--- | :--- | :--- |
| **Mars Viking MDIM2.1 Color Mosaic** | Viking Orbiter 1 & 2 / USGS Astrogeology / NASA Mars Trek | WMTS Map Tiles | ~232 m/pixel | Equirectangular / Web Mercator |
| **MGS MOLA Shaded Relief Merge** | Mars Global Surveyor / NASA GSFC / Mars Trek | WMTS Map Tiles | ~463 m/pixel | Equirectangular |
| **OpenPlanetary Mars Basemap v0.1** | OpenPlanetary / CartoDB / USGS | Slippy Map PNG | ~232 m/pixel | Web Mercator (EPSG:3857) |
| **MOLA MEGDR Topographic DEM** | MGS / NASA PDS Geosciences Node | Global Topography Raster | 1/128° (~463m) | Areocentric Datum (6.1 mbar) |
| **MRO HiRISE / CTX Regional DTM** | MRO / University of Arizona / NASA JPL | Digital Terrain Model | 1.0 m – 350 m / cell | Equirectangular / Mars 2000 Sphere |
| **Curiosity REMS Atmospheric Telemetry** | MSL Curiosity / NASA JPL / CAB | In-situ Telemetry | Gale Crater Surface Point | Areocentric (4.59°S, 137.44°E) |
| **Perseverance MEDA Telemetry** | Mars 2020 / NASA JPL / CAB (CSIC-INTA) | In-situ Telemetry | Jezero Crater Delta Point | Areocentric (18.44°N, 77.45°E) |
| **InSight TWINS / APSS Archive** | InSight Lander / NASA JPL / CNES / DLR | PDS Archived Science Record | Elysium Planitia Point | Areocentric (4.50°N, 135.62°E) |

---

## 2. Dataset Specifics & Provenance Tracking

### 2.1 NASA Mars Trek WMTS Tile Service
- **Official Documentation:** [NASA Solar System Treks API](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars)
- **Base Tile Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
- **Topographic Shaded Relief Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
- **Application Role:** Provides base optical surface imagery and global terrain relief across all zoom levels.
- **Provenance Status:** `LIVE / OPERATIONAL`

### 2.2 OpenPlanetary Mars Global Basemap
- **Tile Endpoint:** `https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-1/all/{z}/{x}/{y}.png`
- **Application Role:** Default high-performance global web-cartography basemap.
- **Attribution:** OpenPlanetary / CartoDB / USGS Astrogeology Science Center.
- **Provenance Status:** `LIVE / OPERATIONAL`

### 2.3 NASA PDS Astrobiological Observation Catalog
- **Source Archive:** [NASA Planetary Data System (PDS)](https://pds.nasa.gov/)
- **Target Records:**
  - Jezero Crater Western Delta (`18.4447°N, 77.4508°E`, elevation `-2,530 m`) — Lacustrine smectite clays and carbonate biosignature targets.
  - Kodiak Butte Delta Remnant (`18.3970°N, 77.4120°E`, elevation `-2,480 m`) — Gilbert-type topset/foreset strata.
  - Gale Crater Mount Sharp Basal Stratigraphy (`5.08°S, 137.85°E`, elevation `-4,450 m`) — Clay-sulfate environmental transition.
  - Olympus Mons Caldera Rim (`18.65°N, 133.80°W`, elevation `+21,287 m`) — Basaltic shield volcanism.
  - Valles Marineris Melas Chasma (`9.80°S, 76.40°W`, elevation `-3,900 m`) — Hydrated layered sulfates.
  - Arcadia Planitia Glacial Ice Sheet (`39.30°N, 170.30°W`, elevation `-3,950 m`) — Shallow radar (SHARAD) subsurface water ice.
- **Provenance Status:** `HISTORICAL / PDS VERIFIED`

### 2.4 Environmental Intelligence (REMS, MEDA, TWINS)
- **Official Portal:** [NASA Mars Weather](https://production.mars.jpllab.net/insight/mission/weather/)
- **Parameters:** Atmospheric pressure, ambient surface temperature range, wind speed, solar longitude ($L_s$), UV flux.
- **Spatial Limits:** Strictly localized to surface rover touchdown coordinates. Not extrapolated globally.
- **Provenance Status:** `HISTORICAL ARCHIVE`
