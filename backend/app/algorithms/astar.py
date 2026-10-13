import heapq
from typing import Dict, Any, List, Optional, Tuple
from .slope import calculate_mars_distance_km
from .terrain_cost import calculate_edge_cost, TerrainCostWeights, DEFAULT_WEIGHTS


def find_nearest_cell(
    grid_data: Dict[str, Any],
    lat: float,
    lon: float
) -> Optional[Dict[str, Any]]:
    min_lat = grid_data["minLat"]
    max_lat = grid_data["maxLat"]
    min_lon = grid_data["minLon"]
    max_lon = grid_data["maxLon"]
    rows = grid_data["rows"]
    cols = grid_data["cols"]

    if lat < min_lat or lat > max_lat or lon < min_lon or lon > max_lon:
        return None

    r = int(round(((max_lat - lat) / (max_lat - min_lat)) * (rows - 1)))
    c = int(round(((lon - min_lon) / (max_lon - min_lon)) * (cols - 1)))

    r = max(0, min(rows - 1, r))
    c = max(0, min(cols - 1, c))

    return grid_data["cells"][r][c]


def astar_search(
    grid_data: Dict[str, Any],
    start_lat: float,
    start_lon: float,
    dest_lat: float,
    dest_lon: float,
    weights: TerrainCostWeights = DEFAULT_WEIGHTS
) -> Dict[str, Any]:
    start_cell = find_nearest_cell(grid_data, start_lat, start_lon)
    dest_cell = find_nearest_cell(grid_data, dest_lat, dest_lon)

    if not start_cell or not dest_cell:
        return {
            "success": False,
            "errorMessage": f"Coordinates fall outside calibrated DEM boundaries ({grid_data['name']})."
        }

    rows = grid_data["rows"]
    cols = grid_data["cols"]

    # Start and goal are identical
    if start_cell["x"] == dest_cell["x"] and start_cell["y"] == dest_cell["y"]:
        wp = [{
            "latitude": start_lat,
            "longitude": start_lon,
            "elevationMeters": start_cell.get("elevationMeters"),
            "slopeDeg": start_cell.get("slopeDeg")
        }]
        return {
            "success": True,
            "distanceKm": 0.0,
            "terrainCost": 0.0,
            "waypoints": wp,
            "elevationProfile": [{
                "distanceKm": 0.0,
                "elevationMeters": start_cell.get("elevationMeters", 0.0),
                "slopeDeg": start_cell.get("slopeDeg", 0.0)
            }],
            "maxSlopeDeg": start_cell.get("slopeDeg", 0.0),
            "averageSlopeDeg": start_cell.get("slopeDeg", 0.0),
            "elevationGainMeters": 0
        }

    def heuristic(c: Dict[str, Any]) -> float:
        # Admissible heuristic: Euclidean Mars distance
        return calculate_mars_distance_km(c["lat"], c["lon"], dest_cell["lat"], dest_cell["lon"])

    # Priority queue: (fScore, counter, current_x, current_y)
    open_heap = []
    counter = 0
    start_key = (start_cell["x"], start_cell["y"])
    heapq.heappush(open_heap, (heuristic(start_cell), counter, start_cell["x"], start_cell["y"]))

    came_from: Dict[Tuple[int, int], Tuple[int, int]] = {}
    g_score: Dict[Tuple[int, int], float] = {start_key: 0.0}
    closed_set = set()

    # 8-connected transitions: (dx, dy, is_diagonal)
    moves = [
        (0, -1, False), (0, 1, False), (-1, 0, False), (1, 0, False),  # orthogonal
        (-1, -1, True), (-1, 1, True), (1, -1, True), (1, 1, True)      # diagonal
    ]

    target_key = (dest_cell["x"], dest_cell["y"])

    while open_heap:
        _, _, cx, cy = heapq.heappop(open_heap)
        current_key = (cx, cy)

        if current_key == target_key:
            # Path reconstruction
            path_cells = []
            curr = target_key
            while curr in came_from:
                path_cells.append(grid_data["cells"][curr[1]][curr[0]])
                curr = came_from[curr]
            path_cells.append(start_cell)
            path_cells.reverse()

            # Compile route metrics
            total_dist_km = 0.0
            total_cost = g_score[target_key]
            elev_gain = 0.0
            max_slope = 0.0
            slope_sum = 0.0
            elevation_profile = []
            waypoints = []

            for i, cell in enumerate(path_cells):
                lat = cell["lat"]
                lon = cell["lon"]
                elev = cell.get("elevationMeters", 0.0)
                slope = cell.get("slopeDeg", 0.0)

                if i > 0:
                    prev = path_cells[i - 1]
                    step_d = calculate_mars_distance_km(prev["lat"], prev["lon"], lat, lon)
                    total_dist_km += step_d
                    diff = elev - prev.get("elevationMeters", 0.0)
                    if diff > 0:
                        elev_gain += diff

                slope_sum += slope
                if slope > max_slope:
                    max_slope = slope

                waypoints.append({
                    "latitude": lat,
                    "longitude": lon,
                    "elevationMeters": elev,
                    "slopeDeg": slope
                })

                elevation_profile.append({
                    "distanceKm": round(total_dist_km, 3),
                    "elevationMeters": round(elev, 1),
                    "slopeDeg": round(slope, 1)
                })

            avg_slope = slope_sum / len(path_cells) if path_cells else 0.0

            return {
                "success": True,
                "distanceKm": round(total_dist_km, 3),
                "terrainCost": round(total_cost, 3),
                "waypoints": waypoints,
                "elevationProfile": elevation_profile,
                "maxSlopeDeg": round(max_slope, 1),
                "averageSlopeDeg": round(avg_slope, 1),
                "elevationGainMeters": int(round(elev_gain))
            }

        closed_set.add(current_key)
        current_cell = grid_data["cells"][cy][cx]

        for dx, dy, is_diag in moves:
            nx = cx + dx
            ny = cy + dy

            if not (0 <= nx < cols and 0 <= ny < rows):
                continue

            neighbor_key = (nx, ny)
            if neighbor_key in closed_set:
                continue

            neighbor_cell = grid_data["cells"][ny][nx]

            # Anti-corner-cutting rule: diagonal transition disallowed if both orthogonal adjacent cells are blocked
            if is_diag:
                ortho1 = grid_data["cells"][cy][nx]
                ortho2 = grid_data["cells"][ny][cx]
                if ortho1.get("isImpassable") and ortho2.get("isImpassable"):
                    continue

            cost, traversable, _ = calculate_edge_cost(current_cell, neighbor_cell, weights)
            if not traversable:
                continue

            tentative_g = g_score[current_key] + cost

            if neighbor_key not in g_score or tentative_g < g_score[neighbor_key]:
                g_score[neighbor_key] = tentative_g
                came_from[neighbor_key] = current_key
                counter += 1
                f_score = tentative_g + heuristic(neighbor_cell)
                heapq.heappush(open_heap, (f_score, counter, nx, ny))

    return {
        "success": False,
        "errorMessage": f"No traversable path found within slope constraint ({weights.max_traversable_slope_deg}°). Barrier escarpments block transit."
    }
