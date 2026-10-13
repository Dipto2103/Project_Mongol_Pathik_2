import React from 'react';
import type { PlannedRoute } from '../../types/route';
import { formatDistance, formatDuration, formatSlope } from '../../utils/formatters';
import { GitCompare, ShieldCheck, AlertTriangle, TrendingUp, Footprints, Info } from 'lucide-react';

interface RouteComparisonProps {
  primaryRoute: PlannedRoute | null;
  alternativeRoute: PlannedRoute | null;
  onActivateRoute?: (route: PlannedRoute) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  primaryRoute,
  alternativeRoute
}) => {
  if (!primaryRoute) {
    return (
      <div className="p-6 text-center text-mars-muted font-mono text-xs space-y-2">
        <GitCompare className="w-8 h-8 text-mars-border mx-auto" />
        <p>No active route computed yet.</p>
        <p className="text-[11px] text-mars-muted/70">
          Calculate a route in the Route Planner to compare direct vs terrain-aware alternatives.
        </p>
      </div>
    );
  }

  const r1 = primaryRoute;
  const r2 = alternativeRoute;

  // Compute trade-offs if both exist
  const distDiff = r2 ? r1.distanceKm - r2.distanceKm : 0;
  const timeDiff = r1.estimatedDurationHours && r2?.estimatedDurationHours
    ? r1.estimatedDurationHours - r2.estimatedDurationHours
    : null;

  return (
    <div className="space-y-5 text-mars-text">
      <div className="flex items-center gap-2 border-b border-mars-border pb-3">
        <GitCompare className="w-4 h-4 text-mars-cyan" />
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
          Route Alternatives & Trade-Offs
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Route 1 Card */}
        <div className="p-3.5 rounded-lg bg-mars-surface border border-mars-orange/60 shadow">
          <div className="flex items-center justify-between border-b border-mars-border/60 pb-2 mb-2.5">
            <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-mars-orange" />
              Candidate 1: {r1.method === 'terrain-aware' ? 'A* Terrain-Aware' : 'Direct Great-Circle'}
            </span>
            <span className="text-[10px] font-mono text-mars-orange bg-mars-orange/15 px-2 py-0.5 rounded font-bold">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-mars-muted block">Distance:</span>
              <span className="font-bold text-white">{formatDistance(r1.distanceKm)}</span>
            </div>
            <div>
              <span className="text-[10px] text-mars-muted block">Duration:</span>
              <span className="font-bold text-mars-sand">{formatDuration(r1.estimatedDurationHours)}</span>
            </div>
            <div>
              <span className="text-[10px] text-mars-muted block">Max Slope:</span>
              <span className="font-bold text-amber-400">{formatSlope(r1.maxSlopeDeg)}</span>
            </div>
            <div>
              <span className="text-[10px] text-mars-muted block">Terrain Model:</span>
              <span className="text-mars-cyan text-[11px]">
                {r1.terrainAssessmentAvailable ? 'High-Res DTM' : 'Unassessed'}
              </span>
            </div>
          </div>
        </div>

        {/* Route 2 Card (if available) */}
        {r2 ? (
          <div className="p-3.5 rounded-lg bg-mars-surface/60 border border-mars-cyan/40">
            <div className="flex items-center justify-between border-b border-mars-border/60 pb-2 mb-2.5">
              <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-mars-cyan" />
                Candidate 2: {r2.method === 'direct' ? 'Direct Great-Circle' : 'A* Terrain-Aware'}
              </span>
              <span className="text-[10px] font-mono text-mars-cyan bg-mars-cyan/15 px-2 py-0.5 rounded font-bold">
                BASELINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-mars-muted block">Distance:</span>
                <span className="font-bold text-white">{formatDistance(r2.distanceKm)}</span>
              </div>
              <div>
                <span className="text-[10px] text-mars-muted block">Duration:</span>
                <span className="font-bold text-mars-sand">{formatDuration(r2.estimatedDurationHours)}</span>
              </div>
              <div>
                <span className="text-[10px] text-mars-muted block">Max Slope:</span>
                <span className="font-bold text-amber-400">{formatSlope(r2.maxSlopeDeg)}</span>
              </div>
              <div>
                <span className="text-[10px] text-mars-muted block">Terrain Model:</span>
                <span className="text-mars-cyan text-[11px]">
                  {r2.terrainAssessmentAvailable ? 'High-Res DTM' : 'Unassessed'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-dashed border-mars-border text-center text-xs font-mono text-mars-muted">
            Alternative comparison route not yet initialized.
          </div>
        )}
      </div>

      {/* Trade-Off Analysis Summary */}
      {r2 && (
        <div className="p-3.5 rounded-lg bg-mars-darkest border border-mars-border space-y-2 text-xs font-sans">
          <div className="flex items-center gap-2 font-mono font-bold text-mars-sand text-xs">
            <TrendingUp className="w-4 h-4 text-mars-orange" />
            <span>Operational Trade-Off Breakdown:</span>
          </div>

          <p className="text-mars-muted text-[11px] leading-relaxed">
            {distDiff > 0 ? (
              <>
                The terrain-aware route is{' '}
                <strong className="text-white">{formatDistance(distDiff)} longer</strong> than the
                direct line — a tactical detour routed around slopes exceeding the{' '}
                {r1.method === 'terrain-aware' ? 'configured' : 'suit-rated'} threshold.
                {timeDiff !== null && timeDiff > 0 && (
                  <> This adds approximately{' '}
                    <strong className="text-mars-sand">{formatDuration(timeDiff)}</strong> to
                    estimated EVA duration.</>
                )}
              </>
            ) : (
              <>
                Both routes record similar distances. The direct connection bypasses digital
                elevation screening — slope data for intermediate segments is unverified.
              </>
            )}
          </p>

          <div className="pt-2 border-t border-mars-border/50 text-[11px] font-mono text-mars-muted space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Recommended: A* Terrain-Aware path respects astronaut suit slope thresholds.</span>
            </div>
          </div>
        </div>
      )}

      {/* Rover Proximity Intelligence */}
      {(r1.roverProximity || r2?.roverProximity) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-[11px] text-sky-400 border-b border-mars-border pb-2">
            <Footprints className="w-3.5 h-3.5" />
            <span>Historical Rover Traverse Proximity</span>
          </div>

          {/* Show proximity for whichever route has the data */}
          {[
            { route: r1, label: 'Candidate 1 (Active)' },
            { route: r2, label: 'Candidate 2 (Baseline)' }
          ]
            .filter(({ route }) => route?.roverProximity)
            .map(({ route, label }) => {
              const prox = route!.roverProximity!;
              const isClose = prox.minDistanceKm < 2.0;
              return (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-mars-surface border border-sky-900/60 space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-mars-muted uppercase">{label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isClose
                          ? 'bg-sky-950 text-sky-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isClose ? '≈ NEAR ROVER PATH' : 'DIVERGES FROM ROVER'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-mars-muted block text-[10px]">Nearest Rover:</span>
                      <span className="text-sky-300 font-bold">{prox.nearestRover}</span>
                    </div>
                    <div>
                      <span className="text-mars-muted block text-[10px]">Min. Distance:</span>
                      <span className={`font-bold ${isClose ? 'text-sky-300' : 'text-white'}`}>
                        {prox.minDistanceKm.toFixed(2)} km
                      </span>
                    </div>
                    <div>
                      <span className="text-mars-muted block text-[10px]">Closest Drive Sol:</span>
                      <span className="text-white">Sol {prox.closestSol}</span>
                    </div>
                    <div>
                      <span className="text-mars-muted block text-[10px]">Closest Site:</span>
                      <span className="text-mars-sand text-[10px] leading-tight">{prox.closestSite}</span>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Astronaut vs Rover Mobility Caveat */}
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2 text-[10px] font-sans text-amber-300/80">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed">
              <strong className="text-amber-300">Rover traverses are reference data, not safety certifications.</strong>{' '}
              Robotic rovers carry different wheel configurations, suspension systems, and drive
              autonomy parameters than suited human astronauts. A rover path may cross terrain that
              exceeds safe EVA slope limits. ARES calculates routes from independent terrain
              data — rover tracks are overlaid for contextual comparison only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
