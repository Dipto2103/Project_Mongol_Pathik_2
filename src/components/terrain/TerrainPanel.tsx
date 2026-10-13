import React from 'react';
import { Mountain, ShieldCheck, AlertTriangle, Layers, Info, Compass } from 'lucide-react';
import { JEZERO_TERRAIN_GRID } from '../../data/jezeroTerrainData';

export const TerrainPanel: React.FC = () => {
  return (
    <div className="space-y-5 text-mars-text">
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-mars-cyan" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            Terrain Intelligence & DTM
          </h2>
        </div>
      </div>

      {/* Active Grid Overview */}
      <div className="p-3.5 rounded-lg bg-mars-surface border border-mars-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-white">
            {JEZERO_TERRAIN_GRID.name}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            25 × 25 GRID
          </span>
        </div>
        <p className="text-[11px] text-mars-muted leading-relaxed font-sans">
          Calibrated digital terrain model covering the Jezero Crater Western Delta, including the delta front escarpment, Kodiak Butte, and the Seitah sand ripple province.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-mars-border/50">
          <div>
            <span className="text-[10px] text-mars-muted block">SPATIAL RESOLUTION</span>
            <span className="text-white font-bold">{JEZERO_TERRAIN_GRID.resolutionMeters}m / cell</span>
          </div>
          <div>
            <span className="text-[10px] text-mars-muted block">ELEVATION RANGE</span>
            <span className="text-mars-cyan font-bold">-2,570m to -2,380m</span>
          </div>
        </div>
      </div>

      {/* Slope Classification Hierarchy */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-mono font-semibold text-mars-sand uppercase tracking-wide">
          Planetary Slope Classification (ARES Model)
        </h3>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
            <div>
              <div className="font-bold text-emerald-300">Lower Mapped Slope (&lt; 10°)</div>
              <div className="text-[11px] text-mars-muted font-sans mt-0.5">
                Minimal metabolic penalty. Nominal EVA suit locomotion envelope.
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-yellow-950/30 border border-yellow-500/30 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1 shrink-0" />
            <div>
              <div className="font-bold text-yellow-300">Moderate Mapped Slope (10° – 18°)</div>
              <div className="text-[11px] text-mars-muted font-sans mt-0.5">
                Requires caution. Significant increase in crew metabolic rate and O₂ consumption.
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
            <div>
              <div className="font-bold text-amber-300">High Slope (18° – 22°)</div>
              <div className="text-[11px] text-mars-muted font-sans mt-0.5">
                Regolith slippage and footing loss hazard. Penalized in A* routing unless no alternative.
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shrink-0" />
            <div>
              <div className="font-bold text-red-300">Impassable Escarpment (&gt; 22°)</div>
              <div className="text-[11px] text-mars-muted font-sans mt-0.5">
                Exceeded safety envelope. Cells are marked impassable and excluded from crew traversal.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slope Calculation Formula */}
      <div className="p-3.5 rounded-lg bg-mars-darkest border border-mars-border space-y-2 text-xs font-mono">
        <div className="text-mars-sand font-bold text-[11px] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-mars-orange" />
          <span>Elevation Gradient Formulation</span>
        </div>
        <p className="text-mars-muted text-[11px] font-sans leading-relaxed">
          Slope angle θ is numerically solved using bidirectional finite differences over horizontal distance:
        </p>
        <div className="p-2 rounded bg-mars-surface text-center text-mars-text text-[11px] font-mono tracking-widest border border-mars-border/60">
          θ = tan⁻¹( √[ (∂z/∂x)² + (∂z/∂y)² ] )
        </div>
      </div>

      {/* Data Limitation Notice */}
      <div className="p-3 rounded-lg bg-mars-surface/50 border border-mars-border text-[11px] font-sans text-mars-muted space-y-1">
        <span className="font-mono font-bold text-mars-orange block text-[10px]">
          RESOLVED SPATIAL SCALE NOTE:
        </span>
        <p className="leading-relaxed">
          The 350m grid model successfully resolves macroscopic canyon rims and delta scarps, but cannot detect meter-scale boulders, crevices, or loose sandy patches. Astronauts must conduct visual scout assessments during surface ops.
        </p>
      </div>
    </div>
  );
};
