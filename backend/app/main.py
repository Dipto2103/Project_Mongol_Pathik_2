from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    TerrainStatusResponse,
    RoverTraversesResponse,
    RouteRequest,
    RouteResponse
)
from .services.terrain_service import terrain_service
from .services.rover_service import rover_service
from .services.route_service import route_service

app = FastAPI(
    title="ARES 2.0 Terrain-Aware Route Planner API",
    description="NASA Space Apps Challenge 2026 — Interplanetary Survival Guide: Martian Map",
    version="2.0.0"
)

# CORS configuration for local React / Vite frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "ARES 2.0 Planetary Routing Engine",
        "systemTimeMarsDatum": "IAU2000 Areoid"
    }


@app.get("/api/terrain/status", response_model=TerrainStatusResponse)
def get_terrain_status():
    status = terrain_service.get_status()
    return TerrainStatusResponse(**status)


@app.get("/api/rover-traverses", response_model=RoverTraversesResponse)
def get_rover_traverses():
    meta_list = rover_service.get_traverses_metadata()
    return RoverTraversesResponse(
        traverses=meta_list,
        attribution="NASA Planetary Data System (PDS) & MSL PLACES Archive"
    )


@app.get("/api/rover-traverses/{rover_id}/geojson")
def get_rover_geojson(rover_id: str):
    geo = rover_service.get_geojson(rover_id)
    if not geo:
        raise HTTPException(status_code=404, detail=f"Rover traverse '{rover_id}' not found.")
    return geo


@app.post("/api/routes/terrain-aware", response_model=RouteResponse)
def plan_route(request: RouteRequest):
    return route_service.plan_route(request)
