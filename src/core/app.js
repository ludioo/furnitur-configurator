import * as THREE from 'three';
import { applyDom, subscribe, t } from './i18n.js';
import { getState, setState, subscribe as subscribeState, switchProduct } from './state.js';
import { ensureSchema, getLast, setLast } from './storage.js';
import { track } from './analytics.js';
import { createRenderer } from '../scene/renderer.js';
import { createCamera } from '../scene/camera.js';
import { setupEnvironment } from '../scene/lights.js';
import { createProductController } from '../scene/product.js';
import { capturePng, shareOrDownloadPng } from '../scene/screenshot.js';
import { initShell, setHash } from '../ui/shell.js';
import { initConfigPanel } from '../ui/configPanel.js';
import { initSavedList } from '../ui/savedList.js';
import { initArButton } from '../ui/arButton.js';
import { showToast } from '../ui/toast.js';
import { resolveFabricHex } from '../ui/swatches.js';
import { resolveFinish, resolveSizeScale } from '../ui/optionChips.js';
import { detectArCapability } from '../ar/capability.js';

const SLOW_MS = 8000;

/** @type {Promise<typeof import('../ar/webxr.js')> | null} */
let webxrModP = null;
/** @type {Promise<typeof import('../ar/usdz.js')> | null} */
let usdzModP = null;

function loadWebxr() {
  return (webxrModP ??= import('../ar/webxr.js').catch((err) => {
    webxrModP = null;
    throw err;
  }));
}

function loadUsdz() {
  return (usdzModP ??= import('../ar/usdz.js').catch((err) => {
    usdzModP = null;
    throw err;
  }));
}

export function init() {
  applyDom();

  const container = document.getElementById('app');
  const splash = document.getElementById('splash');
  const splashPct = document.getElementById('splash-pct');
  const splashStatus = document.getElementById('splash-status');
  const splashRetry = document.getElementById('splash-retry');
  const poster = document.getElementById('webgl-poster');
  if (!container || !splash || !splashPct || !splashStatus || !splashRetry) return;

  ensureSchema();
  const last = getLast();
  if (last) setState(last);

  const saved = initSavedList(document.body, {
    onClose() {
      if ((location.hash || '').replace(/^#/, '') === 'saved') {
        setHash('configure');
      }
    },
  });
  initShell(document.body, { saved });
  const arButton = initArButton(document.body);

  /** @type {(() => Promise<void>) | null} */
  let runScreenshot = null;
  const configPanelReady = initConfigPanel(document.body, {
    onSaved() {
      saved.render();
    },
    onScreenshot() {
      return runScreenshot?.();
    },
  }).catch((err) => {
    console.error('[configPanel]', err);
  });

  let storageFailToasted = false;
  /** @param {{ productId: string, fabricColor: string, finish: string, size: string }} snapshot */
  function persistLast(snapshot) {
    if (setLast(snapshot)) return;
    if (storageFailToasted) return;
    storageFailToasted = true;
    showToast(t('toast.storageFail'));
  }

  subscribeState((next) => {
    persistLast(next);
  });
  persistLast(getState());

  let scene;
  let renderer;
  let setOnTick;
  let start;
  let stop;
  let setPassthrough;
  let syncSize;
  try {
    ({ scene, renderer, setOnTick, start, stop, setPassthrough, syncSize } =
      createRenderer(container));
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
  const { camera, update: updateCamera, setEnabled: setControlsEnabled } = createCamera(
    renderer,
    size,
  );

  runScreenshot = async () => {
    try {
      const blob = await capturePng(renderer, scene, camera);
      const productId = getState().productId || 'furniture';
      const filename = `furncfg-${productId}-${Date.now()}.png`;
      const via = await shareOrDownloadPng(blob, filename);
      if (via === 'aborted') return;
      track('screenshot', { productId, via });
    } catch (err) {
      console.error('[screenshot]', err);
    }
  };

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
  /** @type {string | null} */
  let loadingProductId = null;
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

  function applyCurrentAppearance() {
    const cfg = getState();
    const hex = resolveFabricHex(cfg);
    if (hex) products.applyColor(hex);
    const finish = resolveFinish(cfg);
    if (finish) products.applyFinish(finish);
    products.applySize(resolveSizeScale(cfg));
  }

  subscribeState((next) => {
    if (next.productId !== products.getCurrentId()) {
      if (loadingProductId === next.productId) return;
      loadProduct(next.productId);
      return;
    }
    applyCurrentAppearance();
  });

  /**
   * @param {string} productId
   */
  async function loadProduct(productId) {
    const gen = ++loadGeneration;
    loadingProductId = productId;
    showSplash();
    armSlowTimer();
    try {
      const cfg = getState();
      const hex = resolveFabricHex(cfg) || undefined;
      const finish = resolveFinish(cfg) || undefined;
      const sizeScale = resolveSizeScale(cfg);
      const loaded = await products.load(productId, {
        fabricColorHex: hex,
        finish,
        sizeScale,
        isStale: () => gen !== loadGeneration,
      });
      if (gen !== loadGeneration) return;
      if (!loaded || getState().productId !== productId) {
        loadProduct(getState().productId);
        return;
      }
      loadingProductId = null;
      hideSplash();
      applyCurrentAppearance();
      void configPanelReady
        .then(() => import('../ui/onboarding.js'))
        .then((m) => m.maybeStartTour())
        .catch((err) => console.error('[onboarding]', err));
    } catch (err) {
      if (gen !== loadGeneration) return;
      loadingProductId = null;
      console.error(err);
      showError(t('splash.loadError'));
    }
  }

  splashRetry.addEventListener('click', () => {
    loadProduct(products.getCurrentId() || getState().productId || 'armchair');
  });

  window.__furncfgLoad = (productId) => {
    if (!productId) return;
    if (productId === getState().productId) {
      loadProduct(productId);
      return;
    }
    switchProduct(productId);
  };

  arButton.setOnWebxr(async () => {
    const { startWebxr } = await loadWebxr();
    await startWebxr({
      renderer,
      scene,
      camera,
      getRoot: () => products.getCurrentRoot(),
      ground,
      stopStudio: stop,
      startStudio: start,
      setPassthrough,
      syncSize,
      setControlsEnabled,
    });
  });

  arButton.setOnQuicklook(async () => {
    const { exportAndOpen } = await loadUsdz();
    await exportAndOpen(products.getCurrentRoot());
  });

  // Warm USDZ chunk on Quick Look devices so tap spends less of the activation window on import.
  void detectArCapability().then((mode) => {
    if (mode === 'quicklook') void loadUsdz();
  });

  /** @type {(() => void) | null} */
  let debugUpdate = null;
  const debugFlag = new URLSearchParams(location.search).get('debug');
  if (debugFlag === '1' || debugFlag === 'true') {
    void import('../debug/debugPanel.js')
      .then((m) => m.mountDebugPanel({ renderer, products }))
      .then((api) => {
        debugUpdate = api?.update ?? null;
      })
      .catch((err) => console.error('[debug]', err));
  }

  setOnTick((dt) => {
    updateCamera(dt);
    debugUpdate?.();
    renderer.render(scene, camera);
  });
  start();

  loadProduct(getState().productId || 'armchair');
}
