import React, { useState } from 'react';
import { X, BookOpen, Database, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';
import { NASA_DATA_SOURCES } from '../../services/sourceRegistry';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'algorithms' | 'limitations'>(
    'overview'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-mars-dark border border-mars-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-mars-text">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mars-border bg-mars-surface/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-mars-orange" />
            <div>
              <h2 className="text-base font-mono font-bold tracking-wide text-white">
                ARES // MISSION DOCUMENTATION & SCIENTIFIC INTELLIGENCE
              </h2>
              <p className="text-xs text-mars-muted font-sans">
                NASA Space Apps Challenge 2026 • Interplanetary Survival Guide: Martian Map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-mars-muted hover:text-white hover:bg-mars-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-mars-border bg-mars-darkest px-6 gap-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-mars-orange text-white font-bold'
                : 'border-transparent text-mars-muted hover:text-white'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'sources'
                ? 'border-mars-orange text-white font-bold'
                : 'border-transparent text-mars-muted hover:text-white'
            }`}
          >
            NASA Data Sources
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'algorithms'
                ? 'border-mars-orange text-white font-bold'
                : 'border-transparent text-mars-muted hover:text-white'
            }`}
          >
            Scientific Routing
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'limitations'
                ? 'border-red-400 text-red-300 font-bold'
                : 'border-transparent text-mars-muted hover:text-white'
            }`}
          >
            Scientific Limitations
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs leading-relaxed font-sans">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-mars-orange">
                Project Mission & Operational Concept
              </h3>
              <p className="text-slate-300">
                Mars presents a fundamentally distinct environment from Earth. Extravehicular Activity (EVA)
                planning requires moving beyond static 2D maps to a unified decision-support workstation that
                bridges raw planetary science data and human survival constraints.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
                  <div className="font-mono font-bold text-white text-xs">Martian Explorer</div>
                  <p className="text-mars-muted text-[11px]">
                    Interactive planetary canvas backed by real NASA Mars Trek WMTS tile services and Viking MDIM 2.1 color mosaics.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
                  <div className="font-mono font-bold text-white text-xs">Terrain Intelligence</div>
                  <p className="text-mars-muted text-[11px]">
                    Digital elevation models calculating numerical slope gradients θ = tan⁻¹(√[(∂z/∂x)² + (∂z/∂y)²]) to enforce suit stability envelopes.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
                  <div className="font-mono font-bold text-white text-xs">Route Planner (A*)</div>
                  <p className="text-mars-muted text-[11px]">
                    Multi-criteria cost pathfinding that routes astronauts through gentle ramp corridors while avoiding steep scarps and loose sand ripples.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
                  <div className="font-mono font-bold text-white text-xs">Science Explorer</div>
                  <p className="text-mars-muted text-[11px]">
                    Direct integration of NASA PDS astrobiological targets (Jezero Delta, Mount Sharp, Arcadia subsurface ice sheets).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-mars-orange">
                  Identifiable NASA Planetary Datasets Integrated
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  {Object.keys(NASA_DATA_SOURCES).length} Verified Sources
                </span>
              </div>
              <div className="space-y-3">
                {Object.values(NASA_DATA_SOURCES).map((src) => (
                  <div key={src.id} className="p-3.5 rounded-lg bg-mars-surface border border-mars-border space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-mono font-bold text-white text-xs">{src.name}</div>
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mars-orange hover:text-mars-orange-bright flex items-center gap-1 font-mono text-[11px] shrink-0"
                      >
                        NASA Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-mars-muted">
                      <div>Provider: <span className="text-slate-300">{src.provider}</span></div>
                      <div>Type: <span className="text-slate-300">{src.datasetType}</span></div>
                      <div>Resolution: <span className="text-slate-300">{src.spatialResolution}</span></div>
                      <div>CRS: <span className="text-slate-300">{src.coordinateReferenceSystem}</span></div>
                    </div>
                    <div className="text-[11px] text-mars-sand/90 font-mono bg-mars-darkest p-2 rounded mt-1">
                      <strong>Limitation:</strong> {src.knownLimitations[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'algorithms' && (
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-mars-orange">
                Mathematical Formulations & Algorithmic Design
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1.5">
                  <div className="font-mono font-bold text-white text-xs">
                    1. Great-Circle Distance (Mars Haversine Formulation)
                  </div>
                  <p className="text-mars-muted text-[11px]">
                    Calibrated to Mars mean volumetric radius R = 3,389.5 km.
                  </p>
                  <pre className="p-2 rounded bg-mars-darkest text-emerald-300 font-mono text-[10px] overflow-x-auto">
                    a = sin²(Δϕ/2) + cos(ϕ₁)cos(ϕ₂)sin²(Δλ/2)
c = 2·atan2(√a, √(1-a))
d = 3389.5 · c  [km]
                  </pre>
                </div>

                <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1.5">
                  <div className="font-mono font-bold text-white text-xs">
                    2. A* Pathfinding Edge Cost Equation
                  </div>
                  <p className="text-mars-muted text-[11px]">
                    Traversability cost function penalizes slope, roughness, known hazards, and unmeasured data gaps:
                  </p>
                  <pre className="p-2 rounded bg-mars-darkest text-amber-300 font-mono text-[10px] overflow-x-auto">
                    C(e) = wd·D(e) + ws·S(e) + wr·R(e) + wh·H(e) + wu·U(e)
                  </pre>
                  <p className="text-[11px] text-mars-muted">
                    Missing elevation or slope data is NEVER treated as zero hazard; unmapped cells receive an uncertainty penalty wu·U(e) to favor verified survey corridors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <h3>Scientific & Operational Constraints</h3>
              </div>
              <div className="space-y-2.5 text-[11px] text-slate-300">
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                  <strong className="text-red-300 block font-mono">1. Orbital Resolution Limits:</strong>
                  Global orbital datasets cannot resolve hazards smaller than 25-50 cm (e.g. sharp shatter-cones, perched boulders, or micro-crater lips).
                </div>
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                  <strong className="text-red-300 block font-mono">2. Meteorological Localization:</strong>
                  Rover in-situ weather data (Gale or Jezero) reflect local crater microclimates and must not be interpreted as a planetary real-time forecast.
                </div>
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                  <strong className="text-red-300 block font-mono">3. Human Physiology & Suit Dynamics:</strong>
                  Actual Marswalk duration depends on EMU/xEMU suit pressure, metabolic O₂ consumption rates, CO₂ scrubbing margins, and communication line-of-sight.
                </div>
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                  <strong className="text-red-300 block font-mono">4. Prototype Status:</strong>
                  ARES is a research and educational decision-support prototype. It is NOT certified for life-critical flight navigation or autonomous survival decisions.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-mars-border bg-mars-surface/60 flex items-center justify-between text-xs font-mono">
          <span className="text-mars-muted">NASA SPACE APPS CHALLENGE 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-mars-orange hover:bg-mars-orange-bright text-white font-bold transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
