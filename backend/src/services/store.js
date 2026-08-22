const fs = require('fs');
const path = require('path');

// Pre-seeded DRONACHARYA road detection demo dataset
const initialSeedDefects = [
  {
    id: "DEF-1001",
    title: "Critical Asphalt Sub-base Pothole",
    assetName: "Nagar Road Highway (NH-753F)",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Sector), Pune",
    lat: 18.5585,
    lng: 73.9165,
    altitude: 48.5,
    riskLevel: "CRITICAL",
    riskScore: 94,
    defectClass: "Pothole Class IV (Severe)",
    confidence: 0.965,
    volumetric: {
      volume_m3: 0.68,
      surface_area_m2: 3.45,
      avg_depth_cm: 11.2,
      max_depth_cm: 18.5,
      length_m: 2.3,
      width_m: 1.5
    },
    costEstimation: {
      total_estimated_cost: 42500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Concrete Cold Mix (VG-30)", quantity: "0.75 Tons", unit_cost: "₹38,000 / Ton", cost: 28500 },
        { name: "Rapid-Setting Emulsion Tack Coat (RS-1)", quantity: "20 Liters", unit_cost: "₹140 / Liter", cost: 2800 },
        { name: "Compaction Equipment & Field Crew", quantity: "1 Shift", unit_cost: "₹11,200 / Shift", cost: 11200 }
      ],
      recommended_action: "Milling of degraded asphalt surface, application of RS-1 tack coat, and high-density compaction."
    },
    riskReasons: [
      "High probability of heavy commercial vehicle tire blowout",
      "Rainwater pooling leading to accelerated sub-base erosion"
    ],
    timestamp: "10 mins ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
  },
  {
    id: "DEF-1002",
    title: "Bridge Expansion Joint Shear & Concrete Spalling",
    assetName: "Nagar Road Highway Flyover (Span 2)",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Mid-Corridor Sector), Pune",
    lat: 18.5680,
    lng: 73.9450,
    altitude: 52.0,
    riskLevel: "CRITICAL",
    riskScore: 92,
    defectClass: "Expansion Joint Spalling",
    confidence: 0.942,
    volumetric: {
      volume_m3: 0.32,
      surface_area_m2: 1.8,
      avg_depth_cm: 6.4,
      max_depth_cm: 9.8,
      length_m: 3.0,
      width_m: 0.6
    },
    costEstimation: {
      total_estimated_cost: 65000,
      currency: "₹",
      required_materials: [
        { name: "High-Performance Elastomeric Expansion Seal", quantity: "3.2 Meters", unit_cost: "₹12,500 / Meter", cost: 40000 },
        { name: "Non-Shrink Polymer Modified Mortar", quantity: "50 kg", unit_cost: "₹300 / kg", cost: 15000 },
        { name: "Bridge Structural Maintenance Crew", quantity: "1 Shift", unit_cost: "₹10,000 / Shift", cost: 10000 }
      ],
      recommended_action: "Replace damaged elastomeric joint seal and inject non-shrink polymer mortar around spalled edges."
    },
    riskReasons: [
      "Deep structural tension crack expanding near main bridge girder support joint",
      "High dynamic vibration load from heavy transport vehicles"
    ],
    timestamp: "25 mins ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-1003",
    title: "Deep Rainwater Pothole & Subgrade Erosion",
    assetName: "Nagar Road Highway Corridor Exit 12",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point B Sector), Pune",
    lat: 18.5775,
    lng: 73.9740,
    altitude: 45.0,
    riskLevel: "HIGH",
    riskScore: 89,
    defectClass: "Water-Logged Pothole",
    confidence: 0.915,
    volumetric: {
      volume_m3: 0.42,
      surface_area_m2: 2.1,
      avg_depth_cm: 8.5,
      max_depth_cm: 14.2,
      length_m: 1.8,
      width_m: 1.2
    },
    costEstimation: {
      total_estimated_cost: 34800,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Bitumen Cold Mix", quantity: "0.45 Tons", unit_cost: "₹38,000 / Ton", cost: 17100 },
        { name: "RS-1 Emulsion Tack Coat", quantity: "15 Liters", unit_cost: "₹140 / Liter", cost: 2100 },
        { name: "Vibratory Roller & Maintenance Crew", quantity: "1 Shift", unit_cost: "₹15,600 / Shift", cost: 15600 }
      ],
      recommended_action: "Dewatering, application of RS-1 tack coat, and high-density polymer asphalt compaction."
    },
    riskReasons: [
      "Severe vehicle wheel hydroplaning and rim fracture hazard",
      "Subgrade moisture softening causing accelerated pothole enlargement"
    ],
    timestamp: "40 mins ago",
    inspector: "Raisoni-Drone_P7",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_water_1.jpg"
  },
  {
    id: "DEF-1004",
    title: "Heavy Alligator Fatigue Cracking",
    assetName: "Nagar Road Highway Arterial Stretch",
    assetType: "road",
    locationName: "Nagar Road Corridor (Mid-Corridor Lane 2)",
    lat: 18.5630,
    lng: 73.9310,
    altitude: 46.0,
    riskLevel: "HIGH",
    riskScore: 84,
    defectClass: "Fatigue Alligator Cracking",
    confidence: 0.892,
    volumetric: {
      volume_m3: 0.24,
      surface_area_m2: 4.8,
      avg_depth_cm: 3.5,
      max_depth_cm: 5.8,
      length_m: 4.0,
      width_m: 1.2
    },
    costEstimation: {
      total_estimated_cost: 28000,
      currency: "₹",
      required_materials: [
        { name: "Rubberized Bitumen Crack Sealant", quantity: "35 Liters", unit_cost: "₹400 / Liter", cost: 14000 },
        { name: "Protective Surface Micro-surfacing", quantity: "50 m²", unit_cost: "₹280 / m²", cost: 14000 }
      ],
      recommended_action: "Apply high-viscosity rubberized crack sealant followed by protective micro-surfacing overlay."
    },
    riskReasons: [
      "Water penetration risk into road base during heavy rain",
      "Potential rapid escalation into widespread pothole clusters"
    ],
    timestamp: "1 hour ago",
    inspector: "Raisoni-Drone_P7",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "/defects/asphalt_alligator_1.jpg"
  },
  {
    id: "DEF-1005",
    title: "Bridge Deck Concrete Spalling & Exposed Rebar",
    assetName: "Nagar Road Highway Overpass Bridge",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Span 4 West), Pune",
    lat: 18.5716,
    lng: 73.9550,
    altitude: 54.0,
    riskLevel: "HIGH",
    riskScore: 82,
    defectClass: "Deck Concrete Spalling",
    confidence: 0.884,
    volumetric: {
      volume_m3: 0.28,
      surface_area_m2: 1.6,
      avg_depth_cm: 7.2,
      max_depth_cm: 11.5,
      length_m: 2.2,
      width_m: 0.75
    },
    costEstimation: {
      total_estimated_cost: 58000,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Structural Mortar", quantity: "40 kg", unit_cost: "₹400 / kg", cost: 16000 },
        { name: "Anti-Corrosion Zinc Primer Coating", quantity: "10 Liters", unit_cost: "₹1,200 / Liter", cost: 12000 },
        { name: "Bridge Repair Crew & Equipment", quantity: "1 Shift", unit_cost: "₹30,000 / Shift", cost: 30000 }
      ],
      recommended_action: "Clean exposed steel rebar, apply zinc anti-corrosion coating, and patch with polymer modified mortar."
    },
    riskReasons: [
      "Rusting rebar expansion causing concrete cover delamination",
      "Structural fatigue risk under continuous heavy transport loads"
    ],
    timestamp: "2 hours ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-1006",
    title: "Severe Asphalt Edge Raveling & Sub-base Subsidence",
    assetName: "Nagar Road Highway Outer Lane",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Sub-Sector)",
    lat: 18.5590,
    lng: 73.9190,
    altitude: 47.0,
    riskLevel: "MEDIUM",
    riskScore: 68,
    defectClass: "Asphalt Edge Raveling",
    confidence: 0.861,
    volumetric: {
      volume_m3: 0.19,
      surface_area_m2: 2.4,
      avg_depth_cm: 4.8,
      max_depth_cm: 7.5,
      length_m: 3.1,
      width_m: 0.8
    },
    costEstimation: {
      total_estimated_cost: 22400,
      currency: "₹",
      required_materials: [
        { name: "Dense Bituminous Macadam (DBM)", quantity: "0.3 Tons", unit_cost: "₹34,000 / Ton", cost: 10200 },
        { name: "Shoulder Compaction Crew", quantity: "1 Shift", unit_cost: "₹12,200 / Shift", cost: 12200 }
      ],
      recommended_action: "Re-compact road shoulder edge, apply DBM cold mix, and seal shoulder margin."
    },
    riskReasons: [
      "Vehicle drift tire drop hazard on unpaved shoulder edge",
      "Erosion propagation toward active traffic lane"
    ],
    timestamp: "3 hours ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
  },
  {
    id: "DEF-1007",
    title: "Longitudinal Reflection Crack & Joint Separation",
    assetName: "Nagar Road Highway Central Median",
    assetType: "road",
    locationName: "Nagar Road Corridor (Mid-Corridor Median)",
    lat: 18.5652,
    lng: 73.9370,
    altitude: 49.0,
    riskLevel: "MEDIUM",
    riskScore: 64,
    defectClass: "Longitudinal Crack",
    confidence: 0.847,
    volumetric: {
      volume_m3: 0.12,
      surface_area_m2: 3.2,
      avg_depth_cm: 2.8,
      max_depth_cm: 4.2,
      length_m: 5.5,
      width_m: 0.05
    },
    costEstimation: {
      total_estimated_cost: 18500,
      currency: "₹",
      required_materials: [
        { name: "Hot-Applied Elastic Sealant", quantity: "20 Liters", unit_cost: "₹450 / Liter", cost: 9000 },
        { name: "Crack Routing & Sealing Crew", quantity: "1 Shift", unit_cost: "₹9,500 / Shift", cost: 9500 }
      ],
      recommended_action: "Route crack to 15mm width, clean with compressed air, and fill with hot elastic sealant."
    },
    riskReasons: [
      "Water ingress along longitudinal joint leading to subgrade failure",
      "Risk of crack widening during seasonal temperature changes"
    ],
    timestamp: "4 hours ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/asphalt_alligator_1.jpg"
  },
  {
    id: "DEF-1008",
    title: "Bridge Concrete Parapet Wall Cracking",
    assetName: "Nagar Road Highway Flyover Barrier",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Flyover Span 3)",
    lat: 18.5694,
    lng: 73.9490,
    altitude: 53.0,
    riskLevel: "MEDIUM",
    riskScore: 61,
    defectClass: "Parapet Concrete Crack",
    confidence: 0.823,
    volumetric: {
      volume_m3: 0.08,
      surface_area_m2: 1.1,
      avg_depth_cm: 3.2,
      max_depth_cm: 5.0,
      length_m: 1.9,
      width_m: 0.03
    },
    costEstimation: {
      total_estimated_cost: 32000,
      currency: "₹",
      required_materials: [
        { name: "Structural Epoxy Resin Injection Kit", quantity: "5 Liters", unit_cost: "₹1,400 / Liter", cost: 7000 },
        { name: "Concrete Surface Seal Coating", quantity: "15 m²", unit_cost: "₹400 / m²", cost: 6000 },
        { name: "Safety Scaffolding & Crew", quantity: "1 Shift", unit_cost: "₹19,000 / Shift", cost: 19000 }
      ],
      recommended_action: "Low-pressure epoxy resin injection and application of protective weather-resistant coat."
    },
    riskReasons: [
      "Concrete spalling falling onto lower road underpass hazard",
      "Moisture rust risk to structural reinforcement bars"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-1009",
    title: "Asphalt Surface Raveling & Aggregate Stripping",
    assetName: "Nagar Road Highway Service Lane",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point B Service Road)",
    lat: 18.5760,
    lng: 73.9670,
    altitude: 44.5,
    riskLevel: "LOW",
    riskScore: 42,
    defectClass: "Surface Raveling",
    confidence: 0.954,
    volumetric: {
      volume_m3: 0.06,
      surface_area_m2: 3.8,
      avg_depth_cm: 1.5,
      max_depth_cm: 2.2,
      length_m: 2.8,
      width_m: 1.4
    },
    costEstimation: {
      total_estimated_cost: 9800,
      currency: "₹",
      required_materials: [
        { name: "Fog Seal Bituminous Emulsion", quantity: "25 Liters", unit_cost: "₹180 / Liter", cost: 4500 },
        { name: "Application Spray Unit & Crew", quantity: "1 Job", unit_cost: "₹5,300 / Job", cost: 5300 }
      ],
      recommended_action: "Apply high-penetration fog seal coat to arrest aggregate dislodgement."
    },
    riskReasons: [
      "Minor surface texture loss, low immediate risk to vehicular traffic"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_water_1.jpg"
  },
  {
    id: "DEF-1010",
    title: "Remediated Cold-Mix Pothole Seal Verification",
    assetName: "Nagar Road Highway (Point A Sector)",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Entrance)",
    lat: 18.5575,
    lng: 73.9140,
    altitude: 48.0,
    riskLevel: "LOW",
    riskScore: 28,
    defectClass: "Remediated Pothole",
    confidence: 0.981,
    volumetric: {
      volume_m3: 0.03,
      surface_area_m2: 0.45,
      avg_depth_cm: 0.5,
      max_depth_cm: 1.0,
      length_m: 0.7,
      width_m: 0.6
    },
    costEstimation: {
      total_estimated_cost: 4500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Sealant Coating", quantity: "5 kg", unit_cost: "₹300 / kg", cost: 1500 },
        { name: "PWD Inspection Team", quantity: "1 Job", unit_cost: "₹3,000 / Job", cost: 3000 }
      ],
      recommended_action: "Seal coat verified normal by autonomous drone thermal + LiDAR scan."
    },
    riskReasons: [
      "Remediated pothole patch verified structurally sound by drone scan"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
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
      bridge: this.defects.filter(d => d.assetType === "bridge").length
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

