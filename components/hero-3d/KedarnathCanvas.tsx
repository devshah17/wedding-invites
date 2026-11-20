'use client';

import React, { useRef, useEffect, useSyncExternalStore } from 'react';
import * as THREE from 'three';

export interface KedarnathCanvasProps {
  /** Scroll progress through the hero section (0.0 to 1.0) */
  scrollProgress: number;
  /** Optional custom class name */
  className?: string;
}

const emptySubscribe = () => () => {};

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

/**
 * Creates a soft radial cloud texture for floating 3D mist planes
 */
function createCloudParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  grad.addColorStop(0.35, 'rgba(240, 246, 255, 0.45)');
  grad.addColorStop(0.7, 'rgba(225, 238, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates golden particle motes texture
 */
function createMoteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 235, 170, 1.0)');
  grad.addColorStop(0.4, 'rgba(235, 190, 80, 0.6)');
  grad.addColorStop(1, 'rgba(235, 190, 80, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

export function KedarnathCanvas({ scrollProgress, className = '' }: KedarnathCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isWebGLSupported = useSyncExternalStore(emptySubscribe, checkWebGL, () => true);

  const scrollProgressRef = useRef(scrollProgress);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isWebGLSupported) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#386DB5');
    scene.fog = new THREE.FogExp2('#BDD5EA', 0.0035);

    // 2. CAMERA with dynamic responsive vertical FOV
    const fov = isMobile ? 62 : 48;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 500);
    camera.position.set(0, 20, 52);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. LOAD HIGH-RESOLUTION REALISTIC PHOTOGRAPHIC ASSETS
    const textureLoader = new THREE.TextureLoader();
    const skyTex = textureLoader.load('/images/kedarnath/sky-peaks.jpg');
    const valleyTex = textureLoader.load('/images/kedarnath/temple-valley.jpg');
    const entranceTex = textureLoader.load('/images/kedarnath/temple-entrance.jpg');
    const cloudTex = createCloudParticleTexture();
    const moteTex = createMoteTexture();

    // Optimize texture filtering
    [skyTex, valleyTex, entranceTex].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    });

    // 5. LAYER 1: Deep Himalayan Sky & Peaks Backdrop (z = -100)
    const skyGeo = new THREE.PlaneGeometry(160, 90);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 16, -100);
    scene.add(skyMesh);

    // 6. LAYER 2: Cinematic Valley & Kedarnath Temple (z = -35)
    // Authentic stone shikhara, slate roof, marigolds & mountain slopes
    const valleyGeo = new THREE.PlaneGeometry(105, 59);
    const valleyMat = new THREE.MeshBasicMaterial({
      map: valleyTex,
      transparent: true,
      opacity: 0.1, // Faint in Scene 1, emerges majestically in Scene 2 & 3
      depthWrite: false,
    });
    const valleyMesh = new THREE.Mesh(valleyGeo, valleyMat);
    valleyMesh.position.set(0, 3, -35);
    scene.add(valleyMesh);

    // 7. LAYER 3: Realistic Standing Entrance with Marigold Pillars (z = 4)
    // Authentic carved stone entrance pillars wrapped in marigolds (Scene 4 & 5)
    const entranceGeo = new THREE.PlaneGeometry(62, 35);
    const entranceMat = new THREE.MeshBasicMaterial({
      map: entranceTex,
      transparent: true,
      opacity: 0.0, // Fades in as camera approaches the steps in Scene 4 & 5
      depthWrite: false,
    });
    const entranceMesh = new THREE.Mesh(entranceGeo, entranceMat);
    entranceMesh.position.set(0, -0.5, 4);
    scene.add(entranceMesh);

    // 8. 3D DRIFTING VOLUMETRIC CLOUDS (Layers parting with true depth)
    const cloudGroup = new THREE.Group();
    const cloudMeshes: THREE.Mesh[] = [];
    const cloudConfigs = [
      // High clouds in sky (Scene 1)
      { x: -30, y: 22, z: 25, w: 38, h: 20, opacity: 0.65 },
      { x: 28, y: 24, z: 20, w: 42, h: 22, opacity: 0.7 },
      { x: -8, y: 18, z: 12, w: 34, h: 18, opacity: 0.6 },
      // Mid-valley clouds (Scene 2 & 3)
      { x: -24, y: 12, z: -5, w: 36, h: 19, opacity: 0.55 },
      { x: 26, y: 10, z: -12, w: 40, h: 20, opacity: 0.6 },
      { x: 0, y: 6, z: -20, w: 44, h: 21, opacity: 0.5 },
      // Low mist around mountains (Scene 3 & 4)
      { x: -32, y: 2, z: -45, w: 48, h: 22, opacity: 0.45 },
      { x: 30, y: 3, z: -50, w: 50, h: 24, opacity: 0.45 },
    ];

    cloudConfigs.forEach((cfg, idx) => {
      const cGeo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const cMat = new THREE.MeshBasicMaterial({
        map: cloudTex,
        transparent: true,
        opacity: cfg.opacity,
        depthWrite: false,
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cfg.x, cfg.y, cfg.z);
      cMesh.userData = {
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        baseOpacity: cfg.opacity,
        speed: 0.4 + (idx % 3) * 0.2,
        phase: idx * 1.4,
      };
      cloudMeshes.push(cMesh);
      cloudGroup.add(cMesh);
    });
    scene.add(cloudGroup);

    // 9. 3D FLOATING GOLDEN LIGHT MOTES & SPARKLES
    const motesCount = 140;
    const motesGeo = new THREE.BufferGeometry();
    const motesPos = new Float32Array(motesCount * 3);

    for (let i = 0; i < motesCount; i++) {
      motesPos[i * 3] = (Math.random() - 0.5) * 50;
      motesPos[i * 3 + 1] = Math.random() * 26 - 2;
      motesPos[i * 3 + 2] = Math.random() * 70 - 45;
    }
    motesGeo.setAttribute('position', new THREE.BufferAttribute(motesPos, 3));

    const motesMat = new THREE.PointsMaterial({
      map: moteTex,
      size: 1.1,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const motes = new THREE.Points(motesGeo, motesMat);
    scene.add(motes);

    // 10. MOUSE / TOUCH INTERACTION PARALLAX
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // 11. 60FPS CINEMATIC RENDER LOOP WITH SPLINE CAMERA MOVEMENT
    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Target Camera Vectors
    const targetCamPos = new THREE.Vector3();
    const targetCamLook = new THREE.Vector3();
    const currentCamPos = new THREE.Vector3(0, 20, 52);
    const currentCamLook = new THREE.Vector3(0, 18, -60);

    const renderLoop = () => {
      const elapsedTime = clock.getElapsedTime();
      const p = Math.max(0, Math.min(1, scrollProgressRef.current));

      // =====================================================================
      // 5-STAGE CINEMATIC CAMERA POSITIONING & DEPTH BLENDING
      // =====================================================================
      if (p < 0.22) {
        // Stage 1: Floating in High Himalayan Sky (0.00 - 0.22)
        const t = p / 0.22;
        targetCamPos.set(0, 20 - t * 4, 52 - t * 10);
        targetCamLook.set(0, 18 - t * 3, -60);

        valleyMat.opacity = 0.05 + t * 0.45;
        entranceMat.opacity = 0.0;
        skyMat.opacity = 1.0;
      } else if (p < 0.52) {
        // Stage 2 & 3: Descending through clouds, Temple emerges in valley (0.22 - 0.52)
        const t = (p - 0.22) / 0.30;
        targetCamPos.set(0.8 * Math.sin(t * Math.PI), 16 - t * 8, 42 - t * 20);
        targetCamLook.set(0, 15 - t * 7, -50);

        valleyMat.opacity = 0.5 + t * 0.5; // Full opacity
        entranceMat.opacity = 0.0;
        skyMat.opacity = Math.max(0.2, 1.0 - t * 0.5);
      } else if (p < 0.78) {
        // Stage 4: Approaching the Temple courtyard & steps (0.52 - 0.78)
        const t = (p - 0.52) / 0.26;
        targetCamPos.set(0.3 * (1 - t), 8 - t * 5.5, 22 - t * 12);
        targetCamLook.set(0, 8 - t * 5.0, -25);

        // Transition from distant valley view into close entrance view
        valleyMat.opacity = 1.0 - t * 0.85;
        entranceMat.opacity = t * 0.95;
      } else {
        // Stage 5: Grand Standing Viewpoint outside decorated entrance (0.78 - 1.00)
        const t = (p - 0.78) / 0.22;
        targetCamPos.set(0, 2.5 - t * 1.2, 10 - t * 4.2);
        targetCamLook.set(0, 2.4 - t * 0.5, 0);

        valleyMat.opacity = 0.0;
        entranceMat.opacity = 1.0;
      }

      // Add subtle interactive mouse tilt parallax for organic tactile depth
      const mx = mouseRef.current.x * (isMobile ? 0.3 : 1.2);
      const my = mouseRef.current.y * (isMobile ? 0.2 : 0.8);
      targetCamPos.x += mx;
      targetCamPos.y += my;

      // Smooth camera dampening for buttery momentum
      currentCamPos.lerp(targetCamPos, 0.075);
      currentCamLook.lerp(targetCamLook, 0.075);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamLook);

      // Parallax shift on Sky and Valley planes relative to camera
      skyMesh.position.x = -camera.position.x * 0.12;
      skyMesh.position.y = 16 - (camera.position.y - 20) * 0.1;

      valleyMesh.position.x = -camera.position.x * 0.06;
      valleyMesh.position.y = 3 - (camera.position.y - 10) * 0.08;

      // Drift Clouds along X and bob on Y
      cloudMeshes.forEach((cloud) => {
        const u = cloud.userData;
        cloud.position.x = u.baseX + Math.sin(elapsedTime * 0.08 * u.speed + u.phase) * 3.5;
        cloud.position.y = u.baseY + Math.cos(elapsedTime * 0.06 * u.speed + u.phase) * 1.2;

        // Part clouds as camera moves forward
        if (camera.position.z < u.baseZ + 15) {
          const fade = Math.max(0, (camera.position.z - (u.baseZ - 5)) / 20);
          (cloud.material as THREE.MeshBasicMaterial).opacity = u.baseOpacity * fade;
        } else {
          (cloud.material as THREE.MeshBasicMaterial).opacity = u.baseOpacity;
        }
      });

      // Drift golden light motes in 3D volume
      const posAttr = motesGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < motesCount; i++) {
        let my = posAttr.getY(i) + Math.sin(elapsedTime * 0.6 + i) * 0.012;
        if (my > 26) my = -2;
        posAttr.setY(i, my);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 12. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      const mobileCheck = newW < 768;

      camera.fov = mobileCheck ? 62 : 48;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileCheck ? 1.5 : 2.0));
    };

    window.addEventListener('resize', handleResize);

    // 13. CLEANUP ON UNMOUNT
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isWebGLSupported]);

  if (!isWebGLSupported) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-b from-[#3267B8] via-[#6BA5E7] to-[#FCEAD2] ${className}`}>
        <div className="text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-antique-gold/40 text-champagne shadow-2xl">
          <p className="font-serif text-3xl font-bold">Kedarnath Temple</p>
          <p className="font-sans text-xs tracking-wider opacity-80 mt-1">Scroll to continue into wedding invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${className}`}
      aria-hidden="true"
    />
  );
}

export default KedarnathCanvas;
