import React from 'react';
import { Loader2, Radio } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing Planetary Telemetry...',
  subMessage = 'Querying NASA Mars Trek WMTS & PDS Geosciences Nodes'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-mars-orange/30 border-t-mars-orange animate-spin" />
        <Radio className="w-5 h-5 text-mars-orange absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-medium text-mars-text font-mono tracking-wider">{message}</p>
        <p className="text-xs text-mars-muted mt-1 font-sans">{subMessage}</p>
      </div>
    </div>
  );
};
