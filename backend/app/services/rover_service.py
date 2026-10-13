import json
import os
from typing import Dict, Any, List, Optional
from ..algorithms.slope import calculate_mars_distance_km

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
METADATA_DIR = os.path.join(BASE_DIR, "data", "metadata")


class RoverService:
    def __init__(self):
        self._traverses: Dict[str, Dict[str, Any]] = {}
        self._manifest: Dict[str, Any] = {}
        self._load_data()

    def _load_data(self):
        manifest_path = os.path.join(METADATA_DIR, "rover_traverses_manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, "r", encoding="utf-8") as f:
                self._manifest = json.load(f)

        for rover in ["curiosity", "perseverance"]:
            p = os.path.join(PROCESSED_DIR, f"{rover}_traverse.geojson")
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8") as f:
                    self._traverses[rover] = json.load(f)

    def get_traverses_metadata(self) -> List[Dict[str, Any]]:
        results = []
        if "rovers" in self._manifest:
            for r in self._manifest["rovers"]:
                results.append({
                    "id": r["id"],
                    "rover": r["name"],
                    "mission": "Mars Exploration Program",
                    "region": r["region"],
                    "totalDistanceKm": r["totalDistanceKm"],
                    "solRange": "Multi-sol archive",
                    "pdsSource": r["pdsSource"],
                    "waypointCount": r["waypointCount"],
                    "available": r["id"] in self._traverses
                })
        return results

    def get_geojson(self, rover_id: str) -> Optional[Dict[str, Any]]:
        return self._traverses.get(rover_id)

    def calculate_proximity(
        self,
        route_coords: List[Dict[str, float]]
    ) -> Optional[Dict[str, Any]]:
        """Calculates distance between route waypoints and historical rover positions."""
        min_dist = float("inf")
        nearest_rover = ""
        closest_sol = 0
        closest_site = ""

        for rover_id, geo in self._traverses.items():
            for feat in geo.get("features", []):
                if feat.get("geometry", {}).get("type") == "Point":
                    lon, lat, *_ = feat["geometry"]["coordinates"]
                    for pt in route_coords:
                        d = calculate_mars_distance_km(pt["latitude"], pt["longitude"], lat, lon)
                        if d < min_dist:
                            min_dist = d
                            props = feat.get("properties", {})
                            nearest_rover = props.get("rover", rover_id.capitalize())
                            closest_sol = props.get("sol", 0)
                            closest_site = props.get("site", "Waypoint")

        if min_dist < float("inf"):
            return {
                "nearestRover": nearest_rover,
                "minDistanceKm": round(min_dist, 2),
                "closestSol": closest_sol,
                "closestSite": closest_site
            }
        return None


rover_service = RoverService()
