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
  assetType: 'road' | 'bridge' | 'railway' | 'building';
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
  totalEstimatedBudget: number;
  currency: string;
  byAssetType: {
    road: number;
    bridge: number;
    railway: number;
    building: number;
  };
}
