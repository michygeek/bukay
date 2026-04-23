"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Home } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type HouseType = "bungalow" | "duplex" | "villa";
type RoofStyle = "gable" | "hip" | "flat";

interface Config {
  houseType: HouseType;
  wallColor: string;
  roofColor: string;
  roofStyle: RoofStyle;
  windowColor: string;
}

// ─── Palette data ─────────────────────────────────────────────────────────────

const WALL_COLORS = [
  { label: "White", value: "#F4F0E8" },
  { label: "Beige", value: "#E8D5B0" },
  { label: "Stone", value: "#B8A898" },
  { label: "Sage", value: "#8DA68A" },
  { label: "Terracotta", value: "#C47A5A" },
  { label: "Navy", value: "#2C3E6B" },
];

const ROOF_COLORS = [
  { label: "Clay Red", value: "#8B2018" },
  { label: "Charcoal", value: "#3A3A3A" },
  { label: "Walnut", value: "#6B4226" },
  { label: "Forest", value: "#2C5C2E" },
  { label: "Slate", value: "#607080" },
  { label: "Black", value: "#1A1A1A" },
];

const WINDOW_COLORS = [
  { label: "Sky Blue", value: "#87CEEB" },
  { label: "Warm White", value: "#FDECD0" },
  { label: "Bronze", value: "#6B4F3A" },
  { label: "Clear", value: "#C8E8F8" },
];

// ─── Three.js geometry helpers ────────────────────────────────────────────────

function makeGableRoof(
  width: number,
  depth: number,
  height: number,
  color: string
): THREE.Mesh {
  const hw = width / 2;
  const hd = depth / 2;

  const verts = new Float32Array([
    -hw, 0,  hd,   //  0 front-left
     hw, 0,  hd,   //  1 front-right
      0, height,  hd,  //  2 front-apex
    -hw, 0, -hd,   //  3 back-left
     hw, 0, -hd,   //  4 back-right
      0, height, -hd,  //  5 back-apex
  ]);

  const idx = [
    0, 1, 2,          // front gable
    3, 5, 4,          // back gable
    0, 2, 5,  0, 5, 3,  // left slope
    1, 4, 5,  1, 5, 2,  // right slope
    0, 3, 4,  0, 4, 1,  // bottom (hidden but complete)
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  return new THREE.Mesh(
    geo,
    new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
  );
}

function makeHipRoof(
  width: number,
  depth: number,
  height: number,
  color: string
): THREE.Mesh {
  const hw = width / 2;
  const hd = depth / 2;
  const ridgeHalf = width / 5;

  const verts = new Float32Array([
    -hw, 0,  hd,           // 0 front-left
     hw, 0,  hd,           // 1 front-right
     hw, 0, -hd,           // 2 back-right
    -hw, 0, -hd,           // 3 back-left
    -ridgeHalf, height, 0, // 4 ridge-left
     ridgeHalf, height, 0, // 5 ridge-right
  ]);

  const idx = [
    0, 1, 5,  0, 5, 4,  // front slope
    2, 3, 4,  2, 4, 5,  // back slope
    3, 0, 4,             // left hip
    1, 2, 5,             // right hip
    0, 3, 2,  0, 2, 1,  // bottom
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  return new THREE.Mesh(
    geo,
    new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
  );
}

function makeFlatRoof(
  width: number,
  depth: number,
  color: string
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(width + 0.4, 0.35, depth + 0.4);
  return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color }));
}

function makeRoof(
  style: RoofStyle,
  width: number,
  depth: number,
  color: string
): THREE.Mesh {
  if (style === "gable") return makeGableRoof(width + 0.6, depth + 0.5, 2.5, color);
  if (style === "hip") return makeHipRoof(width + 0.6, depth + 0.5, 2.5, color);
  return makeFlatRoof(width, depth, color);
}

function makeWindow(w: number, h: number, glassColor: string): THREE.Group {
  const g = new THREE.Group();
  // Frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.08),
    new THREE.MeshLambertMaterial({ color: "#8B7355" })
  );
  g.add(frame);
  // Glass
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.05),
    new THREE.MeshPhongMaterial({
      color: glassColor,
      transparent: true,
      opacity: 0.75,
      shininess: 120,
    })
  );
  glass.position.z = 0.05;
  g.add(glass);
  // Divider bars
  const barMat = new THREE.MeshLambertMaterial({ color: "#A08060" });
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, 0.12), barMat);
  hBar.position.z = 0.04;
  g.add(hBar);
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.12), barMat);
  vBar.position.z = 0.04;
  g.add(vBar);
  return g;
}

