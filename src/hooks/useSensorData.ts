import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, PumpStatus, ConnectionStatus, SensorHistory } from '@/types/sensors';

const MAX_HISTORY_POINTS = 50;
const ESP32_URL = 'http://192.168.4.1/api/sensors';

// Initial fallback sensor data
const getInitialSensorData = (): SensorData => ({
  temperature: 0,
  humidity: 0,
  moisture: 0,
  light: 0,
  rain: 0,
  timestamp: new Date(),
});

export function useSensorData() {
  const [sensors, setSensors] = useState<SensorData>(getInitialSensorData());
  const [pump, setPump] = useState<PumpStatus>({
    isOn: false,
    lastActivated: null,
    duration: 0,
  });
  const [connection, setConnection] = useState<ConnectionStatus>({
    isConnected: false,
    signalStrength: 0,
    lastPing: new Date(),
    deviceName: 'Rishu\'s ESP32 Smart Agri Node',
  });
  const [history, setHistory] = useState<SensorHistory>({
    data: [],
    maxPoints: MAX_HISTORY_POINTS,
  });

  const pumpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch actual sensor data from ESP32 every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ESP32_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // A short timeout can be implemented via AbortController in real apps, omitted here for simplicity
        });
        
        if (!response.ok) throw new Error('Network response from ESP32 was not ok');
        
        const rawData = await response.json();
        
        const newData: SensorData = {
          temperature: rawData.temperature ?? 0,
          humidity: rawData.humidity ?? 0,
          moisture: rawData.moisture ?? 0,
          light: rawData.light ?? 0,
          rain: rawData.rain ?? 0,
          timestamp: new Date(),
        };

        setSensors(newData);
        setHistory((prev) => ({
          ...prev,
          data: [...prev.data.slice(-MAX_HISTORY_POINTS + 1), newData],
        }));
        
        setConnection((prev) => ({
          ...prev,
          isConnected: true,
          lastPing: new Date(),
          signalStrength: 85 + Math.random() * 15, // Simulate signal strength if not provided by endpoint
        }));

      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        // Fallback when connection fails
        setConnection(prev => ({
          ...prev,
          isConnected: false,
          signalStrength: 0,
        }));
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const togglePump = useCallback(() => {
    // Ideally this would also send a POST request to ESP32 to actually turn on/off the relay
    // e.g. fetch('http://192.168.4.1/api/pump', { method: 'POST', body: JSON.stringify({ state: !pump.isOn }) })
    setPump((prev) => {
      const newIsOn = !prev.isOn;
      
      if (pumpTimerRef.current) {
        clearInterval(pumpTimerRef.current);
        pumpTimerRef.current = null;
      }

      if (newIsOn) {
        const startTime = Date.now();
        pumpTimerRef.current = setInterval(() => {
          setPump((p) => ({
            ...p,
            duration: Math.floor((Date.now() - startTime) / 1000),
          }));
        }, 1000);
      }

      return {
        isOn: newIsOn,
        lastActivated: newIsOn ? new Date() : prev.lastActivated,
        duration: newIsOn ? 0 : prev.duration,
      };
    });
  }, []);

  const stopPump = useCallback(() => {
    if (pumpTimerRef.current) {
      clearInterval(pumpTimerRef.current);
      pumpTimerRef.current = null;
    }
    setPump((prev) => ({
      ...prev,
      isOn: false,
    }));
  }, []);

  // Auto-stop pump after 10 minutes for safety
  useEffect(() => {
    if (pump.isOn && pump.duration > 600) {
      stopPump();
    }
  }, [pump.isOn, pump.duration, stopPump]);

  return {
    sensors,
    pump,
    connection,
    history,
    togglePump,
    stopPump,
  };
}
