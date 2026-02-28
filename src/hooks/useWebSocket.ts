import { useEffect, useRef, useCallback } from 'react';
import { useCampusStore } from '@/store/campusStore';
import {
  generateSmartBins,
  generateSTPSensors,
  generateSTPStages,
  generateAlerts,
  generatePredictions,
  simulateBinUpdate,
  simulateSTPSensorUpdate,
} from '@/lib/mockData';

interface WebSocketMessage {
  type: 'bin_update' | 'sensor_update' | 'alert' | 'vitals_update';
  payload: unknown;
  timestamp: string;
}

export function useWebSocket() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    bins,
    stpSensors,
    setBins,
    setSTPSensors,
    setSTPStages,
    setAlerts,
    setPredictions,
    setCampusVitals,
    updateBin,
    updateSTPSensor,
    addAlert,
    campusVitals,
  } = useCampusStore();

  // Initialize data on first load
  const initializeData = useCallback(() => {
    setBins(generateSmartBins(25));
    setSTPSensors(generateSTPSensors());
    setSTPStages(generateSTPStages());
    setAlerts(generateAlerts());
    setPredictions(generatePredictions());
  }, [setBins, setSTPSensors, setSTPStages, setAlerts, setPredictions]);

  // Simulate WebSocket message
  const simulateMessage = useCallback((): WebSocketMessage => {
    const messageTypes: WebSocketMessage['type'][] = ['bin_update', 'sensor_update', 'vitals_update'];
    const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    
    switch (type) {
      case 'bin_update': {
        const randomBin = bins[Math.floor(Math.random() * bins.length)];
        if (!randomBin) return { type: 'vitals_update', payload: {}, timestamp: new Date().toISOString() };
        return {
          type: 'bin_update',
          payload: { binId: randomBin.id, updates: simulateBinUpdate(randomBin) },
          timestamp: new Date().toISOString(),
        };
      }
      case 'sensor_update': {
        const randomSensor = stpSensors[Math.floor(Math.random() * stpSensors.length)];
        if (!randomSensor) return { type: 'vitals_update', payload: {}, timestamp: new Date().toISOString() };
        return {
          type: 'sensor_update',
          payload: { sensorId: randomSensor.id, updates: simulateSTPSensorUpdate(randomSensor) },
          timestamp: new Date().toISOString(),
        };
      }
      case 'vitals_update':
      default:
        return {
          type: 'vitals_update',
          payload: {
            edgeLatency: Math.floor(Math.random() * 20) + 10,
            avgResponse: Number((Math.random() * 1 + 1).toFixed(1)),
          },
          timestamp: new Date().toISOString(),
        };
    }
  }, [bins, stpSensors]);

  // Process incoming message
  const processMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'bin_update': {
        const { binId, updates } = message.payload as { binId: string; updates: Parameters<typeof updateBin>[1] };
        updateBin(binId, updates);
        
        // Check for critical alerts
        if (updates.fillLevel && updates.fillLevel > 80) {
          const bin = bins.find(b => b.id === binId);
          if (bin && !bin.status?.includes('critical')) {
            addAlert({
              id: `ALT-${Date.now()}`,
              title: 'Critical Fill Level',
              message: `${bin.name} has reached ${updates.fillLevel}% capacity`,
              severity: 'critical',
              timestamp: new Date().toISOString(),
              source: binId,
              acknowledged: false,
            });
          }
        }
        break;
      }
      case 'sensor_update': {
        const { sensorId, updates } = message.payload as { sensorId: string; updates: Parameters<typeof updateSTPSensor>[1] };
        updateSTPSensor(sensorId, updates);
        break;
      }
      case 'vitals_update': {
        const { edgeLatency, avgResponse } = message.payload as { edgeLatency?: number; avgResponse?: number };
        setCampusVitals({
          ...campusVitals,
          ...(edgeLatency !== undefined && { edgeLatency }),
          ...(avgResponse !== undefined && { avgResponse }),
        });
        break;
      }
    }
  }, [updateBin, updateSTPSensor, setCampusVitals, campusVitals, bins, addAlert]);

  // Start WebSocket simulation
  const connect = useCallback(() => {
    if (intervalRef.current) return;
    
    // Initialize data if empty
    if (bins.length === 0) {
      initializeData();
    }
    
    // Start update interval (2 seconds)
    intervalRef.current = setInterval(() => {
      const message = simulateMessage();
      processMessage(message);
    }, 2000);
  }, [bins.length, initializeData, simulateMessage, processMessage]);

  // Stop WebSocket simulation
  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected: intervalRef.current !== null,
  };
}
