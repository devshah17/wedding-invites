'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Botanical 3D Floral Hibiscus Frame Borders (SacredSurroundings)
 * - Reference: 'Floral Hibiscus Frame Borders.png'
 * - Dense, rounded topiary bush mounds with layered 3D foliage and glossy obovate leaves.
 * - Mobile-safe: Tightly bounded along outer borders (width ~38-44px on mobile) with ZERO content overlap.
 * - Hibiscus Flower Orientation: Faces directly OUT OF THE SCREEN towards the user (+Z axis),
 *   proudly displaying the wide-open 5 ruffled petals, glowing star throat, and golden stamen column.
 * - Real-Time Botanical Wind: Individual leaves flex and twist on their stem pivots in the breeze.
 * - Edge-Flush Guarantee: Rooted mathematically at x = -width/2 and x = width/2 with 0px gap.
 * - 100% Non-Blocking: Canvas has pointer-events: none, preserving complete click-through for all UI.
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

/* 1. Procedural Texture for Glossy Botanical Leaves */
function createGlossyLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth vertical botanical gradient: dark emerald base -> rich foliage green -> bright sunlit apex
  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0.0, '#153A10'); // deep shadow petiole
  grad.addColorStop(0.28, '#265C1C'); // base foliage
  grad.addColorStop(0.65, '#3E8A2B'); // rich emerald body
  grad.addColorStop(0.88, '#5BA53A'); // vibrant sunlit mid
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

  // Lateral veins fanning outward along the leaf blade
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

  // Radial gradient: luminous pale center around throat -> deep crimson -> radiant fuchsia -> blush edge
  const grad = ctx.createRadialGradient(128, 240, 6, 128, 120, 195);
  grad.addColorStop(0.0, '#FFE8F0'); // pale luminous throat center
  grad.addColorStop(0.12, '#8A0030'); // deep crimson ring
  grad.addColorStop(0.28, '#C2185B'); // ruby magenta
  grad.addColorStop(0.6, '#FF1493'); // radiant fuchsia
  grad.addColorStop(0.85, '#FF69B4'); // warm pink
  grad.addColorStop(1.0, '#FFA8C5'); // ruffled edge blush
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Radiating delicate petal veins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.lineWidth = 1.4;
  for (let i = -16; i <= 16; i++) {
    ctx.beginPath();
    ctx.moveTo(128, 240);
    const endX = 128 + i * 7.5;
    const cpX = 128 + i * 4.5;
    ctx.quadraticCurveTo(cpX, 120, endX, 16);
    ctx.stroke();
  }

  // Soft secondary dark crimson throat streaks
  ctx.strokeStyle = 'rgba(110, 0, 40, 0.45)';
  ctx.lineWidth = 2.2;
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
function createCurvedLeafGeometry(w = 24, l = 46): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // stem attachment pivot!
  shape.bezierCurveTo(-w * 0.22, l * 0.22, -w * 0.58, l * 0.62, -w * 0.36, l * 0.92);
  shape.bezierCurveTo(-w * 0.16, l * 1.02, 0, l * 1.0, 0, l * 1.0);
  shape.bezierCurveTo(0, l * 1.0, w * 0.16, l * 1.02, w * 0.36, l * 0.92);
  shape.bezierCurveTo(w * 0.58, l * 0.62, w * 0.22, l * 0.22, 0, 0);

  const geom = new THREE.ShapeGeometry(shape, 10);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = y / l;
    // Central V-crease along midrib so specular light splits realistically
    const crease = -Math.abs(x) * 0.26;
    // Longitudinal arching curve along the blade
    const arch = Math.sin(normY * Math.PI) * 3.2;
    pos.setZ(i, crease + arch);
  }
  geom.computeVertexNormals();
  return geom;
}

