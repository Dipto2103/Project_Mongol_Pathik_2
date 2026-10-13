import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.algorithms.slope import calculate_mars_distance_km, calculate_slope_deg

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"


def test_terrain_status():
    response = client.get("/api/terrain/status")
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert "Gale Crater" in data["region"]
    assert data["slopeAvailable"] is True


def test_rover_traverses():
    response = client.get("/api/rover-traverses")
    assert response.status_code == 200
    data = response.json()
    assert len(data["traverses"]) >= 2
    rover_names = [t["rover"] for t in data["traverses"]]
    assert any("Curiosity" in n for n in rover_names)


def test_rover_geojson_endpoint():
    response = client.get("/api/rover-traverses/curiosity/geojson")
    assert response.status_code == 200
    geo = response.json()
    assert geo["type"] == "FeatureCollection"
    assert len(geo["features"]) > 0


def test_slope_calculation():
    # 20m rise over 100m run -> 11.31 degrees
    slope = calculate_slope_deg(0.2, 0.0)
    assert abs(slope - 11.31) < 0.1


def test_terrain_aware_routing_in_gale():
    # Route in Gale Crater from near Bradbury Landing to Dingo Gap pass
    payload = {
        "start": {"latitude": -4.59, "longitude": 137.44},
        "destination": {"latitude": -4.63, "longitude": 137.42},
        "mode": "terrain-aware",
        "walkingSpeedKmh": 0.5,
        "maxSlopeDeg": 22.0
    }
    response = client.post("/api/routes/terrain-aware", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["method"] == "astar-terrain-cost"
    assert data["distanceKm"] > 0
    assert len(data["waypoints"]) > 2
    assert data["roverProximity"] is not None


def test_direct_mode_fallback():
    payload = {
        "start": {"latitude": 0.0, "longitude": 0.0},
        "destination": {"latitude": 1.0, "longitude": 0.0},
        "mode": "direct",
        "walkingSpeedKmh": 0.5
    }
    response = client.post("/api/routes/terrain-aware", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["method"] == "direct-spherical"
    assert data["distanceKm"] > 50.0
