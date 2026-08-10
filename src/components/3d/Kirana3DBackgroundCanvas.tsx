"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Kirana3DBackgroundCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // 2. Renderer with Alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 3. Dynamic Cursor-Tracking Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const cursorPointLight = new THREE.PointLight(0xf59e0b, 3.5, 35);
    cursorPointLight.position.set(0, 0, 8);
    scene.add(cursorPointLight);

    const accentGreenLight = new THREE.PointLight(0x10b981, 2, 30);
    accentGreenLight.position.set(-8, -6, 5);
    scene.add(accentGreenLight);

    // 4. Background Floating Kirana 3D Elements
    const backgroundGroup = new THREE.Group();
    scene.add(backgroundGroup);

    // Materials
    const goldGrainMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.25,
    });

    const cardamomMat = new THREE.MeshStandardMaterial({
      color: 0x65a30d, // Fresh Green Cardamom
      roughness: 0.4,
      metalness: 0.1,
    });

    const cloveMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Deep Clove/Cinnamon Brown
      roughness: 0.6,
      metalness: 0.15,
    });

    const starAniseMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412, // Star Anise Rust
      roughness: 0.5,
      metalness: 0.2,
    });

    const honeyDropMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75,
      transmission: 0.6,
    });

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.5,
      metalness: 0.05,
    });

    // Mesh Geometries
    const grainGeo = new THREE.SphereGeometry(0.35, 12, 12);
    grainGeo.scale(0.6, 1.4, 0.6); // Rice/Wheat Grain shape

    const cardamomGeo = new THREE.SphereGeometry(0.45, 16, 16);
    cardamomGeo.scale(0.8, 1.3, 0.8); // Cardamom Pod shape

    const cloveHeadGeo = new THREE.SphereGeometry(0.3, 10, 10);
    const cloveStemGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.8, 8);

    const leafGeo = new THREE.SphereGeometry(0.5, 12, 12);
    leafGeo.scale(0.2, 1.2, 0.05);

    const honeyDropGeo = new THREE.ConeGeometry(0.4, 0.8, 16);
    honeyDropGeo.scale(0.9, 1, 0.9);

    // Array of Floating Items with custom float physics
    const floatingItems: {
      mesh: THREE.Object3D;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedX: number;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      parallaxFactor: number;
    }[] = [];

    const ITEM_COUNT = 32;

    for (let i = 0; i < ITEM_COUNT; i++) {
      let mesh: THREE.Object3D;
      const type = i % 6;

      if (type === 0 || type === 1) {
        // Golden Wheat / Rice Grain
        mesh = new THREE.Mesh(grainGeo, goldGrainMat);
      } else if (type === 2) {
        // Fresh Green Cardamom Pod
        mesh = new THREE.Mesh(cardamomGeo, cardamomMat);
      } else if (type === 3) {
        // Clove (Laung)
        const cloveGroup = new THREE.Group();
        const head = new THREE.Mesh(cloveHeadGeo, cloveMat);
        const stem = new THREE.Mesh(cloveStemGeo, cloveMat);
        stem.position.y = -0.4;
        cloveGroup.add(head);
        cloveGroup.add(stem);
        mesh = cloveGroup;
      } else if (type === 4) {
        // Honey / Ghee Amber Droplet
        mesh = new THREE.Mesh(honeyDropGeo, honeyDropMat);
      } else {
        // Organic Green Leaf (Tulsi / Bay Leaf)
        mesh = new THREE.Mesh(leafGeo, leafMat);
      }

      // Distribute widely across the 3D viewport canvas
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 12 - 2;

      mesh.position.set(x, y, z);
      const scale = Math.random() * 0.6 + 0.6;
      mesh.scale.set(scale, scale, scale);

      backgroundGroup.add(mesh);

      floatingItems.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.5,
        rotSpeedX: (Math.random() - 0.5) * 1.2,
        rotSpeedY: (Math.random() - 0.5) * 1.5,
        rotSpeedZ: (Math.random() - 0.5) * 0.8,
        parallaxFactor: (Math.random() * 0.8 + 0.4) * (z > 0 ? 1.5 : 0.8),
      });
    }

    // 5. Golden Dust / Turmeric Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.07,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    backgroundGroup.add(particles);

    // 6. Interactive Cursor Tracking State
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized between -1 and 1
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Animation Loop with Cursor Reaction
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Lerp for Cursor
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Update Cursor Light Position in 3D
      cursorPointLight.position.x = mouseX * 10;
      cursorPointLight.position.y = mouseY * 8;

      // Camera gentle parallax response to cursor
      camera.position.x = mouseX * 1.2;
      camera.position.y = mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Animate background spices and items
      for (let i = 0; i < floatingItems.length; i++) {
        const item = floatingItems[i];
        
        // Gentle organic floating oscillation
        const floatOffsetX = Math.sin(elapsed * 0.5 + i) * 0.4;
        const floatOffsetY = Math.cos(elapsed * 0.6 + i * 1.5) * 0.5;

        // Reactive cursor displacement (objects repel slightly and follow cursor depth)
        const cursorDisplaceX = mouseX * item.parallaxFactor * 2.5;
        const cursorDisplaceY = mouseY * item.parallaxFactor * 2.0;

        item.mesh.position.x = item.baseX + floatOffsetX + cursorDisplaceX;
        item.mesh.position.y = item.baseY + floatOffsetY + cursorDisplaceY;

        // Rotation
        item.mesh.rotation.x = elapsed * item.rotSpeedX * 0.4 + mouseY * 0.5;
        item.mesh.rotation.y = elapsed * item.rotSpeedY * 0.4 + mouseX * 0.5;
        item.mesh.rotation.z = elapsed * item.rotSpeedZ * 0.3;
      }

      // Ambient particle drift
      particles.rotation.y = elapsed * 0.03 + mouseX * 0.1;
      particles.rotation.x = elapsed * 0.02 + mouseY * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 dark:opacity-60 overflow-hidden"
      aria-hidden="true"
    />
  );
}