/* 4. 3D Cupped Hibiscus Petal Geometry */
function createCurvedPetalGeometry(w = 36, l = 54): THREE.BufferGeometry {
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
    // Shallow saucer cupping
    const cup = -Math.sin(normY * Math.PI * 0.8) * 5.0;
    const ripple = Math.sin((x / w) * Math.PI * 3.0) * 1.4 * normY;
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

    // 3. Dynamic Lighting Setup for Glossy Botanical Leaves
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.45);
    scene.add(ambientLight);

    // Warm sun directional light creating glossy specular highlights on curved leaf ridges
    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.2);
    sunLight.position.set(150, 400, 550);
    scene.add(sunLight);

    // Soft fill rim light
    const rimLight = new THREE.DirectionalLight(0xffd580, 0.85);
    rimLight.position.set(-200, -200, 300);
    scene.add(rimLight);

    // 4. Procedural Textures & Materials
    const leafTexture = createGlossyLeafTexture();
    const petalTexture = createHibiscusPetalTexture();

    const leafMaterial = new THREE.MeshStandardMaterial({
      map: leafTexture,
      roughness: 0.28,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });

    const leafShadowMaterial = new THREE.MeshStandardMaterial({
      color: 0x183a12,
      roughness: 0.45,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const leafSproutMaterial = new THREE.MeshStandardMaterial({
      color: 0x6db846,
      roughness: 0.22,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const petalMaterial = new THREE.MeshStandardMaterial({
      map: petalTexture,
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

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
    const leafGeomLarge = createCurvedLeafGeometry(26, 50);
    const leafGeomMid = createCurvedLeafGeometry(20, 38);
    const leafGeomSmall = createCurvedLeafGeometry(14, 26);
    const petalGeom = createCurvedPetalGeometry(36, 54);

    // Stamen cylinder rotated to point forward along +Z towards viewer!
    const stamenStemGeom = new THREE.CylinderGeometry(1.1, 0.7, 34, 8);
    stamenStemGeom.rotateX(Math.PI / 2);
    stamenStemGeom.translate(0, 0, 17);

    const antherGeom = new THREE.SphereGeometry(1.1, 6, 6);
    const stigmaGeom = new THREE.SphereGeometry(1.4, 6, 6);

    // 6. Containers
    const leaves: DynamicLeaf[] = [];
    const flowers: DynamicFlower[] = [];
    const fallingPetals: FallingPetal3D[] = [];

    // Helper: Build a 3D Hibiscus Flower FACING FORWARD TOWARDS THE VIEWER (+Z axis)
    function buildHibiscusFlower(scale = 1.0, flip = false): {
      group: THREE.Group;
      petals: THREE.Mesh[];
      basePetalRotX: number[];
      stamen: THREE.Group;
    } {
      const flowerGroup = new THREE.Group();
      const petals: THREE.Mesh[] = [];
      const basePetalRotX: number[] = [];

      // 5 overlapping petals fanning in the XY plane facing directly forward toward user
      const petalCount = 5;
      for (let i = 0; i < petalCount; i++) {
        const petal = new THREE.Mesh(petalGeom, petalMaterial);
        const angle = i * ((Math.PI * 2) / petalCount);
        // Shallow flare outward of ~16 degrees so petals form a wide saucer bloom facing camera
        const flareX = 0.28;
        basePetalRotX.push(flareX);

        petal.rotation.z = angle;
        petal.rotation.x = flareX;
        petal.position.z = -i * 0.8;
        flowerGroup.add(petal);
        petals.push(petal);
      }

      // Central Golden Stamen Column POINTING OUTWARD (+Z) DIRECTLY TOWARD VIEWER!
      const stamenGroup = new THREE.Group();
      const stem = new THREE.Mesh(stamenStemGeom, stamenStemMat);
      stamenGroup.add(stem);

      // Anther clusters around the protruding tip
      for (let a = 0; a < 18; a++) {
        const anther = new THREE.Mesh(antherGeom, antherMat);
        const aAngle = a * 1.35;
        const rad = 2.2 + Math.sin(a) * 0.6;
        const zPos = 18 + (a % 6) * 2.5;
        anther.position.set(Math.cos(aAngle) * rad, Math.sin(aAngle) * rad, zPos);
        stamenGroup.add(anther);
      }

      // 5 Ruby Stigma pads at the very tip facing user
      for (let s = 0; s < 5; s++) {
        const stigma = new THREE.Mesh(stigmaGeom, stigmaMat);
        const sAngle = s * ((Math.PI * 2) / 5);
        stigma.position.set(Math.cos(sAngle) * 2.0, Math.sin(sAngle) * 2.0, 34);
        stamenGroup.add(stigma);
      }

      // Subtle outward upward curvature of the stamen
      stamenGroup.rotation.x = -0.08;
      stamenGroup.rotation.y = flip ? -0.06 : 0.06;
      flowerGroup.add(stamenGroup);

      flowerGroup.scale.set(scale, scale, scale);
      return { group: flowerGroup, petals, basePetalRotX, stamen: stamenGroup };
    }

    // 7. Generate Full Top-to-Bottom Shrub Hedges Organized as Bush Mounds
    function populateHedges() {
      leaves.forEach((l) => scene.remove(l.mesh));
      flowers.forEach((f) => scene.remove(f.group));
      leaves.length = 0;
      flowers.length = 0;

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      // STRICT BORDER BOUNDS: Keep hedge tightly bounded on screen edges
      // On mobile: reach is strictly 38-44px max, leaving >300px clear for card content!
      // On PC: reach is 135-155px, framing the desktop canvas.
      const hedgeReach = isMobile ? Math.min(42, width * 0.11) : isTablet ? 85 : 145;
      const flowerScale = isMobile ? 0.5 : isTablet ? 0.75 : 1.05;
      const leafScale = isMobile ? 0.58 : isTablet ? 0.78 : 1.0;

      const yStart = height / 2 + 25;
      const yEnd = -height / 2 - 25;
      // Step between bush cloud mounds
      const moundStep = isMobile ? 42 : 52;

      // ================= LEFT BORDER: TOPIARY BUSH MOUNDS =================
      const leftRootX = -width / 2; // EXACT SCREEN LEFT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= moundStep) {
        const moundCenterX = leftRootX + hedgeReach * 0.45;
        const moundCenterY = y + Math.sin(y * 0.04) * (hedgeReach * 0.12);

        // 1. Solid Wall Backing Leaves (pinned tightly to left screen border with 0 gap)
        const wallLeafCount = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeafCount; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          leaf.scale.set(leafScale, leafScale, leafScale);
          const lx = leftRootX + w * (hedgeReach * 0.2) - 1;
          const ly = y + (w - 1) * 12;
          const lz = -18 - w * 3;
          leaf.position.set(lx, ly, lz);

          const rotZ = Math.PI * 0.48 + (Math.random() - 0.5) * 0.2;
          const rotX = 0.1;
          const rotY = 0.15;
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
            flex: 0.3,
          });
        }

        // 2. Bush Mound Core (Dense dark foliage forming the interior of the bush)
        const coreCount = isMobile ? 2 : 4;
        for (let c = 0; c < coreCount; c++) {
          const leaf = new THREE.Mesh(leafGeomLarge, leafMaterial);
          leaf.scale.set(leafScale * 0.95, leafScale * 0.95, leafScale * 0.95);
          const cx = moundCenterX + (Math.random() - 0.5) * (hedgeReach * 0.3);
          const cy = moundCenterY + (Math.random() - 0.5) * 16;
          const cz = -10 + c * 3;
          leaf.position.set(cx, cy, cz);

          const rotZ = Math.PI * 0.35 + (c * 0.35);
          const rotX = 0.2;
          const rotY = 0.2;
          leaf.rotation.set(rotX, rotY, rotZ);
          scene.add(leaf);

          leaves.push({
            mesh: leaf,
            baseX: cx,
            baseY: cy,
            baseZ: cz,
            baseRotX: rotX,
            baseRotY: rotY,
            baseRotZ: rotZ,
            phaseSeed: y * 0.015 + c * 2,
            flex: 0.5,
          });
        }

        // 3. Bush Mound Dome (Leaves radiating outward forming the rounded cloud shape)
        const domeCount = isMobile ? 4 : 7;
        for (let d = 0; d < domeCount; d++) {
          const isOuterEdge = d >= domeCount - 2;
          const geom = isOuterEdge ? leafGeomLarge : leafGeomMid;
          const mat = isOuterEdge ? leafSproutMaterial : leafMaterial;
          const leaf = new THREE.Mesh(geom, mat);
          leaf.scale.set(leafScale, leafScale, leafScale);

          // Fan outward from mound center in an arc into the screen
          const arcAngle = (d / (domeCount - 1)) * Math.PI * 0.9 - Math.PI * 0.45;
          const radiusX = hedgeReach * 0.48;
          const radiusY = (moundStep * 0.42);

          const lx = moundCenterX + Math.cos(arcAngle) * radiusX;
          const ly = moundCenterY + Math.sin(arcAngle) * radiusY;
          const lz = 2 + Math.sin(arcAngle * 2) * 8;
          leaf.position.set(lx, ly, lz);

          // Leaf points outward from mound center
          const rotZ = arcAngle + Math.PI * 0.5;
          const rotX = 0.25;
          const rotY = 0.15;
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
            phaseSeed: y * 0.018 + d * 2,
            flex: 0.8 + (d / domeCount) * 0.4,
          });
        }
      }

      // Left Hibiscus Flowers: Facing FORWARD towards the viewer (+Z)
      const leftFlowerHeights = [
        height * 0.34,
        height * 0.12,
        -height * 0.1,
        -height * 0.32,
      ];
      leftFlowerHeights.forEach((fy, idx) => {
        const s = flowerScale * (idx % 2 === 0 ? 1.05 : 0.88);
        const { group, petals, basePetalRotX, stamen } = buildHibiscusFlower(s, false);
        // Position nestled right at the bush perimeter
        const fx = leftRootX + hedgeReach * 0.72;
        const fz = 24;
        group.position.set(fx, fy, fz);

        // FACING FORWARD TOWARDS USER (+Z axis):
        // rotX ≈ 0.04, rotY ≈ 0.06 (subtle natural angle, but facing directly at viewer)
        const baseRotZ = Math.PI * 0.15 * (idx % 2 === 0 ? 1 : -1);
        const baseRotX = 0.04;
        const baseRotY = 0.06;
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

      // ================= RIGHT BORDER: TOPIARY BUSH MOUNDS =================
      const rightRootX = width / 2; // EXACT SCREEN RIGHT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= moundStep) {
        const moundCenterX = rightRootX - hedgeReach * 0.45;
        const moundCenterY = y + Math.cos(y * 0.04) * (hedgeReach * 0.12);

        // 1. Solid Wall Backing Leaves (pinned tightly to right screen border with 0 gap)
        const wallLeafCount = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeafCount; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          leaf.scale.set(leafScale, leafScale, leafScale);
          const lx = rightRootX - w * (hedgeReach * 0.2) + 1;
          const ly = y + (w - 1) * 12;
          const lz = -18 - w * 3;
          leaf.position.set(lx, ly, lz);

          const rotZ = -Math.PI * 0.48 + (Math.random() - 0.5) * 0.2;
          const rotX = 0.1;
          const rotY = -0.15;
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
            phaseSeed: y * 0.02 + w + 14,
            flex: 0.3,
          });
        }

        // 2. Bush Mound Core
        const coreCount = isMobile ? 2 : 4;
        for (let c = 0; c < coreCount; c++) {
          const leaf = new THREE.Mesh(leafGeomLarge, leafMaterial);
          leaf.scale.set(leafScale * 0.95, leafScale * 0.95, leafScale * 0.95);
          const cx = moundCenterX + (Math.random() - 0.5) * (hedgeReach * 0.3);
          const cy = moundCenterY + (Math.random() - 0.5) * 16;
          const cz = -10 + c * 3;
          leaf.position.set(cx, cy, cz);

          const rotZ = -Math.PI * 0.35 - (c * 0.35);
          const rotX = 0.2;
          const rotY = -0.2;
          leaf.rotation.set(rotX, rotY, rotZ);
          scene.add(leaf);

          leaves.push({
            mesh: leaf,
            baseX: cx,
            baseY: cy,
            baseZ: cz,
            baseRotX: rotX,
            baseRotY: rotY,
            baseRotZ: rotZ,
            phaseSeed: y * 0.015 + c * 2 + 14,
            flex: 0.5,
          });
        }

        // 3. Bush Mound Dome
        const domeCount = isMobile ? 4 : 7;
        for (let d = 0; d < domeCount; d++) {
          const isOuterEdge = d >= domeCount - 2;
          const geom = isOuterEdge ? leafGeomLarge : leafGeomMid;
          const mat = isOuterEdge ? leafSproutMaterial : leafMaterial;
          const leaf = new THREE.Mesh(geom, mat);
          leaf.scale.set(leafScale, leafScale, leafScale);

          const arcAngle = Math.PI - ((d / (domeCount - 1)) * Math.PI * 0.9 - Math.PI * 0.45);
          const radiusX = hedgeReach * 0.48;
          const radiusY = (moundStep * 0.42);

          const lx = moundCenterX - Math.cos(arcAngle) * radiusX;
          const ly = moundCenterY + Math.sin(arcAngle) * radiusY;
          const lz = 2 + Math.sin(arcAngle * 2) * 8;
          leaf.position.set(lx, ly, lz);

          const rotZ = -arcAngle - Math.PI * 0.5;
          const rotX = 0.25;
          const rotY = -0.15;
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
            phaseSeed: y * 0.018 + d * 2 + 20,
            flex: 0.8 + (d / domeCount) * 0.4,
          });
        }
      }

      // Right Hibiscus Flowers: Facing FORWARD towards the viewer (+Z)
      const rightFlowerHeights = [
        height * 0.4,
        height * 0.18,
        -height * 0.04,
        -height * 0.24,
        -height * 0.44,
      ];
      rightFlowerHeights.forEach((fy, idx) => {
        const s = flowerScale * (idx % 2 === 0 ? 1.02 : 0.86);
        const { group, petals, basePetalRotX, stamen } = buildHibiscusFlower(s, true);
        const fx = rightRootX - hedgeReach * 0.72;
        const fz = 24;
        group.position.set(fx, fy, fz);

        // FACING FORWARD TOWARDS USER (+Z axis):
        const baseRotZ = -Math.PI * 0.15 * (idx % 2 === 0 ? 1 : -1);
        const baseRotX = 0.04;
        const baseRotY = -0.06;
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
          swayPhase: idx * 1.8 + 2.4,
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

      scrollVelocity = Math.max(-14, Math.min(14, delta * 0.32));
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
      const triggerThreshold = width < 640 ? 75 : 170;

      if (clickX < triggerThreshold || clickX > width - triggerThreshold) {
        const worldX = e.clientX - width / 2;
        const worldY = height / 2 - e.clientY;
        const isLeft = clickX < width / 2;

        for (let p = 0; p < 7; p++) {
          const petalMesh = new THREE.Mesh(petalGeom, petalMaterial);
          const pScale = width < 640 ? 0.36 : 0.52;
          petalMesh.scale.set(pScale, pScale, pScale);
          petalMesh.position.set(
            worldX + (Math.random() - 0.5) * 20,
            worldY + (Math.random() - 0.5) * 20,
            24 + Math.random() * 20
          );
          scene.add(petalMesh);

          fallingPetals.push({
            mesh: petalMesh,
            vx: (isLeft ? 1 : -1) * (2.2 + Math.random() * 3.5),
            vy: -1.4 - Math.random() * 3.0,
            vz: (Math.random() - 0.5) * 2.0,
            rotVx: (Math.random() - 0.5) * 0.1,
            rotVy: (Math.random() - 0.5) * 0.14,
            rotVz: (Math.random() - 0.5) * 0.08,
            life: 0,
            maxLife: 160 + Math.random() * 60,
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
      const baseWind = 0.42;
      const windForce = (baseWind + gustEnvelope * 0.88) * (1 + Math.abs(scrollVelocity) * 0.14);
      const scrollTilt = scrollVelocity * 0.018;

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
        if (distSq < 25600) {
          // within 160px
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 160) * 12.0;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }

        // Apply realistic stem rotations
        leaf.mesh.rotation.z =
          leaf.baseRotZ + (wave * 0.15 + microRustle * 0.035) * windForce * leaf.flex + scrollTilt * leaf.flex;
        leaf.mesh.rotation.x =
          leaf.baseRotX + Math.sin(time * 2.5 + leaf.phaseSeed) * 0.08 * windForce * leaf.flex;
        leaf.mesh.rotation.y =
          leaf.baseRotY + Math.cos(time * 1.8 + leaf.phaseSeed * 1.4) * 0.06 * windForce * leaf.flex;

        // Physical displacement
        leaf.mesh.position.x = leaf.baseX + wave * 3.5 * windForce * leaf.flex + pushX;
        leaf.mesh.position.y = leaf.baseY + pushY;
        leaf.mesh.position.z = leaf.baseZ + Math.sin(time * 2.8 + leaf.phaseSeed) * 2.8 * leaf.flex;
      }

      // Update Individual Hibiscus Flowers (Maintaining forward facing toward viewer)
      for (let i = 0; i < flowers.length; i++) {
        const fl = flowers[i];
        const wave = Math.sin(time * 1.6 + fl.baseY * 0.006 + fl.swayPhase);

        // Flower body gently bobs without turning away from user
        fl.group.rotation.z = fl.baseRotZ + wave * 0.065 * windForce + scrollTilt * 0.4;
        fl.group.rotation.x = fl.baseRotX + Math.cos(time * 1.3 + fl.swayPhase) * 0.04 * windForce;
        fl.group.position.x = fl.baseX + wave * 3.0 * windForce;

        // Petals ripple gently in the breeze
        for (let p = 0; p < fl.petals.length; p++) {
          const petal = fl.petals[p];
          const petalFlex = Math.sin(time * 3.0 + p * 1.25 + fl.swayPhase);
          petal.rotation.x = fl.basePetalRotX[p] + petalFlex * 0.038 * windForce;
        }

        // Golden stamen column trembles delicately toward viewer
        const stamenJitter =
          Math.sin(time * 5.4 + fl.swayPhase) * 0.14 + Math.cos(time * 7.8) * 0.04;
        fl.stamen.rotation.z = stamenJitter * windForce;
        fl.stamen.rotation.x = Math.sin(time * 3.8) * 0.06 * windForce;
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
          const currentScale = width < 640 ? 0.36 : 0.52;
          p.mesh.scale.set(currentScale * fade, currentScale * fade, currentScale * fade);
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
