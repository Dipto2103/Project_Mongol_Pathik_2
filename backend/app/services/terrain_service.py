import json
import os
from typing import Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")


class TerrainService:
    def __init__(self):
        self._grids: Dict[str, Dict[str, Any]] = {}
        self._load_grids()

    def _load_grids(self):
        gale_path = os.path.join(DATA_DIR, "gale_crater_dem.json")
        if os.path.exists(gale_path):
            with open(gale_path, "r", encoding="utf-8") as f:
                self._grids["gale"] = json.load(f)

    def get_grid_for_coordinates(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """Returns the appropriate regional DEM if coordinates fall within its bounding box."""
        for name, grid in self._grids.items():
            if (grid["minLat"] <= lat <= grid["maxLat"] and
                grid["minLon"] <= lon <= grid["maxLon"]):
                return grid
        return None

    def get_status(self) -> Dict[str, Any]:
        has_gale = "gale" in self._grids
        if has_gale:
            g = self._grids["gale"]
            return {
                "available": True,
                "dataset": g["sourceDataset"],
                "region": g["region"],
                "units": "meters (Mars areoid datum)",
                "slopeAvailable": True,
                "roughnessAvailable": True,
                "coverageStatus": "regional",
                "resolutionMeters": g["resolutionMeters"],
                "minLat": g["minLat"],
                "maxLat": g["maxLat"],
                "minLon": g["minLon"],
                "maxLon": g["maxLon"]
            }
        return {
            "available": False,
            "dataset": "None loaded",
            "region": "None",
            "units": "N/A",
            "slopeAvailable": False,
            "roughnessAvailable": False,
            "coverageStatus": "unavailable",
            "resolutionMeters": 0.0,
            "minLat": 0.0,
            "maxLat": 0.0,
            "minLon": 0.0,
            "maxLon": 0.0
        }


terrain_service = TerrainService()
