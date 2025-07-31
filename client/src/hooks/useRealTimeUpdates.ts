import { useEffect, useRef, useState } from 'react';
import { syncStore } from '@shared/syncStore';

// Real-time updates hook for admin dashboard
export function useRealTimeUpdates() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate real-time connection
    const startRealTimeUpdates = () => {
      intervalRef.current = setInterval(() => {
        // Simulate data updates
        setLastUpdate(new Date());
        
        // Trigger data refresh by emitting sync event
        syncStore.emit('sync_started', null);
        setTimeout(() => {
          syncStore.emit('sync_completed', null);
        }, 1000);
      }, 30000); // Update every 30 seconds
    };

    startRealTimeUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const forceRefresh = () => {
    setLastUpdate(new Date());
    syncStore.emit('sync_started', null);
    setTimeout(() => {
      syncStore.emit('sync_completed', null);
    }, 500);
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