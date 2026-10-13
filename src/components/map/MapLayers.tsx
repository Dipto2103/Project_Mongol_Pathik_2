import React from 'react';
import type { MarsMapLayer } from '../../types/map';
import { Layers, CheckCircle2, AlertCircle, Eye, EyeOff, Sliders } from 'lucide-react';

interface MapLayersProps {
  layers: MarsMapLayer[];
  onToggleLayer: (layerId: string) => void;
  onSetOpacity: (layerId: string, opacity: number) => void;
  onClose?: () => void;
}

export const MapLayers: React.FC<MapLayersProps> = ({
  layers,
  onToggleLayer,
  onSetOpacity,
  onClose
}) => {
  const baseLayers = layers.filter((l) => l.category === 'base');
  const overlayLayers = layers.filter((l) => l.category !== 'base');

  return (
    <div className="space-y-6 text-mars-text">
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-mars-orange" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            NASA Planetary Cartography
          </h2>
        </div>
      </div>

      {/* Base Maps Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-semibold text-mars-sand uppercase tracking-wide">
          Primary Base Surface
        </h3>
        <div className="space-y-2">
          {baseLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                layer.active
                  ? 'bg-mars-surface border-mars-orange/60 shadow-md shadow-mars-orange/10'
                  : 'bg-mars-dark/60 border-mars-border hover:border-mars-muted'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{layer.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        layer.status === 'OPERATIONAL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {layer.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-mars-muted mt-1 leading-relaxed">
                    {layer.description}
                  </p>
                </div>
                <div className="pt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      layer.active
                        ? 'border-mars-orange bg-mars-orange text-white'
                        : 'border-mars-muted'
                    }`}
                  >
                    {layer.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-mars-border/50 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-mars-muted">
                <div>Provider: <span className="text-slate-300">{layer.provider}</span></div>
                <div>Res: <span className="text-slate-300">{layer.spatialResolution}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Overlays */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-semibold text-mars-sand uppercase tracking-wide">
          Scientific Topographic Overlays
        </h3>
        <div className="space-y-2">
          {overlayLayers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 rounded-lg border transition-all ${
                layer.active
                  ? 'bg-mars-surface border-mars-cyan/60'
                  : 'bg-mars-dark/60 border-mars-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{layer.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        layer.status === 'OPERATIONAL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {layer.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-mars-muted mt-1 leading-relaxed">
                    {layer.description}
                  </p>
                </div>

                <button
                  onClick={() => onToggleLayer(layer.id)}
                  className={`p-1.5 rounded transition-colors ${
                    layer.active
                      ? 'bg-mars-cyan/20 text-mars-cyan border border-mars-cyan/40'
                      : 'text-mars-muted hover:text-white bg-mars-darkest'
                  }`}
                  title={layer.active ? 'Hide Overlay' : 'Show Overlay'}
                >
                  {layer.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Opacity slider if active */}
              {layer.active && (
                <div className="mt-3 pt-2 border-t border-mars-border/50 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-mars-muted">OPACITY:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => onSetOpacity(layer.id, parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-mars-darkest rounded-lg appearance-none cursor-pointer accent-mars-cyan"
                  />
                  <span className="text-[10px] font-mono text-mars-cyan w-8 text-right">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
              )}

              <div className="mt-2 text-[10px] font-mono text-mars-muted">
                Limitation: {layer.limitations[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
