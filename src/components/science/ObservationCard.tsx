import React from 'react';
import type { ScienceObservation } from '../../types/science';
import type { MarsCoordinate } from '../../types/route';
import { formatMarsCoordinate } from '../../utils/coordinates';
import { formatElevation } from '../../utils/formatters';
import { Compass, ExternalLink, MapPin, Target, Sparkles } from 'lucide-react';

interface ObservationCardProps {
  poi: ScienceObservation;
  onCenterMap: (coord: MarsCoordinate) => void;
  onConsiderForRoute: (coord: MarsCoordinate) => void;
  isSelected?: boolean;
}

export const ObservationCard: React.FC<ObservationCardProps> = ({
  poi,
  onCenterMap,
  onConsiderForRoute,
  isSelected
}) => {
  return (
    <div
      className={`p-3.5 rounded-lg border transition-all text-xs ${
        isSelected
          ? 'bg-mars-surface border-mars-cyan shadow-lg shadow-mars-cyan/10'
          : 'bg-mars-surface/60 border-mars-border hover:border-mars-muted'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-white text-xs">
            <Compass className="w-4 h-4 text-mars-cyan shrink-0" />
            <span>{poi.name}</span>
          </div>
          <span className="text-[10px] font-mono text-mars-sand uppercase px-1.5 py-0.2 rounded bg-mars-darkest mt-1 inline-block">
            {poi.category.replace('_', ' ')}
          </span>
        </div>
      </div>

      <p className="text-mars-muted text-[11px] mt-2 leading-relaxed font-sans">
        {poi.description}
      </p>

      {/* Astrobiological / Geological relevance */}
      <div className="mt-2.5 p-2 rounded bg-mars-darkest/90 border border-mars-border/50 text-[11px] font-sans text-slate-300">
        <div className="font-mono text-[10px] font-semibold text-mars-cyan flex items-center gap-1 mb-0.5">
          <Sparkles className="w-3 h-3" /> SCIENTIFIC RELEVANCE:
        </div>
        {poi.scientificRelevance}
      </div>

      {/* Metadata */}
      <div className="mt-2.5 pt-2 border-t border-mars-border/50 grid grid-cols-2 gap-1 text-[10px] font-mono text-mars-muted">
        <div>Mission: <span className="text-slate-200">{poi.mission}</span></div>
        <div>Elevation: <span className="text-mars-cyan">{formatElevation(poi.elevationMeters)}</span></div>
        <div>Coords: <span className="text-slate-200">{formatMarsCoordinate(poi.coordinates, 2)}</span></div>
        <div>
          Source:{' '}
          <a
            href={poi.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mars-orange hover:underline inline-flex items-center gap-0.5"
          >
            NASA Record <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 pt-2 border-t border-mars-border/50">
        <button
          onClick={() => onCenterMap(poi.coordinates)}
          className="flex-1 py-1.5 px-2 rounded bg-mars-darkest hover:bg-mars-border text-slate-300 text-[11px] font-mono transition-colors flex items-center justify-center gap-1"
        >
          <MapPin className="w-3 h-3 text-mars-orange" />
          View on Map
        </button>
        <button
          onClick={() => onConsiderForRoute(poi.coordinates)}
          className="flex-1 py-1.5 px-2 rounded bg-mars-orange/20 hover:bg-mars-orange/40 text-mars-orange border border-mars-orange/30 text-[11px] font-mono font-bold transition-colors flex items-center justify-center gap-1"
        >
          <Target className="w-3 h-3" />
          Set Destination
        </button>
      </div>
    </div>
  );
};