function makeDoor(color = "#6B4226"): THREE.Group {
  const g = new THREE.Group();
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 2.3, 0.1),
    new THREE.MeshLambertMaterial({ color })
  );
  g.add(door);
  // Arch top
  const archGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 16, 1, false, 0, Math.PI);
  const arch = new THREE.Mesh(archGeo, new THREE.MeshLambertMaterial({ color }));
  arch.rotation.z = Math.PI / 2;
  arch.position.y = 1.15;
  g.add(arch);
  // Handle
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.06),
    new THREE.MeshPhongMaterial({ color: "#FFD700", shininess: 200 })
  );
  handle.position.set(0.37, 0, 0.09);
  g.add(handle);
  return g;
}

function makeChimney(color: string): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2, 0.6),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(color).multiplyScalar(0.7) })
  );
}

// ─── House builders ───────────────────────────────────────────────────────────

function buildBungalow(cfg: Config): THREE.Group {
  const g = new THREE.Group();
  const W = 10, D = 7, H = 3.5;

  // Foundation
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.6, 0.4, D + 0.6),
    new THREE.MeshLambertMaterial({ color: "#B8B0A0" })
  );
  slab.position.y = 0.2;
  g.add(slab);

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(W, H, D),
    new THREE.MeshLambertMaterial({ color: cfg.wallColor })
  );
  body.position.y = H / 2 + 0.4;
  g.add(body);

  // Roof
  const roof = makeRoof(cfg.roofStyle, W, D, cfg.roofColor);
  roof.position.y = H + 0.4 + (cfg.roofStyle === "flat" ? 0.175 : 0);
  g.add(roof);

  // Front windows ×2
  [-2.5, 2.5].forEach((x) => {
    const win = makeWindow(1.4, 1.1, cfg.windowColor);
    win.position.set(x, H / 2 + 0.8, D / 2 + 0.01);
    g.add(win);
  });
  // Side windows
  [-1.5, 1.5].forEach((z) => {
    const win = makeWindow(1.2, 1.0, cfg.windowColor);
    win.rotation.y = Math.PI / 2;
    win.position.set(W / 2 + 0.01, H / 2 + 0.8, z);
    g.add(win);
  });

  // Door
  const door = makeDoor();
  door.position.set(0, 1.6, D / 2 + 0.01);
  g.add(door);

  // Chimney
  const ch = makeChimney(cfg.roofColor);
  ch.position.set(-2.5, H + 0.4 + 1.2, -1);
  g.add(ch);

  // Porch step
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.2, 0.8),
    new THREE.MeshLambertMaterial({ color: "#C8B89A" })
  );
  step.position.set(0, 0.5, D / 2 + 0.4);
  g.add(step);

  return g;
}

