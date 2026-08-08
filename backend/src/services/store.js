const fs = require('fs');
const path = require('path');

// Pre-seeded hackathon demo dataset
const initialSeedDefects = [
  {
    id: "DEF-1001",
    title: "Severe Road Pothole & Asphalt Degradation",
    assetName: "Western Express Highway (Km 14.2)",
    assetType: "road",
    locationName: "Mumbai, Maharashtra",
    lat: 19.1176,
    lng: 72.8481,
    altitude: 45.2,
    riskLevel: "CRITICAL",
    riskScore: 88,
    defectClass: "Pothole",
    confidence: 0.94,
    volumetric: {
      volume_m3: 0.1240,
      surface_area_m2: 0.85,
      avg_depth_cm: 14.6,
      max_depth_cm: 21.0,
      length_m: 1.10,
      width_m: 0.77
    },
    costEstimation: {
      total_estimated_cost: 8450,
      currency: "₹",
      required_materials: [
        { name: "Bitumen Asphalt Mix", quantity: "0.143 m³", unit_cost: "₹14,500/m³", cost: 2073.5 },
        { name: "Bituminous Tack Coat Primer", quantity: "0.4 L", unit_cost: "₹180/L", cost: 72.0 },
        { name: "Compaction & Skilled Labor", quantity: "1 Patch Crew", unit_cost: "₹2,500/job", cost: 2500 }
      ],
      recommended_action: "Immediate cold-mix asphalt filling and roller compaction to prevent multi-vehicle tire blowout risk."
    },
    riskReasons: [
      "Severe depth (>15 cm) creates immediate vehicular hazard on high-speed arterial road",
      "Large volume (124 Liters) expanding rapidly under monsoon runoff"
    ],
    timestamp: "2026-08-08T10:15:00Z",
    inspector: "Rajesh Kumar (Senior Highway Engineer)",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80"
  },
  {
    id: "DEF-1002",
    title: "Structural Steel Corrosion & Rusting Under Girder 4",
    assetName: "Howrah Bridge (Pillar B)",
    assetType: "bridge",
    locationName: "Kolkata, West Bengal",
    lat: 22.5851,
    lng: 88.3468,
    altitude: 28.5,
    riskLevel: "HIGH",
    riskScore: 72,
    defectClass: "Steel Structure Corrosion",
    confidence: 0.91,
    volumetric: {
      volume_m3: 0.006,
      surface_area_m2: 4.20,
      avg_depth_cm: 0.4,
      max_depth_cm: 0.9,
      length_m: 2.40,
      width_m: 1.75
    },
    costEstimation: {
      total_estimated_cost: 16820,
      currency: "₹",
      required_materials: [
        { name: "Zinc-Rich Anti-Corrosive Primer", quantity: "1.5 L", unit_cost: "₹1,200/L", cost: 1800 },
        { name: "Aliphatic Polyurethane Topcoat", quantity: "1.9 L", unit_cost: "₹950/L", cost: 1805 },
        { name: "Sandblasting Surface Prep", quantity: "4.2 m²", unit_cost: "₹350/m²", cost: 1470 },
        { name: "Scaffolding & Rigging Labor", quantity: "1 Crew", unit_cost: "₹3,500/job", cost: 3500 }
      ],
      recommended_action: "Sa 2.5 abrasive blast cleaning, zinc primer coat, and dual-pack polyurethane protective shell."
    },
    riskReasons: [
      "High risk asset category (BRIDGE) where unmitigated section loss compromises load distribution",
      "Corrosion affects structural load beam connection point"
    ],
    timestamp: "2026-08-08T09:40:00Z",
    inspector: "Ananya Sen (Bridge Structural Inspector)",
    status: "IN_REVIEW",
    alertSent: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&q=80"
  },
  {
    id: "DEF-1003",
    title: "Track Sleepers Crack & Misalignment",
    assetName: "Delhi-Agra Main Railway Corridor (Km 88)",
    assetType: "railway",
    locationName: "Mathura, Uttar Pradesh",
    lat: 27.4924,
    lng: 77.6737,
    altitude: 18.0,
    riskLevel: "CRITICAL",
    riskScore: 92,
    defectClass: "Rail Misalignment & Concrete Sleeper Crack",
    confidence: 0.96,
    volumetric: {
      volume_m3: 0.003,
      surface_area_m2: 0.45,
      avg_depth_cm: 3.8,
      max_depth_cm: 5.2,
      length_m: 1.40,
      width_m: 0.32
    },
    costEstimation: {
      total_estimated_cost: 12400,
      currency: "₹",
      required_materials: [
        { name: "PSC Concrete Sleeper Unit", quantity: "2 Units", unit_cost: "₹2,800/unit", cost: 5600 },
        { name: "Crushed Stone Ballast", quantity: "1.2 m³", unit_cost: "₹2,800/m³", cost: 3360 },
        { name: "Railway Maintenance Track Gang", quantity: "1 Shift", unit_cost: "₹3,400/shift", cost: 3400 }
      ],
      recommended_action: "Emergency track block window requested: Replace damaged sleeper units and re-tamp ballast."
    },
    riskReasons: [
      "CRITICAL derailment risk on high-speed rail corridor (160 km/h train line)",
      "Concrete sleeper structural fracture exceeding 5cm depth"
    ],
    timestamp: "2026-08-08T11:05:00Z",
    inspector: "Vikram Sharma (Railway Track Engineer)",
    status: "DISPATCHED",
    alertSent: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80"
  },
  {
    id: "DEF-1004",
    title: "Exterior Wall Deep Seepage & Concrete Spalling",
    assetName: "AIIMS Hospital Trauma Block (North Facade)",
    assetType: "building",
    locationName: "New Delhi",
    lat: 28.5672,
    lng: 77.2100,
    altitude: 32.0,
    riskLevel: "MEDIUM",
    riskScore: 48,
    defectClass: "Facade Seepage & Spalling",
    confidence: 0.89,
    volumetric: {
      volume_m3: 0.008,
      surface_area_m2: 2.15,
      avg_depth_cm: 1.8,
      max_depth_cm: 3.5,
      length_m: 1.85,
      width_m: 1.16
    },
    costEstimation: {
      total_estimated_cost: 7200,
      currency: "₹",
      required_materials: [
        { name: "Hydrophobic Polymer Waterproof Seal", quantity: "9.6 kg", unit_cost: "₹90/kg", cost: 864 },
        { name: "Crystalline Crack Filler Grout", quantity: "5.0 kg", unit_cost: "₹180/kg", cost: 900 },
        { name: "Rope Access Applicator Team", quantity: "1 Day", unit_cost: "₹3,500/day", cost: 3500 }
      ],
      recommended_action: "Rope access wall preparation, injection of crystalline waterproofing, and protective plaster finish."
    },
    riskReasons: [
      "Moisture ingress threatening electrical conduits inside hospital utility wall",
      "Medium priority facade spalling"
    ],
    timestamp: "2026-08-08T08:20:00Z",
    inspector: "Neha Verma (Civil Infrastructure Auditor)",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&q=80"
  }
];

class DataStore {
  constructor() {
    this.defects = [...initialSeedDefects];
    this.users = [
      { id: "usr-1", name: "Inspector Admin", email: "admin@droneinspect.org", passwordHash: "password123", role: "ADMIN" },
      { id: "usr-2", name: "Field Engineer", email: "engineer@pwd.gov.in", passwordHash: "password123", role: "INSPECTOR" }
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

  getAnalyticsSummary() {
    const totalInspections = this.defects.length;
    const criticalCount = this.defects.filter(d => d.riskLevel === "CRITICAL").length;
    const highCount = this.defects.filter(d => d.riskLevel === "HIGH").length;
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
      totalEstimatedBudget: totalCost,
      currency: "₹",
      byAssetType
    };
  }
}

module.exports = new DataStore();
