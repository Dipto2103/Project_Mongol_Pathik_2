import React, { useState } from 'react';
import { ARCHIVED_WEATHER_RECORDS } from '../../services/nasaWeather';
import { SourceBadge } from '../common/SourceBadge';
import {
  CloudSun,
  Thermometer,
  Gauge,
  Wind,
  Compass,
  AlertTriangle,
  Info,
  Calendar,
  Sun
} from 'lucide-react';

export const EnvironmentPanel: React.FC = () => {
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(1); // default Perseverance (Jezero)
  const currentRecord = ARCHIVED_WEATHER_RECORDS[selectedSiteIndex];

  return (
    <div className="space-y-5 text-mars-text">
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-mars-orange" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            Planetary Environment Telemetry
          </h2>
        </div>
      </div>

      {/* Observation Site Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-mars-muted uppercase">
          Select Observation Station
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {ARCHIVED_WEATHER_RECORDS.map((rec, idx) => (
            <button
              key={rec.mission}
              onClick={() => setSelectedSiteIndex(idx)}
              className={`p-2 rounded-lg border text-left font-mono transition-all ${
                selectedSiteIndex === idx
                  ? 'bg-mars-surface border-mars-orange text-white shadow-md'
                  : 'bg-mars-surface/50 border-mars-border text-mars-muted hover:text-white'
              }`}
            >
              <div className="text-xs font-bold truncate">{rec.mission.split(' ')[0]}</div>
              <div className="text-[10px] text-mars-muted/80 truncate">
                Sol {rec.sol}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Provenance Badge */}
      <div>
        <SourceBadge
          status={currentRecord.provenance}
          sourceName={`${currentRecord.mission} Telemetry`}
          sourceUrl={currentRecord.sourceUrl}
        />
      </div>

      {/* Environmental Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        {/* Air Temperature */}
        <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
          <div className="flex items-center gap-1.5 text-mars-muted text-[10px]">
            <Thermometer className="w-3.5 h-3.5 text-sky-400" />
            <span>SURFACE AIR TEMP</span>
          </div>
          <div className="text-base font-bold text-white">
            {currentRecord.avgTempCelsius !== null ? `${currentRecord.avgTempCelsius}°C` : 'N/A'}
          </div>
          <div className="text-[10px] text-mars-muted flex justify-between pt-1 border-t border-mars-border/50">
            <span>Min: {currentRecord.minTempCelsius}°C</span>
            <span>Max: {currentRecord.maxTempCelsius}°C</span>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
          <div className="flex items-center gap-1.5 text-mars-muted text-[10px]">
            <Gauge className="w-3.5 h-3.5 text-mars-cyan" />
            <span>SURFACE PRESSURE</span>
          </div>
          <div className="text-base font-bold text-mars-cyan">
            {currentRecord.pressurePascals !== null ? `${currentRecord.pressurePascals} Pa` : 'N/A'}
          </div>
          <div className="text-[10px] text-mars-muted pt-1 border-t border-mars-border/50">
            ~{(currentRecord.pressurePascals ? currentRecord.pressurePascals / 100 : 6.1).toFixed(1)} mbar (Earth: ~1013)
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
          <div className="flex items-center gap-1.5 text-mars-muted text-[10px]">
            <Wind className="w-3.5 h-3.5 text-mars-sand" />
            <span>WIND VELOCITY</span>
          </div>
          <div className="text-base font-bold text-mars-sand">
            {currentRecord.windSpeedMps !== null ? `${currentRecord.windSpeedMps} m/s` : 'N/A'}
          </div>
          <div className="text-[10px] text-mars-muted pt-1 border-t border-mars-border/50">
            Dir: {currentRecord.windDirectionCompass || `${currentRecord.windDirectionDegrees}°`}
          </div>
        </div>

        {/* Solar Longitude / Season */}
        <div className="p-3 rounded-lg bg-mars-surface border border-mars-border space-y-1">
          <div className="flex items-center gap-1.5 text-mars-muted text-[10px]">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>SEASON (SOLAR Ls)</span>
          </div>
          <div className="text-base font-bold text-amber-300">
            {currentRecord.seasonLs}° Ls
          </div>
          <div className="text-[10px] text-mars-muted pt-1 border-t border-mars-border/50 truncate">
            {currentRecord.uvIndex || 'High Solar Radiation'}
          </div>
        </div>
      </div>

      {/* Observation Metadata Details */}
      <div className="p-3 rounded-lg bg-mars-darkest border border-mars-border space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-mars-muted">
          <span>Observation Site:</span>
          <span className="text-white font-bold">{currentRecord.observationSite}</span>
        </div>
        <div className="flex items-center justify-between text-mars-muted">
          <span>Martian Sol:</span>
          <span className="text-mars-orange">Sol {currentRecord.sol}</span>
        </div>
        <div className="flex items-center justify-between text-mars-muted">
          <span>Terrestrial Date:</span>
          <span className="text-slate-300">{currentRecord.terrestrialDate}</span>
        </div>
        <div className="flex items-center justify-between text-mars-muted">
          <span>Coordinates:</span>
          <span className="text-slate-300">
            {currentRecord.coordinates.latitude > 0
              ? `${currentRecord.coordinates.latitude}°N`
              : `${Math.abs(currentRecord.coordinates.latitude)}°S`}, {currentRecord.coordinates.longitude}°E
          </span>
        </div>
      </div>

      {/* Spatial Relevance Warning */}
      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] font-sans text-mars-muted space-y-1.5">
        <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Spatial & Temporal Scientific Limitation</span>
        </div>
        <p className="leading-relaxed">
          {currentRecord.spatialRelevanceNote}
        </p>
        <p className="leading-relaxed text-amber-200/80 font-mono text-[10px]">
          Notice: In-situ rover observations do not constitute a live global weather forecast across other Martian regions.
        </p>
      </div>
    </div>
  );
};
