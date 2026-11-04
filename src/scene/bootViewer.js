import { Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { applyDom, subscribe, t } from '../core/i18n.js';
import { getState, subscribe as subscribeState, switchProduct } from '../core/state.js';
import { initAnalytics, track } from '../core/analytics.js';
import { detectArCapability } from '../ar/capability.js';
import { resolveFabricHex } from '../ui/swatches.js';
import { resolveFinish, resolveSizeScale } from '../ui/optionChips.js';
import { createRenderer } from './renderer.js';
import { createCamera } from './camera.js';
import { setupEnvironment } from './lights.js';
import { createProductController } from './product.js';
import { capturePng, shareOrDownloadPng } from './screenshot.js';

const SLOW_MS = 8000;

function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

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

/**
 * Boot WebGL viewer after first paint (dynamic import from app.js).
 * @param {{
 *   container: HTMLElement,
 *   splash: HTMLElement,
 *   splashPct: HTMLElement,
 *   splashStatus: HTMLElement,
 *   splashRetry: HTMLElement,
 *   poster: HTMLElement | null,
 *   arButton: { setOnWebxr: Function, setOnQuicklook: Function },
 *   configPanelReady: Promise<unknown>,
 *   setScreenshotRunner: (fn: () => Promise<void>) => void,
 * }} ctx
 */
export async function bootViewer(ctx) {
  const {
    container,
    splash,
    splashPct,
    splashStatus,
    splashRetry,
    poster,
    arButton,
    configPanelReady,
    setScreenshotRunner,
  } = ctx;

  let scene;
  let renderer;
  let setOnTick;
  let invalidate;
  let start;
  let stop;
  let setPassthrough;
  let syncSize;
  try {
    ({ scene, renderer, setOnTick, invalidate, start, stop, setPassthrough, syncSize } =
      createRenderer(container));
  } catch (err) {
    console.error(err);
    splash.hidden = true;
    splash.setAttribute('aria-hidden', 'true');
    splashPct.textContent = '';
    splashStatus.textContent = '';
    if (poster) {
      poster.hidden = false;
      applyDom(poster);
    }
    return;
  }

  await yieldToMain();

  const size = {
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
  };
  const { camera, update: updateCamera, setEnabled: setControlsEnabled } = createCamera(
    renderer,
    size,
    { invalidate },
  );

  setScreenshotRunner(async () => {
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
  });

  const ground = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({
      color: 0x1a1e26,
      roughness: 1,
      metalness: 0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  await yieldToMain();
  setupEnvironment(scene, renderer);
  invalidate();
  await yieldToMain();

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
    splash.removeAttribute('aria-hidden');
    splash.setAttribute('aria-busy', 'true');
    splashRetry.hidden = true;
    splashPct.textContent = '0%';
    splashStatus.textContent = t('splash.loading');
  }

  function hideSplash() {
    splashPhase = 'idle';
    splash.hidden = true;
    splash.setAttribute('aria-busy', 'false');
    splash.setAttribute('aria-hidden', 'true');
    splashPct.textContent = '';
    splashStatus.textContent = '';
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
    splash.removeAttribute('aria-hidden');
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
    invalidate();
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
      initAnalytics();
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
        invalidate();
      })
      .catch((err) => console.error('[debug]', err));
  }

  setOnTick((dt, force) => {
    const moved = updateCamera(dt);
    const debugOn = Boolean(debugUpdate);
    if (force || moved || debugOn) {
      debugUpdate?.();
      renderer.render(scene, camera);
    }
    return moved || debugOn;
  });
  start();

  loadProduct(getState().productId || 'armchair');
}
