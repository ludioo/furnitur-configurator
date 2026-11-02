import * as THREE from 'three';

const CLEAR_COLOR = 0x12151c;

/**
 * @param {HTMLElement} container
 * @returns {{ scene: THREE.Scene, renderer: THREE.WebGLRenderer, setOnTick: (fn: ((dt: number) => void) | null) => void, start: () => void }}
 */
export function createRenderer(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CLEAR_COLOR);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setClearColor(CLEAR_COLOR, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  setPixelRatio(renderer);
  container.appendChild(renderer.domElement);

  /** @type {((dt: number) => void) | null} */
  let onTick = null;
  let rafId = 0;
  let lastTime = 0;
  let running = false;

  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    return { width: w, height: h };
  }

  function setPixelRatio(r) {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (document.hidden) {
      lastTime = now;
      return;
    }
    const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
    lastTime = now;
    if (onTick) onTick(dt);
  }

  function onVisibility() {
    if (!document.hidden) lastTime = performance.now();
  }

  function onWindowResize() {
    setPixelRatio(renderer);
    const { width, height } = resize();
    renderer.domElement.dispatchEvent(
      new CustomEvent('furncfg:resize', { detail: { width, height } }),
    );
  }

  resize();
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('visibilitychange', onVisibility);

  return {
    scene,
    renderer,
    setOnTick(fn) {
      onTick = fn;
    },
    start() {
      if (running) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
  };
}
