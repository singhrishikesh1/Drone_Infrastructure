const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
    volumetricJson: JSON.stringify({
      volume_m3: 0.68,
      surface_area_m2: 3.45,
      avg_depth_cm: 11.2,
      max_depth_cm: 18.5,
      length_m: 2.3,
      width_m: 1.5
    }),
    costEstimationJson: JSON.stringify({
      total_estimated_cost: 42500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Concrete Cold Mix (VG-30)", quantity: "0.75 Tons", unit_cost: "₹38,000 / Ton", cost: 28500 },
        { name: "Rapid-Setting Emulsion Tack Coat (RS-1)", quantity: "20 Liters", unit_cost: "₹140 / Liter", cost: 2800 },
        { name: "Compaction Equipment & Field Crew", quantity: "1 Shift", unit_cost: "₹11,200 / Shift", cost: 11200 }
      ],
      recommended_action: "Milling of degraded asphalt surface, application of RS-1 tack coat, and high-density compaction."
    }),
    riskReasonsJson: JSON.stringify([
      "High probability of heavy commercial vehicle tire blowout",
      "Rainwater pooling leading to accelerated sub-base erosion"
    ]),
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
    volumetricJson: JSON.stringify({
      volume_m3: 0.32,
      surface_area_m2: 1.8,
      avg_depth_cm: 6.4,
      max_depth_cm: 9.8,
      length_m: 3.0,
      width_m: 0.6
    }),
    costEstimationJson: JSON.stringify({
      total_estimated_cost: 65000,
      currency: "₹",
      required_materials: [
        { name: "High-Performance Elastomeric Expansion Seal", quantity: "3.2 Meters", unit_cost: "₹12,500 / Meter", cost: 40000 },
        { name: "Non-Shrink Polymer Modified Mortar", quantity: "50 kg", unit_cost: "₹300 / kg", cost: 15000 },
        { name: "Bridge Structural Maintenance Crew", quantity: "1 Shift", unit_cost: "₹10,000 / Shift", cost: 10000 }
      ],
      recommended_action: "Replace damaged elastomeric joint seal and inject non-shrink polymer mortar around spalled edges."
    }),
    riskReasonsJson: JSON.stringify([
      "Deep structural tension crack expanding near main bridge girder support joint",
      "High dynamic vibration load from heavy transport vehicles"
    ]),
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
    volumetricJson: JSON.stringify({
      volume_m3: 0.42,
      surface_area_m2: 2.1,
      avg_depth_cm: 8.5,
      max_depth_cm: 14.2,
      length_m: 1.8,
      width_m: 1.2
    }),
    costEstimationJson: JSON.stringify({
      total_estimated_cost: 34800,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Bitumen Cold Mix", quantity: "0.45 Tons", unit_cost: "₹38,000 / Ton", cost: 17100 },
        { name: "RS-1 Emulsion Tack Coat", quantity: "15 Liters", unit_cost: "₹140 / Liter", cost: 2100 },
        { name: "Vibratory Roller & Maintenance Crew", quantity: "1 Shift", unit_cost: "₹15,600 / Shift", cost: 15600 }
      ],
      recommended_action: "Dewatering, application of RS-1 tack coat, and high-density polymer asphalt compaction."
    }),
    riskReasonsJson: JSON.stringify([
      "Severe vehicle wheel hydroplaning and rim fracture hazard",
      "Subgrade moisture softening causing accelerated pothole enlargement"
    ]),
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
    volumetricJson: JSON.stringify({
      volume_m3: 0.24,
      surface_area_m2: 4.8,
      avg_depth_cm: 3.5,
      max_depth_cm: 5.8,
      length_m: 4.0,
      width_m: 1.2
    }),
    costEstimationJson: JSON.stringify({
      total_estimated_cost: 28000,
      currency: "₹",
      required_materials: [
        { name: "Rubberized Bitumen Crack Sealant", quantity: "35 Liters", unit_cost: "₹400 / Liter", cost: 14000 },
        { name: "Protective Surface Micro-surfacing", quantity: "50 m²", unit_cost: "₹280 / m²", cost: 14000 }
      ],
      recommended_action: "Apply high-viscosity rubberized crack sealant followed by protective micro-surfacing overlay."
    }),
    riskReasonsJson: JSON.stringify([
      "Water penetration risk into road base during heavy rain",
      "Potential rapid escalation into widespread pothole clusters"
    ]),
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
    volumetricJson: JSON.stringify({
      volume_m3: 0.28,
      surface_area_m2: 1.6,
      avg_depth_cm: 7.2,
      max_depth_cm: 11.5,
      length_m: 2.2,
      width_m: 0.75
    }),
    costEstimationJson: JSON.stringify({
      total_estimated_cost: 58000,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Structural Mortar", quantity: "40 kg", unit_cost: "₹400 / kg", cost: 16000 },
        { name: "Anti-Corrosion Zinc Primer Coating", quantity: "10 Liters", unit_cost: "₹1,200 / Liter", cost: 12000 },
        { name: "Bridge Repair Crew & Equipment", quantity: "1 Shift", unit_cost: "₹30,000 / Shift", cost: 30000 }
      ],
      recommended_action: "Clean exposed steel rebar, apply zinc anti-corrosion coating, and patch with polymer modified mortar."
    }),
    riskReasonsJson: JSON.stringify([
      "Rusting rebar expansion causing concrete cover delamination",
      "Structural fatigue risk under continuous heavy transport loads"
    ]),
    timestamp: "2 hours ago",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  }
];

