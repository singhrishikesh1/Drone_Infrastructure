import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Drone3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080f, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06080f, 0.4);
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x00f3ff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 20);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // ----------------------------------------------------
    // Create Procedural 3D Drone Model
    // ----------------------------------------------------
    const droneGroup = new THREE.Group();

    // Drone Body Core (Hexagonal / Sleek Box)
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.35, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    droneGroup.add(bodyMesh);

    // Glowing Core Sensor Dome
    const domeGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 0.2;
    droneGroup.add(domeMesh);

    // Drone Arms (4 carbon fiber arms)
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const rotors: THREE.Mesh[] = [];

    armAngles.forEach((angle) => {
      // Arm shaft
      const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.rotation.z = Math.PI / 2;
      armMesh.rotation.y = angle;
      droneGroup.add(armMesh);

      // Motor Pod
      const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const motorMesh = new THREE.Mesh(motorGeo, motorMat);
      const dist = 0.8;
      motorMesh.position.set(Math.cos(angle) * dist, 0.1, Math.sin(angle) * dist);
      droneGroup.add(motorMesh);

      // Glowing Propeller Ring
      const ringGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(Math.cos(angle) * dist, 0.2, Math.sin(angle) * dist);
      droneGroup.add(ringMesh);

      // Rotor Blades
      const bladeGeo = new THREE.BoxGeometry(0.65, 0.015, 0.08);
      const bladeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(Math.cos(angle) * dist, 0.22, Math.sin(angle) * dist);
      droneGroup.add(bladeMesh);
      rotors.push(bladeMesh);
    });

    // Downward LiDAR Laser Ring Grid
    const scanRingGeo = new THREE.RingGeometry(0.5, 3.5, 32);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    const scanRingMesh = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRingMesh.rotation.x = Math.PI / 2;
    scanRingMesh.position.y = -2.5;
    droneGroup.add(scanRingMesh);

    scene.add(droneGroup);

    // Background Particle Starfield Grid
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 280;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 30;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    });
    const particlePoints = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlePoints);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Hover movement (sine wave float & tilt)
      droneGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.35 + 0.5;
      droneGroup.position.x = Math.cos(elapsedTime * 0.8) * 0.6;
      droneGroup.rotation.y = elapsedTime * 0.2;
      droneGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.08;

      // Rotate rotor blades at high speed
      rotors.forEach((rotor) => {
        rotor.rotation.y += 0.45;
      });

      // Pulse scan grid plane
      scanRingMesh.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.15);

      // Rotate background particles
      particlePoints.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
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
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 overflow-hidden"
    />
  );
};
