# NASA Planetary Data Sources & Provenance Registry
**ARES // Astronaut Route & Exploration System**  
*NASA Space Apps Challenge 2026 — Interplanetary Survival Guide: Martian Map*

---

## 1. Integrated Datasets Summary

| Dataset Name | Mission / Provider | Data Type | Spatial Resolution | CRS / Projection |
| :--- | :--- | :--- | :--- | :--- |
| **NASA Mars Trek Exploration Portal** | NASA Solar System Treks Project / JPL | Interactive Portal & Tile Services | Multi-resolution | Web Mercator & Equirectangular |
| **Mars Viking MDIM2.1 Color Mosaic** | Viking Orbiter 1 & 2 / USGS Astrogeology / NASA Mars Trek | WMTS Map Tiles | ~232 m/pixel | Equirectangular / Web Mercator |
| **MGS MOLA Shaded Relief Merge** | Mars Global Surveyor / NASA GSFC / Mars Trek | WMTS Map Tiles | ~463 m/pixel | Equirectangular |
| **OpenPlanetary Mars Basemap v0.1** | OpenPlanetary / CartoDB / USGS | Slippy Map PNG | ~232 m/pixel | Web Mercator (EPSG:3857) |
| **MOLA MEGDR Topographic DEM** | MGS / NASA PDS Geosciences Node | Global Topography Raster | 1/128° (~463m) | Areocentric Datum (6.1 mbar) |
| **Gale Crater Calibrated DEM Grid** | MRO CTX / HiRISE & MOLA | Numerical DEM Grid (30×30) | 280m × 350m / cell | Areocentric (Gale Crater) |
| **Jezero Crater Calibrated DEM Grid** | MRO HiRISE / CTX DTM | Numerical DEM Grid (25×25) | 350m × 350m / cell | Areocentric (Jezero Crater) |
| **Curiosity Rover PLACES Archive** | MSL Curiosity / NASA PDS Geosciences Node | Localized Position CSV & Vectors | Centimeter-level | Local Rover Frame / Areocentric |
| **Perseverance Traverse Localization Catalog** | Mars 2020 / NASA JPL Science Operations | Georeferenced Drive Endpoints | Decimeter-level | Local Site Frame / Areocentric |
| **Curiosity REMS Atmospheric Telemetry** | MSL Curiosity / NASA JPL / CAB | In-situ Telemetry | Gale Crater Surface Point | Areocentric (4.59°S, 137.44°E) |
| **Perseverance MEDA Telemetry** | Mars 2020 / NASA JPL / CAB (CSIC-INTA) | In-situ Telemetry | Jezero Crater Delta Point | Areocentric (18.44°N, 77.45°E) |
| **InSight TWINS / APSS Archive** | InSight Lander / NASA JPL / CNES / DLR | PDS Archived Science Record | Elysium Planitia Point | Areocentric (4.50°N, 135.62°E) |

---

## 2. Dataset Specifics & Provenance Tracking

### 2.1 NASA Mars Trek Exploration Portal & WMTS Services
- **Official Exploration Portal:** [NASA Mars Trek Portal](https://trek.nasa.gov/mars/index.html)
- **API Documentation:** [NASA Solar System Treks API](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars)
- **Base Optical Tile Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
- **Topographic Shaded Relief Endpoint:** `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`
- **Application Role:** Provides base optical surface imagery, global shaded relief, and visual terrain context.
- **Critical Distinction:** Shaded-relief map tiles are decorative visual products; pixel brightness cannot be treated as numerical elevation. ARES uses separate numerical DEM rasters for mathematical slope and cost derivations.
- **Provenance Status:** `LIVE / OPERATIONAL`

### 2.2 NASA Planetary Data System — Curiosity Rover PLACES Archive
- **Official PDS Profile:** [MSL-M-ROVER-6-RDR-PLACES-V1.0](https://pds.nasa.gov/ds-view/pds/viewProfile.jsp?dsid=MSL-M-ROVER-6-RDR-PLACES-V1.0)
- **PDS Archive Bundle:** [urn:nasa:pds:msl_places Version 39.0](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Amsl_places&version=39.0)
- **NASA Mission Interactive Map:** [Where is Curiosity?](https://science.nasa.gov/mission/msl-curiosity/location-map/)
- **Data Content:** Georeferenced rover positions, drive endpoint records, site numbering, sol timeline, and elevation milestones from Sol 0 (Bradbury Landing) through Sol 4120+ (Gediz Vallis Ridge).
- **Application Role:** Renders historical traverse polylines and drive endpoints in Gale Crater; feeds the Rover Proximity calculation and Rover Explorer inspector.
- **Provenance Status:** `HISTORICAL / PDS VERIFIED`

### 2.3 NASA Mars 2020 Perseverance Traverse Localization Catalog
- **Official Mission Map:** [Where is Perseverance?](https://mars.nasa.gov/mars2020/mission/science/traverse-map/)
- **Data Content:** Landing at Octavia E. Butler Landing (Sol 0) through delta front ascent to Neretva Vallis breach (Sol 1050+).
- **Application Role:** Renders historical traverse polylines in Jezero Crater; supports comparative route planning across the Western Fan Delta.
- **Provenance Status:** `HISTORICAL / JPL VERIFIED`

### 2.4 Numerical Digital Elevation Models (DEMs)
- **Gale Crater DEM Grid:** Calibrated 30×30 elevation matrix spanning latitude `[-4.90, -4.55]` and longitude `[137.30, 137.50]`, cell resolution ~280m lat × 350m lon.
- **Jezero Crater DEM Grid:** Calibrated 25×25 elevation matrix spanning latitude `[18.35, 18.52]` and longitude `[77.30, 77.50]`, cell resolution ~350m × 350m.
- **Elevation Datum:** Areocentric datum at 6.1 mbar reference pressure level.
- **Slope Derivation:** Gradients computed via finite difference methods:
  $$\theta = \tan^{-1}\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right)$$

### 2.5 OpenPlanetary Mars Global Basemap
- **Tile Endpoint:** `https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-1/all/{z}/{x}/{y}.png`
- **Application Role:** Default high-performance global web-cartography basemap.
- **Attribution:** OpenPlanetary / CartoDB / USGS Astrogeology Science Center.
- **Provenance Status:** `LIVE / OPERATIONAL`

### 2.6 NASA Astrobiological Observation Catalog
- **Source Archive:** [NASA Planetary Data System (PDS)](https://pds.nasa.gov/)
- **Target Records:** Jezero Crater Western Delta, Kodiak Butte, Mount Sharp Stratigraphy, Olympus Mons, Valles Marineris Melas Chasma, Arcadia Planitia Glacial Ice.
- **Provenance Status:** `HISTORICAL / PDS VERIFIED`
