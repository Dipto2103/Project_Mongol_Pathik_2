import math
from typing import Tuple

MARS_MEAN_RADIUS_KM = 3389.5


def to_radians(deg: float) -> float:
    return math.radians(deg)


def to_degrees(rad: float) -> float:
    return math.degrees(rad)


def normalize_longitude(lon: float) -> float:
    normalized = ((lon + 180.0) % 360.0)
    if normalized < 0:
        normalized += 360.0
    normalized -= 180.0
    if normalized == -180.0 and lon > 0:
        return 180.0
    return normalized


def calculate_mars_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates spherical Mars great-circle distance between two coordinates in km."""
    phi1 = to_radians(lat1)
    phi2 = to_radians(lat2)
    delta_phi = to_radians(lat2 - lat1)
    delta_lambda = to_radians(normalize_longitude(lon2) - normalize_longitude(lon1))

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    a = max(0.0, min(1.0, a))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return MARS_MEAN_RADIUS_KM * c


def calculate_slope_deg(dz_dx: float, dz_dy: float) -> float:
    """
    Calculates slope angle theta in degrees from numerical elevation gradients:
    theta = atan( sqrt( (dz/dx)^2 + (dz/dy)^2 ) )
    """
    grad = math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy)
    return to_degrees(math.atan(grad))
