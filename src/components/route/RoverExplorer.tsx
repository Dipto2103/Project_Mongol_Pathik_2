import React, { useState } from 'react';
import type { MarsCoordinate } from '../../types/route';
import {
  ALL_ROVER_TRAVERSES,
  CURIOSITY_TRAVERSE,
  PERSEVERANCE_TRAVERSE,
  HistoricalRoverTraverse
} from '../../data/roverTraverses';
import { formatMarsCoordinate } from '../../utils/coordinates';
import { formatElevation } from '../../utils/formatters';
import {
  Footprints,
  ExternalLink,
  MapPin,
  Compass,
  AlertTriangle,
  Radio,
  Navigation,
  Globe2,
  Calendar,
  Layers
} from 'lucide-react';

interface RoverExplorerProps {
  onCenterMap: (coord: MarsCoordinate) => void;
  onSetStart?: (coord: MarsCoordinate) => void;
  onSetDestination?: (coord: MarsCoordinate) => void;
}

export const RoverExplorer: React.FC<RoverExplorerProps> = ({
  onCenterMap,
  onSetStart,
  onSetDestination
}) => {
  const [selectedRoverId, setSelectedRoverId] = useState<string>('curiosity-historical');

  const currentTraverse: HistoricalRoverTraverse =
    ALL_ROVER_TRAVERSES.find((r) => r.id === selectedRoverId) || CURIOSITY_TRAVERSE;

  return (
    <div className="space-y-4 text-mars-text">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
            Historical Rover Explorer
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold">
          NASA PDS PLACES
        </span>
      </div>

      {/* Rover Selector Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSelectedRoverId('curiosity-historical')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedRoverId === 'curiosity-historical'
              ? 'bg-sky-950/40 border-sky-500/80 text-white shadow-lg shadow-sky-950/50'
              : 'bg-mars-surface border-mars-border text-mars-muted hover:border-mars-border/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-300">Curiosity</span>
            <span className="text-[9px] font-mono text-mars-muted">MSL</span>
          </div>
          <div className="text-[11px] text-mars-muted mt-0.5">Gale Crater</div>
          <div className="text-[10px] font-mono text-mars-sand mt-1">32.84 km · Sols 0-4120+</div>
        </button>

        <button
          onClick={() => setSelectedRoverId('perseverance-historical')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedRoverId === 'perseverance-historical'
              ? 'bg-sky-950/40 border-sky-500/80 text-white shadow-lg shadow-sky-950/50'
              : 'bg-mars-surface border-mars-border text-mars-muted hover:border-mars-border/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-300">Perseverance</span>
            <span className="text-[9px] font-mono text-mars-muted">Mars 2020</span>
          </div>
          <div className="text-[11px] text-mars-muted mt-0.5">Jezero Crater</div>
          <div className="text-[10px] font-mono text-mars-sand mt-1">27.65 km · Sols 0-1050+</div>
        </button>
      </div>

      {/* NASA Portals & Data Provenance Bar */}
      <div className="p-2.5 rounded-lg bg-mars-surface border border-mars-border space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-mars-muted">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <Globe2 className="w-3.5 h-3.5 text-mars-orange" />
            NASA Mars Exploration Portals
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="https://trek.nasa.gov/mars/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-mars-cyan hover:underline bg-mars-darkest px-2 py-1 rounded border border-mars-border/80"
          >
            <span>NASA Mars Trek</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={currentTraverse.pdsSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:underline bg-mars-darkest px-2 py-1 rounded border border-mars-border/80"
          >
            <span>PDS Archive Source</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          {selectedRoverId === 'curiosity-historical' ? (
            <a
              href="https://science.nasa.gov/mission/msl-curiosity/location-map/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:underline bg-mars-darkest px-2 py-1 rounded border border-mars-border/80"
            >
              <span>Where is Curiosity?</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <a
              href="https://mars.nasa.gov/mars2020/mission/science/traverse-map/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:underline bg-mars-darkest px-2 py-1 rounded border border-mars-border/80"
            >
              <span>Where is Perseverance?</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Mission Metrics Card */}
      <div className="p-3.5 rounded-lg bg-mars-surface border border-mars-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs font-bold text-white">
              {currentTraverse.roverName}
            </div>
            <div className="text-[11px] text-mars-muted">{currentTraverse.landingSiteName}</div>
          </div>
          <button
            onClick={() => onCenterMap(currentTraverse.waypoints[0])}
            className="flex items-center gap-1 text-[11px] font-mono text-mars-cyan hover:text-white bg-mars-darkest px-2.5 py-1.5 rounded border border-mars-border hover:border-mars-cyan transition-colors"
            title="Pan map to rover landing coordinates"
          >
            <Navigation className="w-3 h-3" />
            <span>Center on Site</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2 rounded bg-mars-darkest border border-mars-border/60">
            <div className="text-[9px] text-mars-muted uppercase">Total Odometer</div>
            <div className="text-sm font-bold text-mars-sand mt-0.5">
              {currentTraverse.totalDistanceKm} km
            </div>
          </div>
          <div className="p-2 rounded bg-mars-darkest border border-mars-border/60">
            <div className="text-[9px] text-mars-muted uppercase">Duration</div>
            <div className="text-xs font-bold text-white mt-0.5">{currentTraverse.solRange}</div>
          </div>
          <div className="p-2 rounded bg-mars-darkest border border-mars-border/60">
            <div className="text-[9px] text-mars-muted uppercase">PDS Waypoints</div>
            <div className="text-sm font-bold text-sky-400 mt-0.5">
              {currentTraverse.endpoints.length}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Scientific Caveat Alert Box */}
      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/40 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>NASA Science Traversal Caveat</span>
        </div>
        <p className="text-mars-muted text-[11px] leading-relaxed">
          {currentTraverse.scientificCaveat}
        </p>
        <p className="text-[10px] text-amber-300/80 font-mono leading-normal pt-1 border-t border-amber-500/20">
          Robotic 6-wheel rocker-bogie vehicles travel slowly (avg 0.14 km/h) and cross loose soil or
          steep scarps to access drill targets. Human suited EVA requires stricter slope and slip
          margins. Do NOT assume rover tracks are walk-able corridors.
        </p>
      </div>

      {/* Historical Drive Endpoints List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Key Drive Endpoints & Milestones ({currentTraverse.endpoints.length})
          </span>
          <span className="text-[10px] text-mars-muted">Chronological</span>
        </div>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {currentTraverse.endpoints.map((ep) => (
            <div
              key={`${ep.sol}-${ep.site}`}
              className="p-2.5 rounded-lg bg-mars-surface border border-mars-border/80 hover:border-sky-500/50 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 font-bold text-[10px]">
                      Sol {ep.sol}
                    </span>
                    <span className="font-bold text-white text-[11px]">{ep.site}</span>
                  </div>
                  <div className="text-[10px] font-mono text-mars-muted mt-0.5">
                    {formatMarsCoordinate(ep.coordinate)} ·{' '}
                    <span className="text-mars-sand">{formatElevation(ep.elevationMeters)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onCenterMap(ep.coordinate)}
                    className="p-1 rounded bg-mars-darkest border border-mars-border text-mars-cyan hover:text-white hover:border-mars-cyan transition-colors"
                    title="Center Map on this point"
                  >
                    <Compass className="w-3 h-3" />
                  </button>
                  {onSetStart && (
                    <button
                      onClick={() => onSetStart(ep.coordinate)}
                      className="px-1.5 py-1 rounded bg-mars-darkest border border-mars-border text-[9px] font-mono text-mars-sand hover:text-white hover:border-mars-sand transition-colors"
                      title="Set as Route Start"
                    >
                      Start
                    </button>
                  )}
                  {onSetDestination && (
                    <button
                      onClick={() => onSetDestination(ep.coordinate)}
                      className="px-1.5 py-1 rounded bg-mars-darkest border border-mars-border text-[9px] font-mono text-mars-orange hover:text-white hover:border-mars-orange transition-colors"
                      title="Set as Route Destination"
                    >
                      Dest
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-mars-muted leading-relaxed bg-mars-darkest/60 p-2 rounded border border-mars-border/40 font-sans">
                {ep.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
