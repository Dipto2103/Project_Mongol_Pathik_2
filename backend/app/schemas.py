from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class MarsCoordinateModel(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=360.0, description="Longitude in decimal degrees")
    elevationMeters: Optional[float] = Field(None, description="Elevation relative to Mars areoid in meters")


class TerrainStatusResponse(BaseModel):
    available: bool
    dataset: str
    region: str
    units: str
    slopeAvailable: bool
    roughnessAvailable: bool
    coverageStatus: Literal["regional", "global", "incomplete", "unavailable"]
    resolutionMeters: float
    minLat: float
    maxLat: float
    minLon: float
    maxLon: float


class RoverTraverseMeta(BaseModel):
    id: str
    rover: str
    mission: str
    region: str
    totalDistanceKm: float
    solRange: str
    pdsSource: str
    waypointCount: int
    available: bool


class RoverTraversesResponse(BaseModel):
    traverses: List[RoverTraverseMeta]
    attribution: str


class RouteRequest(BaseModel):
    start: MarsCoordinateModel
    destination: MarsCoordinateModel
    mode: Literal["terrain-aware", "direct", "historical-rover-reference"] = "terrain-aware"
    walkingSpeedKmh: float = Field(0.5, gt=0.0, le=5.0)
    maxSlopeDeg: float = Field(20.0, ge=5.0, le=35.0)
    avoidRoughness: bool = True


class WaypointModel(BaseModel):
    latitude: float
    longitude: float
    elevationMeters: Optional[float] = None
    slopeDeg: Optional[float] = None


class ElevationProfilePoint(BaseModel):
    distanceKm: float
    elevationMeters: float
    slopeDeg: float


class RoverProximityInfo(BaseModel):
    nearestRover: str
    minDistanceKm: float
    closestSol: int
    closestSite: str


class RouteResponse(BaseModel):
    status: Literal["success", "failure"]
    method: Literal["astar-terrain-cost", "direct-spherical", "historical-rover-reference"]
    distanceKm: float
    estimatedDurationHours: Optional[float] = None
    terrainCost: float
    terrainCoveragePercent: float
    maxSlopeDeg: Optional[float] = None
    averageSlopeDeg: Optional[float] = None
    elevationGainMeters: Optional[int] = None
    waypoints: List[WaypointModel]
    elevationProfile: List[ElevationProfilePoint] = []
    roverProximity: Optional[RoverProximityInfo] = None
    limitations: List[str]
    errorMessage: Optional[str] = None
