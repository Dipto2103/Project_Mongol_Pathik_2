# ARES — Astronaut Route & Exploration System
### NASA Space Apps Challenge 2026
**Challenge Category:** *Interplanetary Survival Guide: Martian Map*  
**Project Type:** Interactive Planetary Mapping & Survival-Planning Web Application  
**Development Environment:** Google Antigravity IDE  

---

## 1. Project Overview

Mars presents a fundamentally hostile and unforgiving environment for future human extravehicular activities (EVAs). Its surface is characterized by steep crater scarps, boulder-strewn talus slopes, active sand ripples with mobility-entrapment hazards, and unmeasured data gaps.

**ARES (Astronaut Route & Exploration System)** is an interactive, NASA-data-driven exploration workstation designed to help future Mars astronauts, planetary scientists, and mission planners evaluate surface traversability, identify scientific targets, inspect environmental hazards, reconstruct historical rover movements, and formulate operational mission plans.

### Core Capabilities:
1. **Martian Explorer:** Real NASA planetary cartography powered by [NASA Mars Trek Portal](https://trek.nasa.gov/mars/index.html) WMTS tile services, Viking Color Mosaics, MOLA Shaded Relief, and the OpenPlanetary global basemap.
2. **Terrain Intelligence:** Digital elevation models calculating numerical slope gradients:
   $$\theta = \tan^{-1}\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right)$$
   with documented traversability thresholds and strict data-gap penalties.
3. **Multi-Mode Route Planning:**
   - **Mode A (Direct Distance):** Spherical Haversine distance calculations ($R_{\text{Mars}} = 3,389.5\text{ km}$) with explicit warnings that direct paths are unverified for surface safety.
   - **Mode B (Terrain-Aware A\*):** 8-connected grid pathfinding incorporating distance, slope steepness, surface roughness, and hazard zones to route astronauts through gentle ramp corridors while circumventing steep escarpments.
   - **Mode C (Historical Rover Reference):** Reconstructs validated rover traverses from NASA PDS archives. Computes route-to-traverse proximity metrics while preserving the scientific distinction that robotic paths do not guarantee human EVA walkability.
4. **Historical Rover Intelligence & Rover Explorer:**
   - Curiosity (MSL) traverse through Gale Crater reconstructed from NASA PDS PLACES archives (`MSL-M-ROVER-6-RDR-PLACES-V1.0`).
   - Perseverance (Mars 2020) traverse across the Jezero Western Fan Delta and Neretva Vallis.
   - Interactive milestone browser with sol numbers, site names, elevations, and geological context.
5. **Survival Intelligence & Hazard Mitigation:** Monitored catalog of verified hazards (Jezero Delta Front Escarpment, Kodiak Mesa Precipice, Bagnold Dunes, Olympus Mons Basal Scarp) with severity ratings and actionable mitigation directives.
6. **Science Explorer:** Verified astrobiological and geological observation catalog from the NASA Planetary Data System (PDS), including ancient delta deposits, volcanic calderas, and subsurface water ice sheets.
7. **Operational Mission Briefing:** Comprehensive briefing compiling distance, duration, elevation gain, interactive Recharts elevation profile, rover proximity context, hazard mitigations, and exportable JSON / printable reports.

---

## 2. Technology Stack & Dual-Engine Architecture

ARES features a **dual-engine architecture**:
- **Primary Engine:** High-performance Python FastAPI backend utilizing NumPy and SciPy for raster slope derivations and graph A* search.
- **Client Fallback Engine:** Pure TypeScript client-side pathfinding with local calibrated DEM matrices (zero downtime if backend is offline).

### Frontend:
- **Framework:** React 18, TypeScript (Strict Mode), Vite
- **Styling:** Tailwind CSS (Dark Planetary Mission Control theme)
- **Map Engine:** Leaflet, React-Leaflet (custom high-contrast SVG divIcons, tile coordinate normalization)
- **Data Visualization:** Recharts (Dynamic elevation profile area charts)
- **Icons:** Lucide React
- **Unit Testing:** Vitest (17 tests across 4 test suites)

### Backend:
- **Framework:** Python 3.14+, FastAPI, Uvicorn
- **Data Processing:** NumPy, SciPy, Pydantic v2
- **Unit Testing:** Pytest (7 tests covering terrain status, rover traverses, and A* routing)

---

## 3. Getting Started

### Prerequisites
- Node.js LTS (v18+ or v20+)
- Python 3.10+

### Launching the Frontend
```powershell
# In PowerShell (always prepend Node path if npm policy is restricted):
$env:PATH = "C:\Users\User\AppData\Local\OpenAI\Codex\runtimes\cua_node\e0c305cbb434431d\bin;$env:PATH"

# Install dependencies
npm.cmd install

# Start development server (port 3000)
npm.cmd run dev

# Run Vitest test suite
npm.cmd test

# Build for production
npm.cmd run build
```

### Launching the Optional Backend (FastAPI)
```powershell
# Start Uvicorn backend server (port 8000)
python -m uvicorn backend.app.main:app --reload --port 8000

# Run Pytest backend test suite
python -m pytest backend/tests/test_backend.py
```

---

## 4. Scientific Validation & Testing Results

A total of **24 automated tests** (17 Vitest + 7 Pytest) validate the entire system:

1. **Mars Distance Algorithms (6 tests):** Verified against spherical trigonometry with Mars mean radius $R = 3,389.5\text{ km}$, coordinate validation, and longitude antimeridian normalization.
2. **Slope & Terrain Cost Formulation (3 tests):** Validated against known analytical gradients ($20\text{ m}$ rise over $100\text{ m}$ run $= 11.31^\circ$) and non-linear slope penalties.
3. **A\* Pathfinding & Obstacle Avoidance (4 tests):** Confirms path reconstruction through gentle ramp corridors while excluding slopes $>22^\circ$ and handling unreachable targets.
4. **Rover Traverses & PDS Integrity (4 tests):** Validates Curiosity and Perseverance coordinates, monotonic sol ranges, proximity calculations, and mandatory scientific caveat flags.
5. **Backend API Endpoints (7 tests):** Validates health checks, terrain status, GeoJSON traverse exports, and terrain-aware routing responses.

---

## 5. Official NASA Resources & Provenance

- [NASA Space Apps Challenge 2026](https://www.spaceappschallenge.org/2026/)
- [NASA Mars Trek Portal](https://trek.nasa.gov/mars/index.html)
- [NASA Mars Trek API Documentation](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars)
- [Curiosity Rover PLACES Dataset](https://pds.nasa.gov/ds-view/pds/viewProfile.jsp?dsid=MSL-M-ROVER-6-RDR-PLACES-V1.0)
- [Curiosity PLACES Archive Bundle](https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Amsl_places&version=39.0)
- [Where is Curiosity? Interactive Map](https://science.nasa.gov/mission/msl-curiosity/location-map/)
- [Where is Perseverance? Interactive Map](https://mars.nasa.gov/mars2020/mission/science/traverse-map/)
- [NASA Planetary Data System (PDS)](https://pds.nasa.gov/)
