import React from 'react';
import type { PlannedRoute } from '../../types/route';
import type { RouteHazardAssessment } from '../../algorithms/hazardAssessment';
import type { ScienceObservation } from '../../types/science';
import { formatMarsCoordinate } from '../../utils/coordinates';
import { formatDistance, formatDuration, formatSlope, formatElevation } from '../../utils/formatters';
import {
  FileText,
  Printer,
  Download,
  ShieldAlert,
  AlertTriangle,
  Compass,
  Mountain,
  CheckCircle2,
  ExternalLink,
  Footprints
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface MissionSummaryProps {
  route: PlannedRoute | null;
  hazardAssessment: RouteHazardAssessment | null;
  nearbyScienceTargets: ScienceObservation[];
}

export const MissionSummary: React.FC<MissionSummaryProps> = ({
  route,
  hazardAssessment,
  nearbyScienceTargets
}) => {
  if (!route) {
    return (
      <div className="p-8 text-center text-mars-muted font-mono text-xs space-y-2">
        <FileText className="w-10 h-10 text-mars-border mx-auto" />
        <p>No mission plan compiled.</p>
        <p className="text-[11px] text-mars-muted/70">
          Compute a candidate route in the Route Planner to compile the official ARES Mission Briefing.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      aresMissionBriefingVersion: '2026.1',
      generatedAt: new Date().toISOString(),
      routeOverview: {
        id: route.id,
        name: route.name,
        method: route.method,
        startCoordinate: route.start,
        destinationCoordinate: route.destination,
        distanceKm: route.distanceKm,
        estimatedDurationHours: route.estimatedDurationHours,
        maxSlopeDeg: route.maxSlopeDeg,
        averageSlopeDeg: route.averageSlopeDeg,
        cumulativeElevationGainMeters: route.cumulativeElevationGainMeters
      },
      hazardAssessment: {
        overallRiskLevel: hazardAssessment?.overallRiskLevel,
        detectedHazards: hazardAssessment?.detectedHazards.map((d) => ({
          name: d.hazard.name,
          category: d.hazard.category,
          severity: d.hazard.severity,
          closestDistanceKm: d.closestDistanceKm,
          recommendation: d.hazard.operationalRecommendation
        })),
        actionableRecommendations: hazardAssessment?.recommendations
      },
      nearbyScienceObjectives: nearbyScienceTargets.map((s) => ({
        name: s.name,
        category: s.category,
        mission: s.mission,
        coordinates: s.coordinates
      })),
      roverProximityContext: route.roverProximity
        ? {
            nearestRover: route.roverProximity.nearestRover,
            minDistanceKm: route.roverProximity.minDistanceKm,
            closestSol: route.roverProximity.closestSol,
            closestSite: route.roverProximity.closestSite,
            mobilityCaveat:
              'Historical rover paths are robotic reference data only. Not verified human astronaut EVA corridors.'
          }
        : null,
      disclaimer:
        'ARES Research Prototype — Output is an educational and mission-planning simulation. Not certified for operational astronaut survival or life-critical navigation decisions.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARES_Mission_Briefing_${route.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-mars-text print:p-6 print:bg-white print:text-black">
      {/* Title & Actions */}
      <div className="flex items-center justify-between border-b border-mars-border pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-mars-orange" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
            Operational Mission Briefing
          </h2>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-mars-sand bg-mars-surface hover:bg-mars-border rounded border border-mars-border transition-colors"
            title="Export JSON Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-mars-text bg-mars-surface hover:bg-mars-border rounded border border-mars-border transition-colors"
            title="Print Mission Briefing"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Primary Route Synopsis */}
      <div className="p-4 rounded-lg bg-mars-surface border border-mars-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            MISSION TRAVERSE SPECIFICATION
          </span>
          <span className="font-mono text-[10px] text-mars-orange bg-mars-orange/15 px-2 py-0.5 rounded font-bold border border-mars-orange/30">
            METHOD: {route.method.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
          <div className="bg-mars-darkest p-2.5 rounded">
            <span className="text-[10px] text-mars-muted block">TRAVERSE DISTANCE</span>
            <span className="text-base font-bold text-white">{formatDistance(route.distanceKm)}</span>
          </div>
          <div className="bg-mars-darkest p-2.5 rounded">
            <span className="text-[10px] text-mars-muted block">ESTIMATED DURATION</span>
            <span className="text-base font-bold text-mars-sand">
              {formatDuration(route.estimatedDurationHours)}
            </span>
          </div>
          <div className="bg-mars-darkest p-2.5 rounded">
            <span className="text-[10px] text-mars-muted block">MAX MAPPED SLOPE</span>
            <span className="text-base font-bold text-amber-400">
              {formatSlope(route.maxSlopeDeg)}
            </span>
          </div>
          <div className="bg-mars-darkest p-2.5 rounded">
            <span className="text-[10px] text-mars-muted block">ELEVATION GAIN</span>
            <span className="text-base font-bold text-mars-cyan">
              +{route.cumulativeElevationGainMeters ?? 0} m
            </span>
          </div>
        </div>

        <div className="text-xs font-mono pt-2 border-t border-mars-border/50 grid grid-cols-1 sm:grid-cols-2 gap-2 text-mars-muted">
          <div>
            <strong className="text-emerald-400">START (Base):</strong>{' '}
            {formatMarsCoordinate(route.start, 4)}
          </div>
          <div>
            <strong className="text-mars-orange">DESTINATION (Target):</strong>{' '}
            {formatMarsCoordinate(route.destination, 4)}
          </div>
        </div>
      </div>

      {/* Elevation Profile Chart (if available) */}
      {route.elevationProfile && route.elevationProfile.length > 1 && (
        <div className="p-4 rounded-lg bg-mars-surface border border-mars-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-mars-cyan" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                Route Elevation Profile (Areoid Datum)
              </span>
            </div>
            <span className="text-[10px] font-mono text-mars-muted">Unit: Meters</span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={route.elevationProfile} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aresElevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6738" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff6738" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3846" />
                <XAxis
                  dataKey="distanceKm"
                  stroke="#8e9aa8"
                  fontSize={10}
                  tickFormatter={(v) => `${v}k`}
                />
                <YAxis stroke="#8e9aa8" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14171d',
                    borderColor: '#2e3846',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(val: number) => [`${val} m`, 'Elevation']}
                  labelFormatter={(lbl: number) => `Distance: ${lbl} km`}
                />
                <Area
                  type="monotone"
                  dataKey="elevationMeters"
                  stroke="#ff6738"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#aresElevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Actionable Recommendations & Hazard Warnings */}
      {hazardAssessment && (
        <div className="p-4 rounded-lg bg-mars-surface border border-mars-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                Survival Recommendations & Mitigations
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                hazardAssessment.overallRiskLevel === 'LOW'
                  ? 'bg-emerald-950 text-emerald-300'
                  : hazardAssessment.overallRiskLevel === 'ELEVATED'
                  ? 'bg-amber-950 text-amber-300'
                  : hazardAssessment.overallRiskLevel === 'HIGH' || hazardAssessment.overallRiskLevel === 'CRITICAL'
                  ? 'bg-red-950 text-red-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              RISK: {hazardAssessment.overallRiskLevel}
            </span>
          </div>

          <div className="space-y-2">
            {hazardAssessment.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-2.5 rounded bg-mars-darkest border border-mars-border/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-300">{rec.title}</span>
                  <span className="text-[10px] font-mono text-mars-muted uppercase">
                    Confidence: {rec.confidence}
                  </span>
                </div>
                <p className="text-mars-muted text-[11px] leading-relaxed">{rec.explanation}</p>
                <div className="text-[11px] text-mars-sand font-mono bg-mars-surface/70 px-2 py-1 rounded mt-1">
                  <strong>Action:</strong> {rec.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Scientific Destinations */}
      {nearbyScienceTargets.length > 0 && (
        <div className="p-4 rounded-lg bg-mars-surface border border-mars-border space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-mars-cyan" />
            <span className="font-mono text-xs font-bold text-white uppercase">
              Scientific Objectives En Route ({nearbyScienceTargets.length})
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            {nearbyScienceTargets.map((sci) => (
              <div
                key={sci.id}
                className="p-2 rounded bg-mars-darkest text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-mars-cyan">{sci.name}</span>
                  <span className="text-mars-muted ml-2 text-[11px]">[{sci.mission}]</span>
                </div>
                <span className="text-mars-sand text-[11px]">{formatElevation(sci.elevationMeters)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Rover Traverse Context */}
      {route.roverProximity && (
        <div className="p-4 rounded-lg bg-mars-surface border border-mars-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                Historical Rover Traverse Context
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                route.roverProximity.minDistanceKm <= 1.0
                  ? 'bg-sky-950 text-sky-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {route.roverProximity.minDistanceKm <= 1.0
                ? '≈ NEAR ROVER PATH'
                : 'DIVERGES FROM ROVER'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-mars-darkest border border-mars-border/70">
              <div className="text-[10px] text-mars-muted uppercase">Nearest Rover</div>
              <div className="text-white font-bold text-sm mt-0.5">
                {route.roverProximity.nearestRover}
              </div>
              <div className="text-[10px] text-mars-muted mt-0.5 truncate">
                Site: {route.roverProximity.closestSite}
              </div>
            </div>
            <div className="p-2.5 rounded bg-mars-darkest border border-mars-border/70">
              <div className="text-[10px] text-mars-muted uppercase">Closest Approach</div>
              <div className="text-sky-400 font-bold text-sm mt-0.5">
                {route.roverProximity.minDistanceKm.toFixed(2)} km
              </div>
              <div className="text-[10px] text-mars-muted mt-0.5">
                Recorded at Sol {route.roverProximity.closestSol}
              </div>
            </div>
          </div>

          {/* Operational Mobility Caveat */}
          <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] text-mars-muted space-y-1">
            <div className="font-mono font-bold text-amber-400 text-[10px] uppercase flex items-center gap-1.5">
              <span>Astronaut vs Rover Mobility Distinction</span>
            </div>
            <p className="leading-relaxed">
              Historical rover paths (Curiosity / Perseverance) reflect robotic 6-wheel rocker-bogie capabilities and scientific investigation waypoints. They are NOT certified as safe or walk-able paths for suited human EVA exploration. Terrain slope and obstacles must be independently evaluated.
            </p>
          </div>
        </div>
      )}

      {/* Scientific Limitation & Certification Disclaimer */}
      <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/30 text-[11px] font-sans text-mars-muted space-y-1.5">
        <div className="flex items-center gap-2 font-mono font-bold text-red-400">
          <ShieldAlert className="w-4 h-4" />
          <span>NASA Challenge Operational Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          ARES is a research and educational decision-support prototype developed for the NASA Space Apps Challenge 2026.
          Orbital elevation models and planetary mosaics cannot resolve micro-scale regolith fractures, sharp ventifacts, or rapid meteorological shifts.
          Traverse plans are advisory candidate paths and are NOT certified astronaut navigation directives.
        </p>
      </div>
    </div>
  );
};
