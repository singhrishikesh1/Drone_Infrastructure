const PDFDocument = require('pdfkit');

class PDFService {
  static generateInspectionReport(defect, res) {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Inspection_Audit_${defect.id}.pdf`);

    doc.pipe(res);

    // Header Banner
    doc.rect(0, 0, 612, 80).fill('#0F172A');
    doc.fillColor('#F8FAFC').fontSize(20).text('DRONE INFRASTRUCTURE INSPECTOR AUDIT REPORT', 40, 25, { bold: true });
    doc.fontSize(10).fillColor('#94A3B8').text(`Report Ref ID: ${defect.id}  |  Date: ${defect.timestamp.slice(0, 10)}  |  Classification: OFFICIAL`, 40, 52);

    // Section 1: Overview
    doc.fillColor('#0F172A').fontSize(14).text('1. Inspection Target & Geo-Location', 40, 100, { underline: true });
    doc.fontSize(10).fillColor('#334155');
    doc.text(`Asset Name: ${defect.assetName}`, 40, 125);
    doc.text(`Asset Type: ${defect.assetType ? defect.assetType.toUpperCase() : 'INFRASTRUCTURE'}`, 40, 140);
    doc.text(`Location: ${defect.locationName} (${defect.lat.toFixed(4)}° N, ${defect.lng.toFixed(4)}° E)`, 40, 155);
    doc.text(`Assigned Inspector: ${defect.inspector}`, 40, 170);

    // Risk Badge
    let badgeColor = '#10B981';
    if (defect.riskLevel === 'CRITICAL') badgeColor = '#EF4444';
    else if (defect.riskLevel === 'HIGH') badgeColor = '#F97316';
    else if (defect.riskLevel === 'MEDIUM') badgeColor = '#F59E0B';

    doc.rect(420, 120, 150, 60).fill(badgeColor);
    doc.fillColor('#FFFFFF').fontSize(12).text('RISK LEVEL', 435, 130);
    doc.fontSize(18).text(defect.riskLevel, 435, 148, { bold: true });

    // Section 2: AI & Volumetric Measurement
    doc.fillColor('#0F172A').fontSize(14).text('2. AI Defect Detection & 3D Volumetric Metrics', 40, 205, { underline: true });
    doc.fontSize(10).fillColor('#334155');
    doc.text(`Detected Defect: ${defect.defectClass} (Confidence: ${(defect.confidence * 100).toFixed(1)}%)`, 40, 230);
    
    if (defect.volumetric) {
      doc.text(`Estimated Defect Volume: ${defect.volumetric.volume_m3} m³ (${(defect.volumetric.volume_m3 * 1000).toFixed(1)} Liters)`, 40, 245);
      doc.text(`Affected Surface Area: ${defect.volumetric.surface_area_m2} m²`, 40, 260);
      doc.text(`Max Defect Depth: ${defect.volumetric.max_depth_cm} cm (Avg Depth: ${defect.volumetric.avg_depth_cm} cm)`, 40, 275);
      doc.text(`Estimated Dimensions: ${defect.volumetric.length_m}m (Length) x ${defect.volumetric.width_m}m (Width)`, 40, 290);
    }

    // Section 3: Material BOM & Cost Estimate
    doc.fillColor('#0F172A').fontSize(14).text('3. Civil Engineering Material BOM & Repair Cost', 40, 320, { underline: true });
    
    let y = 345;
    doc.fontSize(9).fillColor('#475569');
    doc.text('Material Description', 40, y, { bold: true });
    doc.text('Quantity Required', 260, y, { bold: true });
    doc.text('Unit Rate', 380, y, { bold: true });
    doc.text('Subtotal Cost', 480, y, { bold: true });
    
    doc.moveTo(40, y + 15).lineTo(560, y + 15).stroke('#CBD5E1');
    y += 25;

    if (defect.costEstimation && defect.costEstimation.required_materials) {
      defect.costEstimation.required_materials.forEach(item => {
        doc.fillColor('#1E293B');
        doc.text(item.name, 40, y);
        doc.text(item.quantity, 260, y);
        doc.text(item.unit_cost, 380, y);
        doc.text(`₹${item.cost.toLocaleString()}`, 480, y);
        y += 20;
      });
    }

    doc.moveTo(40, y + 5).lineTo(560, y + 5).stroke('#0F172A');
    y += 15;
    doc.fontSize(12).fillColor('#0F172A').text(`TOTAL ESTIMATED REPAIR COST:  ₹${(defect.costEstimation?.total_estimated_cost || 0).toLocaleString()}`, 40, y, { bold: true });

    // Section 4: Recommended Engineering Actions
    y += 40;
    doc.fontSize(14).fillColor('#0F172A').text('4. Recommended Engineering Action', 40, y, { underline: true });
    y += 25;
    doc.fontSize(10).fillColor('#334155').text(defect.costEstimation?.recommended_action || "Perform immediate field inspection and repair.", 40, y, { width: 520 });

    // Footer Signatures
    doc.fontSize(9).fillColor('#94A3B8').text('Generated automatically by Drone Infrastructure Inspector Platform', 40, 720);
    doc.text('Authorized Signature: _______________________', 360, 720);

    doc.end();
  }
}

module.exports = PDFService;
