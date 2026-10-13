from typing import Dict, Any, Tuple
from .slope import calculate_mars_distance_km


class TerrainCostWeights:
    def __init__(
        self,
        distance_weight: float = 1.0,
        slope_weight: float = 2.5,
        roughness_weight: float = 1.8,
        hazard_weight: float = 4.0,
        uncertainty_weight: float = 3.0,
        max_traversable_slope_deg: float = 20.0
    ):
        self.distance_weight = distance_weight
        self.slope_weight = slope_weight
        self.roughness_weight = roughness_weight
        self.hazard_weight = hazard_weight
        self.uncertainty_weight = uncertainty_weight
        self.max_traversable_slope_deg = max_traversable_slope_deg


DEFAULT_WEIGHTS = TerrainCostWeights()


def calculate_edge_cost(
    from_cell: Dict[str, Any],
    to_cell: Dict[str, Any],
    weights: TerrainCostWeights = DEFAULT_WEIGHTS
) -> Tuple[float, bool, str]:
    """
    Computes normalized transition cost between two adjacent terrain cells:
    C_edge = D * (1 + ws * Sn + wr * Rn + wh * Hn + wu * Un)
    """
    if from_cell.get("isImpassable") or to_cell.get("isImpassable"):
        return float("inf"), False, "Impassable obstacle / cliff edge barrier"

    lat1, lon1 = from_cell["lat"], from_cell["lon"]
    lat2, lon2 = to_cell["lat"], to_cell["lon"]
    dist_km = calculate_mars_distance_km(lat1, lon1, lat2, lon2)

    slope = to_cell.get("slopeDeg")
    if slope is None:
        slope = from_cell.get("slopeDeg")

    # Slope constraint check
    if slope is not None and slope > weights.max_traversable_slope_deg:
        return float("inf"), False, f"Slope {slope:.1f}° exceeds max configured limit ({weights.max_traversable_slope_deg}°)"

    # Normalized slope cost Sn
    slope_ratio = (slope / weights.max_traversable_slope_deg) if slope is not None else 0.0
    slope_cost = weights.slope_weight * (slope_ratio ** 1.8)

    # Normalized roughness cost Rn
    roughness = to_cell.get("roughness", 0.15)
    roughness_cost = weights.roughness_weight * roughness

    # Hazard penalty Hn
    hazard = max(from_cell.get("hazardPenalty", 0.0), to_cell.get("hazardPenalty", 0.0))
    hazard_cost = weights.hazard_weight * (hazard / 10.0)

    # Uncertainty penalty Un (missing elevation/slope is never zero hazard)
    has_unknown = from_cell.get("elevationMeters") is None or to_cell.get("elevationMeters") is None
    uncertainty_cost = weights.uncertainty_weight * 1.5 if has_unknown else 0.0

    multiplier = 1.0 + slope_cost + roughness_cost + hazard_cost + uncertainty_cost
    total_cost = weights.distance_weight * dist_km * multiplier

    return total_cost, True, ""
