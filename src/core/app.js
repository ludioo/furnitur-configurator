import * as THREE from 'three';
import { createRenderer } from '../scene/renderer.js';
import { createCamera } from '../scene/camera.js';
import { setupEnvironment } from '../scene/lights.js';
import { createProductController } from '../scene/product.js';

const SLOW_MS = 8000;

export function init() {
  const container = document.getElementById('app');
  const splash = document.getElementById('splash');
  const splashPct = document.getElementById('splash-pct');
  const splashStatus = document.getElementById('splash-status');
  const splashRetry = document.getElementById('splash-retry');
  if (!container || !splash || !splashPct || !splashStatus || !splashRetry) return;

  const { scene, renderer, setOnTick, start } = createRenderer(container);
  setupEnvironment(scene, renderer);

  const size = {
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
  };
  const { camera, update: updateCamera } = createCamera(renderer, size);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      color: 0x1a1e26,
      roughness: 1,
      metalness: 0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /** @type {ReturnType<typeof setTimeout> | null} */
  let slowTimer = null;
  let loadGeneration = 0;

  function showSplash() {
    splash.hidden = false;
    splash.setAttribute('aria-busy', 'true');
    splashRetry.hidden = true;
    splashPct.textContent = '0%';
    splashStatus.textContent = 'Loading 3D model…';
  }

  function hideSplash() {
    splash.hidden = true;
    splash.setAttribute('aria-busy', 'false');
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
  }

  function showError(message) {
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
    splash.hidden = false;
    splash.setAttribute('aria-busy', 'false');
    splashStatus.textContent = message;
    splashRetry.hidden = false;
  }

  function armSlowTimer() {
    if (slowTimer) clearTimeout(slowTimer);
    slowTimer = setTimeout(() => {
      if (!splash.hidden && splashRetry.hidden) {
        splashStatus.textContent = 'Slow connection, still loading…';
      }
    }, SLOW_MS);
  }

  const products = createProductController(scene, {
    onProgress(pct) {
      splashPct.textContent = `${pct}%`;
    },
  });

  /**
   * @param {string} productId
   */
  async function loadProduct(productId) {
    const gen = ++loadGeneration;
    showSplash();
    armSlowTimer();
    try {
      await products.load(productId);
      if (gen !== loadGeneration) return;
      hideSplash();
    } catch (err) {
      if (gen !== loadGeneration) return;
      console.error(err);
      showError('Could not load the 3D model.');
    }
  }

  splashRetry.addEventListener('click', () => {
    loadProduct(products.getCurrentId() || 'armchair');
  });

  window.__furncfgLoad = (productId) => loadProduct(productId);

  setOnTick((dt) => {
    updateCamera(dt);
    renderer.render(scene, camera);
  });
  start();

  loadProduct('armchair');
}
