# 🛸 Drone Infrastructure Inspector

> **AI-Powered Automated Monitoring of Roads, Bridges, Railways & Public Assets**
> featuring 3D Volumetric Defect Estimation, Civil Material BOM Cost Prediction & Dynamic Risk Scoring.

---

## 🌟 Key Features

- **🚁 Multi-Asset Inspection Pipeline**: Detects Potholes (Roads), Structural Cracks (Concrete/Buildings), Steel Corrosion (Bridges), and Track Misalignments (Railways).
- **📐 Open3D Volumetric Analysis**: Calculates exact 3D defect volume ($m^3$), surface area ($m^2$), and max depth ($\text{cm}$) from depth maps & point clouds.
- **💰 Civil Engineering Material & Cost Engine**: Automatically estimates required materials (Bitumen Asphalt, Concrete 1:2:4 ratio, Zinc Primer, Rail Ballast) and repair budget based on civil unit rates.
- **🚨 Dynamic Risk Scoring & Alerts**: Classifies defect risk (Low, Medium, High, Critical) and dispatches instant **Twilio SMS** and **Nodemailer Email** alerts.
- **🗺️ Interactive GIS Web Map**: Built with React, TypeScript, Tailwind CSS, and Leaflet.js with custom risk-pin markers and heatmaps.
- **📄 PDF Audit Report Exporter**: Generates official PDF audit reports for municipal and PWD authority sign-offs.

---

## 🏗️ Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Leaflet.js
- **Backend API**: Node.js, Express.js, JWT, PDFKit, Nodemailer, Twilio API
- **AI/ML Engine**: Python, OpenCV, YOLOv8, Open3D, NumPy
- **Drone Simulator**: Microsoft AirSim API & Synthetic Data Stream Generator

---

## 🚀 Quick Start Guide

### 1. Start Python AI Microservice (Port 5001)
```bash
cd ai_engine
python3 app.py
```

### 2. Start Express Backend API (Port 5002)
```bash
cd backend
npm install
npm start
```

### 3. Start React Web Dashboard (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📸 Screenshots & Architecture Diagram

Check project architecture documentation in the repository design docs.
