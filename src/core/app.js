import * as THREE from 'three';
import { applyDom, subscribe, t } from './i18n.js';
import { getState, subscribe as subscribeState } from './state.js';
import { createRenderer } from '../scene/renderer.js';
import { createCamera } from '../scene/camera.js';
import { setupEnvironment } from '../scene/lights.js';
import { createProductController } from '../scene/product.js';
import { initShell } from '../ui/shell.js';
import { initConfigPanel } from '../ui/configPanel.js';
import { resolveFabricHex } from '../ui/swatches.js';

const SLOW_MS = 8000;

export function init() {
  applyDom();

  const container = document.getElementById('app');
  const splash = document.getElementById('splash');
  const splashPct = document.getElementById('splash-pct');
  const splashStatus = document.getElementById('splash-status');
  const splashRetry = document.getElementById('splash-retry');
  const poster = document.getElementById('webgl-poster');
  if (!container || !splash || !splashPct || !splashStatus || !splashRetry) return;

  initShell(document.body);
  initConfigPanel(document.body).catch((err) => {
    console.error('[configPanel]', err);
  });

  let scene;
  let renderer;
  let setOnTick;
  let start;
  try {
    ({ scene, renderer, setOnTick, start } = createRenderer(container));
  } catch (err) {
    console.error(err);
    splash.hidden = true;
    if (poster) {
      poster.hidden = false;
      applyDom(poster);
    }
    return;
  }

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
  /** @type {'loading' | 'slow' | 'error' | 'idle'} */
  let splashPhase = 'idle';

  function showSplash() {
    splashPhase = 'loading';
    splash.hidden = false;
    splash.setAttribute('aria-busy', 'true');
    splashRetry.hidden = true;
    splashPct.textContent = '0%';
    splashStatus.textContent = t('splash.loading');
  }

  function hideSplash() {
    splashPhase = 'idle';
    splash.hidden = true;
    splash.setAttribute('aria-busy', 'false');
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
  }

  function showError(message) {
    splashPhase = 'error';
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
    splash.hidden = false;
    splash.setAttribute('aria-busy', 'false');
    splashStatus.textContent = message;
    splashRetry.hidden = false;
    splashRetry.textContent = t('splash.retry');
  }

  function armSlowTimer() {
    if (slowTimer) clearTimeout(slowTimer);
    slowTimer = setTimeout(() => {
      if (!splash.hidden && splashRetry.hidden) {
        splashPhase = 'slow';
        splashStatus.textContent = t('splash.slow');
      }
    }, SLOW_MS);
  }

  subscribe(() => {
    if (splash.hidden) return;
    if (splashPhase === 'loading') splashStatus.textContent = t('splash.loading');
    else if (splashPhase === 'slow') splashStatus.textContent = t('splash.slow');
    else if (splashPhase === 'error') {
      splashStatus.textContent = t('splash.loadError');
      splashRetry.textContent = t('splash.retry');
    }
  });

  const products = createProductController(scene, {
    onProgress(pct) {
      splashPct.textContent = `${pct}%`;
    },
  });

  function applyCurrentColor() {
    const hex = resolveFabricHex(getState());
    if (hex) products.applyColor(hex);
  }

  subscribeState(() => {
    applyCurrentColor();
  });

  /**
   * @param {string} productId
   */
  async function loadProduct(productId) {
    const gen = ++loadGeneration;
    showSplash();
    armSlowTimer();
    try {
      const hex = resolveFabricHex(getState()) || undefined;
      await products.load(productId, { fabricColorHex: hex });
      if (gen !== loadGeneration) return;
      hideSplash();
      applyCurrentColor();
    } catch (err) {
      if (gen !== loadGeneration) return;
      console.error(err);
      showError(t('splash.loadError'));
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
