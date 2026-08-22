import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export const Drone3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Fog
    const scene = new THREE.Scene();
    const isDark = themeRef.current === 'dark';
    const fogColor = isDark ? 0x0B0F17 : 0xF8FAFC;
    scene.fog = new THREE.FogExp2(fogColor, 0.025);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 7.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(fogColor, isDark ? 0.4 : 0.25);
    container.appendChild(renderer.domElement);

    // Lighting System
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1E293B : 0xFFFFFF, 1.6);
    scene.add(ambientLight);

    // Primary Directional Light (Aerospace Teal Accent)
    const brandColorHex = isDark ? 0x38BDF8 : 0x0284C7;
    const rimLight = new THREE.DirectionalLight(brandColorHex, 2.0);
    rimLight.position.set(-6, 8, 4);
    scene.add(rimLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    // Underbody Sensor Point Light
    const sensorLight = new THREE.PointLight(brandColorHex, 2.5, 12);
    sensorLight.position.set(0, -0.2, 0);
    scene.add(sensorLight);

    // ----------------------------------------------------
    // Drone Model Assembly (Clean Metallic / Matte Aerospace Finish)
    // ----------------------------------------------------
    const droneGroup = new THREE.Group();

    // Central Chassis
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.28, 1.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1E293B : 0xE2E8F0,
      metalness: 0.6,
      roughness: 0.2,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
    droneGroup.add(bodyMesh);

    // Top Avionics Plate
    const topPlateGeo = new THREE.BoxGeometry(1.0, 0.08, 1.0);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: brandColorHex,
      metalness: 0.8,
      roughness: 0.1,
    });
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlateMesh.position.y = 0.18;
    droneGroup.add(topPlateMesh);

    // Optical Sensor Lens
    const sensorGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const sensorMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      transmission: 0.8,
      emissive: brandColorHex,
      emissiveIntensity: 0.6
    });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(0, -0.20, 0.2);
    droneGroup.add(sensorMesh);

    // Arms & Motors
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const rotors: THREE.Mesh[] = [];
    const armDist = 1.35;

    armAngles.forEach((angle) => {
      const armGeo = new THREE.CylinderGeometry(0.06, 0.06, armDist * 1.8);
      const armMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x334155 : 0x94A3B8,
        metalness: 0.7,
        roughness: 0.3
      });
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.rotation.z = Math.PI / 2;
      armMesh.rotation.y = angle;
      droneGroup.add(armMesh);

      // Motor Housing
      const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.28, 24);
      const motorMat = new THREE.MeshStandardMaterial({ color: brandColorHex, metalness: 0.8, roughness: 0.2 });
      const motorMesh = new THREE.Mesh(motorGeo, motorMat);
      const posX = Math.cos(angle) * armDist;
      const posZ = Math.sin(angle) * armDist;
      motorMesh.position.set(posX, 0.12, posZ);
      droneGroup.add(motorMesh);

      // Rotor Blades
      const bladeGeo = new THREE.BoxGeometry(1.2, 0.015, 0.08);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0xF8FAFC : 0x0F172A,
        roughness: 0.1
      });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(posX, 0.27, posZ);
      droneGroup.add(bladeMesh);
      rotors.push(bladeMesh);
    });

    scene.add(droneGroup);

    // Grid Floor
    const gridGeo = new THREE.PlaneGeometry(50, 50, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: brandColorHex,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.12 : 0.08
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -3.8;
    scene.add(gridMesh);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Hover
      droneGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.2 + 0.2;
      droneGroup.position.x = Math.cos(elapsedTime * 0.7) * 0.3;
      droneGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.12;
      droneGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.04;
      droneGroup.rotation.x = Math.cos(elapsedTime * 0.9) * 0.03;

      // Rotors spinning
      rotors.forEach((r) => {
        r.rotation.y += 0.5;
      });

      // Scroll floor grid
      gridMesh.position.z = (elapsedTime * 0.4) % 1.25;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-50 overflow-hidden transition-opacity duration-300"
    />
  );
};
