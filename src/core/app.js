import * as THREE from 'three';
import { createRenderer } from '../scene/renderer.js';
import { createCamera } from '../scene/camera.js';
import { setupEnvironment } from '../scene/lights.js';

const ACCENT = 0xd4a373;

export function init() {
  const container = document.getElementById('app');
  if (!container) return;

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

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: ACCENT,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );
  box.position.y = 0.5;
  scene.add(box);

  setOnTick((dt) => {
    updateCamera(dt);
    renderer.render(scene, camera);
  });
  start();
}
