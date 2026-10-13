import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import type { MarsCoordinate, PlannedRoute } from '../../types/route';
import type { MarsMapLayer } from '../../types/map';
import type { ScienceObservation } from '../../types/science';
import type { HazardRecord } from '../../types/hazards';
import { formatMarsCoordinate, toEastPositiveLongitude } from '../../utils/coordinates';
import { formatElevation, formatSlope, formatDistance } from '../../utils/formatters';
import { Compass, AlertTriangle, Flag, Navigation, MapPin } from 'lucide-react';

import { ALL_ROVER_TRAVERSES } from '../../data/roverTraverses';

interface MarsMapProps {
  activeBaseLayer: MarsMapLayer;
  activeOverlays: MarsMapLayer[];
  startCoord: MarsCoordinate | null;
  destCoord: MarsCoordinate | null;
  primaryRoute: PlannedRoute | null;
  alternativeRoute: PlannedRoute | null;
  sciencePOIs: ScienceObservation[];
  hazards: HazardRecord[];
  onSelectCoordinate: (coord: MarsCoordinate) => void;
  onSetStart: (coord: MarsCoordinate) => void;
  onSetDestination: (coord: MarsCoordinate) => void;
  onCursorMove: (coord: MarsCoordinate) => void;
  selectedPOI: ScienceObservation | null;
  selectedHazard: HazardRecord | null;
  centerTarget?: MarsCoordinate | null;
  showRoverTraverses?: boolean;
}

