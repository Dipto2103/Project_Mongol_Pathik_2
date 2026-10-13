import React from 'react';
import { Compass, Database, ShieldAlert, BookOpen, Layers, MapPin } from 'lucide-react';
import { DEMO_LOCATIONS } from '../../data/demoLocations';
import type { MarsCoordinate } from '../../types/route';

interface AppHeaderProps {
  currentRegionName: string;
  onSelectPresetLocation: (coord: MarsCoordinate, name: string) => void;
  onOpenDocs: () => void;
  onToggleLayerDrawer: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRegionName,
  onSelectPresetLocation,
  onOpenDocs,
  onToggleLayerDrawer
}) => {
  return (
    <header className="h-14 border-b border-mars-border bg-mars-dark/95 backdrop-blur px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mars-rust to-mars-orange flex items-center justify-center shadow-lg shadow-mars-orange/20 border border-mars-orange/40">
          <Compass className="w-5 h-5 text-white animate-[pulse_4s_infinite]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider text-base text-mars-text">
              ARES <span className="text-mars-orange font-normal">//</span> MARTIAN MAP
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-mars-orange/20 text-mars-orange border border-mars-orange/30">
              NASA SPACE APPS 2026
            </span>
          </div>
          <p className="text-[11px] text-mars-muted hidden sm:block">
            Astronaut Route & Exploration System • Interplanetary Survival Guide
          </p>
        </div>
      </div>

      {/* Central Region & Quick Presets */}
      <div className="hidden lg:flex items-center gap-3 bg-mars-surface/80 border border-mars-border px-3 py-1.5 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-1.5 text-mars-muted">
          <MapPin className="w-3.5 h-3.5 text-mars-orange" />
          <span>REGION:</span>
        </div>
        <span className="text-mars-text font-semibold truncate max-w-[220px]" title={currentRegionName}>
          {currentRegionName}
        </span>
        <span className="text-mars-border">|</span>
        <select
          onChange={(e) => {
            const loc = DEMO_LOCATIONS.find((l) => l.id === e.target.value);
            if (loc) onSelectPresetLocation(loc.coordinates, loc.name);
          }}
          defaultValue=""
          className="bg-transparent text-mars-orange hover:text-mars-orange-bright cursor-pointer focus:outline-none text-xs"
        >
          <option value="" disabled className="bg-mars-dark text-mars-muted">
            Jump to Landmark...
          </option>
          {DEMO_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id} className="bg-mars-dark text-mars-text">
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Telemetry connection status */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-mars-surface border border-mars-border text-[11px] font-mono text-mars-muted">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>NASA TREK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Layer drawer toggle */}
        <button
          onClick={onToggleLayerDrawer}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-mars-surface hover:bg-mars-border text-mars-text text-xs font-mono transition-colors border border-mars-border"
          title="Toggle NASA Map Layers"
        >
          <Layers className="w-3.5 h-3.5 text-mars-orange" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        {/* Documentation / Science limitation modal */}
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-mars-surface hover:bg-mars-border text-mars-text text-xs font-mono transition-colors border border-mars-border"
          title="Scientific Data Sources & Provenance"
        >
          <BookOpen className="w-3.5 h-3.5 text-mars-cyan" />
          <span className="hidden md:inline">Mission Intel</span>
        </button>
      </div>
    </header>
  );
};
