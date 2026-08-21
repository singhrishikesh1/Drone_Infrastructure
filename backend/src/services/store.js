const fs = require('fs');
const path = require('path');

// Pre-seeded DRONACHARYA road detection demo dataset
const initialSeedDefects = [
  {
    id: "DEF-1001",
    title: "Bridge Structural Crack",
    assetName: "Kharadi EON Cable Bridge Flyover (Span 2)",
    assetType: "bridge",
    locationName: "Highway 101 - Km 42.5",
    lat: 18.5515,
    lng: 73.9348,
    altitude: 35.8,
    riskLevel: "CRITICAL",
    riskScore: 92,
    defectClass: "Bridge Structural Crack",
    confidence: 0.942,
    volumetric: {
      volume_m3: 0.1850,
      surface_area_m2: 1.45,
      avg_depth_cm: 18.2,
      max_depth_cm: 24.5,
      length_m: 2.10,
      width_m: 0.95
    },
    costEstimation: {
      total_estimated_cost: 24500,
      currency: "₹",
      required_materials: [
        { name: "Structural Carbon Fiber Wrap", quantity: "4.5 m²", unit_cost: "₹3,000/m²", cost: 13500 },
        { name: "High-Pressure Epoxy Resin Grout", quantity: "12 L", unit_cost: "₹500/L", cost: 6000 },
        { name: "Bridge Inspection Cradle & Crew", quantity: "1 Shift", unit_cost: "₹5,000/shift", cost: 5000 }
      ],
      recommended_action: "Immediate high-pressure epoxy resin injection and carbon-fiber composite wrap."
    },
    riskReasons: [
      "Deep structural tension crack expanding near main bridge girder support joint",
      "High dynamic vibration load from heavy transport vehicles"
    ],
    timestamp: "10 mins ago",
    inspector: "Autonomous Drone SkyGuardian-X1",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&q=80"
  },
  {
    id: "DEF-1002",
    title: "Road Surface Damage",
    assetName: "Sector 7 Expressway Arterial Road",
    assetType: "road",
    locationName: "Sector 7 Main Road",
    lat: 18.5679,
    lng: 73.9143,
    altitude: 42.5,
    riskLevel: "HIGH",
    riskScore: 78,
    defectClass: "Road Surface Damage",
    confidence: 0.885,
    volumetric: {
      volume_m3: 0.1120,
      surface_area_m2: 0.85,
      avg_depth_cm: 12.4,
      max_depth_cm: 18.1,
      length_m: 1.15,
      width_m: 0.74
    },
    costEstimation: {
      total_estimated_cost: 11200,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Bitumen Mix", quantity: "0.14 m³", unit_cost: "₹15,000/m³", cost: 2100 },
        { name: "Asphalt Cold Patch Crew", quantity: "1 Shift", unit_cost: "₹9,100/shift", cost: 9100 }
      ],
      recommended_action: "Cold-mix asphalt patch filling and vibratory roller compaction."
    },
    riskReasons: [
      "Asphalt raveling and surface alligator cracking on high-speed lane",
      "Subgrade moisture infiltration risk under heavy rainfall"
    ],
    timestamp: "25 mins ago",
    inspector: "Autonomous Drone SkyGuardian-X1",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80"
  },
  {
    id: "DEF-1003",
    title: "Pothole Inspection",
    assetName: "Expressway Transit Sector Exit 12",
    assetType: "road",
    locationName: "Express Way Exit 12",
    lat: 18.5808,
    lng: 73.9818,
    altitude: 30.0,
    riskLevel: "LOW",
    riskScore: 35,
    defectClass: "Pothole Inspection",
    confidence: 0.981,
    volumetric: {
      volume_m3: 0.0450,
      surface_area_m2: 0.40,
      avg_depth_cm: 4.2,
      max_depth_cm: 6.5,
      length_m: 0.65,
      width_m: 0.60
    },
    costEstimation: {
      total_estimated_cost: 4500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Sealer Compound", quantity: "5 kg", unit_cost: "₹300/kg", cost: 1500 },
        { name: "Local PWD Maintenance Team", quantity: "1 Job", unit_cost: "₹3,000/job", cost: 3000 }
      ],
      recommended_action: "Seal coat layer applied. Verified by rescan."
    },
    riskReasons: [
      "Remediated pothole patch verified by autonomous drone scan"
    ],
    timestamp: "1 hour ago",
    inspector: "Autonomous Drone SkyGuardian-X1",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80"
  }
];

