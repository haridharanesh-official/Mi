'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type LightingMode = 'golden' | 'night' | 'daylight';
type CameraView = 'hero' | 'eye' | 'aerial';

function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 230, 170, 1)');
    gradient.addColorStop(0.25, 'rgba(201, 154, 85, 0.85)');
    gradient.addColorStop(0.65, 'rgba(201, 154, 85, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.5)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function Charminar3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [lightMode, setLightMode] = useState<LightingMode>('golden');
  const [activeView, setActiveView] = useState<CameraView>('hero');
  const [error, setError] = useState<string | null>(null);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.PointLight;
    rimLight: THREE.DirectionalLight;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0a0d, 0.035);

    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Initial hero camera: close-up, dramatic low-angle looking up at minarets
    camera.position.set(2.6, 0.9, 3.4);
    cameraRef.current = camera;

    // 2. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    // Keep camera upright and focused on the central arch & minarets
    controls.target.set(0, 0.1, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't flip below ground
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    controlsRef.current = controls;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xfff4e6, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffdfa8, 3.4);
    keyLight.position.set(5, 7, 4);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x8a243a, 2.6, 20);
    fillLight.position.set(-5, 2.5, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc99a55, 2.2);
    rimLight.position.set(-2, 6, -5);
    scene.add(rimLight);

    lightsRef.current = {
      ambient: ambientLight,
      keyLight,
      fillLight,
      rimLight,
    };

    // 5. Soft Ground Shadow Disc (Replaces the sharp square plane)
    const shadowGeo = new THREE.PlaneGeometry(5.4, 5.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.55;
    scene.add(shadowPlane);

    // 6. Floating Golden Firefly / Dust Particles (Circular & Ethereal)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 7;
      particlePositions[i + 1] = Math.random() * 5 - 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 7;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffdfa0,
      size: 0.1,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. GLTF Loader
    const loader = new GLTFLoader();
    loader.load(
      '/Charminar_Soft_Demo.glb',
      (gltf) => {
        const model = gltf.scene;

        // Hide any flat polygonal ground planes that stretch the bounding box
        model.traverse((child) => {
          if (
            child.name &&
            (child.name.toLowerCase().includes('ground') ||
              child.name.toLowerCase().includes('courtyard') ||
              child.name.toLowerCase() === 'plane')
          ) {
            child.visible = false;
          }
        });

        // Compute Bounding Box strictly on visible architectural geometry
        const box = new THREE.Box3();
        model.traverse((child) => {
          if (child.visible && (child as THREE.Mesh).isMesh) {
            box.expandByObject(child);
          }
        });

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Target height ~3.1 units to comfortably fill the viewport vertically
        const targetHeight = 3.1;
        const scale = targetHeight / (size.y || 1);
        model.scale.setScalar(scale);

        // Center precisely so arches are at eye level and minarets soar upward
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale + 0.1;
        model.position.z = -center.z * scale;

        // Align shadow plane right below base of monument
        shadowPlane.position.y = -center.y * scale + (box.min.y - center.y) * scale + 0.02;

        // Enhance stone material lighting and texture warmth
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && child.visible) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.48;
              mat.metalness = 0.15;
              mat.envMapIntensity = 1.2;
              mat.needsUpdate = true;
            }
          }
        });

        scene.add(model);
        setLoading(false);

        controls.target.set(0, 0.1, 0);
        controls.update();
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('Error loading Charminar GLB:', err);
        setError('Could not load 3D model.');
        setLoading(false);
      }
    );

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gently elevate and drift particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.004;
        if (positions[i] > 4.5) {
          positions[i] = -1.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.015;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 580;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Controls Logic
  const toggleRotate = () => {
    if (!controlsRef.current) return;
    const nextState = !isRotating;
    controlsRef.current.autoRotate = nextState;
    setIsRotating(nextState);
  };

  const setCameraAngle = (view: CameraView) => {
    setActiveView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (view === 'hero') {
      camera.position.set(2.6, 0.9, 3.4);
      controls.target.set(0, 0.1, 0);
    } else if (view === 'eye') {
      camera.position.set(0, 0.3, 3.8);
      controls.target.set(0, 0.2, 0);
    } else if (view === 'aerial') {
      camera.position.set(2.8, 2.6, 3.6);
      controls.target.set(0, 0.1, 0);
    }
    controls.update();
  };

  const changeLighting = (mode: LightingMode) => {
    setLightMode(mode);
    if (!lightsRef.current) return;
    const { ambient, keyLight, fillLight, rimLight } = lightsRef.current;

    if (mode === 'golden') {
      ambient.color.setHex(0xfff4e6);
      ambient.intensity = 1.4;
      keyLight.color.setHex(0xffdfa8);
      keyLight.intensity = 3.4;
      fillLight.color.setHex(0x8a243a);
      fillLight.intensity = 2.6;
      rimLight.color.setHex(0xc99a55);
      rimLight.intensity = 2.2;
    } else if (mode === 'night') {
      ambient.color.setHex(0x1a2638);
      ambient.intensity = 0.8;
      keyLight.color.setHex(0x68aee4);
      keyLight.intensity = 2.2;
      fillLight.color.setHex(0xc99a55);
      fillLight.intensity = 1.8;
      rimLight.color.setHex(0xfad289);
      rimLight.intensity = 2.6;
    } else if (mode === 'daylight') {
      ambient.color.setHex(0xffffff);
      ambient.intensity = 1.8;
      keyLight.color.setHex(0xfffaed);
      keyLight.intensity = 3.6;
      fillLight.color.setHex(0xd0e2f2);
      fillLight.intensity = 1.4;
      rimLight.color.setHex(0xffffff);
      rimLight.intensity = 1.4;
    }
  };

  return (
    <div className="charminar-3d-wrapper">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="charminar-canvas-container" />

      {/* Loading Overlay */}
      {loading && (
        <div className="charminar-loading-scrim">
          <div className="charminar-spinner">
            <span className="spinner-spark">✦</span>
          </div>
          <p className="loading-title">Rendering 3D Charminar…</p>
          <div className="loading-bar-wrap">
            <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="loading-pct">{loadProgress}%</span>
        </div>
      )}

      {error && (
        <div className="charminar-error-scrim">
          <p>{error}</p>
        </div>
      )}

      {/* Top Header Badge */}
      <div className="charminar-3d-header">
        <div className="charminar-title-pill">
          <span className="monument-icon">🏛</span>
          <span className="pill-title">CHARMINAR · HYDERABAD</span>
          <span className="pill-year">1591 AD</span>
        </div>
        <span className="pill-live-tag">Interactive 3D Monument</span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="charminar-3d-toolbar">
        {/* Camera Angle Switcher */}
        <div className="angle-toggle-group">
          <button
            type="button"
            className={`tool-btn ${activeView === 'hero' ? 'is-active' : ''}`}
            onClick={() => setCameraAngle('hero')}
            title="Heroic Low Angle"
          >
            <span>🏛 Hero View</span>
          </button>
          <button
            type="button"
            className={`tool-btn ${activeView === 'eye' ? 'is-active' : ''}`}
            onClick={() => setCameraAngle('eye')}
            title="Eye Level Arches"
          >
            <span>👁 Eye Level</span>
          </button>
          <button
            type="button"
            className={`tool-btn ${activeView === 'aerial' ? 'is-active' : ''}`}
            onClick={() => setCameraAngle('aerial')}
            title="Aerial Sunset Angle"
          >
            <span>🕊 Aerial</span>
          </button>
        </div>

        <div className="toolbar-actions">
          {/* Lighting Mode Switcher */}
          <div className="lighting-toggle-group">
            <button
              type="button"
              className={`tool-btn ${lightMode === 'golden' ? 'is-active' : ''}`}
              onClick={() => changeLighting('golden')}
              title="Golden Hour Sunset"
            >
              <span>🌅 Dusk</span>
            </button>
            <button
              type="button"
              className={`tool-btn ${lightMode === 'night' ? 'is-active' : ''}`}
              onClick={() => changeLighting('night')}
              title="Night Illumination"
            >
              <span>🌙 Night</span>
            </button>
            <button
              type="button"
              className={`tool-btn ${lightMode === 'daylight' ? 'is-active' : ''}`}
              onClick={() => changeLighting('daylight')}
              title="Bright Daylight"
            >
              <span>☀️ Day</span>
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            className={`tool-btn ${isRotating ? 'is-active' : ''}`}
            onClick={toggleRotate}
            title={isRotating ? 'Pause rotation' : 'Resume rotation'}
          >
            <span>{isRotating ? '⏸ Pause' : '▶ Rotate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