// Custom Leaflet DivIcon helpers
function createMarkerIcon(color: string, glyph: string, size = 30) {
  return L.divIcon({
    className: 'ares-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
      ">
        ${glyph}
      </div>
    `
  });
}

const START_ICON = createMarkerIcon('#22c55e', 'A', 28); // Green Start
const DEST_ICON = createMarkerIcon('#ff6738', 'B', 28);  // Orange Destination
const POI_ICON = createMarkerIcon('#38bdf8', '★', 24);   // Cyan Science POI
const HAZARD_ICON = createMarkerIcon('#ef4444', '▲', 24); // Red Hazard
const ROVER_ICON = createMarkerIcon('#0284c7', 'R', 22);  // Steel Blue Rover Endpoint

// Controller to handle center changes smoothly
const MapController: React.FC<{
  centerTarget?: MarsCoordinate | null;
  onCursorMove: (coord: MarsCoordinate) => void;
  onSelectCoordinate: (coord: MarsCoordinate) => void;
}> = ({ centerTarget, onCursorMove, onSelectCoordinate }) => {
  const map = useMap();

  useEffect(() => {
    if (centerTarget) {
      map.flyTo([centerTarget.latitude, centerTarget.longitude], Math.max(map.getZoom(), 8), {
        duration: 1.2
      });
    }
  }, [centerTarget, map]);

  useMapEvents({
    mousemove(e) {
      onCursorMove({
        latitude: parseFloat(e.latlng.lat.toFixed(5)),
        longitude: parseFloat(e.latlng.lng.toFixed(5))
      });
    },
    click(e) {
      onSelectCoordinate({
        latitude: parseFloat(e.latlng.lat.toFixed(5)),
        longitude: parseFloat(e.latlng.lng.toFixed(5))
      });
    }
  });

  return null;
};

export const MarsMap: React.FC<MarsMapProps> = ({
  activeBaseLayer,
  activeOverlays,
  startCoord,
  destCoord,
  primaryRoute,
  alternativeRoute,
  sciencePOIs,
  hazards,
  onSelectCoordinate,
  onSetStart,
  onSetDestination,
  onCursorMove,
  selectedPOI,
  selectedHazard,
  centerTarget,
  showRoverTraverses = true
}) => {
  // Convert route coordinates to Leaflet LatLng tuples
  const primaryRouteLatLngs = useMemo<[number, number][]>(() => {
    if (!primaryRoute) return [];
    return primaryRoute.waypoints.map((w) => [w.latitude, w.longitude]);
  }, [primaryRoute]);

  const alternativeRouteLatLngs = useMemo<[number, number][]>(() => {
    if (!alternativeRoute) return [];
    return alternativeRoute.waypoints.map((w) => [w.latitude, w.longitude]);
  }, [alternativeRoute]);

  return (
    <div className="relative w-full h-full bg-mars-darkest">
      <MapContainer
        center={[18.4447, 77.4508]} // Default centered on Jezero Crater
        zoom={7}
        minZoom={1}
        maxZoom={activeBaseLayer.maxZoom}
        style={{ width: '100%', height: '100%', background: '#0b0c10' }}
        zoomControl={false}
      >
        <MapController
          centerTarget={centerTarget}
          onCursorMove={onCursorMove}
          onSelectCoordinate={onSelectCoordinate}
        />

        {/* Base Planetary Tile Layer */}
        <TileLayer
          key={activeBaseLayer.id}
          url={activeBaseLayer.url}
          attribution={activeBaseLayer.attribution}
          maxZoom={activeBaseLayer.maxZoom}
          minZoom={activeBaseLayer.minZoom}
          opacity={activeBaseLayer.opacity}
          noWrap={false}
        />

        {/* Overlays (e.g. MOLA Shaded Relief) */}
        {activeOverlays.map((overlay) => (
          <TileLayer
            key={overlay.id}
            url={overlay.url}
            attribution={overlay.attribution}
            maxZoom={overlay.maxZoom}
            minZoom={overlay.minZoom}
            opacity={overlay.opacity}
            noWrap={false}
          />
        ))}

        {/* Mapped Hazards Footprints */}
        {hazards.map((h) => {
          const color =
            h.severity === 'critical'
              ? '#ef4444'
              : h.severity === 'high'
              ? '#f97316'
              : h.severity === 'moderate'
              ? '#eab308'
              : '#94a3b8';

          return (
            <React.Fragment key={h.id}>
              {h.radiusKm && (
                <Circle
                  center={[h.location.latitude, h.location.longitude]}
                  radius={h.radiusKm * 1000} // Leaflet uses meters
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.18,
                    weight: 1.5,
                    dashArray: '4, 4'
                  }}
                />
              )}
              <Marker
                position={[h.location.latitude, h.location.longitude]}
                icon={HAZARD_ICON}
              >
                <Popup className="ares-popup">
                  <div className="p-1 space-y-2 text-xs font-sans max-w-[240px]">
                    <div className="flex items-center gap-1.5 text-red-400 font-mono font-bold uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{h.name}</span>
                    </div>
                    <p className="text-mars-muted text-[11px] leading-relaxed">{h.description}</p>
                    <div className="bg-mars-darkest p-2 rounded text-[11px] font-mono space-y-1">
                      <div>Severity: <span className="font-semibold text-white uppercase">{h.severity}</span></div>
                      {h.slopeAngleDeg && <div>Slope: <span className="text-amber-300">{h.slopeAngleDeg}°</span></div>}
                      <div>Coord: {formatMarsCoordinate(h.location, 3)}</div>
                    </div>
                    <div className="text-[10px] text-mars-orange bg-mars-orange/10 p-1.5 rounded">
                      <strong>Mitigation:</strong> {h.operationalRecommendation}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Science Points of Interest */}
        {sciencePOIs.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.coordinates.latitude, poi.coordinates.longitude]}
            icon={POI_ICON}
          >
            <Popup className="ares-popup">
              <div className="p-1 space-y-2 text-xs font-sans max-w-[260px]">
                <div className="flex items-center gap-1.5 text-mars-cyan font-mono font-bold">
                  <Compass className="w-4 h-4 text-mars-cyan" />
                  <span>{poi.name}</span>
                </div>
                <p className="text-mars-muted text-[11px] leading-relaxed">{poi.description}</p>
                <div className="bg-mars-darkest p-2 rounded text-[11px] font-mono space-y-1 text-slate-300">
                  <div>Mission: <span className="text-white">{poi.mission}</span></div>
                  <div>Elevation: <span className="text-mars-cyan">{formatElevation(poi.elevationMeters)}</span></div>
                  <div>Coords: {formatMarsCoordinate(poi.coordinates, 3)}</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onSetStart(poi.coordinates)}
                    className="flex-1 py-1 px-2 rounded bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono transition-colors"
                  >
                    Set as Start
                  </button>
                  <button
                    onClick={() => onSetDestination(poi.coordinates)}
                    className="flex-1 py-1 px-2 rounded bg-mars-orange/20 hover:bg-mars-orange/40 text-mars-orange border border-mars-orange/40 text-[10px] font-mono transition-colors"
                  >
                    Set as Target
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Historical Rover Traverses (Curiosity & Perseverance) */}
        {showRoverTraverses &&
          ALL_ROVER_TRAVERSES.map((trav) => (
            <React.Fragment key={trav.id}>
              {/* Traverse Polyline */}
              <Polyline
                positions={trav.waypoints.map((w) => [w.latitude, w.longitude])}
                pathOptions={{
                  color: '#0284c7',
                  weight: 3.5,
                  dashArray: '4, 6',
                  opacity: 0.85
                }}
              />

              {/* Major Drive Endpoints */}
              {trav.endpoints.map((ep) => (
                <Marker
                  key={`${trav.id}-sol-${ep.sol}`}
                  position={[ep.coordinate.latitude, ep.coordinate.longitude]}
                  icon={ROVER_ICON}
                >
                  <Popup className="ares-popup">
                    <div className="p-1 space-y-1.5 text-xs font-sans max-w-[250px]">
                      <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold text-xs">
                        <span>{trav.roverName} — Sol {ep.sol}</span>
                      </div>
                      <div className="font-bold text-white text-xs">{ep.site}</div>
                      <p className="text-mars-muted text-[11px] leading-relaxed font-sans">{ep.notes}</p>
                      <div className="bg-mars-darkest p-2 rounded text-[11px] font-mono text-slate-300 space-y-0.5">
                        <div>Elevation: <span className="text-sky-300">{formatElevation(ep.elevationMeters)}</span></div>
                        <div>Coords: {formatMarsCoordinate(ep.coordinate, 3)}</div>
                      </div>
                      <div className="text-[10px] text-sky-200/80 bg-sky-950/40 p-1.5 rounded border border-sky-500/20">
                        {trav.scientificCaveat}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => onSetStart(ep.coordinate)}
                          className="flex-1 py-1 px-2 rounded bg-emerald-950 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono transition-colors"
                        >
                          Set Start
                        </button>
                        <button
                          onClick={() => onSetDestination(ep.coordinate)}
                          className="flex-1 py-1 px-2 rounded bg-mars-orange/20 hover:bg-mars-orange/40 text-mars-orange border border-mars-orange/40 text-[10px] font-mono transition-colors"
                        >
                          Set Target
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          ))}

        {/* Alternative Route (e.g. Direct baseline) */}
        {alternativeRoute && alternativeRouteLatLngs.length > 0 && (
          <Polyline
            positions={alternativeRouteLatLngs}
            pathOptions={{
              color: '#38bdf8',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.75
            }}
          />
        )}

        {/* Primary Planned Route */}
        {primaryRoute && primaryRouteLatLngs.length > 0 && (
          <Polyline
            positions={primaryRouteLatLngs}
            pathOptions={{
              color: '#ff6738',
              weight: primaryRoute.method === 'terrain-aware' ? 5 : 4,
              dashArray: primaryRoute.method === 'direct' ? '8, 8' : undefined,
              opacity: 0.95
            }}
          />
        )}

        {/* Start Marker */}
        {startCoord && (
          <Marker
            position={[startCoord.latitude, startCoord.longitude]}
            icon={START_ICON}
          >
            <Popup className="ares-popup">
              <div className="p-1 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" /> START: EVA DEPLOYMENT BASE
                </div>
                <div>{formatMarsCoordinate(startCoord, 4)}</div>
                <div className="text-[11px] text-mars-sand">
                  {toEastPositiveLongitude(startCoord.longitude)}°E Areocentric
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destCoord && (
          <Marker
            position={[destCoord.latitude, destCoord.longitude]}
            icon={DEST_ICON}
          >
            <Popup className="ares-popup">
              <div className="p-1 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-mars-orange flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> DESTINATION: SCIENCE OBJECTIVE
                </div>
                <div>{formatMarsCoordinate(destCoord, 4)}</div>
                <div className="text-[11px] text-mars-sand">
                  {toEastPositiveLongitude(destCoord.longitude)}°E Areocentric
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
