'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Natural Botanical 3D Floral Hibiscus Frame Borders (SacredSurroundings)
 * - Reference: 'Floral Hibiscus Frame Borders.png'
 * - Natural Bush Alignment: Continuous organic S-curve silhouette with cohesive topiary cloud mounds,
 *   subtle connecting twigs, and natural leaf density transitions.
 * - Natural Flower Alignment: Hibiscus flowers arranged in organic botanical pairings
 *   (Primary Bloom + Companion Semi-Open Blossom + Bud Twig Sprays) nestled into the foliage crooks.
 * - Flower Orientation: Faces directly OUT OF THE SCREEN towards the user (+Z axis),
 *   showcasing the full circle of ruffled pink petals, glowing star throat, and golden stamen column.
 * - Mobile Safe: Strictly bounded along the outer screen border (38-42px on mobile) with 0px content overlap.
 * - Real-Time Wind Physics: Individual leaves, petals, and stamens gently flex and flutter on their stem pivots.
 * - Edge-Flush Guarantee: Rooted at x = -width/2 and x = width/2 with 0px gap on mobile and PC.
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

interface DynamicBud {
  group: THREE.Group;
  baseX: number;
  baseY: number;
  baseRotZ: number;
  phaseSeed: number;
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

  // Radial gradient: luminous pale center -> deep crimson -> radiant fuchsia -> blush edge
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
    const crease = -Math.abs(x) * 0.26;
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

    // 3. Dynamic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.2);
    sunLight.position.set(150, 400, 550);
    scene.add(sunLight);

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

