import * as THREE from 'three';

/**
 * Creates procedural soft cloud texture with natural radial falloff
 */
function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);

  // Soft puff clusters
  const puffs = [
    { x: 128, y: 128, r: 90, a: 0.65 },
    { x: 95, y: 135, r: 65, a: 0.55 },
    { x: 165, y: 130, r: 70, a: 0.55 },
    { x: 130, y: 95, r: 60, a: 0.6 },
    { x: 80, y: 110, r: 50, a: 0.45 },
    { x: 180, y: 115, r: 52, a: 0.45 },
  ];

  puffs.forEach(({ x, y, r, a }) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${a})`);
    gradient.addColorStop(0.5, `rgba(248, 250, 255, ${a * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates procedural mountain rock & snow texture
 */
function createMountainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark slate granite mountain base
  ctx.fillStyle = '#4A4D53';
  ctx.fillRect(0, 0, 512, 512);

  // Rocky fissures and strata
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const val = 50 + Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgba(${val}, ${val + 2}, ${val + 6}, 0.15)`;
    ctx.fillRect(x, y, 2 + Math.random() * 4, 1 + Math.random() * 3);
  }

  // Snow accumulation at top
  const snowGrad = ctx.createLinearGradient(0, 0, 0, 512);
  snowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  snowGrad.addColorStop(0.35, 'rgba(240, 245, 255, 0.85)');
  snowGrad.addColorStop(0.65, 'rgba(180, 195, 210, 0.3)');
  snowGrad.addColorStop(1, 'rgba(74, 77, 83, 0)');

  ctx.fillStyle = snowGrad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates realistic Himalayan mountain range with jagged snow summits
 */
function createMountainMesh(
  width: number,
  height: number,
  depth: number,
  mountainTex: THREE.Texture
): THREE.Mesh {
  const geo = new THREE.ConeGeometry(width / 2, height, 9, 14);
  const pos = geo.attributes.position;

  // Add realistic jagged ridgeline displacement to vertices
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Skip apex
    if (y < height * 0.45) {
      const angle = Math.atan2(z, x);
      const ridgeNoise = Math.sin(angle * 4) * 0.25 + Math.cos(angle * 8) * 0.12;
      const heightFactor = 1.0 - (y + height / 2) / height;

      pos.setX(i, x * (1.0 + ridgeNoise * heightFactor));
      pos.setZ(i, z * (1.0 + ridgeNoise * heightFactor * depth));
    }
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    map: mountainTex,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export interface HimalayanEnvironmentResult {
  group: THREE.Group;
  cloudMeshes: THREE.Mesh[];
  sunLight: THREE.DirectionalLight;
  ambientLight: THREE.HemisphereLight;
  motesMesh: THREE.Points;
  update: (time: number, scrollProgress: number) => void;
}

/**
 * Builds the complete 3D Himalayan Environment
 */
export function createHimalayanEnvironment(): HimalayanEnvironmentResult {
  const envGroup = new THREE.Group();
  envGroup.name = 'HimalayanEnvironment';

  const mountainTex = createMountainTexture();
  const cloudTex = createCloudTexture();

  // =========================================================================
  // 1. ATMOSPHERIC SKY DOME
  // =========================================================================
  const skyGeo = new THREE.SphereGeometry(320, 32, 24);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color('#3267B8') },      // Deep Himalayan Zenith Blue
      midColor: { value: new THREE.Color('#6BA5E7') },      // Crisp mountain azure
      horizonColor: { value: new THREE.Color('#FCEAD2') },  // Warm golden sunlit haze
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 horizonColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        vec3 col = mix(horizonColor, midColor, smoothstep(0.0, 0.4, h));
        col = mix(col, topColor, smoothstep(0.4, 0.9, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  envGroup.add(skyDome);

  // =========================================================================
  // 2. LIGHTING SETUP
  // =========================================================================
  // Hemisphere sky & ground ambient
  const ambientLight = new THREE.HemisphereLight('#C7E0FF', '#7A6B58', 1.4);
  envGroup.add(ambientLight);

  // Golden Morning Sun
  const sunLight = new THREE.DirectionalLight('#FFF3DB', 2.8);
  sunLight.position.set(-60, 110, 80);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 300;
  sunLight.shadow.camera.left = -40;
  sunLight.shadow.camera.right = 40;
  sunLight.shadow.camera.top = 40;
  sunLight.shadow.camera.bottom = -40;
  sunLight.shadow.bias = -0.0005;
  envGroup.add(sunLight);

  // Soft secondary warm fill
  const fillLight = new THREE.DirectionalLight('#FAD6A5', 0.8);
  fillLight.position.set(40, 50, -40);
  envGroup.add(fillLight);

  // =========================================================================
  // 3. DISTANT MAJESTIC HIMALAYAN SNOW PEAKS (Kedarnath Ridge & Kedar Dome)
  // =========================================================================
  const mountainGroup = new THREE.Group();
  mountainGroup.name = 'MountainRanges';

  // Central Towering Kedarnath Peak (Directly behind temple at z ~ -120)
  const mainPeak = createMountainMesh(95, 88, 1.3, mountainTex);
  mainPeak.position.set(0, 38, -120);
  mountainGroup.add(mainPeak);

  // Left Flank Peaks (Kedar Dome)
  const leftPeak1 = createMountainMesh(78, 72, 1.2, mountainTex);
  leftPeak1.position.set(-62, 30, -100);
  mountainGroup.add(leftPeak1);

  const leftPeak2 = createMountainMesh(65, 58, 1.1, mountainTex);
  leftPeak2.position.set(-95, 24, -80);
  mountainGroup.add(leftPeak2);

  // Right Flank Peaks (Bhagirathi / Meru ridgeline)
  const rightPeak1 = createMountainMesh(74, 68, 1.2, mountainTex);
  rightPeak1.position.set(58, 28, -105);
  mountainGroup.add(rightPeak1);

  const rightPeak2 = createMountainMesh(62, 54, 1.1, mountainTex);
  rightPeak2.position.set(90, 22, -85);
  mountainGroup.add(rightPeak2);

  // Middle Valley Slopes (Flanking the Mandakini valley path)
  const valleyLeft = createMountainMesh(48, 32, 1.4, mountainTex);
  valleyLeft.position.set(-36, 12, -45);
  mountainGroup.add(valleyLeft);

  const valleyRight = createMountainMesh(50, 34, 1.4, mountainTex);
  valleyRight.position.set(38, 13, -48);
  mountainGroup.add(valleyRight);

  envGroup.add(mountainGroup);

  // =========================================================================
  // 4. ALPINE CONIFEROUS PINE TREES ALONG VALLEY RIDGES
  // =========================================================================
  const pineTrunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 1.2, 5);
  const pineTrunkMat = new THREE.MeshStandardMaterial({ color: '#3A2618', roughness: 0.9 });
  const pineFoliageGeo = new THREE.ConeGeometry(1.2, 3.4, 5);
  const pineFoliageMat = new THREE.MeshStandardMaterial({ color: '#274428', roughness: 0.8 });

  const treeGroup = new THREE.Group();
  treeGroup.name = 'AlpineForest';

  // Populate clumps of pine trees on valley sides
  const treeSpots = [
    [-18, 0, 5], [-16, 0.5, 0], [-21, 1.2, -6], [-19, 2.0, -14], [-24, 3.5, -22],
    [18, 0, 6], [16, 0.6, 1], [22, 1.4, -5], [20, 2.2, -13], [25, 3.8, -20],
    [-28, 5.0, -32], [29, 5.2, -30], [-15, 0.2, 10], [15, 0.2, 11],
  ];

  treeSpots.forEach(([tx, ty, tz], idx) => {
    const singleTree = new THREE.Group();
    const scale = 0.8 + (idx % 4) * 0.25;

    const trunk = new THREE.Mesh(pineTrunkGeo, pineTrunkMat);
    trunk.position.y = 0.6;
    singleTree.add(trunk);

    const foliage1 = new THREE.Mesh(pineFoliageGeo, pineFoliageMat);
    foliage1.position.y = 2.4;
    singleTree.add(foliage1);

    const foliage2 = new THREE.Mesh(pineFoliageGeo, pineFoliageMat);
    foliage2.scale.set(0.75, 0.8, 0.75);
    foliage2.position.y = 3.6;
    singleTree.add(foliage2);

    singleTree.scale.set(scale, scale, scale);
    singleTree.position.set(tx, ty, tz);
    treeGroup.add(singleTree);
  });
  envGroup.add(treeGroup);

  // Valley Ground Floor
  const groundGeo = new THREE.PlaneGeometry(160, 200, 32, 32);
  // Gentle valley undulations
  const gPos = groundGeo.attributes.position;
  for (let i = 0; i < gPos.count; i++) {
    const gx = gPos.getX(i);
    const gy = gPos.getY(i);
    const elevation = Math.sin(gx * 0.08) * 1.5 + Math.cos(gy * 0.06) * 1.2;
    gPos.setZ(i, elevation);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshStandardMaterial({
    color: '#656860', // Alpine rocky soil & moss
    roughness: 0.9,
    metalness: 0.05,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, -0.2, -40);
  groundMesh.receiveShadow = true;
  envGroup.add(groundMesh);

  // =========================================================================
  // 5. MULTI-DEPTH VOLUMETRIC-STYLE CLOUD LAYERS
  // =========================================================================
  const cloudGroup = new THREE.Group();
  cloudGroup.name = 'CloudLayers';
  const cloudMeshes: THREE.Mesh[] = [];

  // Define cloud layers at varying altitudes and depth planes
  const cloudConfigs = [
    // High altitude clouds in sky (Scene 1 & 2)
    { x: -35, y: 44, z: 95, w: 48, h: 22, opacity: 0.75 },
    { x: 30, y: 46, z: 85, w: 52, h: 24, opacity: 0.8 },
    { x: -10, y: 38, z: 70, w: 42, h: 18, opacity: 0.7 },
    { x: 45, y: 34, z: 55, w: 46, h: 20, opacity: 0.75 },

    // Mid descending cloud bank (Scene 2 & 3)
    { x: -32, y: 26, z: 35, w: 44, h: 19, opacity: 0.8 },
    { x: 28, y: 24, z: 25, w: 46, h: 20, opacity: 0.85 },
    { x: -18, y: 19, z: 8, w: 38, h: 16, opacity: 0.7 },
    { x: 22, y: 17, z: -2, w: 40, h: 18, opacity: 0.75 },

    // Valley ground mist & mountain skirts (Scene 3, 4 & 5)
    { x: -45, y: 9, z: -25, w: 54, h: 18, opacity: 0.65 },
    { x: 42, y: 10, z: -28, w: 56, h: 19, opacity: 0.65 },
    { x: 0, y: 7, z: -45, w: 60, h: 20, opacity: 0.6 },
  ];

  cloudConfigs.forEach((cfg, idx) => {
    const cGeo = new THREE.PlaneGeometry(cfg.w, cfg.h);
    const cMat = new THREE.MeshBasicMaterial({
      map: cloudTex,
      transparent: true,
      opacity: cfg.opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.set(cfg.x, cfg.y, cfg.z);
    cMesh.userData = {
      baseX: cfg.x,
      baseY: cfg.y,
      baseZ: cfg.z,
      speed: 0.3 + (idx % 3) * 0.15,
      driftPhase: idx * 1.3,
      baseOpacity: cfg.opacity,
    };
    cloudMeshes.push(cMesh);
    cloudGroup.add(cMesh);
  });
  envGroup.add(cloudGroup);

  // =========================================================================
  // 6. FLOATING GOLDEN LIGHT MOTES & CELESTIAL PARTICLES
  // =========================================================================
  const motesCount = 120;
  const motesGeo = new THREE.BufferGeometry();
  const motesPositions = new Float32Array(motesCount * 3);
  const motesScales = new Float32Array(motesCount);

  for (let i = 0; i < motesCount; i++) {
    motesPositions[i * 3] = (Math.random() - 0.5) * 60;
    motesPositions[i * 3 + 1] = 2 + Math.random() * 30;
    motesPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    motesScales[i] = 0.5 + Math.random() * 1.5;
  }

  motesGeo.setAttribute('position', new THREE.BufferAttribute(motesPositions, 3));

  // Circular soft gold particle canvas texture
  const moteCanvas = document.createElement('canvas');
  moteCanvas.width = 64;
  moteCanvas.height = 64;
  const mCtx = moteCanvas.getContext('2d')!;
  const mGrad = mCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
  mGrad.addColorStop(0, 'rgba(255, 230, 160, 1.0)');
  mGrad.addColorStop(0.4, 'rgba(235, 185, 75, 0.6)');
  mGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
  mCtx.fillStyle = mGrad;
  mCtx.fillRect(0, 0, 64, 64);
  const moteTex = new THREE.CanvasTexture(moteCanvas);

  const motesMat = new THREE.PointsMaterial({
    map: moteTex,
    size: 1.2,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const motesMesh = new THREE.Points(motesGeo, motesMat);
  envGroup.add(motesMesh);

  // =========================================================================
  // 7. TICK UPDATE FUNCTION (Called every frame)
  // =========================================================================
  const update = (time: number, scrollProgress: number) => {
    // 1. Gently drift clouds along X and subtle bob on Y
    cloudMeshes.forEach((cloud) => {
      const u = cloud.userData;
      cloud.position.x = u.baseX + Math.sin(time * 0.08 * u.speed + u.driftPhase) * 4.5;
      cloud.position.y = u.baseY + Math.cos(time * 0.06 * u.speed + u.driftPhase) * 1.2;

      // Make high clouds fade out gracefully as camera dives through them
      if (u.baseZ > 50) {
        // High sky clouds: visible at start, fade as scroll progresses past 0.35
        const fade = Math.max(0, 1.0 - scrollProgress * 2.2);
        (cloud.material as THREE.MeshBasicMaterial).opacity = u.baseOpacity * fade;
      }
    });

    // 2. Animate floating golden motes
    const posAttr = motesGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < motesCount; i++) {
      let y = posAttr.getY(i) + Math.sin(time + i) * 0.015;
      if (y > 32) y = 2;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;

    // 3. Modulate sun warmth and intensity with scroll
    // Scene 1 opens with soft morning glow, intensifying to radiant gold in Scene 4 & 5
    sunLight.intensity = 2.4 + scrollProgress * 0.8;
  };

  return {
    group: envGroup,
    cloudMeshes,
    sunLight,
    ambientLight,
    motesMesh,
    update,
  };
}
