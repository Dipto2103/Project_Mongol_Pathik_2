from typing import Dict, Any, List
from ..schemas import RouteRequest, RouteResponse, WaypointModel, ElevationProfilePoint, RoverProximityInfo
from .terrain_service import terrain_service
from .rover_service import rover_service
from ..algorithms.astar import astar_search
from ..algorithms.slope import calculate_mars_distance_km
from ..algorithms.terrain_cost import TerrainCostWeights


class RouteService:
    def plan_route(self, request: RouteRequest) -> RouteResponse:
        start_lat = request.start.latitude
        start_lon = request.start.longitude
        dest_lat = request.destination.latitude
        dest_lon = request.destination.longitude

        # 1. Mode A: Direct Great-Circle Fallback
        if request.mode == "direct":
            return self._plan_direct(start_lat, start_lon, dest_lat, dest_lon, request.walkingSpeedKmh)

        # 2. Check terrain data coverage for Mode B and Mode C
        grid = terrain_service.get_grid_for_coordinates(start_lat, start_lon)
        if not grid:
            # Fall back to direct mode if outside DEM coverage with explicit limitation
            fallback = self._plan_direct(start_lat, start_lon, dest_lat, dest_lon, request.walkingSpeedKmh)
            fallback.limitations.insert(
                0,
                f"Selected coordinates lie outside the loaded regional DEM coverage ({terrain_service.get_status().get('region', 'None')}). Direct spherical mode activated."
            )
            return fallback

        weights = TerrainCostWeights(
            max_traversable_slope_deg=request.maxSlopeDeg
        )

        astar_result = astar_search(
            grid, start_lat, start_lon, dest_lat, dest_lon, weights
        )

        if not astar_result["success"]:
            return RouteResponse(
                status="failure",
                method="astar-terrain-cost",
                distanceKm=0.0,
                terrainCost=float("inf"),
                terrainCoveragePercent=0.0,
                waypoints=[],
                limitations=["Terrain slope barriers block path."],
                errorMessage=astar_result.get("errorMessage", "Route search failed.")
            )

        # Format waypoints and elevation profile
        waypoints = [WaypointModel(**wp) for wp in astar_result["waypoints"]]
        profile = [ElevationProfilePoint(**pt) for pt in astar_result["elevationProfile"]]

        dist_km = astar_result["distanceKm"]
        hours = dist_km / request.walkingSpeedKmh if request.walkingSpeedKmh > 0 else None

        # Check proximity to rover traverses
        rover_prox_dict = rover_service.calculate_proximity(
            [{"latitude": wp.latitude, "longitude": wp.longitude} for wp in waypoints]
        )
        rover_prox = RoverProximityInfo(**rover_prox_dict) if rover_prox_dict else None

        method_name = "historical-rover-reference" if request.mode == "historical-rover-reference" else "astar-terrain-cost"

        limitations = [
            f"Derived from {grid['name']} ({grid['resolutionMeters']}m spatial cell spacing).",
            "Orbital DEM cannot resolve sub-meter boulders or micro-crevices.",
            "Historical rover traverses provide contextual mobility evidence; they do not certify astronaut human safety."
        ]

        return RouteResponse(
            status="success",
            method=method_name,
            distanceKm=dist_km,
            estimatedDurationHours=round(hours, 2) if hours else None,
            terrainCost=astar_result["terrainCost"],
            terrainCoveragePercent=100.0,
            maxSlopeDeg=astar_result["maxSlopeDeg"],
            averageSlopeDeg=astar_result["averageSlopeDeg"],
            elevationGainMeters=astar_result["elevationGainMeters"],
            waypoints=waypoints,
            elevationProfile=profile,
            roverProximity=rover_prox,
            limitations=limitations
        )

    def _plan_direct(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
        speed_kmh: float
    ) -> RouteResponse:
        dist_km = calculate_mars_distance_km(lat1, lon1, lat2, lon2)
        hours = dist_km / speed_kmh if speed_kmh > 0 else None

        # Interpolate 24 waypoints along great circle
        waypoints = [
            WaypointModel(latitude=lat1, longitude=lon1),
            WaypointModel(latitude=lat2, longitude=lon2)
        ]

        limitations = [
            "Direct great-circle estimate only. Surface topography, slope gradient, and boulder fields unassessed.",
            "Must NOT be treated as a verified safe astronaut walking route."
        ]

        return RouteResponse(
            status="success",
            method="direct-spherical",
            distanceKm=round(dist_km, 2),
            estimatedDurationHours=round(hours, 2) if hours else None,
            terrainCost=round(dist_km, 2),
            terrainCoveragePercent=0.0,
            waypoints=waypoints,
            elevationProfile=[],
            limitations=limitations
        )


route_service = RouteService()
