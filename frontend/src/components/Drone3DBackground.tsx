import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Drone3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070B, 0.028);

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
    renderer.setClearColor(0x05070B, 0.5);
    container.appendChild(renderer.domElement);

    // Lighting System
    const ambientLight = new THREE.AmbientLight(0x0a1526, 0.6);
    scene.add(ambientLight);

    // Directional rim light (Cyan accent)
    const rimLight = new THREE.DirectionalLight(0x00f3ff, 1.5);
    rimLight.position.set(-6, 8, 4);
    scene.add(rimLight);

    // Key Light (Subtle White/Cool)
    const keyLight = new THREE.DirectionalLight(0x94a3b8, 0.8);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    // Underbody Sensor Point Light
    const sensorLight = new THREE.PointLight(0x00f3ff, 2.5, 12);
    sensorLight.position.set(0, -0.2, 0);
    scene.add(sensorLight);

    // ----------------------------------------------------
    // Build Realistic Matte Black Industrial Drone Model
    // ----------------------------------------------------
    const droneGroup = new THREE.Group();

    // Central Carbon Fiber Chassis Core
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.3, 1.4);
    const matteCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x0c1017,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, matteCarbonMat);
    droneGroup.add(bodyMesh);

    // Top Avionics Plate
    const topPlateGeo = new THREE.BoxGeometry(1.0, 0.1, 1.0);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: 0x141b26,
      metalness: 0.9,
      roughness: 0.2,
    });
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlateMesh.position.y = 0.2;
    droneGroup.add(topPlateMesh);

    // Glowing Optical Sensor Pod (Underneath)
    const sensorGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const sensorMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070B,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.4
    });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(0, -0.22, 0.2);
    droneGroup.add(sensorMesh);

    // Front Camera Lens Ring (Cyan)
    const lensRingGeo = new THREE.TorusGeometry(0.16, 0.03, 16, 32);
    const lensRingMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const lensRingMesh = new THREE.Mesh(lensRingGeo, lensRingMat);
    lensRingMesh.position.set(0, -0.22, 0.48);
    droneGroup.add(lensRingMesh);

    // 4 Carbon Arms & Motor Pods
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const rotors: THREE.Mesh[] = [];
    const rotorDiscs: THREE.Mesh[] = [];
    const armDist = 1.35;

    armAngles.forEach((angle, index) => {
      // Carbon arm shaft
      const armGeo = new THREE.CylinderGeometry(0.065, 0.065, armDist * 1.8);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x111622, metalness: 0.9, roughness: 0.3 });
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.rotation.z = Math.PI / 2;
      armMesh.rotation.y = angle;
      droneGroup.add(armMesh);

      // Motor Housing
      const motorGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 24);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95 });
      const motorMesh = new THREE.Mesh(motorGeo, motorMat);
      const posX = Math.cos(angle) * armDist;
      const posZ = Math.sin(angle) * armDist;
      motorMesh.position.set(posX, 0.12, posZ);
      droneGroup.add(motorMesh);

      // Arm End Cyan LED Beacon
      const ledGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const ledMat = new THREE.MeshBasicMaterial({ color: index < 2 ? 0x00f3ff : 0xa855f7 });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(posX, -0.08, posZ);
      droneGroup.add(ledMesh);

      // Rotor Blade Assembly (Dual Blade)
      const bladeGeo = new THREE.BoxGeometry(1.2, 0.015, 0.09);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(posX, 0.29, posZ);
      droneGroup.add(bladeMesh);
      rotors.push(bladeMesh);

      // Translucent Motion Blur Disc
      const discGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.005, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.set(posX, 0.3, posZ);
      droneGroup.add(discMesh);
      rotorDiscs.push(discMesh);
    });

    // ----------------------------------------------------
    // Downward LiDAR Laser Scanning Beam (Conical Grid)
    // ----------------------------------------------------
    const coneGeo = new THREE.ConeGeometry(3.5, 6, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const scanConeMesh = new THREE.Mesh(coneGeo, coneMat);
    scanConeMesh.position.y = -3.2;
    droneGroup.add(scanConeMesh);

    scene.add(droneGroup);

    // ----------------------------------------------------
    // Topographic Wireframe Ground Grid & Particle Field
    // ----------------------------------------------------
    const gridGeo = new THREE.PlaneGeometry(50, 50, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.07
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -3.8;
    scene.add(gridMesh);

    // Floating Particles Starfield
    const particleCount = 350;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 35;
      posArray[i + 1] = (Math.random() - 0.5) * 25;
      posArray[i + 2] = (Math.random() - 0.5) * 25;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });
    const particlePoints = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlePoints);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Physical Hovering Math (Sinusoidal bob, subtle tilt)
      droneGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.28 + 0.3;
      droneGroup.position.x = Math.cos(elapsedTime * 0.7) * 0.4;
      droneGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.15;
      droneGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.05;
      droneGroup.rotation.x = Math.cos(elapsedTime * 0.9) * 0.04;

      // High-speed rotor blade rotation
      rotors.forEach((rotor) => {
        rotor.rotation.y += 0.55;
      });

      // Pulse scanning laser beam opacity
      scanConeMesh.rotation.y = elapsedTime * -0.5;
      coneMat.opacity = 0.06 + Math.sin(elapsedTime * 3) * 0.04;

      // Scroll topographic grid under drone
      gridMesh.position.z = (elapsedTime * 0.5) % 1.25;

      // Rotate particle field
      particlePoints.rotation.y = elapsedTime * 0.02;

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
      className="fixed inset-0 pointer-events-none z-0 opacity-60 overflow-hidden"
    />
  );
};

