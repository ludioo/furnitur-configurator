import * as THREE from 'three';
import productsData from '../data/products.json';
import { createModelLoader } from './loader.js';

/**
 * @param {THREE.Object3D} root
 * @returns {{ meshes: string[], materials: string[] }}
 */
export function inspectMaterials(root) {
  const meshes = [];
  const materials = new Set();
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    meshes.push(obj.name || '(unnamed)');
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if (m?.name) materials.add(m.name);
    }
  });
  return { meshes, materials: [...materials] };
}

/**
 * @param {THREE.Object3D} root
 */
function disposeObject(root) {
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        for (const key of Object.keys(m)) {
          const val = m[key];
          if (val && val.isTexture) val.dispose();
        }
        m.dispose();
      }
    }
  });
}

/**
 * @param {THREE.Scene} scene
 * @param {{
 *   onProgress?: (pct: number) => void,
 *   onError?: (err: Error) => void,
 * }} [hooks]
 */
export function createProductController(scene, hooks = {}) {
  const loader = createModelLoader(hooks);
  /** @type {THREE.Object3D | null} */
  let current = null;
  /** @type {string | null} */
  let currentId = null;

  function getProduct(id) {
    const product = productsData.products?.find((p) => p.id === id);
    if (!product) throw new Error(`Unknown product: ${id}`);
    return product;
  }

  /**
   * @param {string} productId
   */
  async function load(productId) {
    const product = getProduct(productId);
    const root = await loader.load(product.modelUrl);
    root.name = productId;
    root.scale.setScalar(product.defaultScale ?? 1);

    const box = new THREE.Box3().setFromObject(root);
    const minY = box.min.y;
    if (Number.isFinite(minY) && minY !== 0) {
      root.position.y -= minY;
    }

    if (current) {
      scene.remove(current);
      disposeObject(current);
    }
    scene.add(root);
    current = root;
    currentId = productId;

    const info = inspectMaterials(root);
    console.info(`[product] ${productId} materials:`, info.materials, 'meshes:', info.meshes);
    return { root, product, info };
  }

  return {
    load,
    getCurrentId: () => currentId,
    getCurrentRoot: () => current,
    listProducts: () => productsData.products ?? [],
    dispose() {
      if (current) {
        scene.remove(current);
        disposeObject(current);
        current = null;
      }
      loader.dispose();
    },
  };
}
