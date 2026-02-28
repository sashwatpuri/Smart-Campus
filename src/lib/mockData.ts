import type {
  SmartBin,
  STPSensor,
  STPStage,
  Alert,
  Prediction,
  TimeSeriesData,
  RouteOptimization,
  SimulationScenario,
} from '@/types';

// Campus boundaries (approximate coordinates for mock data)
const CAMPUS_BOUNDS = {
  lat: { min: 12.97, max: 12.99 },
  lng: { min: 77.59, max: 77.61 },
};

const BUILDINGS = [
  'Main Block', 'Library', 'Canteen', 'Hostel A', 'Hostel B', 'Hostel C',
  'Hostel D', 'Sports Complex', 'Auditorium', 'Research Center', 'Lab Block',
  'Admin Block', 'Parking A', 'Parking B', 'Medical Center', 'Cafeteria',
  'Workshop', 'Incubation Center', 'Gymnasium', 'Open Air Theatre',
];

const BIN_TYPES = ['wet', 'dry', 'recyclable'] as const;

// Generate random number in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate random integer in range
const randomInt = (min: number, max: number) => Math.floor(random(min, max + 1));

// Generate timestamp within last n hours
const recentTimestamp = (hoursAgo: number = 24) => {
  const date = new Date();
  date.setHours(date.getHours() - random(0, hoursAgo));
  return date.toISOString();
};

// Generate 24h history data
const generateHistory = (baseValue: number, variance: number = 20): number[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hourFactor = Math.sin((i - 6) * Math.PI / 12) * 0.3 + 0.7;
    const noise = random(-variance, variance);
    return Math.max(0, Math.min(100, baseValue * hourFactor + noise));
  });
};

// Generate Smart Bins
export const generateSmartBins = (count: number = 25): SmartBin[] => {
  return Array.from({ length: count }, (_, i) => {
    const type = BIN_TYPES[i % 3];
    const baseFill = random(10, 95);
    const building = BUILDINGS[i % BUILDINGS.length];
    
    let status: 'healthy' | 'warning' | 'critical';
    if (baseFill > 80) status = 'critical';
    else if (baseFill > 50) status = 'warning';
    else status = 'healthy';

    return {
      id: `BIN-${String(i + 1).padStart(3, '0')}`,
      name: `${building} ${type.charAt(0).toUpperCase() + type.slice(1)} Bin`,
      type,
      location: {
        lat: random(CAMPUS_BOUNDS.lat.min, CAMPUS_BOUNDS.lat.max),
        lng: random(CAMPUS_BOUNDS.lng.min, CAMPUS_BOUNDS.lng.max),
        building,
      },
      fillLevel: Math.round(baseFill),
      status,
      lastCollection: recentTimestamp(48),
      predictedFillTime: new Date(Date.now() + random(2, 12) * 3600000).toISOString(),
      history: generateHistory(baseFill),
      batteryLevel: randomInt(60, 100),
      lastPing: recentTimestamp(1),
    };
  });
};

