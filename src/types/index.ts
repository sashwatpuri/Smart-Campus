// Campus Pulse - Type Definitions

export type BinType = 'wet' | 'dry' | 'recyclable';
export type BinStatus = 'healthy' | 'warning' | 'critical';
export type SensorType = 'fill_level' | 'ph' | 'turbidity' | 'dissolved_oxygen' | 'flow_rate' | 'gas';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SmartBin {
  id: string;
  name: string;
  type: BinType;
  location: {
    lat: number;
    lng: number;
    building: string;
  };
  fillLevel: number;
  status: BinStatus;
  lastCollection: string;
  predictedFillTime: string;
  history: number[];
  batteryLevel: number;
  lastPing: string;
}

export interface STPSensor {
  id: string;
  name: string;
  type: SensorType;
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'calibrating';
  lastPing: string;
  calibrationDate: string;
}

export interface STPStage {
  id: string;
  name: string;
  order: number;
  sensors: STPSensor[];
  flowRate: number;
  isActive: boolean;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

export interface Prediction {
  id: string;
  type: 'waste' | 'water' | 'maintenance' | 'route';
  title: string;
  confidence: number;
  prediction: string;
  details: string;
  features: string[];
  timestamp: string;
}

export interface SustainabilityMetrics {
  overallScore: number;
  circularEconomy: number;
  waterAutonomy: number;
  carbonAvoidance: number;
  engagementRate: number;
  hostelLeaderboard: HostelRank[];
}

export interface HostelRank {
  rank: number;
  name: string;
  score: number;
  participation: number;
}

export interface CampusVitals {
  wasteHealth: number;
  waterHealth: number;
  safetyScore: number;
  binsMonitored: number;
  stpSensors: number;
  avgResponse: number;
  edgeLatency: number;
}

export interface FlowLayer {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  particleCount: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  eventType: 'festival' | 'exam' | 'holiday' | 'normal';
  attendance: number;
  predictedWasteIncrease: number;
  predictedWaterIncrease: number;
  recommendations: string[];
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  predicted?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

export interface RouteOptimization {
  routeId: string;
  bins: string[];
  estimatedTime: number;
  timeSaved: number;
  distance: number;
  fuelSaved: number;
}
