import React from 'react';
import type { ProvenanceStatus } from '../../types/weather';
import { ExternalLink, Database, AlertCircle, CheckCircle2, History } from 'lucide-react';

interface SourceBadgeProps {
  status?: ProvenanceStatus;
  sourceName: string;
  sourceUrl?: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  status = 'HISTORICAL',
  sourceName,
  sourceUrl,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'LIVE':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400 animate-pulse',
          label: 'LIVE TELEMETRY',
          icon: CheckCircle2
        };
      case 'CACHED':
        return {
          bg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          dot: 'bg-blue-400',
          label: 'CACHED',
          icon: Database
        };
      case 'HISTORICAL':
        return {
          bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          label: 'ARCHIVED / PDS',
          icon: History
        };
      case 'DEMO':
        return {
          bg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
          dot: 'bg-purple-400',
          label: 'ILLUSTRATIVE DEMO',
          icon: AlertCircle
        };
      case 'UNAVAILABLE':
      default:
        return {
          bg: 'bg-red-950/80 border-red-500/40 text-red-300',
          dot: 'bg-red-400',
          label: 'DATA UNAVAILABLE',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border ${config.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="font-semibold">{config.label}</span>
      <span className="text-mars-muted">|</span>
      <span className="truncate max-w-[140px] text-mars-text" title={sourceName}>
        {sourceName}
      </span>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mars-orange hover:text-mars-orange-bright transition-colors ml-0.5"
          title={`View NASA Source: ${sourceUrl}`}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
