import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SmartBin,
  STPSensor,
  STPStage,
  Alert,
  Prediction,
  SustainabilityMetrics,
  CampusVitals,
  FlowLayer,
  SimulationScenario,
} from '@/types';

interface CampusState {
  // Live Data
  bins: SmartBin[];
  stpSensors: STPSensor[];
  stpStages: STPStage[];
  alerts: Alert[];
  campusVitals: CampusVitals;
  
  // Predictions
  predictions: Prediction[];
  
  // Sustainability
  sustainabilityMetrics: SustainabilityMetrics;
  
  // Digital Twin
  flowLayers: FlowLayer[];
  simulationTime: number;
  isSimulationPlaying: boolean;
  simulationSpeed: number;
  
  // UI State
  selectedBinId: string | null;
  selectedSensorId: string | null;
  activeSection: string;
  isSidebarCollapsed: boolean;
  
  // Admin
  alertThresholds: Record<string, number>;
  simulationScenario: SimulationScenario | null;
  
  // Actions
  setBins: (bins: SmartBin[]) => void;
  updateBin: (binId: string, updates: Partial<SmartBin>) => void;
  setSTPSensors: (sensors: STPSensor[]) => void;
  setSTPStages: (stages: STPStage[]) => void;
  updateSTPSensor: (sensorId: string, updates: Partial<STPSensor>) => void;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  setCampusVitals: (vitals: CampusVitals) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setSustainabilityMetrics: (metrics: SustainabilityMetrics) => void;
  setFlowLayers: (layers: FlowLayer[]) => void;
  toggleFlowLayer: (layerId: string) => void;
  setSimulationTime: (time: number) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  setSelectedBin: (binId: string | null) => void;
  setSelectedSensor: (sensorId: string | null) => void;
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void;
  setAlertThreshold: (key: string, value: number) => void;
  setSimulationScenario: (scenario: SimulationScenario | null) => void;
}

export const useCampusStore = create<CampusState>()(
  persist(
    (set) => ({
      // Initial State
      bins: [],
      stpSensors: [],
      stpStages: [],
      alerts: [],
      campusVitals: {
        wasteHealth: 92,
        waterHealth: 88,
        safetyScore: 96,
        binsMonitored: 24,
        stpSensors: 12,
        avgResponse: 1.8,
        edgeLatency: 18,
      },
      predictions: [],
      sustainabilityMetrics: {
        overallScore: 84,
        circularEconomy: 78,
        waterAutonomy: 61,
        carbonAvoidance: 12.4,
        engagementRate: 73,
        hostelLeaderboard: [
          { rank: 1, name: 'Hostel A', score: 94, participation: 89 },
          { rank: 2, name: 'Hostel C', score: 91, participation: 85 },
          { rank: 3, name: 'Hostel B', score: 87, participation: 82 },
        ],
      },
      flowLayers: [
        { id: 'waste', name: 'Waste Stream', enabled: true, color: '#00F0FF', particleCount: 150 },
        { id: 'water', name: 'Water Cycle', enabled: true, color: '#27C59A', particleCount: 120 },
        { id: 'energy', name: 'Energy Flow', enabled: false, color: '#F59E0B', particleCount: 80 },
      ],
      simulationTime: 12,
      isSimulationPlaying: false,
      simulationSpeed: 1,
      selectedBinId: null,
      selectedSensorId: null,
      activeSection: 'live',
      isSidebarCollapsed: false,
      alertThresholds: {
        binFillWarning: 50,
        binFillCritical: 80,
        phMin: 6.5,
        phMax: 8.5,
        turbidityMax: 5,
        flowRateMin: 80,
      },
      simulationScenario: null,

      // Actions
      setBins: (bins) => set({ bins }),
      updateBin: (binId, updates) => set((state) => ({
        bins: state.bins.map((b) => b.id === binId ? { ...b, ...updates } : b),
      })),
      setSTPSensors: (sensors) => set({ stpSensors: sensors }),
      setSTPStages: (stages) => set({ stpStages: stages }),
      updateSTPSensor: (sensorId, updates) => set((state) => ({
        stpSensors: state.stpSensors.map((s) => s.id === sensorId ? { ...s, ...updates } : s),
      })),
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      acknowledgeAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map((a) => a.id === alertId ? { ...a, acknowledged: true } : a),
      })),
      setCampusVitals: (vitals) => set({ campusVitals: vitals }),
      setPredictions: (predictions) => set({ predictions }),
      setSustainabilityMetrics: (metrics) => set({ sustainabilityMetrics: metrics }),
      setFlowLayers: (layers) => set({ flowLayers: layers }),
      toggleFlowLayer: (layerId) => set((state) => ({
        flowLayers: state.flowLayers.map((l) =>
          l.id === layerId ? { ...l, enabled: !l.enabled } : l
        ),
      })),
      setSimulationTime: (time) => set({ simulationTime: time }),
      setSimulationPlaying: (playing) => set({ isSimulationPlaying: playing }),
      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
      setSelectedBin: (binId) => set({ selectedBinId: binId }),
      setSelectedSensor: (sensorId) => set({ selectedSensorId: sensorId }),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setAlertThreshold: (key, value) => set((state) => ({
        alertThresholds: { ...state.alertThresholds, [key]: value },
      })),
      setSimulationScenario: (scenario) => set({ simulationScenario: scenario }),
    }),
    {
      name: 'campus-pulse-storage',
      partialize: (state) => ({
        alertThresholds: state.alertThresholds,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
