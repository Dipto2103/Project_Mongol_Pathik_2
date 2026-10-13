import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, Search, Crosshair } from 'lucide-react';
import type { MarsCoordinate } from '../../types/route';
import { parseCoordinateInput } from '../../utils/coordinates';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onNavigateCoordinates: (coord: MarsCoordinate) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onNavigateCoordinates
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseCoordinateInput(searchInput);
    if (parsed) {
      setSearchError(false);
      onNavigateCoordinates(parsed);
      setSearchInput('');
    } else {
      setSearchError(true);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 select-none">
      {/* Coordinate Search Box */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-mars-dark/90 backdrop-blur border border-mars-border rounded-lg shadow-xl overflow-hidden max-w-[280px]"
      >
        <div className="pl-3 text-mars-muted">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (searchError) setSearchError(false);
          }}
          placeholder="Coordinates (e.g. 18.4, 77.4)"
          className="w-full bg-transparent text-xs font-mono text-mars-text px-2.5 py-1.5 focus:outline-none placeholder:text-mars-muted/60"
        />
        <button
          type="submit"
          className="px-2.5 py-1.5 bg-mars-surface hover:bg-mars-border text-mars-orange text-xs font-mono transition-colors border-l border-mars-border"
          title="Jump to coordinates"
        >
          Go
        </button>
      </form>

      {searchError && (
        <div className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-1 rounded border border-red-500/30">
          Invalid coordinates. Format: &quot;18.44, 77.45&quot;
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex flex-col bg-mars-dark/90 backdrop-blur border border-mars-border rounded-lg shadow-xl overflow-hidden w-9">
        <button
          onClick={onZoomIn}
          className="p-2 text-mars-text hover:bg-mars-surface hover:text-mars-orange transition-colors flex items-center justify-center border-b border-mars-border"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 text-mars-text hover:bg-mars-surface hover:text-mars-orange transition-colors flex items-center justify-center border-b border-mars-border"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onResetView}
          className="p-2 text-mars-text hover:bg-mars-surface hover:text-mars-cyan transition-colors flex items-center justify-center"
          title="Reset to Jezero Crater"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
