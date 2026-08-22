export interface VolumetricData {
  volume_m3: number;
  surface_area_m2: number;
  avg_depth_cm: number;
  max_depth_cm: number;
  length_m: number;
  width_m: number;
}

export interface MaterialItem {
  name: string;
  quantity: string;
  unit_cost: string;
  cost: number;
}

export interface CostEstimation {
  total_estimated_cost: number;
  currency: string;
  required_materials: MaterialItem[];
  recommended_action: string;
  risk_score?: string;
  risk_numeric?: number;
  risk_reasons?: string[];
}

export interface Defect {
  id: string;
  title: string;
  assetName: string;
  assetType: 'road' | 'bridge';
  locationName: string;
  lat: number;
  lng: number;
  altitude: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  defectClass: string;
  confidence: number;
  volumetric: VolumetricData;
  costEstimation: CostEstimation;
  riskReasons: string[];
  timestamp: string;
  inspector: string;
  status: 'OPEN' | 'IN_REVIEW' | 'DISPATCHED' | 'RESOLVED';
  alertSent: boolean;
  thumbnailUrl: string;
}

export interface AnalyticsSummary {
  totalInspections: number;
  criticalRisks: number;
  highRisks: number;
  resolvedProblems?: number;
  totalEstimatedBudget: number;
  currency: string;
  byAssetType: {
    road: number;
    bridge: number;
  };
}

export interface DroneItem {
  id: string;
  name: string;
  model: string;
  status: 'FLYING' | 'CHARGING' | 'STANDBY' | 'MAINTENANCE';
  assignedArea: string;
  lat: number;
  lng: number;
  altitude: number;
  speedKmH: number;
  batteryPercent: number;
  rotorHealth: number;
  cameraStream: string;
  lastServiceDate: string;
  nextServiceDue: string;
  totalFlightHours: number;
}

export interface ServiceRecord {
  id: string;
  droneId: string;
  droneName: string;
  serviceType: string;
  date: string;
  technician: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'IN_PROGRESS';
  cost: string;
  notes: string;
}

export interface RedisKeyItem {
  key: string;
  type: string;
  ttl: number;
  val: string;
}

export interface RedisStats {
  status: string;
  mode: string;
  version: string;
  memoryUsedMb: number;
  totalKeys: number;
  opsPerSec: number;
  connectedClients: number;
  pubSubChannels: string[];
  recentKeys: RedisKeyItem[];
  telemetryStream: {
    channel: string;
    activePayload: {
      timestamp: string;
      activeDronesCount: number;
      puneBoundCenter: { lat: number; lng: number };
      packetsProcessed: number;
      cacheHitRatio: string;
    };
  };
}