function buildDuplex(cfg: Config): THREE.Group {
  const g = new THREE.Group();
  const W = 10, D = 7, FH = 3.4, SH = 3.4;
  const totalH = FH + SH;

  // Foundation
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.6, 0.4, D + 0.6),
    new THREE.MeshLambertMaterial({ color: "#B8B0A0" })
  );
  slab.position.y = 0.2;
  g.add(slab);

  // Ground floor
  const gf = new THREE.Mesh(
    new THREE.BoxGeometry(W, FH, D),
    new THREE.MeshLambertMaterial({ color: cfg.wallColor })
  );
  gf.position.y = FH / 2 + 0.4;
  g.add(gf);

  // Floor band / lintel
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.2, 0.3, D + 0.2),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(cfg.wallColor).multiplyScalar(0.85) })
  );
  band.position.y = FH + 0.4;
  g.add(band);

  // Upper floor
  const uf = new THREE.Mesh(
    new THREE.BoxGeometry(W, SH, D),
    new THREE.MeshLambertMaterial({ color: cfg.wallColor })
  );
  uf.position.y = FH + SH / 2 + 0.45;
  g.add(uf);

  // Balcony slab
  const balcony = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.18, 1.2),
    new THREE.MeshLambertMaterial({ color: "#C0B8A8" })
  );
  balcony.position.set(-0.5, FH + 0.45, D / 2 + 0.6);
  g.add(balcony);
  // Balcony railing posts
  for (let x = -2; x <= 2; x += 1) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.8, 0.07),
      new THREE.MeshLambertMaterial({ color: "#ffffff" })
    );
    post.position.set(x - 0.5, FH + 0.45 + 0.4, D / 2 + 1.15);
    g.add(post);
  }
  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.08, 0.07),
    new THREE.MeshLambertMaterial({ color: "#ffffff" })
  );
  rail.position.set(-0.5, FH + 0.45 + 0.84, D / 2 + 1.15);
  g.add(rail);

  // Roof
  const roof = makeRoof(cfg.roofStyle, W, D, cfg.roofColor);
  roof.position.y = totalH + 0.45 + (cfg.roofStyle === "flat" ? 0.175 : 0);
  g.add(roof);

  // Ground floor windows ×2 + door
  [-2.8, 2.8].forEach((x) => {
    const win = makeWindow(1.3, 1.1, cfg.windowColor);
    win.position.set(x, FH / 2 + 0.3, D / 2 + 0.01);
    g.add(win);
  });
  const door = makeDoor();
  door.position.set(0, 1.6, D / 2 + 0.01);
  g.add(door);

  // Upper floor windows ×3
  [-3, 0, 3].forEach((x) => {
    const win = makeWindow(1.3, 1.1, cfg.windowColor);
    win.position.set(x, FH + SH / 2 + 0.45, D / 2 + 0.01);
    g.add(win);
  });

  // Side windows both floors
  [FH / 2 + 0.3, FH + SH / 2 + 0.45].forEach((y) => {
    const win = makeWindow(1.1, 1.0, cfg.windowColor);
    win.rotation.y = Math.PI / 2;
    win.position.set(W / 2 + 0.01, y, 0);
    g.add(win);
  });

  return g;
}

function buildVilla(cfg: Config): THREE.Group {
  const g = new THREE.Group();
  const wallMat = new THREE.MeshLambertMaterial({ color: cfg.wallColor });

  // Main block
  const mainW = 14, mainD = 9, mainH = 4.5;
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(mainW, mainH, mainD), wallMat);
  mainBody.position.set(0, mainH / 2 + 0.4, 0);
  g.add(mainBody);

  // Wing
  const wingW = 6, wingD = 7, wingH = 4.5;
  const wingBody = new THREE.Mesh(new THREE.BoxGeometry(wingW, wingH, wingD), wallMat);
  wingBody.position.set(mainW / 2 + wingW / 2 - 0.2, wingH / 2 + 0.4, -mainD / 2 + wingD / 2);
  g.add(wingBody);

  // Foundation (full footprint)
  const foundGeo = new THREE.BoxGeometry(mainW + 0.8, 0.4, mainD + 0.8);
  const found = new THREE.Mesh(foundGeo, new THREE.MeshLambertMaterial({ color: "#B8B0A0" }));
  found.position.y = 0.2;
  g.add(found);

  // Main roof
  const mainRoof = makeRoof(cfg.roofStyle, mainW, mainD, cfg.roofColor);
  mainRoof.position.set(0, mainH + 0.4 + (cfg.roofStyle === "flat" ? 0.175 : 0), 0);
  g.add(mainRoof);

  // Wing roof
  const wingRoof = makeRoof(cfg.roofStyle, wingW, wingD, cfg.roofColor);
  wingRoof.position.set(
    mainW / 2 + wingW / 2 - 0.2,
    wingH + 0.4 + (cfg.roofStyle === "flat" ? 0.175 : 0),
    -mainD / 2 + wingD / 2
  );
  g.add(wingRoof);

  // Grand entrance — double door
  const dl = makeDoor();
  dl.position.set(-0.65, 1.6, mainD / 2 + 0.01);
  g.add(dl);
  const dr = makeDoor();
  dr.position.set(0.65, 1.6, mainD / 2 + 0.01);
  g.add(dr);

  // Front windows ×4
  [-5, -2.5, 2.5, 5].forEach((x) => {
    const win = makeWindow(1.5, 1.3, cfg.windowColor);
    win.position.set(x, mainH / 2 + 0.6, mainD / 2 + 0.01);
    g.add(win);
  });

  // Side windows on main block
  [-2, 0, 2].forEach((z) => {
    const win = makeWindow(1.3, 1.2, cfg.windowColor);
    win.rotation.y = -Math.PI / 2;
    win.position.set(-mainW / 2 - 0.01, mainH / 2 + 0.6, z);
    g.add(win);
  });

  // Wing windows
  [-1, 1].forEach((z) => {
    const win = makeWindow(1.3, 1.2, cfg.windowColor);
    win.rotation.y = Math.PI / 2;
    win.position.set(mainW / 2 + wingW - 0.2, wingH / 2 + 0.4, -mainD / 2 + wingD / 2 + z);
    g.add(win);
  });

  // Columns ×4
  const colMat = new THREE.MeshLambertMaterial({ color: "#F0EDE8" });
  [-1.5, -0.5, 0.5, 1.5].forEach((x) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, mainH, 12), colMat);
    col.position.set(x, mainH / 2 + 0.4, mainD / 2 + 0.5);
    g.add(col);
  });

  // Porch overhang
  const porch = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.2, 1.4),
    new THREE.MeshLambertMaterial({ color: "#E0DCCC" })
  );
  porch.position.set(0, mainH + 0.4, mainD / 2 + 0.7);
  g.add(porch);

  return g;
}