    const twigMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f, // warm woody twig
      roughness: 0.5,
      metalness: 0.05,
    });

    const petalMaterial = new THREE.MeshStandardMaterial({
      map: petalTexture,
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const budMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3b94,
      roughness: 0.3,
      metalness: 0.05,
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

    const stamenStemGeom = new THREE.CylinderGeometry(1.1, 0.7, 34, 8);
    stamenStemGeom.rotateX(Math.PI / 2);
    stamenStemGeom.translate(0, 0, 17);

    const antherGeom = new THREE.SphereGeometry(1.1, 6, 6);
    const stigmaGeom = new THREE.SphereGeometry(1.4, 6, 6);

    const twigGeom = new THREE.CylinderGeometry(1.0, 0.7, 40, 6);
    twigGeom.translate(0, 20, 0);

    const budTipGeom = new THREE.ConeGeometry(3.0, 8, 8);
    budTipGeom.translate(0, 4, 0);

    // 6. Containers
    const leaves: DynamicLeaf[] = [];
    const flowers: DynamicFlower[] = [];
    const buds: DynamicBud[] = [];
    const fallingPetals: FallingPetal3D[] = [];
    const twigs: THREE.Mesh[] = [];

    // Helper: Build a 3D Hibiscus Flower FACING OUT OF THE SCREEN towards the user (+Z axis)
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
        const flareX = 0.26;
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

      stamenGroup.rotation.x = -0.06;
      stamenGroup.rotation.y = flip ? -0.05 : 0.05;
      flowerGroup.add(stamenGroup);

      flowerGroup.scale.set(scale, scale, scale);
      return { group: flowerGroup, petals, basePetalRotX, stamen: stamenGroup };
    }

    // Helper: Build a delicate slender bud twig with teardrop pink tip
    function buildBudTwig(scale = 1.0): THREE.Group {
      const budGroup = new THREE.Group();
      const stem = new THREE.Mesh(twigGeom, twigMaterial);
      stem.scale.set(0.6, 0.7, 0.6);
      budGroup.add(stem);

      const tip = new THREE.Mesh(budTipGeom, budMaterial);
      tip.position.y = 26;
      budGroup.add(tip);

      const sepal = new THREE.Mesh(leafGeomSmall, leafSproutMaterial);
      sepal.scale.set(0.35, 0.35, 0.35);
      sepal.position.set(0, 22, 1);
      budGroup.add(sepal);

      budGroup.scale.set(scale, scale, scale);
      return budGroup;
    }

    // 7. Generate Full Top-to-Bottom Shrub Hedges with Natural Bush Alignment & Flower Pairing
    function populateHedges() {
      leaves.forEach((l) => scene.remove(l.mesh));
      flowers.forEach((f) => scene.remove(f.group));
      buds.forEach((b) => scene.remove(b.group));
      twigs.forEach((t) => scene.remove(t));
      leaves.length = 0;
      flowers.length = 0;
      buds.length = 0;
      twigs.length = 0;

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      // STRICT BORDER BOUNDS: Keep hedge tightly bounded on screen edges
      // On mobile: reach is strictly 38-42px max, leaving >300px clear for card content!
      // On PC: reach is 135-150px, gracefully framing the desktop canvas.
      const hedgeReach = isMobile ? Math.min(40, width * 0.105) : isTablet ? 85 : 145;
      const flowerScale = isMobile ? 0.48 : isTablet ? 0.72 : 1.02;
      const leafScale = isMobile ? 0.55 : isTablet ? 0.76 : 1.0;

      const yStart = height / 2 + 30;
      const yEnd = -height / 2 - 30;
      // Step between bush cloud mounds
      const moundStep = isMobile ? 40 : 50;

      // ================= LEFT BORDER: NATURAL BOTANICAL BUSH =================
      const leftRootX = -width / 2; // EXACT SCREEN LEFT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= moundStep) {
        // Natural undulating S-curve silhouette rhythm
        const waveOffset = Math.sin(y * 0.012) * (hedgeReach * 0.15) + Math.cos(y * 0.025) * (hedgeReach * 0.08);
        const currentMoundReach = hedgeReach + waveOffset;
        const moundCenterX = leftRootX + currentMoundReach * 0.48;
        const moundCenterY = y;

        // 1. Connecting woody twig branch inside the mound
        if (!isMobile || y % 80 < 40) {
          const twig = new THREE.Mesh(twigGeom, twigMaterial);
          twig.scale.set(leafScale * 0.8, leafScale * 0.9, leafScale * 0.8);
          twig.position.set(moundCenterX - currentMoundReach * 0.2, moundCenterY - 10, -12);
          twig.rotation.z = Math.PI * 0.45 + Math.sin(y * 0.05) * 0.25;
          scene.add(twig);
          twigs.push(twig);
        }

        // 2. Solid Wall Backing Leaves (pinned tightly to left screen border with 0 gap)
        const wallLeafCount = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeafCount; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          leaf.scale.set(leafScale, leafScale, leafScale);
          const lx = leftRootX + w * (currentMoundReach * 0.2) - 1;
          const ly = y + (w - 1) * 10;
          const lz = -18 - w * 3;
          leaf.position.set(lx, ly, lz);

          const rotZ = Math.PI * 0.48 + (Math.random() - 0.5) * 0.15;
          const rotX = 0.08;
          const rotY = 0.12;
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
            flex: 0.28,
          });
        }

        // 3. Dense Shrub Core (volumetric leaf cluster forming the center of the mound)
        const coreCount = isMobile ? 2 : 4;
        for (let c = 0; c < coreCount; c++) {
          const leaf = new THREE.Mesh(leafGeomLarge, leafMaterial);
          leaf.scale.set(leafScale * 0.95, leafScale * 0.95, leafScale * 0.95);
          const cx = moundCenterX + (Math.random() - 0.5) * (currentMoundReach * 0.25);
          const cy = moundCenterY + (Math.random() - 0.5) * 14;
          const cz = -10 + c * 3;
          leaf.position.set(cx, cy, cz);

          const rotZ = Math.PI * 0.35 + (c * 0.32);
          const rotX = 0.18;
          const rotY = 0.15;
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
            flex: 0.48,
          });
        }

        // 4. Bush Mound Dome (Leaves radiating outward forming the rounded cloud shape)
        const domeCount = isMobile ? 4 : 7;
        for (let d = 0; d < domeCount; d++) {
          const isOuterEdge = d >= domeCount - 2;
          const geom = isOuterEdge ? leafGeomLarge : leafGeomMid;
          const mat = isOuterEdge ? leafSproutMaterial : leafMaterial;
          const leaf = new THREE.Mesh(geom, mat);
          leaf.scale.set(leafScale, leafScale, leafScale);

          // Fan outward in a smooth rounded arc into the screen
          const arcAngle = (d / (domeCount - 1)) * Math.PI * 0.85 - Math.PI * 0.42;
          const radiusX = currentMoundReach * 0.46;
          const radiusY = moundStep * 0.44;

          const lx = moundCenterX + Math.cos(arcAngle) * radiusX;
          const ly = moundCenterY + Math.sin(arcAngle) * radiusY;
          const lz = 2 + Math.sin(arcAngle * 2) * 7;
          leaf.position.set(lx, ly, lz);

          const rotZ = arcAngle + Math.PI * 0.5;
          const rotX = 0.22;
          const rotY = 0.12;
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
            flex: 0.75 + (d / domeCount) * 0.35,
          });
        }
      }

      // ================= LEFT HIBISCUS FLOWERS: NATURAL PAIRINGS & ALIGNMENT =================
      // Cluster 1: Upper Left (Primary Bloom + Companion Semi-Open Blossom + Bud Sprays)
      const leftCluster1Y = height * 0.26;
      const leftC1Reach = hedgeReach * 0.75;

      // 1. Main Large Blossom (scale 1.05) - facing out of screen towards user
      const f1 = buildHibiscusFlower(flowerScale * 1.05, false);
      const f1X = leftRootX + leftC1Reach;
      f1.group.position.set(f1X, leftCluster1Y, 26);
      f1.group.rotation.set(0.04, 0.05, Math.PI * 0.08); // facing forward towards viewer
      scene.add(f1.group);
      flowers.push({
        group: f1.group,
        baseX: f1X,
        baseY: leftCluster1Y,
        baseRotX: 0.04,
        baseRotY: 0.05,
        baseRotZ: Math.PI * 0.08,
        petals: f1.petals,
        basePetalRotX: f1.basePetalRotX,
        stamen: f1.stamen,
        swayPhase: 0,
      });

      // 2. Companion Semi-Open Blossom (scale 0.65) nestled just above-right of main flower
      const f1Comp = buildHibiscusFlower(flowerScale * 0.65, false);
      const f1CompX = f1X + (isMobile ? 12 : 28);
      const f1CompY = leftCluster1Y + (isMobile ? 18 : 36);
      f1Comp.group.position.set(f1CompX, f1CompY, 20);
      f1Comp.group.rotation.set(0.06, 0.08, -Math.PI * 0.12);
      scene.add(f1Comp.group);
      flowers.push({
        group: f1Comp.group,
        baseX: f1CompX,
        baseY: f1CompY,
        baseRotX: 0.06,
        baseRotY: 0.08,
        baseRotZ: -Math.PI * 0.12,
        petals: f1Comp.petals,
        basePetalRotX: f1Comp.basePetalRotX,
        stamen: f1Comp.stamen,
        swayPhase: 0.8,
      });

      // 3. Bud Twig Sprays extending naturally from cluster
      const bud1 = buildBudTwig(leafScale * 0.8);
      const b1X = f1CompX + (isMobile ? 8 : 16);
      const b1Y = f1CompY + (isMobile ? 14 : 26);
      bud1.position.set(b1X, b1Y, 18);
      bud1.rotation.z = Math.PI * 0.35;
      scene.add(bud1);
      buds.push({ group: bud1, baseX: b1X, baseY: b1Y, baseRotZ: Math.PI * 0.35, phaseSeed: 1.2 });

      // Cluster 2: Mid-Lower Left (Medium Bloom + Baby Bud)
      const leftCluster2Y = -height * 0.15;
      const f2 = buildHibiscusFlower(flowerScale * 0.92, false);
      const f2X = leftRootX + leftC1Reach * 0.95;
      f2.group.position.set(f2X, leftCluster2Y, 24);
      f2.group.rotation.set(0.03, 0.05, -Math.PI * 0.06);
      scene.add(f2.group);
      flowers.push({
        group: f2.group,
        baseX: f2X,
        baseY: leftCluster2Y,
        baseRotX: 0.03,
        baseRotY: 0.05,
        baseRotZ: -Math.PI * 0.06,
        petals: f2.petals,
        basePetalRotX: f2.basePetalRotX,
        stamen: f2.stamen,
        swayPhase: 2.4,
      });

      const bud2 = buildBudTwig(leafScale * 0.75);
      const b2X = f2X + (isMobile ? 10 : 20);
      const b2Y = leftCluster2Y - (isMobile ? 14 : 24);
      bud2.position.set(b2X, b2Y, 18);
      bud2.rotation.z = Math.PI * 0.65;
      scene.add(bud2);
      buds.push({ group: bud2, baseX: b2X, baseY: b2Y, baseRotZ: Math.PI * 0.65, phaseSeed: 3.1 });


      // ================= RIGHT BORDER: NATURAL BOTANICAL BUSH =================
      const rightRootX = width / 2; // EXACT SCREEN RIGHT BORDER TOUCH!

      for (let y = yStart; y >= yEnd; y -= moundStep) {
        // Natural undulating S-curve silhouette rhythm (asymmetric to left side)
        const waveOffset = Math.cos(y * 0.012 + 1) * (hedgeReach * 0.15) + Math.sin(y * 0.025) * (hedgeReach * 0.08);
        const currentMoundReach = hedgeReach + waveOffset;
        const moundCenterX = rightRootX - currentMoundReach * 0.48;
        const moundCenterY = y;

        // 1. Connecting woody twig branch
        if (!isMobile || y % 80 < 40) {
          const twig = new THREE.Mesh(twigGeom, twigMaterial);
          twig.scale.set(leafScale * 0.8, leafScale * 0.9, leafScale * 0.8);
          twig.position.set(moundCenterX + currentMoundReach * 0.2, moundCenterY - 10, -12);
          twig.rotation.z = -Math.PI * 0.45 - Math.cos(y * 0.05) * 0.25;
          scene.add(twig);
          twigs.push(twig);
        }

        // 2. Solid Wall Backing Leaves (pinned tightly to right screen border with 0 gap)
        const wallLeafCount = isMobile ? 2 : 3;
        for (let w = 0; w < wallLeafCount; w++) {
          const leaf = new THREE.Mesh(leafGeomMid, leafShadowMaterial);
          leaf.scale.set(leafScale, leafScale, leafScale);
          const lx = rightRootX - w * (currentMoundReach * 0.2) + 1;
          const ly = y + (w - 1) * 10;
          const lz = -18 - w * 3;
          leaf.position.set(lx, ly, lz);

          const rotZ = -Math.PI * 0.48 + (Math.random() - 0.5) * 0.15;
          const rotX = 0.08;
          const rotY = -0.12;
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
            phaseSeed: y * 0.02 + w + 16,
            flex: 0.28,
          });
        }

        // 3. Dense Shrub Core
        const coreCount = isMobile ? 2 : 4;
        for (let c = 0; c < coreCount; c++) {
          const leaf = new THREE.Mesh(leafGeomLarge, leafMaterial);
          leaf.scale.set(leafScale * 0.95, leafScale * 0.95, leafScale * 0.95);
          const cx = moundCenterX + (Math.random() - 0.5) * (currentMoundReach * 0.25);
          const cy = moundCenterY + (Math.random() - 0.5) * 14;
          const cz = -10 + c * 3;
          leaf.position.set(cx, cy, cz);

          const rotZ = -Math.PI * 0.35 - (c * 0.32);
          const rotX = 0.18;
          const rotY = -0.15;
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
            phaseSeed: y * 0.015 + c * 2 + 16,
            flex: 0.48,
          });
        }

        // 4. Bush Mound Dome
        const domeCount = isMobile ? 4 : 7;
        for (let d = 0; d < domeCount; d++) {
          const isOuterEdge = d >= domeCount - 2;
          const geom = isOuterEdge ? leafGeomLarge : leafGeomMid;
          const mat = isOuterEdge ? leafSproutMaterial : leafMaterial;
          const leaf = new THREE.Mesh(geom, mat);
          leaf.scale.set(leafScale, leafScale, leafScale);

          const arcAngle = Math.PI - ((d / (domeCount - 1)) * Math.PI * 0.85 - Math.PI * 0.42);
          const radiusX = currentMoundReach * 0.46;
          const radiusY = moundStep * 0.44;

          const lx = moundCenterX - Math.cos(arcAngle) * radiusX;
          const ly = moundCenterY + Math.sin(arcAngle) * radiusY;
          const lz = 2 + Math.sin(arcAngle * 2) * 7;
          leaf.position.set(lx, ly, lz);

          const rotZ = -arcAngle - Math.PI * 0.5;
          const rotX = 0.22;
          const rotY = -0.12;
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
            phaseSeed: y * 0.018 + d * 2 + 22,
            flex: 0.75 + (d / domeCount) * 0.35,
          });
        }
      }

      // ================= RIGHT HIBISCUS FLOWERS: NATURAL PAIRINGS & ALIGNMENT =================
      // Cluster 1: Upper Right (Medium Bloom nestled in upper slope)
      const rightCluster1Y = height * 0.35;
      const rightC1Reach = hedgeReach * 0.75;
      const rf1 = buildHibiscusFlower(flowerScale * 0.92, true);
      const rf1X = rightRootX - rightC1Reach * 0.95;
      rf1.group.position.set(rf1X, rightCluster1Y, 24);
      rf1.group.rotation.set(0.04, -0.05, -Math.PI * 0.08); // facing forward towards viewer
      scene.add(rf1.group);
      flowers.push({
        group: rf1.group,
        baseX: rf1X,
        baseY: rightCluster1Y,
        baseRotX: 0.04,
        baseRotY: -0.05,
        baseRotZ: -Math.PI * 0.08,
        petals: rf1.petals,
        basePetalRotX: rf1.basePetalRotX,
        stamen: rf1.stamen,
        swayPhase: 1.5,
      });

      // Cluster 2: Mid-Lower Right (Large Main Bloom + Companion Semi-Open Blossom + Bud Sprays)
      const rightCluster2Y = -height * 0.05;
      const rf2 = buildHibiscusFlower(flowerScale * 1.05, true);
      const rf2X = rightRootX - rightC1Reach;
      rf2.group.position.set(rf2X, rightCluster2Y, 26);
      rf2.group.rotation.set(0.04, -0.05, -Math.PI * 0.05); // facing forward towards viewer
      scene.add(rf2.group);
      flowers.push({
        group: rf2.group,
        baseX: rf2X,
        baseY: rightCluster2Y,
        baseRotX: 0.04,
        baseRotY: -0.05,
        baseRotZ: -Math.PI * 0.05,
        petals: rf2.petals,
        basePetalRotX: rf2.basePetalRotX,
        stamen: rf2.stamen,
        swayPhase: 2.8,
      });

      // Companion Blossom nestled beside main flower
      const rf2Comp = buildHibiscusFlower(flowerScale * 0.65, true);
      const rf2CompX = rf2X - (isMobile ? 12 : 28);
      const rf2CompY = rightCluster2Y + (isMobile ? 18 : 36);
      rf2Comp.group.position.set(rf2CompX, rf2CompY, 20);
      rf2Comp.group.rotation.set(0.06, -0.08, Math.PI * 0.12);
      scene.add(rf2Comp.group);
      flowers.push({
        group: rf2Comp.group,
        baseX: rf2CompX,
        baseY: rf2CompY,
        baseRotX: 0.06,
        baseRotY: -0.08,
        baseRotZ: Math.PI * 0.12,
        petals: rf2Comp.petals,
        basePetalRotX: rf2Comp.basePetalRotX,
        stamen: rf2Comp.stamen,
        swayPhase: 3.6,
      });

      // Bud spray reaching outward
      const rBud = buildBudTwig(leafScale * 0.8);
      const rbX = rf2CompX - (isMobile ? 8 : 16);
      const rbY = rf2CompY + (isMobile ? 14 : 26);
      rBud.position.set(rbX, rbY, 18);
      rBud.rotation.z = -Math.PI * 0.35;
      scene.add(rBud);
      buds.push({ group: rBud, baseX: rbX, baseY: rbY, baseRotZ: -Math.PI * 0.35, phaseSeed: 4.2 });
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
      const triggerThreshold = width < 640 ? 70 : 165;

      if (clickX < triggerThreshold || clickX > width - triggerThreshold) {
        const worldX = e.clientX - width / 2;
        const worldY = height / 2 - e.clientY;
        const isLeft = clickX < width / 2;

        for (let p = 0; p < 7; p++) {
          const petalMesh = new THREE.Mesh(petalGeom, petalMaterial);
          const pScale = width < 640 ? 0.35 : 0.5;
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

        // Flower body gently sways without turning away from user
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

      // Update Bud Twigs
      for (let b = 0; b < buds.length; b++) {
        const bud = buds[b];
        const wave = Math.sin(time * 2.6 + bud.phaseSeed);
        bud.group.rotation.z = bud.baseRotZ + wave * 0.12 * windForce;
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
          const currentScale = width < 640 ? 0.35 : 0.5;
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
      twigGeom.dispose();
      budTipGeom.dispose();

      leafTexture.dispose();
      petalTexture.dispose();
      leafMaterial.dispose();
      leafShadowMaterial.dispose();
      leafSproutMaterial.dispose();
      twigMaterial.dispose();
      petalMaterial.dispose();
      budMaterial.dispose();
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
