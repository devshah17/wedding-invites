'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Botanical 3D Floral Hibiscus Frame Borders (SacredSurroundings)
 * - Reference: 'Floral Hibiscus Frame Borders.png'
 * - Every single leaf is an individual 3D curved mesh organized into natural botanical rosettes
 *   and scalloped mounds, exactly matching the reference shrub hedge.
 * - Leaves possess 3D V-crease midribs and longitudinal arching, catching dynamic glossy specular highlights.
 * - Real-Time Botanical Wind Physics: Each leaf rotates, rolls, and flutters around its stem pivot
 *   independently as fluid wind waves and periodic gust swells ripple through.
 * - Edge-Flush Guarantee: Rooted at x = -width/2 and x = width/2 with zero gap on mobile and PC.
 * - 3D Hibiscus Blossoms: 5-petal overlapping cups with radiant crimson-to-blush velvet textures
 *   and protruding golden stamen columns.
 * - 100% Non-Blocking: Canvas has pointer-events: none, preserving full click-through for all UI elements.
 */

interface DynamicLeaf {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  phaseSeed: number;
  flex: number;
}

interface DynamicFlower {
  group: THREE.Group;
  baseX: number;
  baseY: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  petals: THREE.Mesh[];
  basePetalRotX: number[];
  stamen: THREE.Group;
  swayPhase: number;
}

interface FallingPetal3D {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rotVx: number;
  rotVy: number;
  rotVz: number;
  life: number;
  maxLife: number;
}

/* 1. Procedural High-Resolution Texture for Glossy Botanical Leaves */
function createGlossyLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth botanical gradient: dark emerald base -> rich foliage green -> bright sunlit apex
  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0.0, '#153A10'); // deep shadow petiole
  grad.addColorStop(0.3, '#265C1C'); // base foliage
  grad.addColorStop(0.65, '#3E8A2B'); // rich emerald body
  grad.addColorStop(0.9, '#5BA53A'); // vibrant sunlit mid
  grad.addColorStop(1.0, '#75BC49'); // bright apex
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle natural leaf margin edge shade
  const edgeGrad = ctx.createRadialGradient(128, 256, 40, 128, 256, 128);
  edgeGrad.addColorStop(0.0, 'rgba(255,255,255,0.06)');
  edgeGrad.addColorStop(0.8, 'rgba(0,0,0,0.0)');
  edgeGrad.addColorStop(1.0, 'rgba(10,35,8,0.3)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Central pale midrib vein
  ctx.strokeStyle = 'rgba(185, 235, 145, 0.75)';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(128, 512);
  ctx.quadraticCurveTo(127, 260, 128, 20);
  ctx.stroke();

  // Delicate lateral veins fanning outward along the leaf blade
  ctx.strokeStyle = 'rgba(155, 215, 120, 0.35)';
  ctx.lineWidth = 1.6;
  for (let y = 60; y < 480; y += 36) {
    ctx.beginPath();
    ctx.moveTo(128, y);
    ctx.quadraticCurveTo(85, y - 16, 28, y - 36);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(128, y);
    ctx.quadraticCurveTo(171, y - 16, 228, y - 36);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/* 2. Procedural Texture for Velvet Hibiscus Petals */
function createHibiscusPetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FF2E93';
  ctx.fillRect(0, 0, 256, 256);

  // Radial gradient: deep crimson throat -> vibrant fuchsia -> soft blush pink edge
  const grad = ctx.createRadialGradient(128, 240, 10, 128, 120, 195);
  grad.addColorStop(0.0, '#740026'); // deep crimson throat
  grad.addColorStop(0.2, '#B81355'); // ruby magenta
  grad.addColorStop(0.55, '#FF1493'); // deep fuchsia
  grad.addColorStop(0.82, '#FF69B4'); // warm pink
  grad.addColorStop(1.0, '#FFA8C5'); // ruffled edge blush
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Radiating delicate petal veins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.3;
  for (let i = -16; i <= 16; i++) {
    ctx.beginPath();
    ctx.moveTo(128, 240);
    const endX = 128 + i * 7.5;
    const cpX = 128 + i * 4.5;
    ctx.quadraticCurveTo(cpX, 120, endX, 16);
    ctx.stroke();
  }

  // Soft secondary dark crimson throat streaks
  ctx.strokeStyle = 'rgba(90, 0, 30, 0.4)';
  ctx.lineWidth = 2.0;
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(128, 240);
    ctx.quadraticCurveTo(128 + i * 3.5, 175, 128 + i * 6.5, 95);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/* 3. 3D Obovate Curved Leaf Geometry (Pivot at base 0,0,0) */
function createCurvedLeafGeometry(w = 26, l = 52): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // stem attachment pivot!
  // Spoon / obovate curve matching reference image
  shape.bezierCurveTo(-w * 0.22, l * 0.22, -w * 0.58, l * 0.62, -w * 0.36, l * 0.92);
  shape.bezierCurveTo(-w * 0.16, l * 1.02, 0, l * 1.0, 0, l * 1.0); // rounded apex
  shape.bezierCurveTo(0, l * 1.0, w * 0.16, l * 1.02, w * 0.36, l * 0.92);
  shape.bezierCurveTo(w * 0.58, l * 0.62, w * 0.22, l * 0.22, 0, 0);

  const geom = new THREE.ShapeGeometry(shape, 10);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = y / l;
    // Central V-crease along midrib so specular light splits realistically
    const crease = -Math.abs(x) * 0.28;
    // Longitudinal arching curve along the blade
    const arch = Math.sin(normY * Math.PI) * 3.8;
    pos.setZ(i, crease + arch);
  }
  geom.computeVertexNormals();
  return geom;
}

