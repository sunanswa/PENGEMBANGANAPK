import { useEffect, useRef, useState } from 'react';
import { useSync } from './useSync';

// Real-time updates hook for admin dashboard
export function useRealTimeUpdates() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { syncStore } = useSync();

  useEffect(() => {
    // Simulate real-time connection
    const startRealTimeUpdates = () => {
      intervalRef.current = setInterval(() => {
        // Simulate data updates
        setLastUpdate(new Date());
        
        // Trigger data refresh from syncStore
        syncStore.syncWithBackend();
      }, 30000); // Update every 30 seconds
    };

    startRealTimeUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [syncStore]);

  const forceRefresh = () => {
    setLastUpdate(new Date());
    syncStore.syncWithBackend();
  };

  const getConnectionStatus = () => ({
    isConnected,
    lastUpdate,
    timeSinceUpdate: Date.now() - lastUpdate.getTime()
  });

  return {
    isConnected,
    lastUpdate,
    forceRefresh,
    getConnectionStatus
  };
}