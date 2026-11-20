import * as THREE from 'three';

/**
 * Creates authentic procedural canvas textures for Kedarnath Temple materials.
 */
function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base stone grey
  ctx.fillStyle = '#6E6E70';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle noise and weathering
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = 100 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgba(${shade}, ${shade - 2}, ${shade - 5}, 0.12)`;
    ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  // Horizontal stone slab masonry courses
  const rowHeight = 32;
  for (let y = 0; y < 512; y += rowHeight) {
    ctx.strokeStyle = '#3E3E40';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Vertical stone block joints with stagger
    const offsetX = (y / rowHeight) % 2 === 0 ? 0 : 36;
    for (let x = offsetX; x < 512; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowHeight);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createSlateRoofTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark slate stone
  ctx.fillStyle = '#424549';
  ctx.fillRect(0, 0, 256, 256);

  // Slate tile layering
  for (let y = 0; y < 256; y += 16) {
    ctx.strokeStyle = '#25272A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, y, 256, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createMarigoldTexture(baseColor: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const r = 2 + Math.random() * 6;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Builds the complete 3D Kedarnath Temple Group
 */
export function createKedarnathTemple(): THREE.Group {
  const templeGroup = new THREE.Group();
  templeGroup.name = 'KedarnathTemple';

  const stoneTexture = createStoneTexture();
  const roofTexture = createSlateRoofTexture();
  const marigoldOrangeTex = createMarigoldTexture('#FF7A00', '#FFB703');
  const marigoldYellowTex = createMarigoldTexture('#FFC107', '#FFA000');

  // Materials
  const stoneMat = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.85,
    metalness: 0.1,
    bumpMap: stoneTexture,
    bumpScale: 0.04,
  });

  const darkStoneMat = new THREE.MeshStandardMaterial({
    color: '#4A4A4D',
    roughness: 0.9,
    metalness: 0.05,
  });

  const slateRoofMat = new THREE.MeshStandardMaterial({
    map: roofTexture,
    roughness: 0.65,
    metalness: 0.2,
    color: '#55585C',
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: '#F4C430',
    roughness: 0.25,
    metalness: 0.9,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: '#533529',
    roughness: 0.8,
    metalness: 0.05,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    roughness: 0.35,
    metalness: 0.8,
  });

  const marigoldOrangeMat = new THREE.MeshStandardMaterial({
    map: marigoldOrangeTex,
    roughness: 0.7,
    metalness: 0.0,
    color: '#FF7A00',
  });

  const marigoldYellowMat = new THREE.MeshStandardMaterial({
    map: marigoldYellowTex,
    roughness: 0.7,
    metalness: 0.0,
    color: '#FFC72C',
  });

  const saffronFlagMat = new THREE.MeshStandardMaterial({
    color: '#FF5E00',
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  // =========================================================================
  // 1. PLINTH & COURTYARD PLATFORM (Jagati)
  // =========================================================================
  const plinthGeo = new THREE.BoxGeometry(22, 1.2, 34);
  const plinthMesh = new THREE.Mesh(plinthGeo, stoneMat);
  plinthMesh.position.set(0, 0.6, -2);
  plinthMesh.receiveShadow = true;
  templeGroup.add(plinthMesh);

  // Stepped entrance platform
  const stepCount = 5;
  for (let i = 0; i < stepCount; i++) {
    const stepWidth = 10 - i * 0.4;
    const stepDepth = 1.2;
    const stepHeight = 0.24;
    const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
    const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
    stepMesh.position.set(0, stepHeight * (i + 0.5), 15 + (stepCount - 1 - i) * 0.8);
    stepMesh.receiveShadow = true;
    templeGroup.add(stepMesh);
  }

  // =========================================================================
  // 2. MAIN SANCTUM (Garbhagriha) BASE & WALLS (at rear, z ~ -10)
  // =========================================================================
  const sanctumBaseGeo = new THREE.BoxGeometry(11, 8.5, 11);
  const sanctumBase = new THREE.Mesh(sanctumBaseGeo, stoneMat);
  sanctumBase.position.set(0, 1.2 + 8.5 / 2, -10);
  sanctumBase.castShadow = true;
  sanctumBase.receiveShadow = true;
  templeGroup.add(sanctumBase);

  // Horizontal cornice mouldings on sanctum
  for (let c = 0; c < 3; c++) {
    const corniceGeo = new THREE.BoxGeometry(11.6 + c * 0.2, 0.35, 11.6 + c * 0.2);
    const cornice = new THREE.Mesh(corniceGeo, darkStoneMat);
    cornice.position.set(0, 4.0 + c * 2.2, -10);
    templeGroup.add(cornice);
  }

  // =========================================================================
  // 3. TOWERING SHIKHARA (Kedarnath Curvilinear Stone Spire)
  // =========================================================================
  const shikharaTiers = 14;
  const spireBaseY = 1.2 + 8.5;
  const baseSize = 10.5;

  for (let t = 0; t < shikharaTiers; t++) {
    const progress = t / shikharaTiers;
    // Elegant curvilinear taper
    const scale = Math.cos(progress * (Math.PI / 2.2)) * baseSize;
    const tierHeight = 1.05;
    const tierGeo = new THREE.BoxGeometry(scale, tierHeight, scale);
    const tierMesh = new THREE.Mesh(tierGeo, stoneMat);
    tierMesh.position.set(0, spireBaseY + t * tierHeight + tierHeight / 2, -10);
    tierMesh.castShadow = true;
    tierMesh.receiveShadow = true;
    templeGroup.add(tierMesh);

    // Decorative corner miniature urns / amalakas on intermediate tiers
    if (t === 4 || t === 8 || t === 11) {
      const cornerOff = scale / 2;
      [
        [-cornerOff, -cornerOff],
        [cornerOff, -cornerOff],
        [-cornerOff, cornerOff],
        [cornerOff, cornerOff],
      ].forEach(([cx, cz]) => {
        const miniUrnGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.8, 8);
        const miniUrn = new THREE.Mesh(miniUrnGeo, darkStoneMat);
        miniUrn.position.set(cx, spireBaseY + t * tierHeight + 0.4, -10 + cz);
        templeGroup.add(miniUrn);
      });
    }
  }

  const spireTopY = spireBaseY + shikharaTiers * 1.05;

  // Front Sukanasa (Antarala gable projection on front of Shikhara)
  const sukanasaGeo = new THREE.ConeGeometry(3.2, 5, 4);
  const sukanasa = new THREE.Mesh(sukanasaGeo, stoneMat);
  sukanasa.rotation.y = Math.PI / 4;
  sukanasa.position.set(0, spireBaseY + 3.5, -4.8);
  templeGroup.add(sukanasa);

  // AMALAKA (Ribbed stone crowning disc)
  const amalakaGeo = new THREE.CylinderGeometry(2.4, 2.7, 1.4, 24);
  const amalakaMesh = new THREE.Mesh(amalakaGeo, darkStoneMat);
  amalakaMesh.position.set(0, spireTopY + 0.7, -10);
  amalakaMesh.castShadow = true;
  templeGroup.add(amalakaMesh);

  // Gold Kalash (Urn Finial atop the Amalaka)
  const kalashBaseGeo = new THREE.CylinderGeometry(1.2, 0.8, 1.0, 16);
  const kalashBase = new THREE.Mesh(kalashBaseGeo, goldMat);
  kalashBase.position.set(0, spireTopY + 1.8, -10);
  templeGroup.add(kalashBase);

  const kalashPotGeo = new THREE.SphereGeometry(1.0, 16, 16);
  const kalashPot = new THREE.Mesh(kalashPotGeo, goldMat);
  kalashPot.position.set(0, spireTopY + 2.7, -10);
  templeGroup.add(kalashPot);

  const kalashSpireGeo = new THREE.ConeGeometry(0.3, 2.2, 12);
  const kalashSpire = new THREE.Mesh(kalashSpireGeo, goldMat);
  kalashSpire.position.set(0, spireTopY + 4.1, -10);
  templeGroup.add(kalashSpire);

  // Saffron flag atop the Shikhara
  const shikharaFlagGeo = new THREE.BufferGeometry();
  const flagVertices = new Float32Array([
    0, 0, 0,
    0, 1.8, 0,
    2.4, 0.9, 0,
  ]);
  shikharaFlagGeo.setAttribute('position', new THREE.BufferAttribute(flagVertices, 3));
  shikharaFlagGeo.computeVertexNormals();
  const shikharaFlag = new THREE.Mesh(shikharaFlagGeo, saffronFlagMat);
  shikharaFlag.position.set(0.1, spireTopY + 3.8, -10);
  templeGroup.add(shikharaFlag);

  // =========================================================================
  // 4. SABHA MANDAPA (Front Main Hall with Pitched Slate Roof)
  // =========================================================================
  const mandapaBaseGeo = new THREE.BoxGeometry(13.5, 6.8, 16);
  const mandapaBase = new THREE.Mesh(mandapaBaseGeo, stoneMat);
  mandapaBase.position.set(0, 1.2 + 6.8 / 2, 3);
  mandapaBase.castShadow = true;
  mandapaBase.receiveShadow = true;
  templeGroup.add(mandapaBase);

  // Mandapa Sloped Slate Roof (Tiered Gable)
  const roofHeight = 4.2;
  const mandapaRoofGeo = new THREE.ConeGeometry(10.5, roofHeight, 4);
  const mandapaRoof = new THREE.Mesh(mandapaRoofGeo, slateRoofMat);
  mandapaRoof.rotation.y = Math.PI / 4;
  mandapaRoof.scale.set(1.05, 1.0, 1.45);
  mandapaRoof.position.set(0, 1.2 + 6.8 + roofHeight / 2 - 0.2, 3);
  mandapaRoof.castShadow = true;
  templeGroup.add(mandapaRoof);

  // Roof Gold Ridge Finials
  for (let rz = -2; rz <= 8; rz += 3.2) {
    const ridgeFinialGeo = new THREE.ConeGeometry(0.35, 1.2, 8);
    const ridgeFinial = new THREE.Mesh(ridgeFinialGeo, goldMat);
    ridgeFinial.position.set(0, 1.2 + 6.8 + roofHeight, rz);
    templeGroup.add(ridgeFinial);
  }

  // Eaves Overhang Mouldings
  const eaveGeo = new THREE.BoxGeometry(14.2, 0.4, 16.8);
  const eaveMesh = new THREE.Mesh(eaveGeo, woodMat);
  eaveMesh.position.set(0, 1.2 + 6.7, 3);
  templeGroup.add(eaveMesh);

  // =========================================================================
  // 5. ARDHA MANDAPA (Front Entrance Portico & Pillars)
  // =========================================================================
  const porticoRoofGeo = new THREE.BoxGeometry(9.6, 0.6, 5.0);
  const porticoRoof = new THREE.Mesh(porticoRoofGeo, stoneMat);
  porticoRoof.position.set(0, 1.2 + 5.8, 13.5);
  templeGroup.add(porticoRoof);

  // Front Pediment / Arch above entrance
  const pedimentGeo = new THREE.ConeGeometry(5.4, 2.2, 4);
  const pediment = new THREE.Mesh(pedimentGeo, slateRoofMat);
  pediment.rotation.y = Math.PI / 4;
  pediment.scale.set(1.0, 0.9, 0.5);
  pediment.position.set(0, 1.2 + 5.8 + 1.1, 13.8);
  templeGroup.add(pediment);

  // Gold kalash on entrance pediment
  const pedimentKalashGeo = new THREE.ConeGeometry(0.3, 0.9, 8);
  const pedimentKalash = new THREE.Mesh(pedimentKalashGeo, goldMat);
  pedimentKalash.position.set(0, 1.2 + 5.8 + 2.2, 13.8);
  templeGroup.add(pedimentKalash);

  // Grand Front Pillars (Wrapped in Marigolds as in Screenshot 3!)
  const pillarPositions = [
    [-3.8, 13.5],
    [-1.6, 14.2],
    [1.6, 14.2],
    [3.8, 13.5],
  ];

  pillarPositions.forEach(([px, pz], idx) => {
    // Stone Pillar Base
    const pBaseGeo = new THREE.BoxGeometry(1.1, 0.8, 1.1);
    const pBase = new THREE.Mesh(pBaseGeo, darkStoneMat);
    pBase.position.set(px, 1.2 + 0.4, pz);
    templeGroup.add(pBase);

    // Pillar Column Shaft
    const pShaftGeo = new THREE.CylinderGeometry(0.42, 0.45, 4.4, 16);
    const pShaft = new THREE.Mesh(pShaftGeo, stoneMat);
    pShaft.position.set(px, 1.2 + 0.8 + 2.2, pz);
    pShaft.castShadow = true;
    templeGroup.add(pShaft);

    // Pillar Capital
    const pCapGeo = new THREE.BoxGeometry(1.2, 0.6, 1.2);
    const pCap = new THREE.Mesh(pCapGeo, darkStoneMat);
    pCap.position.set(px, 1.2 + 0.8 + 4.4 + 0.3, pz);
    templeGroup.add(pCap);

    // SPIRALING MARIGOLD GARLAND WRAPPED AROUND PILLAR
    const spiralTurns = 5;
    for (let s = 0; s < spiralTurns; s++) {
      const ringY = 1.2 + 1.0 + (s / spiralTurns) * 3.8;
      const angle = (s * Math.PI) / 2 + idx * 0.4;
      const garlandRingGeo = new THREE.TorusGeometry(0.52, 0.12, 8, 20);
      const garlandMat = s % 2 === 0 ? marigoldOrangeMat : marigoldYellowMat;
      const garlandRing = new THREE.Mesh(garlandRingGeo, garlandMat);
      garlandRing.rotation.x = Math.PI / 2 + 0.18;
      garlandRing.rotation.y = angle;
      garlandRing.position.set(px, ringY, pz);
      templeGroup.add(garlandRing);
    }
  });

  // =========================================================================
  // 6. ENTRANCE DOORWAY, BRASS GATES & TORAN
  // =========================================================================
  // Deep Doorway Frame
  const doorFrameGeo = new THREE.BoxGeometry(3.6, 4.6, 0.8);
  const doorFrame = new THREE.Mesh(doorFrameGeo, darkStoneMat);
  doorFrame.position.set(0, 1.2 + 2.3, 11.2);
  templeGroup.add(doorFrame);

  // Carved Dark Wooden Door Leaves
  const doorLeafGeo = new THREE.BoxGeometry(1.5, 4.0, 0.2);
  const leftDoor = new THREE.Mesh(doorLeafGeo, woodMat);
  leftDoor.position.set(-0.8, 1.2 + 2.1, 11.1);
  templeGroup.add(leftDoor);

  const rightDoor = new THREE.Mesh(doorLeafGeo, woodMat);
  rightDoor.position.set(0.8, 1.2 + 2.1, 11.1);
  templeGroup.add(rightDoor);

  // Brass Door Handles
  [-0.8, 0.8].forEach((hx) => {
    const handleGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    const handle = new THREE.Mesh(handleGeo, brassMat);
    handle.position.set(hx, 1.2 + 2.1, 11.25);
    templeGroup.add(handle);
  });

  // Auspicious Inner Sanctum Diya / Golden Glow Light
  const sanctumLight = new THREE.PointLight('#FFB74D', 2.5, 8, 1.2);
  sanctumLight.position.set(0, 1.2 + 2.5, 10.5);
  templeGroup.add(sanctumLight);

  // Marigold Festoon Toran Draped along Entrance Lintel
  const toranCurvePoints = [
    new THREE.Vector3(-2.2, 1.2 + 4.6, 12.0),
    new THREE.Vector3(-1.1, 1.2 + 4.1, 12.0),
    new THREE.Vector3(0, 1.2 + 4.4, 12.0),
    new THREE.Vector3(1.1, 1.2 + 4.1, 12.0),
    new THREE.Vector3(2.2, 1.2 + 4.6, 12.0),
  ];
  const toranCurve = new THREE.CatmullRomCurve3(toranCurvePoints);
  const toranGeo = new THREE.TubeGeometry(toranCurve, 24, 0.14, 8, false);
  const entranceToran = new THREE.Mesh(toranGeo, marigoldOrangeMat);
  templeGroup.add(entranceToran);

  // Marigold Hanging Drops
  [-1.6, -0.8, 0, 0.8, 1.6].forEach((tx, i) => {
    const dropGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const dropMesh = new THREE.Mesh(dropGeo, i % 2 === 0 ? marigoldYellowMat : marigoldOrangeMat);
    dropMesh.position.set(tx, 1.2 + 4.0, 12.0);
    templeGroup.add(dropMesh);
  });

  // =========================================================================
  // 7. COURTYARD SAFFRON FLAGS (Dhwaja)
  // =========================================================================
  const flagPoles = [
    [-8.5, 14.5],
    [8.5, 14.5],
    [-7.0, 2.0],
    [7.0, 2.0],
  ];

  flagPoles.forEach(([fx, fz], idx) => {
    // Wooden Pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.5, 8);
    const poleMesh = new THREE.Mesh(poleGeo, woodMat);
    poleMesh.position.set(fx, 1.2 + 3.75, fz);
    templeGroup.add(poleMesh);

    // Gold finial on pole
    const pFinialGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const pFinial = new THREE.Mesh(pFinialGeo, goldMat);
    pFinial.position.set(fx, 1.2 + 7.6, fz);
    templeGroup.add(pFinial);

    // Fluttering Saffron Triangular Flag
    const triFlagGeo = new THREE.BufferGeometry();
    const flagW = 2.0;
    const flagH = 1.4;
    const flagVerts = new Float32Array([
      0, 0, 0,
      0, flagH, 0,
      flagW, flagH * 0.5, 0.15 * Math.sin(idx),
    ]);
    triFlagGeo.setAttribute('position', new THREE.BufferAttribute(flagVerts, 3));
    triFlagGeo.computeVertexNormals();
    const flagMesh = new THREE.Mesh(triFlagGeo, saffronFlagMat);
    flagMesh.position.set(fx + 0.08, 1.2 + 7.4 - flagH, fz);
    flagMesh.rotation.y = 0.2 * idx;
    templeGroup.add(flagMesh);
  });

  return templeGroup;
}
