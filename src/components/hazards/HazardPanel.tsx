import React, { useState } from 'react';
import type { HazardRecord, HazardCategory } from '../../types/hazards';
import type { MarsCoordinate } from '../../types/route';
import { HAZARDS_CATALOG } from '../../data/hazardsCatalog';
import { formatMarsCoordinate } from '../../utils/coordinates';
import {
  AlertTriangle,
  Mountain,
  Wind,
  HelpCircle,
  ShieldAlert,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface HazardPanelProps {
  onCenterMap: (coord: MarsCoordinate) => void;
  selectedHazard?: HazardRecord | null;
}

export const HazardPanel: React.FC<HazardPanelProps> = ({
  onCenterMap,
  selectedHazard
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HazardCategory | 'ALL'>('ALL');

  const categories: { id: HazardCategory | 'ALL'; label: string; icon: typeof AlertTriangle }[] = [
    { id: 'ALL', label: 'All Hazards', icon: AlertTriangle },
    { id: 'steep_terrain', label: 'Steep Slopes', icon: Mountain },
    { id: 'surface_roughness', label: 'Sand / Dunes', icon: Wind },
    { id: 'unknown_terrain', label: 'Data Gaps', icon: HelpCircle }
  ];

  const filtered = HAZARDS_CATALOG.filter(
    (h) => selectedCategory === 'ALL' || h.category === selectedCategory
  );

  return (
    <div className="space-y-4 text-mars-text">
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            Hazard Intelligence
          </h2>
        </div>
        <span className="text-[11px] font-mono text-mars-muted">
          {filtered.length} Monitored Zones
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                selectedCategory === c.id
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-mars-surface/60 text-mars-muted hover:text-white border border-mars-border'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hazard Cards List */}
      <div className="space-y-3 pt-1">
        {filtered.map((hazard) => {
          const isHighlighted = selectedHazard?.id === hazard.id;
          const severityBadgeColor =
            hazard.severity === 'critical'
              ? 'bg-red-950 text-red-300 border-red-500/40'
              : hazard.severity === 'high'
              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
              : hazard.severity === 'moderate'
              ? 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-600';

          return (
            <div
              key={hazard.id}
              className={`p-3.5 rounded-lg border transition-all text-xs ${
                isHighlighted
                  ? 'bg-mars-surface border-amber-400 shadow-lg'
                  : 'bg-mars-surface/60 border-mars-border hover:border-mars-muted'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{hazard.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${severityBadgeColor}`}
                    >
                      {hazard.severity}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-mars-muted mt-0.5 block">
                    Dataset: {hazard.datasetName}
                  </span>
                </div>
              </div>

              <p className="text-mars-muted text-[11px] mt-2 leading-relaxed">
                {hazard.description}
              </p>

              {/* Mitigation Guidance */}
              <div className="mt-2.5 p-2 rounded bg-mars-darkest border border-mars-border text-[11px] font-sans">
                <span className="font-mono text-amber-300 font-semibold block mb-0.5 text-[10px]">
                  OPERATIONAL MITIGATION:
                </span>
                <span className="text-mars-sand">{hazard.operationalRecommendation}</span>
              </div>

              {/* Technical Attributes */}
              <div className="mt-2.5 pt-2 border-t border-mars-border/50 grid grid-cols-2 gap-1 text-[10px] font-mono text-mars-muted">
                {hazard.slopeAngleDeg && (
                  <div>
                    Slope: <span className="text-amber-400 font-semibold">{hazard.slopeAngleDeg}°</span>
                  </div>
                )}
                {hazard.radiusKm && (
                  <div>
                    Footprint: <span className="text-slate-300">{hazard.radiusKm} km radius</span>
                  </div>
                )}
                <div>Coords: <span className="text-slate-300">{formatMarsCoordinate(hazard.location, 2)}</span></div>
                <div>Confidence: <span className="text-slate-300 uppercase">{hazard.confidence}</span></div>
              </div>

              {/* Action */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-mars-border/50">
                <a
                  href={hazard.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-mars-orange hover:underline flex items-center gap-1"
                >
                  NASA Archive <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <button
                  onClick={() => onCenterMap(hazard.location)}
                  className="px-2.5 py-1 rounded bg-mars-darkest hover:bg-mars-border text-slate-200 text-[11px] font-mono transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-mars-orange" />
                  Center on Map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
