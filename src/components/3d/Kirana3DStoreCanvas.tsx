"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Move3d, RotateCw } from "lucide-react";

export default function Kirana3DStoreCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string>("A2 Desi Cow Ghee (Bilona Churned)");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting for Luxury Kirana Aesthetic
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const warmMainLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    warmMainLight.position.set(8, 12, 10);
    warmMainLight.castShadow = true;
    scene.add(warmMainLight);

    const goldAccentLight = new THREE.PointLight(0xd4af37, 4, 30);
    goldAccentLight.position.set(-6, 4, 4);
    scene.add(goldAccentLight);

    const emeraldFillLight = new THREE.PointLight(0x10b981, 2.5, 30);
    emeraldFillLight.position.set(5, -4, -3);
    scene.add(emeraldFillLight);

    // 4. Main Showcase Group
    const mainShowcaseGroup = new THREE.Group();
    scene.add(mainShowcaseGroup);

    // --- Object 1: Traditional Brass A2 Ghee Pot (Matka) ---
    const gheeGroup = new THREE.Group();
    
    // Pot Body
    const potBodyGeo = new THREE.SphereGeometry(1.2, 32, 24);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.18,
    });
    const potBody = new THREE.Mesh(potBodyGeo, brassMat);
    potBody.scale.set(1, 0.9, 1);
    potBody.castShadow = true;
    gheeGroup.add(potBody);

    // Pot Neck & Rim
    const neckGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.4, 32);
    const potNeck = new THREE.Mesh(neckGeo, brassMat);
    potNeck.position.y = 0.95;
    gheeGroup.add(potNeck);

    const rimGeo = new THREE.TorusGeometry(0.7, 0.08, 16, 32);
    const potRim = new THREE.Mesh(rimGeo, brassMat);
    potRim.position.y = 1.15;
    potRim.rotation.x = Math.PI / 2;
    gheeGroup.add(potRim);

    // Traditional Ghee Lid with Brass Knob
    const lidGeo = new THREE.CylinderGeometry(0.2, 0.62, 0.2, 32);
    const potLid = new THREE.Mesh(lidGeo, brassMat);
    potLid.position.y = 1.25;
    gheeGroup.add(potLid);

    const knobGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const lidKnob = new THREE.Mesh(knobGeo, brassMat);
    lidKnob.position.y = 1.4;
    gheeGroup.add(lidKnob);

    // Embossed decorative mid-band
    const bandGeo = new THREE.TorusGeometry(1.22, 0.05, 16, 48);
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1,
    });
    const potBand = new THREE.Mesh(bandGeo, bandMat);
    potBand.rotation.x = Math.PI / 2;
    gheeGroup.add(potBand);

    mainShowcaseGroup.add(gheeGroup);

    // --- Object 2: Burlap Basmati Rice Sack (Orbiting) ---
    const riceSackGroup = new THREE.Group();
    const sackBodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.2, 24);
    const sackMat = new THREE.MeshStandardMaterial({
      color: 0xc2b280, // Jute burlap tone
      roughness: 0.85,
      metalness: 0.05,
    });
    const sackBody = new THREE.Mesh(sackBodyGeo, sackMat);
    sackBody.castShadow = true;
    riceSackGroup.add(sackBody);

    // Tied sack top
    const sackTopGeo = new THREE.ConeGeometry(0.45, 0.5, 24);
    const sackTop = new THREE.Mesh(sackTopGeo, sackMat);
    sackTop.position.y = 0.75;
    riceSackGroup.add(sackTop);

    // Golden Rope Knot
    const ropeGeo = new THREE.TorusGeometry(0.48, 0.06, 12, 24);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.position.y = 0.55;
    rope.rotation.x = Math.PI / 2;
    riceSackGroup.add(rope);

    // "ROYAL BASMATI" label stripe
    const labelGeo = new THREE.CylinderGeometry(0.57, 0.62, 0.45, 24);
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const sackLabel = new THREE.Mesh(labelGeo, labelMat);
    sackLabel.position.y = -0.05;
    riceSackGroup.add(sackLabel);

    mainShowcaseGroup.add(riceSackGroup);

    // --- Object 3: Fresh Organic Alphonso Mango (Orbiting) ---
    const mangoGroup = new THREE.Group();
    const mangoGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const mangoMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Saffron Gold / Mango
      roughness: 0.25,
      metalness: 0.15,
    });
    const mangoBody = new THREE.Mesh(mangoGeo, mangoMat);
    mangoBody.scale.set(0.9, 1.2, 0.85);
    mangoBody.castShadow = true;
    mangoGroup.add(mangoBody);

    // Mango Green Stem & Leaf
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.3, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.7;
    mangoGroup.add(stem);

    const leafGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.scale.set(0.2, 0.6, 0.05);
    leaf.position.set(0.15, 0.75, 0);
    leaf.rotation.z = Math.PI / 4;
    mangoGroup.add(leaf);

    mainShowcaseGroup.add(mangoGroup);

    // --- Object 4: Cold-Pressed Oil Glass Bottle (Orbiting) ---
    const oilGroup = new THREE.Group();
    const bottleBodyGeo = new THREE.CylinderGeometry(0.4, 0.42, 1.3, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    const bottleBody = new THREE.Mesh(bottleBodyGeo, glassMat);
    bottleBody.castShadow = true;
    oilGroup.add(bottleBody);

    const bottleNeckGeo = new THREE.CylinderGeometry(0.16, 0.25, 0.5, 16);
    const bottleNeck = new THREE.Mesh(bottleNeckGeo, glassMat);
    bottleNeck.position.y = 0.85;
    oilGroup.add(bottleNeck);

    const corkGeo = new THREE.CylinderGeometry(0.17, 0.15, 0.25, 16);
    const corkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const cork = new THREE.Mesh(corkGeo, corkMat);
    cork.position.y = 1.15;
    oilGroup.add(cork);

    mainShowcaseGroup.add(oilGroup);

    // --- Object 5: Pure Heritage Kashmiri Saffron / Spice Pot ---
    const spiceGroup = new THREE.Group();
    const spiceGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.5, 6);
    const spiceMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Deep Saffron Red
      metalness: 0.6,
      roughness: 0.3,
    });
    const spiceBody = new THREE.Mesh(spiceGeo, spiceMat);
    spiceBody.castShadow = true;
    spiceGroup.add(spiceBody);

    const spiceLidGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.15, 6);
    const spiceLid = new THREE.Mesh(spiceLidGeo, brassMat);
    spiceLid.position.y = 0.3;
    spiceGroup.add(spiceLid);

    mainShowcaseGroup.add(spiceGroup);

    // 5. Floating Grain & Spice Particles Field (Golden Wheat & Cardamom Dust)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
      particleScales[i] = Math.random() * 0.08 + 0.03;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainShowcaseGroup.add(particles);

    // 6. Interactive 360° Drag & Mouse Movement
    let isUserInteracting = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isUserInteracting = true;
      setIsDragging(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isUserInteracting) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMouseX;
      const deltaY = clientY - previousMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;

      // Clamp X rotation to avoid flipping upside down
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
      setIsDragging(false);
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // 7. Dynamic Animation Loop with Multi-Item Orbiting
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Continuous gentle auto-rotation if user isn't actively dragging
      if (!isUserInteracting) {
        targetRotationY += 0.002;
      }

      // Smooth Lerp Rotation for 360° Inspection
      mainShowcaseGroup.rotation.y += (targetRotationY - mainShowcaseGroup.rotation.y) * 0.06;
      mainShowcaseGroup.rotation.x += (targetRotationX - mainShowcaseGroup.rotation.x) * 0.06;

      // Central Ghee Pot gentle floating bob
      gheeGroup.position.y = Math.sin(t * 0.8) * 0.08;
      gheeGroup.rotation.y = Math.sin(t * 0.4) * 0.15;

      // Orbit 1: Basmati Rice Sack (Gentle, Relaxed Glide)
      const r1 = 2.4;
      const angle1 = t * 0.28;
      riceSackGroup.position.set(Math.cos(angle1) * r1, Math.sin(t * 1.1 + 1) * 0.12 + 0.15, Math.sin(angle1) * r1);
      riceSackGroup.rotation.y = -angle1 + Math.PI / 2;
      riceSackGroup.rotation.z = Math.sin(t * 0.6) * 0.08;

      // Orbit 2: Alphonso Mango
      const r2 = 2.3;
      const angle2 = angle1 + (Math.PI * 2) / 4;
      mangoGroup.position.set(Math.cos(angle2) * r2, Math.sin(t * 1.2 + 2) * 0.14 - 0.2, Math.sin(angle2) * r2);
      mangoGroup.rotation.y = t * 0.6;
      mangoGroup.rotation.x = Math.sin(t * 0.5) * 0.15;

      // Orbit 3: Cold-Pressed Oil Bottle
      const r3 = 2.5;
      const angle3 = angle1 + (Math.PI * 2 * 2) / 4;
      oilGroup.position.set(Math.cos(angle3) * r3, Math.sin(t * 1.0 + 3) * 0.12 + 0.2, Math.sin(angle3) * r3);
      oilGroup.rotation.y = t * 0.4;
      oilGroup.rotation.z = Math.sin(t * 0.7) * 0.1;

      // Orbit 4: Kashmiri Saffron & Spice Pot
      const r4 = 2.2;
      const angle4 = angle1 + (Math.PI * 2 * 3) / 4;
      spiceGroup.position.set(Math.cos(angle4) * r4, Math.sin(t * 1.3 + 4) * 0.1 - 0.3, Math.sin(angle4) * r4);
      spiceGroup.rotation.y = -t * 0.6;

      // Particle Field Swirl
      particles.rotation.y = t * 0.05;
      particles.rotation.x = Math.sin(t * 0.1) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-amber-500/10 via-zinc-900/60 to-zinc-950 border border-amber-500/30 dark:border-amber-500/20 shadow-2xl group select-none">
      {/* 3D WebGL Canvas Mounting Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Floating Badge - 350° 3D Kirana Orbit Live Indicator */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 text-[11px] font-bold text-amber-400 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>350° Interactive Kirana 3D Orbit</span>
        </div>
        <div className="hidden sm:inline-flex bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-[11px] text-zinc-300 items-center gap-1.5">
          <Move3d className="w-3.5 h-3.5 text-amber-500" />
          <span>Drag 360° to Rotate</span>
        </div>
      </div>

      {/* Bottom Floating Item Spotlight Bar */}
      <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/90 backdrop-blur-xl p-3.5 rounded-2xl border border-amber-500/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black shadow-md flex-shrink-0">
            🍯
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Shaswat Royal Kirana Collection</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[11px] text-zinc-400">
              A2 Bilona Ghee • Royal Basmati Rice • Alphonso Mangoes • Pure Mustard Oil • Kashmiri Saffron
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 whitespace-nowrap">
          <RotateCw className="w-3 h-3 animate-spin" />
          <span>Live 3D Physics</span>
        </div>
      </div>
    </div>
  );
}
