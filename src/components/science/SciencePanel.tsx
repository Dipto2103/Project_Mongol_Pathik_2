import React, { useState } from 'react';
import type { ScienceObservation, ScienceCategory } from '../../types/science';
import type { MarsCoordinate } from '../../types/route';
import { SCIENCE_CATALOG } from '../../data/scienceCatalog';
import { ObservationCard } from './ObservationCard';
import { Compass, Search, Filter } from 'lucide-react';

interface SciencePanelProps {
  onCenterMap: (coord: MarsCoordinate) => void;
  onConsiderForRoute: (coord: MarsCoordinate) => void;
}

export const SciencePanel: React.FC<SciencePanelProps> = ({
  onCenterMap,
  onConsiderForRoute
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ScienceCategory | 'ALL'>('ALL');

  const categories: { id: ScienceCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Targets' },
    { id: 'ancient_delta', label: 'River Deltas' },
    { id: 'crater', label: 'Craters' },
    { id: 'volcano', label: 'Volcanoes' },
    { id: 'chasma', label: 'Canyons' },
    { id: 'ice_deposit', label: 'Glacial Ice' }
  ];

  const filteredPOIs = SCIENCE_CATALOG.filter((poi) => {
    const matchesCategory = selectedCategory === 'ALL' || poi.category === selectedCategory;
    const matchesSearch =
      poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.mission.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 text-mars-text">
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-mars-cyan" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            NASA Science Explorer
          </h2>
        </div>
        <span className="text-[11px] font-mono text-mars-muted">
          {filteredPOIs.length} Objectives
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-mars-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name, mission, minerals..."
          className="w-full bg-mars-surface border border-mars-border rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-mars-text placeholder:text-mars-muted/60 focus:outline-none focus:border-mars-cyan"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              selectedCategory === c.id
                ? 'bg-mars-cyan/20 text-mars-cyan border border-mars-cyan/40 font-semibold'
                : 'bg-mars-surface/60 text-mars-muted hover:text-white border border-mars-border'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Targets List */}
      <div className="space-y-3 pt-1">
        {filteredPOIs.map((poi) => (
          <ObservationCard
            key={poi.id}
            poi={poi}
            onCenterMap={onCenterMap}
            onConsiderForRoute={onConsiderForRoute}
          />
        ))}
        {filteredPOIs.length === 0 && (
          <div className="p-6 text-center text-xs font-mono text-mars-muted">
            No scientific targets match the filter query.
          </div>
        )}
      </div>
    </div>
  );
};