/* 4. 3D Cupped Hibiscus Petal Geometry */
function createCurvedPetalGeometry(w = 40, l = 62): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-w * 0.35, l * 0.18, -w * 0.72, l * 0.52, -w * 0.62, l * 0.85);
  shape.bezierCurveTo(-w * 0.35, l * 1.04, 0, l * 0.96, w * 0.35, l * 1.04);
  shape.bezierCurveTo(w * 0.62, l * 0.85, w * 0.72, l * 0.52, w * 0.35, l * 0.18);
  shape.bezierCurveTo(w * 0.18, l * 0.06, 0, 0, 0, 0);

  const geom = new THREE.ShapeGeometry(shape, 10);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = Math.min(1, Math.max(0, y / l));
    const cup = -Math.sin(normY * Math.PI * 0.8) * 8.0;
    const ripple = Math.sin((x / w) * Math.PI * 3.0) * 1.6 * normY;
    pos.setZ(i, cup + ripple);
  }
  geom.computeVertexNormals();
  return geom;
}

export function SacredSurroundings() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Orthographic Pixel Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      2000
    );
    camera.position.z = 600;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Dynamic Lighting Setup for Realistic Glossy Botanical Leaves
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4);
    scene.add(ambientLight);

    // Warm sun directional light creating glossy specular highlights on curved leaf ridges
    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.0);
    sunLight.position.set(200, 450, 500);
    scene.add(sunLight);

    // Golden rim light defining ruffled foliage silhouettes
    const rimLight = new THREE.DirectionalLight(0xffd580, 0.9);
    rimLight.position.set(-250, -250, 300);
    scene.add(rimLight);

    // 4. Procedural Textures & Materials
    const leafTexture = createGlossyLeafTexture();
    const petalTexture = createHibiscusPetalTexture();

    // Standard glossy emerald leaf material
    const leafMaterial = new THREE.MeshStandardMaterial({
      map: leafTexture,
      roughness: 0.28,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });

    // Darker shadow leaf material for hedge depth and screen-border backing
    const leafShadowMaterial = new THREE.MeshStandardMaterial({
      color: 0x183a12,
      roughness: 0.42,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    // Bright sunlit sprout leaf material
    const leafSproutMaterial = new THREE.MeshStandardMaterial({
      color: 0x6db846,
      roughness: 0.22,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // Velvet hibiscus petal material
    const petalMaterial = new THREE.MeshStandardMaterial({
      map: petalTexture,
      roughness: 0.4,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Golden stamen column materials
    const stamenStemMat = new THREE.MeshStandardMaterial({
      color: 0xe91e63,
      roughness: 0.3,
      metalness: 0.1,
    });
    const antherMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.22,
      metalness: 0.38,
    });
    const stigmaMat = new THREE.MeshStandardMaterial({
      color: 0x880020,
      roughness: 0.3,
    });

    // 5. Geometries
    const leafGeomLarge = createCurvedLeafGeometry(28, 54);
    const leafGeomMid = createCurvedLeafGeometry(22, 42);
    const leafGeomSmall = createCurvedLeafGeometry(16, 30);
    const petalGeom = createCurvedPetalGeometry(42, 64);
    const stamenStemGeom = new THREE.CylinderGeometry(1.2, 0.8, 48, 8);
    const antherGeom = new THREE.SphereGeometry(1.2, 6, 6);
    const stigmaGeom = new THREE.SphereGeometry(1.5, 6, 6);

    // 6. Containers
    const leaves: DynamicLeaf[] = [];
    const flowers: DynamicFlower[] = [];
    const fallingPetals: FallingPetal3D[] = [];

    // Helper: Build a complete 3D Hibiscus Flower with stamen
    function buildHibiscusFlower(scale = 1.0, flip = false): {
      group: THREE.Group;
      petals: THREE.Mesh[];
      basePetalRotX: number[];
      stamen: THREE.Group;
    } {
      const flowerGroup = new THREE.Group();
      const petals: THREE.Mesh[] = [];
      const basePetalRotX: number[] = [];

      // 5 overlapping petals in pinwheel cup
      const petalCount = 5;
      for (let i = 0; i < petalCount; i++) {
        const petal = new THREE.Mesh(petalGeom, petalMaterial);
        const angle = i * ((Math.PI * 2) / petalCount);
        const flareX = 0.84;
        basePetalRotX.push(flareX);

        petal.rotation.z = angle;
        petal.rotation.x = flareX;
        petal.position.z = -i * 1.2;
        flowerGroup.add(petal);
        petals.push(petal);
      }

      // Central Golden Stamen Column
      const stamenGroup = new THREE.Group();
      const stem = new THREE.Mesh(stamenStemGeom, stamenStemMat);
      stem.position.y = 24;
      stamenGroup.add(stem);

      // Anther clusters
      for (let a = 0; a < 18; a++) {
        const anther = new THREE.Mesh(antherGeom, antherMat);
        const h = 26 + (a % 6) * 3.5;
        const aAngle = a * 1.4;
        const rad = 2.4 + Math.sin(a) * 0.8;
        anther.position.set(Math.cos(aAngle) * rad, h, Math.sin(aAngle) * rad);
        stamenGroup.add(anther);
      }

      // 5 Ruby Stigma pads at the tip
      for (let s = 0; s < 5; s++) {
        const stigma = new THREE.Mesh(stigmaGeom, stigmaMat);
        const sAngle = s * ((Math.PI * 2) / 5);
        stigma.position.set(Math.cos(sAngle) * 2.2, 49, Math.sin(sAngle) * 2.2);
        stamenGroup.add(stigma);
      }

      stamenGroup.rotation.x = 0.35 * (flip ? -1 : 1);
      stamenGroup.rotation.z = flip ? -0.25 : 0.25;
      stamenGroup.position.z = 6;
      flowerGroup.add(stamenGroup);

      flowerGroup.scale.set(scale, scale, scale);
      return { group: flowerGroup, petals, basePetalRotX, stamen: stamenGroup };
    }

    // 7. Generate Full Top-to-Bottom Shrub Hedges with Botanical Rosettes
    function populateHedges() {
      leaves.forEach((l) => scene.remove(l.mesh));
      flowers.forEach((f) => scene.remove(f.group));
      leaves.length = 0;
      flowers.length = 0;

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const hedgeReach = isMobile ? Math.min(85, width * 0.22) : isTablet ? 135 : 185;
      const flowerScale = isMobile ? 0.72 : isTablet ? 0.88 : 1.12;

      const yStart = height / 2 + 35;
      const yEnd = -height / 2 - 35;
      const yStep = isMobile ? 32 : 26;

      // ================= LEFT BORDER: BOTANICAL ROSETTES =================
      const leftRootX = -width / 2; // EXACT SCREEN LEFT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= yStep) {
        // A. Solid Wall Shadow Foliage (pinned tightly against left screen edge with zero gap)
        const wallLeaves = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeaves; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          const lx = leftRootX + w * (hedgeReach * 0.22) - 2;
          const ly = y + Math.sin(w * 2 + y * 0.05) * 10;
          const lz = -22 - w * 4;
          leaf.position.set(lx, ly, lz);

          const rotZ = Math.PI * 0.45 + (Math.random() - 0.5) * 0.3;
          const rotX = (Math.random() - 0.5) * 0.3;
          const rotY = 0.2;
          leaf.rotation.set(rotX, rotY, rotZ);
          scene.add(leaf);

          leaves.push({
            mesh: leaf,
            baseX: lx,
            baseY: ly,
            baseZ: lz,
            baseRotX: rotX,
            baseRotY: rotY,
            baseRotZ: rotZ,
            phaseSeed: y * 0.02 + w,
            flex: 0.35, // low flex near screen edge to keep attachment rock-solid
          });
        }

        // B. Mid-Canopy Rosettes: 5-6 leaves radiating from rosette center
        const rosetteCount = isMobile ? 2 : 3;
        for (let r = 0; r < rosetteCount; r++) {
          const reachFraction = (r + 1) / (rosetteCount + 0.4);
          const rosetteCenterX = leftRootX + reachFraction * hedgeReach * (0.8 + Math.sin(y * 0.03) * 0.2);
          const rosetteCenterY = y + Math.cos(r * 2 + y * 0.02) * 14;
          const rosetteCenterZ = -8 + r * 10;

          // Leaves per rosette
          const leavesInRosette = isMobile ? 4 : 5;
          for (let leafIdx = 0; leafIdx < leavesInRosette; leafIdx++) {
            const geom = r === rosetteCount - 1 ? leafGeomLarge : leafGeomMid;
            const mat = r === rosetteCount - 1 && leafIdx % 2 === 0 ? leafSproutMaterial : leafMaterial;
            const leaf = new THREE.Mesh(geom, mat);

            // Fan angle around rosette center
            const fanAngle = leafIdx * ((Math.PI * 1.8) / leavesInRosette) - Math.PI * 0.4;
            const tiltOut = 0.35 + (Math.random() - 0.5) * 0.2;

            const lx = rosetteCenterX + Math.cos(fanAngle) * 12;
            const ly = rosetteCenterY + Math.sin(fanAngle) * 12;
            const lz = rosetteCenterZ + leafIdx * 1.5;
            leaf.position.set(lx, ly, lz);

            const rotZ = fanAngle + Math.PI * 0.5;
            const rotX = tiltOut;
            const rotY = 0.25;
            leaf.rotation.set(rotX, rotY, rotZ);
            scene.add(leaf);

            leaves.push({
              mesh: leaf,
              baseX: lx,
              baseY: ly,
              baseZ: lz,
              baseRotX: rotX,
              baseRotY: rotY,
              baseRotZ: rotZ,
              phaseSeed: y * 0.015 + r * 3 + leafIdx,
              flex: 0.6 + reachFraction * 0.6,
            });
          }
        }

        // C. Foreground Sunlit Tips (cloud scallops puffing into the screen)
        if (!isMobile || y % 64 < 32) {
          const sproutLeaf = new THREE.Mesh(leafGeomSmall, leafSproutMaterial);
          const sx = leftRootX + hedgeReach * (0.92 + Math.sin(y * 0.04) * 0.12);
          const sy = y + Math.sin(y * 0.05) * 12;
          const sz = 16;
          sproutLeaf.position.set(sx, sy, sz);

          const sRotZ = Math.PI * 0.5 + (Math.random() - 0.5) * 0.4;
          const sRotX = 0.4;
          const sRotY = 0.3;
          sproutLeaf.rotation.set(sRotX, sRotY, sRotZ);
          scene.add(sproutLeaf);

          leaves.push({
            mesh: sproutLeaf,
            baseX: sx,
            baseY: sy,
            baseZ: sz,
            baseRotX: sRotX,
            baseRotY: sRotY,
            baseRotZ: sRotZ,
            phaseSeed: y * 0.02 + 8,
            flex: 1.25, // maximum leaf tip flutter
          });
        }
      }

      // Left Hibiscus Flowers at staggered heights
      const leftFlowerHeights = [
        height * 0.36,
        height * 0.15,
        -height * 0.08,
        -height * 0.3,
      ];
      leftFlowerHeights.forEach((fy, idx) => {
        const s = flowerScale * (idx % 2 === 0 ? 1.05 : 0.88);
        const { group, petals, basePetalRotX, stamen } = buildHibiscusFlower(s, false);
        const fx = leftRootX + hedgeReach * 0.74;
        const fz = 22;
        group.position.set(fx, fy, fz);

        const baseRotZ = Math.PI * 0.32 + (idx % 2 === 0 ? 0.2 : -0.2);
        const baseRotX = 0.28;
        const baseRotY = 0.24;
        group.rotation.set(baseRotX, baseRotY, baseRotZ);
        scene.add(group);

        flowers.push({
          group,
          baseX: fx,
          baseY: fy,
          baseRotX,
          baseRotY,
          baseRotZ,
          petals,
          basePetalRotX,
          stamen,
          swayPhase: idx * 1.8,
        });
      });

      // ================= RIGHT BORDER: BOTANICAL ROSETTES =================
      const rightRootX = width / 2; // EXACT SCREEN RIGHT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= yStep) {
        // A. Solid Wall Shadow Foliage (pinned tightly against right screen edge with zero gap)
        const wallLeaves = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeaves; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          const lx = rightRootX - w * (hedgeReach * 0.22) + 2;
          const ly = y + Math.sin(w * 2 + y * 0.05 + 2) * 10;
          const lz = -22 - w * 4;
          leaf.position.set(lx, ly, lz);

          const rotZ = -Math.PI * 0.45 + (Math.random() - 0.5) * 0.3;
          const rotX = (Math.random() - 0.5) * 0.3;
          const rotY = -0.2;
          leaf.rotation.set(rotX, rotY, rotZ);
          scene.add(leaf);

          leaves.push({
            mesh: leaf,
            baseX: lx,
            baseY: ly,
            baseZ: lz,
            baseRotX: rotX,
            baseRotY: rotY,
            baseRotZ: rotZ,
            phaseSeed: y * 0.02 + w + 12,
            flex: 0.35,
          });
        }

        // B. Mid-Canopy Rosettes: 5-6 leaves radiating from rosette center
        const rosetteCount = isMobile ? 2 : 3;
        for (let r = 0; r < rosetteCount; r++) {
          const reachFraction = (r + 1) / (rosetteCount + 0.4);
          const rosetteCenterX = rightRootX - reachFraction * hedgeReach * (0.8 + Math.cos(y * 0.03) * 0.2);
          const rosetteCenterY = y + Math.sin(r * 2 + y * 0.02) * 14;
          const rosetteCenterZ = -8 + r * 10;

          const leavesInRosette = isMobile ? 4 : 5;
          for (let leafIdx = 0; leafIdx < leavesInRosette; leafIdx++) {
            const geom = r === rosetteCount - 1 ? leafGeomLarge : leafGeomMid;
            const mat = r === rosetteCount - 1 && leafIdx % 2 === 0 ? leafSproutMaterial : leafMaterial;
            const leaf = new THREE.Mesh(geom, mat);

            const fanAngle = -leafIdx * ((Math.PI * 1.8) / leavesInRosette) + Math.PI * 0.4;
            const tiltOut = 0.35 + (Math.random() - 0.5) * 0.2;

            const lx = rosetteCenterX + Math.cos(fanAngle) * 12;
            const ly = rosetteCenterY + Math.sin(fanAngle) * 12;
            const lz = rosetteCenterZ + leafIdx * 1.5;
            leaf.position.set(lx, ly, lz);

            const rotZ = fanAngle - Math.PI * 0.5;
            const rotX = tiltOut;
            const rotY = -0.25;
            leaf.rotation.set(rotX, rotY, rotZ);
            scene.add(leaf);

            leaves.push({
              mesh: leaf,
              baseX: lx,
              baseY: ly,
              baseZ: lz,
              baseRotX: rotX,
              baseRotY: rotY,
              baseRotZ: rotZ,
              phaseSeed: y * 0.015 + r * 3 + leafIdx + 20,
              flex: 0.6 + reachFraction * 0.6,
            });
          }
        }

        // C. Foreground Sunlit Tips (cloud scallops puffing into the screen)
        if (!isMobile || y % 64 < 32) {
          const sproutLeaf = new THREE.Mesh(leafGeomSmall, leafSproutMaterial);
          const sx = rightRootX - hedgeReach * (0.92 + Math.cos(y * 0.04) * 0.12);
          const sy = y + Math.sin(y * 0.05 + 1) * 12;
          const sz = 16;
          sproutLeaf.position.set(sx, sy, sz);

          const sRotZ = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.4;
          const sRotX = 0.4;
          const sRotY = -0.3;
          sproutLeaf.rotation.set(sRotX, sRotY, sRotZ);
          scene.add(sproutLeaf);

          leaves.push({
            mesh: sproutLeaf,
            baseX: sx,
            baseY: sy,
            baseZ: sz,
            baseRotX: sRotX,
            baseRotY: sRotY,
            baseRotZ: sRotZ,
            phaseSeed: y * 0.02 + 18,
            flex: 1.25,
          });
        }
      }

      // Right Hibiscus Flowers at staggered heights (asymmetric to left)
      const rightFlowerHeights = [
        height * 0.42,
        height * 0.2,
        -height * 0.02,
        -height * 0.24,
        -height * 0.44,
      ];
      rightFlowerHeights.forEach((fy, idx) => {
        const s = flowerScale * (idx % 2 === 0 ? 1.02 : 0.86);
        const { group, petals, basePetalRotX, stamen } = buildHibiscusFlower(s, true);
        const fx = rightRootX - hedgeReach * 0.74;
        const fz = 22;
        group.position.set(fx, fy, fz);

        const baseRotZ = -Math.PI * 0.32 - (idx % 2 === 0 ? 0.2 : -0.2);
        const baseRotX = 0.28;
        const baseRotY = -0.24;
        group.rotation.set(baseRotX, baseRotY, baseRotZ);
        scene.add(group);

        flowers.push({
          group,
          baseX: fx,
          baseY: fy,
          baseRotX,
          baseRotY,
          baseRotZ,
          petals,
          basePetalRotX,
          stamen,
          swayPhase: idx * 1.8 + 2.5,
        });
      });
    }

    populateHedges();

    // 8. Event Handlers: Dynamic Scroll & Pointer Proximity
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      scrollVelocity = Math.max(-15, Math.min(15, delta * 0.35));
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollVelocity = 0;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let mouseX = -9999;
    let mouseY = -9999;
    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX - width / 2;
      mouseY = height / 2 - e.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Tap / Click Petal Burst on borders
    const handlePointerDown = (e: PointerEvent) => {
      const clickX = e.clientX;
      const triggerThreshold = width < 640 ? 110 : 200;

      if (clickX < triggerThreshold || clickX > width - triggerThreshold) {
        const worldX = e.clientX - width / 2;
        const worldY = height / 2 - e.clientY;
        const isLeft = clickX < width / 2;

        for (let p = 0; p < 7; p++) {
          const petalMesh = new THREE.Mesh(petalGeom, petalMaterial);
          petalMesh.scale.set(0.52, 0.52, 0.52);
          petalMesh.position.set(
            worldX + (Math.random() - 0.5) * 26,
            worldY + (Math.random() - 0.5) * 26,
            24 + Math.random() * 20
          );
          scene.add(petalMesh);

          fallingPetals.push({
            mesh: petalMesh,
            vx: (isLeft ? 1 : -1) * (2.2 + Math.random() * 3.8),
            vy: -1.4 - Math.random() * 3.2,
            vz: (Math.random() - 0.5) * 2.0,
            rotVx: (Math.random() - 0.5) * 0.1,
            rotVy: (Math.random() - 0.5) * 0.14,
            rotVz: (Math.random() - 0.5) * 0.08,
            life: 0,
            maxLife: 170 + Math.random() * 60,
          });
        }
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      populateHedges();
    };
    window.addEventListener('resize', handleResize);

    // 9. Real-Time Botanical Wind Physics Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // "Gaze of Wind": Periodic gust swells sweeping through foliage
      const gustEnvelope = Math.pow(Math.sin(time * 0.42) * 0.5 + 0.5, 1.8);
      const baseWind = 0.45;
      const windForce = (baseWind + gustEnvelope * 0.9) * (1 + Math.abs(scrollVelocity) * 0.14);
      const scrollTilt = scrollVelocity * 0.02;

      // Update Individual Leaves (each rotates & flexes on its stem pivot!)
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // Spatial wind wave propagating along Y and X
        const wave = Math.sin(time * 2.2 + leaf.baseY * 0.007 + leaf.phaseSeed);
        const microRustle = Math.cos(time * 5.2 + leaf.phaseSeed * 2.0);

        // Cursor proximity breeze
        const dx = leaf.mesh.position.x - mouseX;
        const dy = leaf.mesh.position.y - mouseY;
        const distSq = dx * dx + dy * dy;
        let pushX = 0;
        let pushY = 0;
        if (distSq < 32400) {
          // within 180px
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 180) * 14.0;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }

        // Apply realistic stem rotations
        leaf.mesh.rotation.z =
          leaf.baseRotZ + (wave * 0.16 + microRustle * 0.04) * windForce * leaf.flex + scrollTilt * leaf.flex;
        leaf.mesh.rotation.x =
          leaf.baseRotX + Math.sin(time * 2.5 + leaf.phaseSeed) * 0.1 * windForce * leaf.flex;
        leaf.mesh.rotation.y =
          leaf.baseRotY + Math.cos(time * 1.8 + leaf.phaseSeed * 1.4) * 0.08 * windForce * leaf.flex;

        // Physical displacement
        leaf.mesh.position.x = leaf.baseX + wave * 4.2 * windForce * leaf.flex + pushX;
        leaf.mesh.position.y = leaf.baseY + pushY;
        leaf.mesh.position.z = leaf.baseZ + Math.sin(time * 2.8 + leaf.phaseSeed) * 3.5 * leaf.flex;
      }

      // Update Individual Hibiscus Flowers
      for (let i = 0; i < flowers.length; i++) {
        const fl = flowers[i];
        const wave = Math.sin(time * 1.6 + fl.baseY * 0.006 + fl.swayPhase);

        // Flower body sways gently
        fl.group.rotation.z = fl.baseRotZ + wave * 0.075 * windForce + scrollTilt * 0.5;
        fl.group.rotation.x = fl.baseRotX + Math.cos(time * 1.3 + fl.swayPhase) * 0.05 * windForce;
        fl.group.position.x = fl.baseX + wave * 3.8 * windForce;

        // Petals ripple in the breeze
        for (let p = 0; p < fl.petals.length; p++) {
          const petal = fl.petals[p];
          const petalFlex = Math.sin(time * 3.2 + p * 1.25 + fl.swayPhase);
          petal.rotation.x = fl.basePetalRotX[p] + petalFlex * 0.045 * windForce;
        }

        // Golden stamen column trembles with delicate garden flutter
        const stamenJitter =
          Math.sin(time * 5.4 + fl.swayPhase) * 0.17 + Math.cos(time * 7.8) * 0.05;
        fl.stamen.rotation.z = stamenJitter * windForce;
        fl.stamen.rotation.x = Math.sin(time * 3.8) * 0.08 * windForce;
      }

      // Update Falling 3D Petals
      for (let i = fallingPetals.length - 1; i >= 0; i--) {
        const p = fallingPetals[i];
        p.life++;

        p.vy -= 0.075;
        p.vx += Math.sin(time * 3.0 + p.life * 0.1) * 0.14;
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;

        p.mesh.rotation.x += p.rotVx;
        p.mesh.rotation.y += p.rotVy;
        p.mesh.rotation.z += p.rotVz;

        if (p.life > p.maxLife - 30) {
          const fade = (p.maxLife - p.life) / 30;
          p.mesh.scale.set(0.52 * fade, 0.52 * fade, 0.52 * fade);
        }

        if (p.life >= p.maxLife || p.mesh.position.y < -height / 2 - 50) {
          scene.remove(p.mesh);
          fallingPetals.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Up on Unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimeout);

      leafGeomLarge.dispose();
      leafGeomMid.dispose();
      leafGeomSmall.dispose();
      petalGeom.dispose();
      stamenStemGeom.dispose();
      antherGeom.dispose();
      stigmaGeom.dispose();

      leafTexture.dispose();
      petalTexture.dispose();
      leafMaterial.dispose();
      leafShadowMaterial.dispose();
      leafSproutMaterial.dispose();
      petalMaterial.dispose();
      stamenStemMat.dispose();
      antherMat.dispose();
      stigmaMat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden w-full h-full"
      aria-hidden="true"
    />
  );
}

export default SacredSurroundings;
