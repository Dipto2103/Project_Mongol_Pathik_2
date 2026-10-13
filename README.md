# ARES — Astronaut Route & Exploration System
### NASA Space Apps Challenge 2026
**Challenge Category:** *Interplanetary Survival Guide: Martian Map*  
**Project Type:** Interactive Planetary Mapping & Survival-Planning Web Application  
**Development Environment:** Google Antigravity IDE  

---

## 1. Project Overview

Mars presents a fundamentally hostile and unforgiving environment for future human extravehicular activities (EVAs). Its surface is characterized by steep crater scarps, boulder-strewn talus slopes, active sand ripples with mobility-entrapment hazards, and unmeasured data gaps.

**ARES (Astronaut Route & Exploration System)** is an interactive, NASA-data-driven exploration workstation designed to help future Mars astronauts, planetary scientists, and mission planners evaluate surface traversability, identify scientific targets, inspect environmental hazards, and formulate operational mission plans.

Instead of presenting an undifferentiated static map, ARES combines:
1. **Martian Explorer:** Real NASA planetary cartography powered by NASA Mars Trek WMTS tile services and the OpenPlanetary global basemap.
2. **Terrain Intelligence:** Digital elevation models calculating numerical slope gradients $\theta = \tan^{-1}\left(\sqrt{(\partial z/\partial x)^2 + (\partial z/\partial y)^2}\right)$ with documented traversability thresholds.
3. **Route Planner (Modes A & B):**
   - **Mode A (Direct Great-Circle):** Spherical distance calculations ($R = 3,389.5\text{ km}$) with explicit warnings that direct paths are unverified for surface safety.
   - **Mode B (A\* Terrain-Aware):** 8-connected grid pathfinding incorporating distance, slope steepness, surface roughness, and hazard zones to route astronauts through gentle ramp corridors while circumventing steep escarpments.
4. **Survival Intelligence & Hazard Mitigation:** Monitored catalog of verified hazards (Jezero Delta Front Escarpment, Kodiak Mesa Precipice, Bagnold Dunes, Olympus Mons Basal Scarp) with severity ratings and actionable mitigation directives.
5. **Science Explorer:** Verified astrobiological and geological observation catalog from the NASA Planetary Data System (PDS), including ancient delta deposits, volcanic calderas, and subsurface water ice sheets.
6. **Operational Mission Briefing:** Comprehensive briefing compiling distance, duration, elevation gain, interactive Recharts elevation profile, hazard mitigations, and exportable JSON / printable reports.

---

## 2. Technology Stack

- **Framework:** React 18, TypeScript (Strict Mode), Vite
- **Styling:** Tailwind CSS (Dark Planetary Mission Control theme)
- **Map Engine:** Leaflet, React-Leaflet (custom high-contrast SVG divIcons, tile coordinate normalization)
- **Data Visualization:** Recharts (Dynamic elevation profile area charts)
- **Icons:** Lucide React
- **Unit Testing:** Vitest (13 comprehensive algorithmic tests covering distance, edge costs, and pathfinding)

---

## 3. Getting Started

### Prerequisites
- Node.js LTS (v18+ or v20+)
- npm (v9+)

### Installation & Run
```bash
# Clone or navigate to the repository
cd ares-martian-map

# Install dependencies
npm install

# Start development server
npm run dev
# The application will be accessible at http://localhost:3000

# Execute Vitest test suite
npm test

# Build for production
npm run build
```

---

## 4. Project Architecture

```
ares-martian-map/
├── docs/
│   ├── DATA_SOURCES.md          # Full NASA dataset provenance & URL registry
│   └── SCIENTIFIC_LIMITATIONS.md# Resolution limits, weather localization, and safety disclaimers
├── src/
│   ├── algorithms/
│   │   ├── distance.ts          # Mars Haversine formulation (R = 3389.5 km) & travel time
│   │   ├── terrainCost.ts       # Partial-derivative slope formula & traversability weights
│   │   ├── routeSearch.ts       # A* terrain-aware pathfinding & great-circle baseline
│   │   └── hazardAssessment.ts  # Risk rating engine & survival recommendation generator
│   ├── app/
│   │   └── App.tsx              # Main three-panel mission control workstation layout
│   ├── components/
│   │   ├── common/              # Source badges, loading HUD, error states, documentation modal
│   │   ├── layout/              # Header, navigation sidebar, and status bar
│   │   ├── map/                 # MarsMap, Leaflet overlays, map controls, cartographic legend
│   │   ├── route/               # RoutePlanner, RouteComparison, MissionSummary briefing
│   │   ├── science/             # SciencePanel & ObservationCard
│   │   ├── hazards/             # HazardPanel & mitigation directives
│   │   ├── environment/         # In-situ telemetry (Curiosity, InSight, Perseverance)
│   │   └── terrain/             # Regional DTM slope distribution & grid parameters
│   ├── data/
│   │   ├── demoLocations.ts     # Verified landing sites (Butler, Bradbury, InSight, Viking)
│   │   ├── hazardsCatalog.ts    # Documented terrain scarps and sand ripple complexes
│   │   ├── jezeroTerrainData.ts # 25x25 calibrated Jezero Crater delta DEM grid
│   │   ├── marsLayers.ts        # NASA Mars Trek & OpenPlanetary layer registry
│   │   └── scienceCatalog.ts    # NASA PDS points of interest with astrobiological relevance
│   ├── hooks/
│   │   ├── useMarsLayers.ts     # Map tile layer selection & opacity management
│   │   └── useRoutePlanner.ts   # Route generation, comparison state, and hazard assessment
│   ├── services/
│   │   ├── nasaWeather.ts       # REMS, MEDA, and TWINS environmental telemetry
│   │   └── sourceRegistry.ts    # Metadata repository for all integrated NASA datasets
│   ├── types/                   # Typed models for routes, maps, hazards, science, and weather
│   ├── utils/                   # Coordinate formatters, parsers, and validation functions
│   └── styles/                  # Tailwind directives and custom Leaflet dark UI styles
└── tests/
    ├── distance.test.ts         # Distance, speed, and antimeridian normalization tests
    ├── terrainCost.test.ts      # Slope calculation and traversability penalty tests
    └── routeSearch.test.ts      # A* search, obstacle bypass, and grid boundary tests
```

---

## 5. Scientific Validation & Testing Results

All 13 unit tests execute cleanly across the core algorithms:
- **Mars Distance Algorithms:** Verified against spherical trigonometry with Mars mean radius $R = 3,389.5\text{ km}$, coordinate validation, and longitude antimeridian normalization.
- **Slope & Terrain Cost Formulation:** Validated against known analytical gradients (e.g. 20m vertical rise over 100m horizontal run producing exactly $11.31^\circ$).
- **A\* Pathfinding & Obstacle Bypass:** Confirmed path reconstruction through the gentle natural ramp corridor in the Jezero Western Delta while excluding slopes $> 22^\circ$.

---

## 6. Official NASA Challenge Resources

- [NASA Space Apps Challenge 2026](https://www.spaceappschallenge.org/2026/)
- [NASA Mars Trek API Documentation](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars)
- [NASA Planetary Data System (PDS)](https://pds.nasa.gov/)
- [NASA Mars Weather Portal](https://production.mars.jpllab.net/insight/mission/weather/)
