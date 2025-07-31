import React from 'react';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

export default function RealTimeIndicator() {
  const { isConnected, lastUpdate, forceRefresh, getConnectionStatus } = useRealTimeUpdates();
  const { timeSinceUpdate } = getConnectionStatus();

  const formatTimeAgo = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? (
          <Wifi size={14} className="animate-pulse" />
        ) : (
          <WifiOff size={14} />
        )}
        <span className="font-medium">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Last Update */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={14} />
        <span>Updated {formatTimeAgo(timeSinceUpdate)}</span>
      </div>

      {/* Refresh Button */}
      <button
        onClick={forceRefresh}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group"
        title="Force refresh"
      >
        <RefreshCw size={16} className="group-hover:animate-spin" />
      </button>
    </div>
  );
}