function buildHouse(group: THREE.Group, cfg: Config) {
  while (group.children.length) {
    const child = group.children[0] as THREE.Mesh | THREE.Group;
    group.remove(child);
    child.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      if ((obj as THREE.Mesh).material) {
        const mats = Array.isArray((obj as THREE.Mesh).material)
          ? (obj as THREE.Mesh).material as THREE.Material[]
          : [(obj as THREE.Mesh).material as THREE.Material];
        mats.forEach((m) => m.dispose());
      }
    });
  }
  const house =
    cfg.houseType === "bungalow"
      ? buildBungalow(cfg)
      : cfg.houseType === "duplex"
      ? buildDuplex(cfg)
      : buildVilla(cfg);
  group.add(house);
}

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_CFG: Config = {
  houseType: "bungalow",
  wallColor: "#F4F0E8",
  roofColor: "#8B2018",
  roofStyle: "gable",
  windowColor: "#87CEEB",
};

export default function HouseDesigner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    houseGroup: THREE.Group;
    animId: number;
    ctrl: {
      dragging: boolean;
      lastX: number;
      lastY: number;
      theta: number;
      phi: number;
      radius: number;
      autoRotate: boolean;
    };
  } | null>(null);

  const [cfg, setCfg] = useState<Config>(DEFAULT_CFG);
  const [autoRotate, setAutoRotate] = useState(true);
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;

  // ── Scene init (runs once) ────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#87CEEB");
    scene.fog = new THREE.FogExp2("#C9E8F8", 0.018);

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 200);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff8e0, 1.1);
    sun.position.set(15, 25, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xb0d4ff, 0.35);
    fill.position.set(-10, 8, -8);
    scene.add(fill);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(35, 48),
      new THREE.MeshLambertMaterial({ color: "#6DB35A" })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Driveway path
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.05, 10),
      new THREE.MeshLambertMaterial({ color: "#C8B89A" })
    );
    path.position.set(0, 0.025, 9);
    scene.add(path);

    // Some trees (simple cone + cylinder)
    [[10, 0, 5], [-12, 0, 3], [8, 0, -8], [-9, 0, -6]].forEach(([x, , z]) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8),
        new THREE.MeshLambertMaterial({ color: "#6B4226" })
      );
      trunk.position.set(x, 0.75, z);
      scene.add(trunk);
      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, 4, 8),
        new THREE.MeshLambertMaterial({ color: "#2E7D32" })
      );
      leaves.position.set(x, 4, z);
      scene.add(leaves);
    });

    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // Orbit controls state
    const ctrl = {
      dragging: false,
      lastX: 0,
      lastY: 0,
      theta: 0.5,
      phi: 1.05,
      radius: 26,
      autoRotate: true,
    };

    function updateCamera() {
      const x = ctrl.radius * Math.sin(ctrl.phi) * Math.sin(ctrl.theta);
      const y = ctrl.radius * Math.cos(ctrl.phi);
      const z = ctrl.radius * Math.sin(ctrl.phi) * Math.cos(ctrl.theta);
      camera.position.set(x, y + 3, z);
      camera.lookAt(0, 3, 0);
    }
    updateCamera();

    // Mouse events
    const canvas = renderer.domElement;
    const onDown = (e: MouseEvent) => {
      ctrl.dragging = true;
      ctrl.lastX = e.clientX;
      ctrl.lastY = e.clientY;
    };
    const onMove = (e: MouseEvent) => {
      if (!ctrl.dragging) return;
      const dx = e.clientX - ctrl.lastX;
      const dy = e.clientY - ctrl.lastY;
      ctrl.theta -= dx * 0.007;
      ctrl.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, ctrl.phi - dy * 0.007));
      ctrl.lastX = e.clientX;
      ctrl.lastY = e.clientY;
      updateCamera();
    };
    const onUp = () => { ctrl.dragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      ctrl.radius = Math.max(10, Math.min(55, ctrl.radius + e.deltaY * 0.06));
      updateCamera();
    };

    // Touch events
    let lastTouch = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      ctrl.dragging = true;
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!ctrl.dragging) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      ctrl.theta -= dx * 0.007;
      ctrl.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, ctrl.phi - dy * 0.007));
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateCamera();
    };
    const onTouchEnd = () => { ctrl.dragging = false; };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    // Animation
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (ctrl.autoRotate && !ctrl.dragging) {
        ctrl.theta += 0.004;
        updateCamera();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Initial house
    buildHouse(houseGroup, cfgRef.current);

    threeRef.current = { renderer, scene, camera, houseGroup, animId, ctrl };

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(canvas)) el.removeChild(canvas);
    };
  }, []);

  // ── Rebuild house when config changes ─────────────────────────────────────
  useEffect(() => {
    if (!threeRef.current) return;
    buildHouse(threeRef.current.houseGroup, cfg);
  }, [cfg]);

  // ── Auto-rotate sync ──────────────────────────────────────────────────────
  const toggleAutoRotate = useCallback(() => {
    if (!threeRef.current) return;
    const next = !threeRef.current.ctrl.autoRotate;
    threeRef.current.ctrl.autoRotate = next;
    setAutoRotate(next);
  }, []);

  const zoomIn = useCallback(() => {
    if (!threeRef.current) return;
    const ctrl = threeRef.current.ctrl;
    ctrl.radius = Math.max(10, ctrl.radius - 3);
    const { camera } = threeRef.current;
    const x = ctrl.radius * Math.sin(ctrl.phi) * Math.sin(ctrl.theta);
    const y = ctrl.radius * Math.cos(ctrl.phi);
    const z = ctrl.radius * Math.sin(ctrl.phi) * Math.cos(ctrl.theta);
    camera.position.set(x, y + 3, z);
    camera.lookAt(0, 3, 0);
  }, []);

  const zoomOut = useCallback(() => {
    if (!threeRef.current) return;
    const ctrl = threeRef.current.ctrl;
    ctrl.radius = Math.min(55, ctrl.radius + 3);
    const { camera } = threeRef.current;
    const x = ctrl.radius * Math.sin(ctrl.phi) * Math.sin(ctrl.theta);
    const y = ctrl.radius * Math.cos(ctrl.phi);
    const z = ctrl.radius * Math.sin(ctrl.phi) * Math.cos(ctrl.theta);
    camera.position.set(x, y + 3, z);
    camera.lookAt(0, 3, 0);
  }, []);

  const resetView = useCallback(() => {
    if (!threeRef.current) return;
    const ctrl = threeRef.current.ctrl;
    ctrl.theta = 0.5;
    ctrl.phi = 1.05;
    ctrl.radius = 26;
    const { camera } = threeRef.current;
    const x = ctrl.radius * Math.sin(ctrl.phi) * Math.sin(ctrl.theta);
    const y = ctrl.radius * Math.cos(ctrl.phi);
    const z = ctrl.radius * Math.sin(ctrl.phi) * Math.cos(ctrl.theta);
    camera.position.set(x, y + 3, z);
    camera.lookAt(0, 3, 0);
  }, []);

  const set = (key: keyof Config, val: string) =>
    setCfg((c) => ({ ...c, [key]: val }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-0 bg-[#f8fafc] min-h-[780px]">
      {/* 3D Viewport */}
      <div className="relative flex-1 min-h-[420px] lg:min-h-[780px] bg-sky-200">
        <div ref={mountRef} className="absolute inset-0" />

        {/* Overlay hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur pointer-events-none">
          Drag to rotate · Scroll to zoom
        </div>

        {/* Viewport controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {[
            { icon: autoRotate ? <Pause size={15} /> : <Play size={15} />, fn: toggleAutoRotate, tip: autoRotate ? "Pause rotation" : "Auto-rotate" },
            { icon: <ZoomIn size={15} />, fn: zoomIn, tip: "Zoom in" },
            { icon: <ZoomOut size={15} />, fn: zoomOut, tip: "Zoom out" },
            { icon: <Home size={15} />, fn: resetView, tip: "Reset view" },
          ].map(({ icon, fn, tip }, i) => (
            <button
              key={i}
              onClick={fn}
              title={tip}
              className="w-9 h-9 bg-white/80 hover:bg-white backdrop-blur rounded-xl flex items-center justify-center text-[#0f2d54] shadow-md transition-all hover:shadow-lg"
            >
              {icon}
            </button>
          ))}
        </div>

        {/* House type badge */}
        <div className="absolute top-4 left-4 bg-[#0f2d54]/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">
          {cfg.houseType}
        </div>
      </div>

      {/* Controls panel */}
      <div className="w-full lg:w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto">
        <h3 className="font-black text-[#0f2d54] text-base mb-5 flex items-center gap-2">
          <RotateCcw size={16} className="text-[#e8820c]" /> Design Controls
        </h3>

        {/* House type */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">House Type</p>
          <div className="grid grid-cols-3 gap-2">
            {(["bungalow", "duplex", "villa"] as HouseType[]).map((t) => (
              <button
                key={t}
                onClick={() => set("houseType", t)}
                className={`py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                  cfg.houseType === t
                    ? "bg-[#0f2d54] border-[#0f2d54] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#0f2d54]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Roof style */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Roof Style</p>
          <div className="grid grid-cols-3 gap-2">
            {(["gable", "hip", "flat"] as RoofStyle[]).map((r) => (
              <button
                key={r}
                onClick={() => set("roofStyle", r)}
                className={`py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                  cfg.roofStyle === r
                    ? "bg-[#e8820c] border-[#e8820c] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#e8820c]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Wall colour */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Wall Colour</p>
          <div className="grid grid-cols-6 gap-1.5">
            {WALL_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                onClick={() => set("wallColor", value)}
                style={{ backgroundColor: value }}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  cfg.wallColor === value ? "border-[#0f2d54] scale-110 shadow-md" : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Selected: {WALL_COLORS.find((c) => c.value === cfg.wallColor)?.label}
          </p>
        </div>

        {/* Roof colour */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Roof Colour</p>
          <div className="grid grid-cols-6 gap-1.5">
            {ROOF_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                onClick={() => set("roofColor", value)}
                style={{ backgroundColor: value }}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  cfg.roofColor === value ? "border-[#0f2d54] scale-110 shadow-md" : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Selected: {ROOF_COLORS.find((c) => c.value === cfg.roofColor)?.label}
          </p>
        </div>

        {/* Window colour */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Window Glass</p>
          <div className="grid grid-cols-4 gap-1.5">
            {WINDOW_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                onClick={() => set("windowColor", value)}
                style={{ backgroundColor: value }}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  cfg.windowColor === value ? "border-[#0f2d54] scale-110 shadow-md" : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => setCfg(DEFAULT_CFG)}
          className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-bold hover:border-[#0f2d54] hover:text-[#0f2d54] transition-all"
        >
          Reset to Default
        </button>

        <div className="mt-5 bg-[#f8fafc] rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            This is a conceptual 3D visualiser. For detailed architectural drawings and structural engineering, contact our design team.
          </p>
        </div>
      </div>
    </div>
  );
}
