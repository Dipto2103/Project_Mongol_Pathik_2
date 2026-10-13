import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-[400] select-none">
      <div className="bg-mars-dark/95 backdrop-blur border border-mars-border rounded-lg shadow-xl overflow-hidden min-w-[210px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-semibold text-mars-text hover:bg-mars-surface transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-mars-orange" />
            <span>CARTOGRAPHIC LEGEND</span>
          </div>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <div className="p-3 border-t border-mars-border space-y-2.5 text-xs font-mono">
            {/* Markers */}
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                A
              </span>
              <span className="text-[11px] text-mars-text">EVA Start / Outpost Base</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-mars-orange border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                B
              </span>
              <span className="text-[11px] text-mars-text">Science Destination Target</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-400 border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                ★
              </span>
              <span className="text-[11px] text-mars-text">NASA Science POI (PDS/CRISM)</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                ▲
              </span>
              <span className="text-[11px] text-mars-text">Mapped Hazard / Cliff Scarp</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                R
              </span>
              <span className="text-[11px] text-mars-text">Historical Rover Drive Endpoint</span>
            </div>

            <div className="pt-2 border-t border-mars-border/50 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-1 bg-mars-orange rounded-full shrink-0" />
                <span className="text-[11px] text-mars-text">A* Terrain-Aware Route</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-0.5 border-t border-dashed border-sky-400 shrink-0" />
                <span className="text-[11px] text-mars-text">Direct Distance (Unverified)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-0.5 border-t border-dashed border-sky-600 shrink-0" />
                <span className="text-[11px] text-mars-text">Historical Rover Traverse</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
