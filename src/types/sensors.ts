export interface SensorData {
  temperature: number;
  humidity: number;
  moisture: number;
  light: number;
  rain: number;
  timestamp: Date;
}

export interface PumpStatus {
  isOn: boolean;
  lastActivated: Date | null;
  duration: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  signalStrength: number;
  lastPing: Date | null;
  deviceName: string;
}

export interface SensorHistory {
  data: SensorData[];
  maxPoints: number;
}

export interface SystemStatus {
  sensors: SensorData;
  pump: PumpStatus;
  connection: ConnectionStatus;
  history: SensorHistory;
}
