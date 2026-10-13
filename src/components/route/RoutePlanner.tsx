import React, { useState } from 'react';
import type { MarsCoordinate, RouteMethod, PlannedRoute } from '../../types/route';
import { DEMO_LOCATIONS } from '../../data/demoLocations';
import { SCIENCE_CATALOG } from '../../data/scienceCatalog';
import { formatMarsCoordinate } from '../../utils/coordinates';
import { formatDistance, formatDuration, formatSlope, formatElevation } from '../../utils/formatters';
import {
  Route,
  ArrowRightLeft,
  Play,
  Trash2,
  Clock,
  Activity,
  AlertTriangle,
  Info,
  Footprints,
  Mountain
} from 'lucide-react';

interface RoutePlannerProps {
  startCoord: MarsCoordinate | null;
  destCoord: MarsCoordinate | null;
  onSetStart: (coord: MarsCoordinate) => void;
  onSetDestination: (coord: MarsCoordinate) => void;
  method: RouteMethod;
  onSetMethod: (method: RouteMethod) => void;
  walkingSpeedKmh: number;
  onSetWalkingSpeed: (speed: number) => void;
  maxSlopeDeg: number;
  onSetMaxSlope: (slope: number) => void;
  onGenerateRoute: () => void;
  onSwapLocations: () => void;
  onClearRoute: () => void;
  primaryRoute: PlannedRoute | null;
  planningError: string | null;
  isPlanning: boolean;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  startCoord,
  destCoord,
  onSetStart,
  onSetDestination,
  method,
  onSetMethod,
  walkingSpeedKmh,
  onSetWalkingSpeed,
  maxSlopeDeg,
  onSetMaxSlope,
  onGenerateRoute,
  onSwapLocations,
  onClearRoute,
  primaryRoute,
  planningError,
  isPlanning
}) => {
  const [startInput, setStartInput] = useState('');
  const [destInput, setDestInput] = useState('');

  return (
    <div className="space-y-5 text-mars-text">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-mars-orange" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            Astronaut Route Planner
          </h2>
        </div>
        {primaryRoute && (
          <button
            onClick={onClearRoute}
            className="flex items-center gap-1 text-[11px] font-mono text-mars-muted hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Start Location */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-emerald-400 flex items-center justify-between">
          <span>EVA BASE / STARTING POINT (A)</span>
          {startCoord && (
            <span className="text-[11px] text-mars-muted font-normal">
              {formatMarsCoordinate(startCoord, 3)}
            </span>
          )}
        </label>
        <select
          onChange={(e) => {
            const loc = DEMO_LOCATIONS.find((l) => l.id === e.target.value);
            if (loc) onSetStart(loc.coordinates);
          }}
          defaultValue="site-octavia-butler"
          className="w-full bg-mars-surface border border-mars-border rounded-lg px-3 py-2 text-xs font-mono text-mars-text focus:outline-none focus:border-mars-orange"
        >
          <option value="" disabled>Choose Outpost / Base...</option>
          {DEMO_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.coordinates.latitude > 0 ? `${loc.coordinates.latitude}°N` : `${Math.abs(loc.coordinates.latitude)}°S`})
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-1">
        <button
          onClick={onSwapLocations}
          className="p-1.5 rounded-full bg-mars-dark border border-mars-border hover:bg-mars-surface hover:text-mars-orange text-mars-muted transition-colors"
          title="Swap Start and Destination"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Destination Location */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-mars-orange flex items-center justify-between">
          <span>DESTINATION OBJECTIVE (B)</span>
          {destCoord && (
            <span className="text-[11px] text-mars-muted font-normal">
              {formatMarsCoordinate(destCoord, 3)}
            </span>
          )}
        </label>
        <select
          onChange={(e) => {
            const poi = SCIENCE_CATALOG.find((p) => p.id === e.target.value);
            if (poi) onSetDestination(poi.coordinates);
          }}
          defaultValue="poi-jezero-kodiak"
          className="w-full bg-mars-surface border border-mars-border rounded-lg px-3 py-2 text-xs font-mono text-mars-text focus:outline-none focus:border-mars-orange"
        >
          <option value="" disabled>Choose Science Destination...</option>
          {SCIENCE_CATALOG.map((poi) => (
            <option key={poi.id} value={poi.id}>
              {poi.name} ({poi.category.replace('_', ' ')})
            </option>
          ))}
        </select>
      </div>

      {/* Planning Mode Selector */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-mono text-mars-sand font-semibold uppercase">
          Routing Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onSetMethod('terrain-aware')}
            className={`p-2 rounded-lg border text-xs font-mono text-left transition-all ${
              method === 'terrain-aware'
                ? 'bg-mars-orange/20 border-mars-orange text-white font-semibold'
                : 'bg-mars-surface/60 border-mars-border text-mars-muted hover:text-mars-text'
            }`}
          >
            <div className="font-bold text-[11px]">Mode B: Terrain-Aware</div>
            <div className="text-[9px] text-mars-muted mt-0.5">A* cost search</div>
          </button>
          <button
            onClick={() => onSetMethod('historical-rover-reference')}
            className={`p-2 rounded-lg border text-xs font-mono text-left transition-all ${
              method === 'historical-rover-reference'
                ? 'bg-sky-950/80 border-sky-400 text-white font-semibold'
                : 'bg-mars-surface/60 border-mars-border text-mars-muted hover:text-mars-text'
            }`}
          >
            <div className="font-bold text-[11px] text-sky-300">Mode C: Rover Ref</div>
            <div className="text-[9px] text-mars-muted mt-0.5">Curiosity / M2020</div>
          </button>
          <button
            onClick={() => onSetMethod('direct')}
            className={`p-2 rounded-lg border text-xs font-mono text-left transition-all ${
              method === 'direct'
                ? 'bg-mars-orange/20 border-mars-orange text-white font-semibold'
                : 'bg-mars-surface/60 border-mars-border text-mars-muted hover:text-mars-text'
            }`}
          >
            <div className="font-bold text-[11px]">Mode A: Direct</div>
            <div className="text-[9px] text-mars-muted mt-0.5">Spherical baseline</div>
          </button>
        </div>
      </div>

      {/* Parameters: Walking Speed & Max Slope */}
      <div className="space-y-3 p-3 rounded-lg bg-mars-surface/60 border border-mars-border">
        {/* Walking Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-mars-muted">
              <Footprints className="w-3.5 h-3.5 text-mars-orange" /> Assumed Walking Speed:
            </span>
            <span className="text-mars-orange font-bold">{walkingSpeedKmh.toFixed(2)} km/h</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={walkingSpeedKmh}
            onChange={(e) => onSetWalkingSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-mars-darkest rounded-lg appearance-none cursor-pointer accent-mars-orange"
          />
          <div className="flex justify-between text-[10px] font-mono text-mars-muted/80">
            <span>0.2 km/h (Rough)</span>
            <span>0.5 km/h (Nominal EVA)</span>
            <span>1.5 km/h (Fast)</span>
          </div>
        </div>

        {/* Slope Threshold (if terrain-aware) */}
        {method === 'terrain-aware' && (
          <div className="space-y-1.5 pt-2 border-t border-mars-border/50">
            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-mars-muted">
                <Mountain className="w-3.5 h-3.5 text-amber-400" /> Max Traversable Slope:
              </span>
              <span className="text-amber-400 font-bold">{maxSlopeDeg.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={maxSlopeDeg}
              onChange={(e) => onSetMaxSlope(parseFloat(e.target.value))}
              className="w-full h-1 bg-mars-darkest rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-mars-muted/80">
              <span>10° (Conservative)</span>
              <span>20° (NASA Standard)</span>
              <span>25° (Aggressive)</span>
            </div>
          </div>
        )}
      </div>

      {/* Generate Route Action */}
      <button
        onClick={onGenerateRoute}
        disabled={isPlanning}
        className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-mars-rust to-mars-orange hover:from-mars-orange hover:to-mars-orange-bright text-white font-mono font-bold text-xs shadow-lg shadow-mars-orange/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Play className="w-4 h-4 fill-white" />
        {isPlanning ? 'Analyzing Terrain Grid...' : 'Calculate Candidate Route'}
      </button>

      {/* Error notification if routing fails or outside bounds */}
      {planningError && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Navigation Advisory</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-100">{planningError}</p>
        </div>
      )}

      {/* Calculated Route Results */}
      {primaryRoute && (
        <div className="space-y-3 p-3.5 rounded-lg bg-mars-surface border border-mars-orange/50 shadow-lg">
          <div className="flex items-center justify-between border-b border-mars-border/60 pb-2">
            <span className="font-mono text-xs font-bold text-mars-text">
              {primaryRoute.name}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                primaryRoute.method === 'terrain-aware'
                  ? 'bg-mars-orange/20 text-mars-orange border border-mars-orange/40'
                  : 'bg-sky-950 text-sky-300 border border-sky-500/30'
              }`}
            >
              {primaryRoute.method.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-mars-darkest/70 p-2 rounded">
              <span className="text-[10px] text-mars-muted block">TRAVERSE DISTANCE</span>
              <span className="text-sm font-bold text-white">
                {formatDistance(primaryRoute.distanceKm)}
              </span>
            </div>

            <div className="bg-mars-darkest/70 p-2 rounded">
              <span className="text-[10px] text-mars-muted block">ESTIMATED DURATION</span>
              <span className="text-sm font-bold text-mars-sand flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-mars-sand" />
                {formatDuration(primaryRoute.estimatedDurationHours)}
              </span>
            </div>

            {primaryRoute.terrainAssessmentAvailable && (
              <>
                <div className="bg-mars-darkest/70 p-2 rounded">
                  <span className="text-[10px] text-mars-muted block">MAX MAPPED SLOPE</span>
                  <span className="text-sm font-bold text-amber-400">
                    {formatSlope(primaryRoute.maxSlopeDeg)}
                  </span>
                </div>

                <div className="bg-mars-darkest/70 p-2 rounded">
                  <span className="text-[10px] text-mars-muted block">ELEVATION GAIN</span>
                  <span className="text-sm font-bold text-mars-cyan">
                    +{primaryRoute.cumulativeElevationGainMeters} m
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Historical Rover Proximity Badge */}
          {primaryRoute.roverProximity && (
            <div className="p-2.5 rounded bg-sky-950/40 border border-sky-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-sky-300 font-bold text-[11px]">
                <span>HISTORICAL ROVER PROXIMITY</span>
                <span className="text-white bg-sky-900/60 px-1.5 py-0.2 rounded text-[10px]">
                  {primaryRoute.roverProximity.nearestRover}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Separation: <strong className="text-sky-400">{formatDistance(primaryRoute.roverProximity.minDistanceKm)}</strong> from Sol {primaryRoute.roverProximity.closestSol} ({primaryRoute.roverProximity.closestSite})
              </div>
              <div className="text-[10px] text-sky-200/70 font-sans leading-tight pt-1 border-t border-sky-500/20">
                Evidence: Rover traversed this corridor during prior science operations; not an automatic human safety certification.
              </div>
            </div>
          )}

          {/* Scientific Caveats and Limitations */}
          <div className="p-2.5 rounded bg-mars-darkest/90 border border-mars-border/80 text-[10px] font-sans text-mars-muted space-y-1">
            <div className="font-mono font-semibold text-mars-sand flex items-center gap-1">
              <Info className="w-3 h-3 text-mars-orange" /> Scientific Limitations:
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              {primaryRoute.dataLimitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
