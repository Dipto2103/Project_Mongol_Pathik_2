import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  technicalDetails?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Service Anomaly',
  message,
  onRetry,
  technicalDetails
}) => {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-mars-text">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-red-300 font-mono tracking-wide">{title}</h4>
          <p className="text-xs text-mars-muted leading-relaxed">{message}</p>
          {technicalDetails && (
            <p className="text-[11px] font-mono text-red-400/80 bg-mars-darkest/60 px-2 py-1 rounded mt-2">
              {technicalDetails}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-red-300 bg-red-900/40 hover:bg-red-900/70 border border-red-500/30 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};