const initialDrones = [
  {
    id: "DRONE-PUNE-01",
    droneCode: "Raisoni-Drone_P7",
    name: "SkyGuardian-X1",
    status: "IN_FLIGHT",
    batteryPct: 88,
    payloadType: "4K LiDAR & Thermal Sensor",
    currentLat: 18.5679,
    currentLng: 73.9143,
    lastServiced: "2026-08-10",
    healthScore: 96
  },
  {
    id: "DRONE-PUNE-02",
    droneCode: "AeroFalcon-P2",
    name: "AeroFalcon-P2 Autonomous",
    status: "ACTIVE",
    batteryPct: 95,
    payloadType: "High-Res Photogrammetry",
    currentLat: 18.5716,
    currentLng: 73.9550,
    lastServiced: "2026-07-15",
    healthScore: 92
  }
];

const initialServicingTickets = [
  {
    id: "SRV-901",
    defectId: "DEF-1002",
    title: "Bridge Expansion Joint Seal Replacement & Grouting",
    assetName: "Nagar Road Highway Flyover (Span 2)",
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    estimatedCost: 65000,
    assignedCrew: "PMC Bridge Infrastructure Team Alpha",
    scheduledDate: "2026-08-24",
    notes: "High priority repair due to structural tension expansion."
  },
  {
    id: "SRV-902",
    defectId: "DEF-1003",
    title: "Subgrade Compaction & Asphalt Milling",
    assetName: "Nagar Road Highway Corridor Exit 12",
    status: "DISPATCHED",
    priority: "HIGH",
    estimatedCost: 34800,
    assignedCrew: "Field Maintenance Unit 4",
    scheduledDate: "2026-08-25",
    notes: "Dewatering & hot asphalt application scheduled."
  }
];

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // Seed Users
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@droneinfrastructure.org" },
    update: {},
    create: {
      email: "admin@droneinfrastructure.org",
      name: "Pune Drone Operations Admin",
      passwordHash,
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "engineer@pmc.gov.in" },
    update: {},
    create: {
      email: "engineer@pmc.gov.in",
      name: "Field Infrastructure Engineer",
      passwordHash,
      role: "INSPECTOR"
    }
  });

  console.log("✅ Users seeded.");

  // Seed Drones
  for (const drone of initialDrones) {
    await prisma.drone.upsert({
      where: { droneCode: drone.droneCode },
      update: drone,
      create: drone
    });
  }
  console.log("✅ Drones seeded.");

  // Seed Defects
  for (const defect of initialSeedDefects) {
    await prisma.defect.upsert({
      where: { id: defect.id },
      update: defect,
      create: defect
    });
  }
  console.log("✅ Defects seeded.");

  // Seed Servicing Tickets
  for (const ticket of initialServicingTickets) {
    await prisma.servicingTicket.upsert({
      where: { id: ticket.id },
      update: ticket,
      create: ticket
    });
  }
  console.log("✅ Servicing Tickets seeded.");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
