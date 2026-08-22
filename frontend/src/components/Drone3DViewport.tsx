import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Eye, RotateCcw, Zap, Compass, Maximize2, ShieldAlert, Cpu, Radio } from 'lucide-react';

interface Drone3DViewportProps {
  height?: string;
}

export const Drone3DViewport: React.FC<Drone3DViewportProps> = ({ height = '450px' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  
  const [laserActive, setLaserActive] = useState<boolean>(true);
  const [rotorSpeed, setRotorSpeed] = useState<'normal' | 'high' | 'off'>('normal');
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'front' | 'bottom' | 'top'>('orbit');

  const laserRef = useRef(laserActive);
  const speedRef = useRef(rotorSpeed);
  const themeRef = useRef(resolvedTheme);

  useEffect(() => { laserRef.current = laserActive; }, [laserActive]);
  useEffect(() => { speedRef.current = rotorSpeed; }, [rotorSpeed]);
  useEffect(() => { themeRef.current = resolvedTheme; }, [resolvedTheme]);

  const cameraTargetRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 6.5,
    theta: Math.PI / 4,
    phi: Math.PI / 3
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const isDark = themeRef.current === 'dark';
    const bgHex = isDark ? 0x090D16 : 0xF1F5F9;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.02);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(isDark ? 0x334155 : 0xFFFFFF, 1.8);
    scene.add(ambient);

    const brandColorHex = isDark ? 0x38BDF8 : 0x0284C7;

    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(brandColorHex, 2.5);
    rimLight.position.set(-6, 6, -4);
    scene.add(rimLight);

    const underLight = new THREE.PointLight(brandColorHex, 3.0, 10);
    underLight.position.set(0, -0.5, 0);
    scene.add(underLight);

    // ----------------------------------------------------
    // Drone Detailed Model Construction
    // ----------------------------------------------------
    const droneGroup = new THREE.Group();

    // Central Main Chassis Core
    const chassisGeo = new THREE.BoxGeometry(1.6, 0.32, 1.6);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1E293B : 0xFFFFFF,
      metalness: 0.7,
      roughness: 0.2,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    droneGroup.add(chassisMesh);

    // Top Avionics Deck Plate
    const topPlateGeo = new THREE.BoxGeometry(1.1, 0.09, 1.1);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: brandColorHex,
      metalness: 0.8,
      roughness: 0.1,
    });
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlateMesh.position.y = 0.20;
    droneGroup.add(topPlateMesh);

    // Front Camera Mount Pod
    const cameraPodGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const cameraPodMat = new THREE.MeshPhysicalMaterial({
      color: 0x0F172A,
      roughness: 0.1,
      transmission: 0.6,
      emissive: brandColorHex,
      emissiveIntensity: 0.5
    });
    const cameraPodMesh = new THREE.Mesh(cameraPodGeo, cameraPodMat);
    cameraPodMesh.position.set(0, -0.22, 0.4);
    droneGroup.add(cameraPodMesh);

    // Arms & Motor Pods
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const rotors: THREE.Mesh[] = [];
    const rotorDiscs: THREE.Mesh[] = [];
    const armDist = 1.45;

    armAngles.forEach((angle, idx) => {
      const armGeo = new THREE.CylinderGeometry(0.07, 0.07, armDist * 1.8);
      const armMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x334155 : 0x94A3B8,
        metalness: 0.8,
        roughness: 0.3
      });
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.rotation.z = Math.PI / 2;
      armMesh.rotation.y = angle;
      droneGroup.add(armMesh);

      // Motor Base
      const motorGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 24);
      const motorMat = new THREE.MeshStandardMaterial({ color: brandColorHex, metalness: 0.8, roughness: 0.2 });
      const motorMesh = new THREE.Mesh(motorGeo, motorMat);
      const posX = Math.cos(angle) * armDist;
      const posZ = Math.sin(angle) * armDist;
      motorMesh.position.set(posX, 0.14, posZ);
      droneGroup.add(motorMesh);

      // LED Nav Lights (Front Green, Rear Red)
      const ledGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const ledMat = new THREE.MeshBasicMaterial({ color: idx < 2 ? 0x16A34A : 0xE11D48 });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(posX, -0.08, posZ);
      droneGroup.add(ledMesh);

      // Rotor Blade Assembly
      const bladeGeo = new THREE.BoxGeometry(1.3, 0.015, 0.09);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0xF8FAFC : 0x0F172A,
        roughness: 0.1
      });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(posX, 0.30, posZ);
      droneGroup.add(bladeMesh);
      rotors.push(bladeMesh);

      // Motion blur transparent disc
      const discGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.005, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: brandColorHex,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.set(posX, 0.31, posZ);
      droneGroup.add(discMesh);
      rotorDiscs.push(discMesh);
    });

    // Conical LiDAR Scanning Laser Beam
    const laserGeo = new THREE.ConeGeometry(3.5, 6, 32, 1, true);
    const laserMat = new THREE.MeshBasicMaterial({
      color: brandColorHex,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const laserConeMesh = new THREE.Mesh(laserGeo, laserMat);
    laserConeMesh.position.y = -3.2;
    droneGroup.add(laserConeMesh);

    scene.add(droneGroup);

    // Floor Target Grid
    const gridGeo = new THREE.PlaneGeometry(30, 30, 30, 30);
    const gridMat = new THREE.MeshBasicMaterial({
      color: brandColorHex,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.15 : 0.1
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -3.8;
    scene.add(gridMesh);

    // Interactive Mouse Dragging (Rotate & Zoom)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraTargetRef.current.theta -= deltaX * 0.008;
      cameraTargetRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraTargetRef.current.phi - deltaY * 0.008));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraTargetRef.current.radius = Math.max(3.5, Math.min(12.0, cameraTargetRef.current.radius + e.deltaY * 0.005));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Positioning from Target Spherical Coordinates
      const { radius, theta, phi } = cameraTargetRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);

      // Hover physics
      droneGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.15;
      droneGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.08;
      droneGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.03;

      // Rotor animation according to speed control
      let rotIncrement = 0.5;
      if (speedRef.current === 'high') rotIncrement = 0.9;
      if (speedRef.current === 'off') rotIncrement = 0;

      rotors.forEach((r) => {
        r.rotation.y += rotIncrement;
      });

      // Laser scanner toggle & pulse
      laserConeMesh.visible = laserRef.current;
      if (laserRef.current) {
        laserConeMesh.rotation.y = elapsedTime * -0.6;
        laserMat.opacity = 0.08 + Math.sin(elapsedTime * 3) * 0.06;
      }

      gridMesh.position.z = (elapsedTime * 0.3) % 1.0;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('wheel', handleWheel);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [resolvedTheme]);

  // Preset Camera Angles Trigger
  const applyPreset = (preset: 'orbit' | 'front' | 'bottom' | 'top') => {
    setCameraPreset(preset);
    if (preset === 'orbit') {
      cameraTargetRef.current = { radius: 6.5, theta: Math.PI / 4, phi: Math.PI / 3 };
    } else if (preset === 'front') {
      cameraTargetRef.current = { radius: 4.5, theta: 0, phi: Math.PI / 2.2 };
    } else if (preset === 'bottom') {
      cameraTargetRef.current = { radius: 5.0, theta: Math.PI / 6, phi: Math.PI / 1.4 };
    } else if (preset === 'top') {
      cameraTargetRef.current = { radius: 7.0, theta: 0, phi: 0.1 };
    }
  };

  return (
    <div className="app-card p-4 space-y-3 font-sans relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-[var(--brand-primary)] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              SKYGUARDIAN-X1 • 3D INSPECTION VIEWPORT
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-mono font-semibold">
                INTERACTIVE 3D
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Click and drag to rotate 360° • Scroll mouse wheel to zoom</p>
          </div>
        </div>

        {/* Viewport Control Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto font-mono text-[11px]">
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
              laserActive
                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-xs'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
            }`}
          >
            LiDAR Beam: {laserActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setRotorSpeed(rotorSpeed === 'normal' ? 'high' : rotorSpeed === 'high' ? 'off' : 'normal')}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold transition-all hover:bg-[var(--bg-hover)]"
          >
            Rotors: <span className="uppercase text-[var(--brand-primary)] font-bold">{rotorSpeed}</span>
          </button>

          <button
            onClick={() => applyPreset('orbit')}
            className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-inner" style={{ height }}>
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Camera Angle Presets Overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 bg-[var(--bg-surface)]/90 backdrop-blur-md p-1.5 rounded-xl border border-[var(--border-subtle)] text-[11px] font-mono shadow-md">
          {[
            { id: 'orbit', label: '360° Orbit' },
            { id: 'front', label: 'Front POV' },
            { id: 'bottom', label: 'LiDAR View' },
            { id: 'top', label: 'Top Deck' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id as any)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                cameraPreset === preset.id
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Telemetry Live Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-10 bg-[var(--bg-surface)]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] space-y-1 shadow-md">
          <div className="font-bold text-[var(--brand-primary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" /> SKYGUARDIAN-X1 RTK
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            ROTORS: <span className="text-[var(--text-primary)] font-bold">11,400 RPM</span> | MOTORS: <span className="text-[var(--status-success)] font-bold">34°C NOMINAL</span>
          </div>
        </div>

        {/* Controls Instructions Hint */}
        <div className="absolute bottom-3 right-3 z-10 bg-[var(--bg-surface)]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] shadow-md hidden sm:block">
          🖱️ Click + Drag to rotate | Scroll to zoom
        </div>
      </div>
    </div>
  );
};
