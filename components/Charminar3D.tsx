'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

type LightingPreset = 'dusk' | 'noon' | 'twilight';

// Fallback perspectives if WebGL is unavailable
const FALLBACK_PERSPECTIVES = [
  {
    id: 'wide-bazaar',
    label: '01 / The Crowded Bazaar',
    file: '/photos/trip/IMG_20260905_165459.webp',
    alt: 'Charminar from the bustling market streets',
    caption: 'Rising above the historic Laad Bazaar where the search began.',
  },
  {
    id: 'minarets',
    label: '02 / Towering Minarets',
    file: '/photos/trip/IMG_20260905_165501.webp',
    alt: 'Looking up at the majestic minarets of Charminar',
    caption: 'Four 48-metre grand minarets carved from granite and mortar.',
  },
  {
    id: 'arches',
    label: '03 / At The Arches',
    file: '/photos/trip/IMG_20260905_165509.webp',
    alt: 'A quiet moment in front of the grand arches',
    caption: 'Standing beneath the historic arches that gave Hyderabad its heart.',
  },
];

// Generate stone courtyard plaza texture with procedural flagstones
function createStoneCourtyardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#6b5d52';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 16;
  const cols = 16;
  const w = 512 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = (r % 2) * (w / 2);
      const x = (c * w + offsetX) % 512;
      const y = r * h;

      const shade = 120 + Math.floor(Math.sin(r * 2.5 + c * 4.1) * 18) + Math.floor(Math.random() * 20);
      const red = shade + 16;
      const green = shade + 6;
      const blue = shade - 10;

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let i = 0; i < 16; i++) {
        const nx = x + Math.random() * (w - 4) + 2;
        const ny = y + Math.random() * (h - 4) + 2;
        ctx.fillRect(nx, ny, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Create starfield for midnight mode
function createStarfield(): THREE.Points {
  const count = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2.0 * Math.PI;
    const phi = Math.acos(Math.random() * 0.9); // upper dome
    const r = 240 + Math.random() * 30;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.max(18, r * Math.cos(phi));
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const rnd = Math.random();
    if (rnd > 0.8) {
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.6;
    } else if (rnd > 0.5) {
      colors[i * 3] = 0.8;
      colors[i * 3 + 1] = 0.9;
      colors[i * 3 + 2] = 1.0;
    } else {
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

// Create floating golden dust motes in sunset air
function createGoldenMotes(): { points: THREE.Points; update: (delta: number) => void } {
  const count = 120;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 55;
    positions[i * 3 + 1] = Math.random() * 34 + 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 55;
    speeds[i] = 0.6 + Math.random() * 1.4;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffd59e,
    size: 1.4,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  const update = (delta: number) => {
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta * 0.9;
      pos[i * 3] += Math.sin(pos[i * 3 + 1] * 0.4) * delta * 0.35;
      if (pos[i * 3 + 1] > 38) {
        pos[i * 3 + 1] = 0.5;
        pos[i * 3] = (Math.random() - 0.5) * 55;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 55;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  };

  return { points, update };
}

export default function Charminar3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lighting, setLighting] = useState<LightingPreset>('dusk');
  const [isInteracting, setIsInteracting] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Three.js object references
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const skyRef = useRef<Sky | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const motesRef = useRef<THREE.Points | null>(null);
  const pmremGeneratorRef = useRef<THREE.PMREMGenerator | null>(null);
  const defaultCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 16, 48));
  const defaultTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 13, 0));

  // Lights
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const minaretLightsRef = useRef<THREE.PointLight[]>([]);

  // Update atmospheric lighting and skybox
  const applyLightingPreset = useCallback((preset: LightingPreset) => {
    setLighting(preset);

    const sky = skyRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    const starfield = starfieldRef.current;
    const motes = motesRef.current;
    const scene = sceneRef.current;

    if (!sky || !dirLight || !hemiLight || !scene) return;

    const uniforms = sky.material.uniforms;
    const sun = new THREE.Vector3();

    if (preset === 'dusk') {
      // Warm Golden Dusk Sunset
      uniforms['turbidity'].value = 8.5;
      uniforms['rayleigh'].value = 3.2;
      uniforms['mieCoefficient'].value = 0.007;
      uniforms['mieDirectionalG'].value = 0.86;

      // Sun low near horizon (5.5 deg elevation, south-west azimuth)
      const phi = THREE.MathUtils.degToRad(90 - 5.5);
      const theta = THREE.MathUtils.degToRad(210);
      sun.setFromSphericalCoords(1, phi, theta);
      uniforms['sunPosition'].value.copy(sun);

      // Warm directional sunlight
      dirLight.color.setHex(0xff9944);
      dirLight.intensity = 2.7;
      dirLight.position.copy(sun).multiplyScalar(80);

      // Atmosphere ambient
      hemiLight.color.setHex(0x5672a0);
      hemiLight.groundColor.setHex(0xb58055);
      hemiLight.intensity = 1.1;

      // Hide stars, show golden motes
      if (starfield) {
        (starfield.material as THREE.PointsMaterial).opacity = 0;
      }
      if (motes) {
        (motes.material as THREE.PointsMaterial).opacity = 0.75;
      }

      // Warm glow through arches
      minaretLightsRef.current.forEach((l) => {
        l.color.setHex(0xffa844);
        l.intensity = 1.4;
      });

      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(0x422f28);
        (scene.fog as THREE.FogExp2).density = 0.0035;
      }
    } else if (preset === 'noon') {
      // Radiant Afternoon Sun
      uniforms['turbidity'].value = 3.2;
      uniforms['rayleigh'].value = 1.6;
      uniforms['mieCoefficient'].value = 0.004;
      uniforms['mieDirectionalG'].value = 0.76;

      const phi = THREE.MathUtils.degToRad(90 - 46);
      const theta = THREE.MathUtils.degToRad(145);
      sun.setFromSphericalCoords(1, phi, theta);
      uniforms['sunPosition'].value.copy(sun);

      dirLight.color.setHex(0xfffaed);
      dirLight.intensity = 3.1;
      dirLight.position.copy(sun).multiplyScalar(80);

      hemiLight.color.setHex(0x8cb6e8);
      hemiLight.groundColor.setHex(0xab947d);
      hemiLight.intensity = 1.25;

      if (starfield) {
        (starfield.material as THREE.PointsMaterial).opacity = 0;
      }
      if (motes) {
        (motes.material as THREE.PointsMaterial).opacity = 0.35;
      }

      minaretLightsRef.current.forEach((l) => {
        l.color.setHex(0xfffaea);
        l.intensity = 0.5;
      });

      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(0x95bddc);
        (scene.fog as THREE.FogExp2).density = 0.0028;
      }
    } else if (preset === 'twilight') {
      // Midnight with Starfield & Golden Architectural Floodlights
      uniforms['turbidity'].value = 10;
      uniforms['rayleigh'].value = 0.25;
      uniforms['mieCoefficient'].value = 0.001;
      uniforms['mieDirectionalG'].value = 0.9;

      const phi = THREE.MathUtils.degToRad(90 - -14); // Sun below horizon
      const theta = THREE.MathUtils.degToRad(180);
      sun.setFromSphericalCoords(1, phi, theta);
      uniforms['sunPosition'].value.copy(sun);

      // Silvery moonlight
      dirLight.color.setHex(0x6a8db8);
      dirLight.intensity = 0.85;
      dirLight.position.set(-20, 65, 20);

      hemiLight.color.setHex(0x192238);
      hemiLight.groundColor.setHex(0x130e15);
      hemiLight.intensity = 0.65;

      // Reveal stars, hide sun motes
      if (starfield) {
        (starfield.material as THREE.PointsMaterial).opacity = 0.95;
      }
      if (motes) {
        (motes.material as THREE.PointsMaterial).opacity = 0.15;
      }

      // Golden architectural uplighting on all 4 minarets
      minaretLightsRef.current.forEach((l) => {
        l.color.setHex(0xffa834);
        l.intensity = 5.2;
      });

      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(0x0c0b14);
        (scene.fog as THREE.FogExp2).density = 0.0042;
      }
    }

    // Update real-time environment map for stone reflections
    if (pmremGeneratorRef.current && scene) {
      try {
        const renderTarget = pmremGeneratorRef.current.fromScene(sky);
        scene.environment = renderTarget.texture;
      } catch {
        // Safe fallback
      }
    }
  }, []);

  // Reset view to ideal framing
  const handleResetView = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    cam.position.copy(defaultCamPos.current);
    ctrl.target.copy(defaultTarget.current);
    ctrl.update();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL 2 capability safely
    if (!WebGL.isWebGL2Available()) {
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2');
    } catch {
      gl = null;
    }

    if (!gl) {
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    setWebglSupported(true);

    let isDisposed = false;
    let animId = 0;
    let isVisible = true;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x422f28, 0.0035);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 3000);
    camera.position.set(0, 16, 48);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGLRenderer init failed:', e);
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.75;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Never dip below ground level
    controls.minPolarAngle = 0.15;
    controls.minDistance = 14;
    controls.maxDistance = 90;
    controls.target.set(0, 13, 0);
    controlsRef.current = controls;

    controls.addEventListener('start', () => setIsInteracting(true));
    controls.addEventListener('end', () => setIsInteracting(false));

    // 5. Realistic Skybox (Preetham Atmospheric Scattering)
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    skyRef.current = sky;

    // Setup initial golden dusk sun position
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = 8.5;
    uniforms['rayleigh'].value = 3.2;
    uniforms['mieCoefficient'].value = 0.007;
    uniforms['mieDirectionalG'].value = 0.86;

    const initialSun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - 5.5);
    const theta = THREE.MathUtils.degToRad(210);
    initialSun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(initialSun);

    // PMREM Environment Map Generator for realistic stone radiance
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    pmremGeneratorRef.current = pmremGenerator;

    try {
      const renderTarget = pmremGenerator.fromScene(sky);
      scene.environment = renderTarget.texture;
    } catch {
      // Safe fallback
    }

    // 6. Starfield (for Midnight mode)
    const starfield = createStarfield();
    scene.add(starfield);
    starfieldRef.current = starfield;

    // 7. Golden Dust Motes in Sunset Air
    const { points: motes, update: updateMotes } = createGoldenMotes();
    scene.add(motes);
    motesRef.current = motes;

    // 8. Dynamic Lighting
    const dirLight = new THREE.DirectionalLight(0xff9944, 2.7);
    dirLight.position.copy(initialSun).multiplyScalar(80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    dirLight.shadow.camera.left = -28;
    dirLight.shadow.camera.right = 28;
    dirLight.shadow.camera.top = 42;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.bias = -0.0004;
    dirLight.shadow.radius = 2;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const hemiLight = new THREE.HemisphereLight(0x5672a0, 0xb58055, 1.1);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Four Architectural Minaret Base Floodlights
    const minaretLights: THREE.PointLight[] = [];
    const minaretPositions = [
      [-9, 1.2, -9],
      [9, 1.2, -9],
      [-9, 1.2, 9],
      [9, 1.2, 9],
    ];

    minaretPositions.forEach(([x, y, z]) => {
      const light = new THREE.PointLight(0xffa844, 1.4, 45, 1.4);
      light.position.set(x, y, z);
      scene.add(light);
      minaretLights.push(light);
    });
    minaretLightsRef.current = minaretLights;

    // 9. Realistic Stone Courtyard Plaza Plinth & Ground
    const stoneTexture = createStoneCourtyardTexture();

    // Large plaza disk
    const plazaGeo = new THREE.CircleGeometry(140, 64);
    const plazaMat = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.82,
      metalness: 0.04,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Raised Heritage Plinth beneath Charminar's foundation
    const plinthGeo = new THREE.BoxGeometry(26, 0.4, 26);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xa89380,
      roughness: 0.88,
      metalness: 0.02,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    scene.add(plinth);

    // 10. Load Charminar 3D GLB Model
    let mixer: THREE.AnimationMixer | null = null;
    const loader = new GLTFLoader();

    loader.load(
      '/Charminar_Soft_Demo.glb',
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        // Center monument on X and Z, rest on plinth (y = 0.4)
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -bbox.min.y + 0.4;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.roughness !== undefined) {
                mat.roughness = Math.max(0.45, mat.roughness);
              }
              // Enable environment reflection on all stone materials
              mat.envMapIntensity = 1.25;
            }
          }
        });

        scene.add(model);

        // Play all 14 bird flight animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.timeScale = 0.85;
            action.play();
          });
        }

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetY = size.y * 0.42 + 0.4;
        const camDistance = Math.max(maxDim * 0.95, 42);

        camera.position.set(0, targetY + 5, camDistance);
        controls.target.set(0, targetY, 0);
        controls.update();

        defaultCamPos.current.copy(camera.position);
        defaultTarget.current.copy(controls.target);

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
          setLoadProgress(percent);
        } else {
          setLoadProgress((prev) => Math.min(95, prev + 8));
        }
      },
      (err) => {
        console.error('Error loading Charminar 3D model:', err);
        if (!isDisposed) {
          setLoadError('Failed to load 3D model.');
          setLoading(false);
        }
      }
    );

    // 11. Viewport Visibility Tracking
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 12. Window Resize Handling
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 13. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      updateMotes(delta);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 14. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      controls.dispose();
      pmremGenerator.dispose();

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });

      stoneTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  // Sync autoRotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const currentFallback = FALLBACK_PERSPECTIVES[fallbackIndex];

  return (
    <div className="charminar-3d-wrapper" ref={containerRef}>
      {webglSupported === false ? (
        /* Fallback View if WebGL is unavailable */
        <div className="charminar-fallback-view">
          <div className="charminar-fallback-frame">
            <Image
              src={currentFallback.file}
              alt={currentFallback.alt}
              fill
              sizes="(max-width: 768px) 95vw, 1200px"
              priority
              className="charminar-fallback-img"
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <div className="fallback-gradient-overlay" />

            <div className="charminar-model-badge">
              <span className="badge-dot" />
              <span className="badge-text">HISTORIC MONUMENT · 1591 CE</span>
            </div>

            <div className="fallback-caption-overlay">
              <p className="fallback-cap-title">{currentFallback.caption}</p>
              <span className="fallback-cap-label">{currentFallback.label}</span>
            </div>
          </div>

          <div className="charminar-3d-controls">
            <div className="controls-group">
              <span className="ctrl-label">PERSPECTIVE:</span>
              {FALLBACK_PERSPECTIVES.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`charminar-chip ${fallbackIndex === i ? 'is-active' : ''}`}
                  onClick={() => setFallbackIndex(i)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="controls-group">
              <span className="charminar-fallback-note">Old City of Hyderabad</span>
            </div>
          </div>
        </div>
      ) : (
        /* Realistic 3D WebGL Model with Atmospheric Skybox */
        <>
          <div className="charminar-3d-canvas-box">
            <canvas ref={canvasRef} className="charminar-canvas" aria-label="Interactive 3D Charminar model with atmospheric skybox" />

            {/* Loading Overlay */}
            {loading && (
              <div className="charminar-3d-loading">
                <div className="charminar-spinner">
                  <span className="spinner-inner" />
                </div>
                <p className="loading-title">ILLUMINATING CHARMINAR SKYBOX</p>
                <p className="loading-progress">
                  {loadProgress > 0 ? `${loadProgress}%` : 'Scattering evening sky…'}
                </p>
                <p className="loading-subtext">The stone where the journey was headed</p>
              </div>
            )}

            {/* Error Fallback */}
            {loadError && (
              <div className="charminar-3d-error">
                <p>Could not render the 3D monument.</p>
                <small>{loadError}</small>
              </div>
            )}

            {/* Floating Interaction Hint */}
            {!loading && !loadError && (
              <div className={`charminar-interaction-hint ${isInteracting ? 'is-faded' : ''}`}>
                <span className="hint-icon" aria-hidden="true">
                  ↻
                </span>
                <span>Drag to rotate 360° · Scroll or pinch to zoom</span>
              </div>
            )}

            {/* Architectural Badge */}
            <div className="charminar-model-badge">
              <span className="badge-dot" />
              <span className="badge-text">3D REALISTIC ATMOSPHERE · SKYBOX ACTIVE</span>
            </div>
          </div>

          {/* Control Bar */}
          <div className="charminar-3d-controls" role="toolbar" aria-label="3D Model Controls">
            <div className="controls-group">
              <button
                type="button"
                className={`charminar-ctrl-btn ${autoRotate ? 'is-active' : ''}`}
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Pause 360° rotation' : 'Start 360° rotation'}
                aria-pressed={autoRotate}
              >
                <span className="ctrl-icon">{autoRotate ? '⏸' : '▶'}</span>
                <span>{autoRotate ? 'Auto-Spin: On' : 'Auto-Spin: Off'}</span>
              </button>

              <button
                type="button"
                className="charminar-ctrl-btn"
                onClick={handleResetView}
                title="Reset camera view"
              >
                <span className="ctrl-icon">⌂</span>
                <span>Reset View</span>
              </button>
            </div>

            {/* Atmosphere Skybox Selector */}
            <div className="controls-group lighting-selector">
              <span className="ctrl-label">SKYBOX ATMOSPHERE:</span>
              <button
                type="button"
                className={`charminar-chip ${lighting === 'dusk' ? 'is-active' : ''}`}
                onClick={() => applyLightingPreset('dusk')}
              >
                🌅 Golden Sunset
              </button>
              <button
                type="button"
                className={`charminar-chip ${lighting === 'noon' ? 'is-active' : ''}`}
                onClick={() => applyLightingPreset('noon')}
              >
                ☀️ Radiant Day
              </button>
              <button
                type="button"
                className={`charminar-chip ${lighting === 'twilight' ? 'is-active' : ''}`}
                onClick={() => applyLightingPreset('twilight')}
              >
                🌙 Midnight Stars
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
