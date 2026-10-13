import React from 'react';
import type { MarsCoordinate } from '../../types/route';
import { formatMarsCoordinate, toEastPositiveLongitude } from '../../utils/coordinates';
import { formatElevation } from '../../utils/formatters';
import { Globe, Crosshair, Database, ShieldCheck } from 'lucide-react';

interface StatusBarProps {
  cursorCoord: MarsCoordinate | null;
  selectedCoord: MarsCoordinate | null;
  selectedElevation?: number;
  activeBaseLayerName: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  cursorCoord,
  selectedCoord,
  selectedElevation,
  activeBaseLayerName
}) => {
  const displayCoord = cursorCoord || selectedCoord || { latitude: 18.4447, longitude: 77.4508 };
  const eastLon = toEastPositiveLongitude(displayCoord.longitude);

  return (
    <footer className="h-8 bg-mars-darkest border-t border-mars-border px-3 flex items-center justify-between text-[11px] font-mono text-mars-muted shrink-0 z-20 select-none">
      {/* Coordinates readout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-mars-text">
          <Crosshair className="w-3.5 h-3.5 text-mars-orange" />
          <span>COORD:</span>
          <span className="text-mars-orange-bright font-medium">
            {formatMarsCoordinate(displayCoord, 4)}
          </span>
          <span className="text-mars-border hidden sm:inline">|</span>
          <span className="text-mars-sand hidden sm:inline">
            {eastLon}°E AREOCENTRIC
          </span>
        </div>

        {selectedElevation !== undefined && (
          <div className="hidden md:flex items-center gap-1">
            <span>ELEV:</span>
            <span className="text-mars-cyan font-semibold">
              {formatElevation(selectedElevation)}
            </span>
          </div>
        )}
      </div>

      {/* Attribution & Status */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 truncate max-w-[280px]">
          <Database className="w-3 h-3 text-mars-muted" />
          <span className="truncate">DATA: {activeBaseLayerName}</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
          <ShieldCheck className="w-3 h-3" />
          <span>ARES OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
};