// Generate STP Sensors
export const generateSTPSensors = (): STPSensor[] => {
  const sensors: STPSensor[] = [
    { id: 'SENS-PH-01', name: 'pH Sensor', type: 'ph', value: 7.1, unit: 'pH', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
    { id: 'SENS-TURB-01', name: 'Turbidity', type: 'turbidity', value: 2.4, unit: 'NTU', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
    { id: 'SENS-DO-01', name: 'Dissolved O2', type: 'dissolved_oxygen', value: 6.8, unit: 'mg/L', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
    { id: 'SENS-FLOW-01', name: 'Flow Rate', type: 'flow_rate', value: 112, unit: 'm³/h', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
    { id: 'SENS-GAS-01', name: 'H2S Sensor', type: 'gas', value: 0.3, unit: 'ppm', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
    { id: 'SENS-GAS-02', name: 'NH3 Sensor', type: 'gas', value: 1.2, unit: 'ppm', status: 'online', lastPing: recentTimestamp(0.5), calibrationDate: '2024-01-15' },
  ];
  return sensors;
};

// Generate STP Stages
export const generateSTPStages = (): STPStage[] => {
  const sensors = generateSTPSensors();
  return [
    { id: 'STAGE-01', name: 'INLET', order: 1, sensors: [sensors[3]], flowRate: 112, isActive: true },
    { id: 'STAGE-02', name: 'SCREENING', order: 2, sensors: [], flowRate: 112, isActive: true },
    { id: 'STAGE-03', name: 'AERATION', order: 3, sensors: [sensors[2]], flowRate: 108, isActive: true },
    { id: 'STAGE-04', name: 'CLARIFIER', order: 4, sensors: [sensors[1]], flowRate: 105, isActive: true },
    { id: 'STAGE-05', name: 'FILTER', order: 5, sensors: [sensors[0]], flowRate: 102, isActive: true },
    { id: 'STAGE-06', name: 'OUTLET', order: 6, sensors: [sensors[4], sensors[5]], flowRate: 98, isActive: true },
  ];
};

// Generate Alerts
export const generateAlerts = (): Alert[] => {
  return [
    {
      id: 'ALT-001',
      title: 'High Fill Level',
      message: 'BIN-007 in Canteen has reached 87% capacity',
      severity: 'warning',
      timestamp: recentTimestamp(2),
      source: 'BIN-007',
      acknowledged: false,
    },
    {
      id: 'ALT-002',
      title: 'Critical Battery',
      message: 'BIN-015 battery level at 23%',
      severity: 'critical',
      timestamp: recentTimestamp(4),
      source: 'BIN-015',
      acknowledged: false,
    },
    {
      id: 'ALT-003',
      title: 'Odor Risk Detected',
      message: 'H2S levels elevated near STP outlet',
      severity: 'warning',
      timestamp: recentTimestamp(1),
      source: 'SENS-GAS-01',
      acknowledged: true,
    },
    {
      id: 'ALT-004',
      title: 'Sensor Offline',
      message: 'Turbidity sensor not responding for 15 minutes',
      severity: 'info',
      timestamp: recentTimestamp(0.5),
      source: 'SENS-TURB-01',
      acknowledged: false,
    },
  ];
};

// Generate Predictions
export const generatePredictions = (): Prediction[] => {
  return [
    {
      id: 'PRED-001',
      type: 'waste',
      title: 'Waste Generation Next 24h',
      confidence: 87,
      prediction: 'Peak at 2:00 PM - 340 kg expected',
      details: 'Based on historical patterns and event calendar',
      features: ['Historical fill rate', 'Event schedule', 'Day of week pattern'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 'PRED-002',
      type: 'route',
      title: 'Optimal Collection Route',
      confidence: 92,
      prediction: 'Route A optimized - 23 minutes saved',
      details: '12 bins prioritized by fill level and proximity',
      features: ['Fill level data', 'Traffic patterns', 'Bin proximity'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 'PRED-003',
      type: 'water',
      title: 'Water Demand Spike',
      confidence: 78,
      prediction: 'High demand expected Tuesday 6-8 PM',
      details: 'Sports event + regular hostel usage overlap',
      features: ['Event calendar', 'Historical usage', 'Weather forecast'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 'PRED-004',
      type: 'maintenance',
      title: 'STP Maintenance Window',
      confidence: 85,
      prediction: 'Recommended: Sunday 2-6 AM',
      details: 'Equipment health score at 73% - preventive maintenance advised',
      features: ['Equipment runtime', 'Vibration analysis', 'Flow efficiency'],
      timestamp: new Date().toISOString(),
    },
  ];
};

// Generate Time Series Data for Charts
export const generateTimeSeriesData = (
  points: number = 24,
  baseValue: number = 50,
  variance: number = 15
): TimeSeriesData[] => {
  return Array.from({ length: points }, (_, i) => {
    const hour = i;
    const diurnalFactor = 0.7 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
    const value = baseValue * diurnalFactor + random(-variance, variance);
    const predicted = value + random(-5, 5);
    
    return {
      timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
      value: Math.round(value * 10) / 10,
      predicted: Math.round(predicted * 10) / 10,
      confidenceLower: Math.round((predicted - variance * 0.5) * 10) / 10,
      confidenceUpper: Math.round((predicted + variance * 0.5) * 10) / 10,
    };
  });
};

// Generate Route Optimization
export const generateRouteOptimization = (): RouteOptimization => {
  return {
    routeId: 'ROUTE-A',
    bins: ['BIN-007', 'BIN-012', 'BIN-015', 'BIN-018', 'BIN-021', 'BIN-023'],
    estimatedTime: 42,
    timeSaved: 23,
    distance: 3.2,
    fuelSaved: 1.8,
  };
};

// Generate Simulation Scenarios
export const generateSimulationScenarios = (): SimulationScenario[] => {
  return [
    {
      id: 'SIM-001',
      name: 'Tech Fest',
      eventType: 'festival',
      attendance: 5000,
      predictedWasteIncrease: 35,
      predictedWaterIncrease: 28,
      recommendations: [
        'Deploy 5 additional temporary bins',
        'Schedule extra collection at 4 PM',
        'Increase STP monitoring frequency',
      ],
    },
    {
      id: 'SIM-002',
      name: 'Exam Week',
      eventType: 'exam',
      attendance: 3000,
      predictedWasteIncrease: 15,
      predictedWaterIncrease: 12,
      recommendations: [
        'Reduce collection frequency in hostel areas',
        'Monitor library block more closely',
        'Expect higher night-time water usage',
      ],
    },
    {
      id: 'SIM-003',
      name: 'Holiday Break',
      eventType: 'holiday',
      attendance: 500,
      predictedWasteIncrease: -60,
      predictedWaterIncrease: -55,
      recommendations: [
        'Reduce collection to alternate days',
        'Schedule STP maintenance',
        'Put non-essential sensors in low-power mode',
      ],
    },
  ];
};

// Simulate real-time updates
export const simulateBinUpdate = (bin: SmartBin): Partial<SmartBin> => {
  const fillChange = random(-3, 5);
  const newFill = Math.max(0, Math.min(100, bin.fillLevel + fillChange));
  
  let status: 'healthy' | 'warning' | 'critical';
  if (newFill > 80) status = 'critical';
  else if (newFill > 50) status = 'warning';
  else status = 'healthy';
  
  return {
    fillLevel: Math.round(newFill),
    status,
    lastPing: new Date().toISOString(),
    batteryLevel: Math.max(0, bin.batteryLevel - randomInt(0, 1)),
  };
};

export const simulateSTPSensorUpdate = (sensor: STPSensor): Partial<STPSensor> => {
  const variance = sensor.type === 'ph' ? 0.2 : sensor.type === 'flow_rate' ? 5 : 0.5;
  return {
    value: Math.round((sensor.value + random(-variance, variance)) * 10) / 10,
    lastPing: new Date().toISOString(),
  };
};
