import * as THREE from 'three';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE });

const IDLE_MS = 5000;
/** rad/s — slow studio spin */
const IDLE_AZIMUTH_SPEED = 0.15;

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {{ width: number, height: number }} size
 */
export function createCamera(renderer, size) {
  const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100);
  const controls = new CameraControls(camera, renderer.domElement);
  controls.minDistance = 1.2;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minPolarAngle = 0.05;
  controls.setLookAt(2.5, 1.6, 3.2, 0, 0.5, 0, false);

  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedMotionMq.matches;
  let lastInteractAt = performance.now();
  let idle = false;

  function bumpInteract() {
    lastInteractAt = performance.now();
    idle = false;
  }

  controls.addEventListener('controlstart', bumpInteract);
  controls.addEventListener('control', bumpInteract);
  controls.addEventListener('controlend', bumpInteract);
  renderer.domElement.addEventListener('wheel', bumpInteract, { passive: true });

  function onReducedMotionChange() {
    reducedMotion = reducedMotionMq.matches;
    if (reducedMotion) idle = false;
  }
  reducedMotionMq.addEventListener('change', onReducedMotionChange);

  renderer.domElement.addEventListener('furncfg:resize', (e) => {
    const { width, height } = e.detail;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  });

  /**
   * @param {number} dt
   * @returns {boolean} whether camera moved
   */
  function update(dt) {
    if (!reducedMotion) {
      const now = performance.now();
      if (!idle && now - lastInteractAt >= IDLE_MS) idle = true;
      if (idle) {
        controls.rotate(IDLE_AZIMUTH_SPEED * dt, 0, false);
      }
    }
    return controls.update(dt);
  }

  return { camera, controls, update };
}
