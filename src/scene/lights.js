import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * Studio IBL via RoomEnvironment + PMREM (no HDR file).
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 */
export function setupEnvironment(scene, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = new RoomEnvironment();
  const envMap = pmrem.fromScene(env).texture;
  scene.environment = envMap;
  env.dispose();
  pmrem.dispose();
  return envMap;
}