const initialDrones = [
  {
    id: "DRONE-PUNE-01",
    name: "SkyGuardian-X1",
    model: "Matrice 300 RTK Industrial",
    status: "FLYING",
    assignedArea: "Road Patrol Sector 04",
    lat: 18.5679,
    lng: 73.9143,
    altitude: 48.5,
    speedKmH: 24.2,
    batteryPercent: 88,
    rotorHealth: 96,
    cameraStream: "HD Thermal + LiDAR Road Scan",
    lastServiceDate: "2026-08-10",
    nextServiceDue: "2026-09-10",
    totalFlightHours: 142.5
  }
];

const initialServiceLogs = [
  {
    id: "SRV-901",
    droneId: "DRONE-PUNE-02",
    droneName: "AeroFalcon-P2 Autonomous",
    serviceType: "Motor Calibration & Gimbal Alignment",
    date: "2026-07-15",
    technician: "Suresh More (Cert. Drone Engineer)",
    status: "COMPLETED",
    cost: "₹4,500",
    notes: "Replaced Rotor #3 bearing set and recalibrated 4K optical thermal camera sensor."
  },
  {
    id: "SRV-902",
    droneId: "DRONE-PUNE-01",
    droneName: "SkyGuardian-X1 Pro",
    serviceType: "Battery Pack Cycle & Propeller Inspection",
    date: "2026-07-20",
    technician: "Amit Shinde (Avionics Tech)",
    status: "COMPLETED",
    cost: "₹3,200",
    notes: "High-voltage battery telemetry check normal. Rotors balanced to 99.8% precision."
  }
];

class DataStore {
  constructor() {
    this.defects = [...initialSeedDefects];
    this.drones = [...initialDrones];
    this.serviceLogs = [...initialServiceLogs];
    this.users = [
      { id: "usr-1", name: "Pune Drone Operations Admin", email: "admin@droneinfrastructure.org", passwordHash: "password123", role: "ADMIN" },
      { id: "usr-2", name: "Field Infrastructure Engineer", email: "engineer@pmc.gov.in", passwordHash: "password123", role: "INSPECTOR" }
    ];
  }

  getAllDefects() {
    return this.defects;
  }

  getDefectById(id) {
    return this.defects.find(d => d.id === id);
  }

  addDefect(defectData) {
    const newDefect = {
      id: `DEF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      status: "OPEN",
      alertSent: defectData.riskLevel === "CRITICAL",
      ...defectData
    };
    this.defects.unshift(newDefect);
    return newDefect;
  }

  updateDefectStatus(id, newStatus) {
    const defect = this.defects.find(d => d.id === id);
    if (defect) {
      defect.status = newStatus;
      return defect;
    }
    return null;
  }

  getAllDrones() {
    return this.drones;
  }

  getDroneById(id) {
    return this.drones.find(d => d.id === id);
  }

  getAllServiceLogs() {
    return this.serviceLogs;
  }

  addServiceRequest(serviceData) {
    const newRecord = {
      id: `SRV-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      status: "SCHEDULED",
      cost: "₹5,000",
      ...serviceData
    };
    this.serviceLogs.unshift(newRecord);
    return newRecord;
  }

  getAnalyticsSummary() {
    const totalInspections = this.defects.length;
    const criticalCount = this.defects.filter(d => d.riskLevel === "CRITICAL").length;
    const highCount = this.defects.filter(d => d.riskLevel === "HIGH").length;
    const resolvedCount = this.defects.filter(d => d.status === "RESOLVED").length;
    const totalCost = this.defects.reduce((acc, d) => acc + (d.costEstimation?.total_estimated_cost || 0), 0);

    const byAssetType = {
      road: this.defects.filter(d => d.assetType === "road").length,
      bridge: this.defects.filter(d => d.assetType === "bridge").length,
      railway: this.defects.filter(d => d.assetType === "railway").length,
      building: this.defects.filter(d => d.assetType === "building").length
    };

    return {
      totalInspections,
      criticalRisks: criticalCount,
      highRisks: highCount,
      resolvedProblems: resolvedCount,
      totalEstimatedBudget: totalCost,
      currency: "₹",
      byAssetType
    };
  }
}

module.exports = new DataStore();

