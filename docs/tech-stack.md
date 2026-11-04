# Tech stack — Furniture Configurator

Tanggal riset: 2 Nov 2026. Sumber dibuka langsung (bukan tebakan). Update library UI/UX + testing: 2 Nov 2026.

## Keputusan stack (ringkas)
Vanilla **three.js r170+** + **Vite 6** (sama pola APAR). Tanpa React/TS/Tailwind. AR lewat **WebXR hit-test** (Android) + **USDZExporter → Quick Look** (iOS). Analytics Umami. Deploy Vercel. Quality: Vitest + Playwright + ESLint flat + Prettier + Lighthouse CI. UI: bottom sheet web component / CSS snap, driver.js (lazy), motion/mini, Lucide SVG, toast custom, floating-ui bila tooltip.

## Runtime & build
| Item | Pilihan | Lisensi | Sumber |
|---|---|---|---|
| Language | JavaScript ES modules | — | — |
| Bundler | Vite ^6 | MIT | https://vitejs.dev |
| 3D | `three` (r170 atau terbaru stabil npm) | MIT | https://threejs.org · https://www.npmjs.com/package/three |
| Deploy | Vercel (Vite preset, output `dist`) | — | https://vercel.com/docs |
| Analytics | Umami Cloud Hobby | AGPL server / snippet ringan | https://umami.is |

## three.js addons yang dipakai (dari paket `three/addons/…`)
| Addon | Fungsi | Catatan |
|---|---|---|
| `GLTFLoader` + `DRACOLoader` + `KTX2Loader` + `MeshoptDecoder` | Load model terkompresi | Decoder di `/public/decoders/` (copy dari `three/examples/jsm/libs`) |
| `RoomEnvironment` + `PMREMGenerator` | IBL studio tanpa file HDR besar | Pola APAR T4.1 — lebih hemat dari studio HDR 1.5 MB |
| `ARButton` | Tombol Enter AR | https://github.com/mrdoob/three.js/tree/master/examples/jsm/webxr |
| Contoh hit-test | `webxr_ar_hittest` | https://threejs.org/examples/#webxr_ar_hittest |
| `USDZExporter` | Export scene → USDZ untuk iOS Quick Look | Opsi `quickLookCompatible: true` (docs: https://threejs.org/docs/#examples/en/exporters/USDZExporter) |
| `XREstimatedLight` (opsional Later) | Cahaya AR menyesuaikan ruangan | Boleh ditambah jika hit-test sudah stabil |

## Library 3D / pipeline (runtime atau script)
| Library | Fungsi | Lisensi | Versi dicek | Ukuran / catatan | Sumber |
|---|---|---|---|---|---|
| `camera-controls` | Orbit/dolly/touch halus | MIT | latest npm | Ringan; ganti OrbitControls | https://github.com/yomotsu/camera-controls |
| `gltf-transform` (+ `@gltf-transform/functions`, CLI) | Compress Draco / meshopt / KTX2 di `scripts/optimize-model.mjs` | MIT | latest | Dev/script saja | https://gltf-transform.dev |
| `jspdf` + `html2canvas` | PDF quote (**Later**) | MIT | — | Jangan di MVP | npm |

## Library UI / UX (standar — bukan opsional)
| Library | Fungsi | Lisensi | Versi dicek | Ukuran / vanilla | Sumber |
|---|---|---|---|---|---|
| `pure-web-bottom-sheet` | Bottom sheet mobile (web component, CSS scroll-snap) | MIT | **1.1.1** (9 Okt 2026) | ~ringan; framework-agnostic; peer React/Vue **opsional** | https://github.com/viliket/pure-web-bottom-sheet · https://www.npmjs.com/package/pure-web-bottom-sheet |
| CSS scroll-snap sheet (fallback) | Bottom sheet jika Safari &lt; 18.2 | — | — | Zero dep; wajib karena `pure-web-bottom-sheet` butuh Safari 18.2+ | Pola di architecture + design-system |
| `driver.js` | Onboarding / product tour 3–5 langkah | MIT | **1.10.2** (Okt 2026) | ~5 KB gzip; **lazy** `import()` sekali saat first visit | https://driverjs.com · https://www.npmjs.com/package/driver.js |
| `motion` → import `motion/mini` | Animasi UI (sheet peek, toast, modal) | MIT | **14.x** (npm `motion`, update Okt 2026) | Mini `animate` ~**3.2 KB**; **bukan** Motion+ berbayar | https://motion.dev · https://motion.dev/docs/animate · https://www.npmjs.com/package/motion |
| Custom toast (`src/ui/toast.js`) | Notifikasi 2.5 dtk | — | — | &lt;1 KB; tidak perlu lib | architecture |
| `@floating-ui/dom` | Posisi tooltip (AR disabled, help) | MIT | **1.8.0** | ~8 KB gzip | https://floating-ui.com · https://www.npmjs.com/package/@floating-ui/dom |
| Lucide icons (SVG individual) | Ikon UI (save, share, AR, lang, close, info) | **ISC** (setara MIT untuk pemakaian) | salin SVG dari repo | Hanya ikon yang dipakai → `src/ui/icons/*.svg`; jangan bundle `lucide-static` penuh | https://lucide.dev · https://github.com/lucide-icons/lucide · guide vanilla: https://lucide.dev/guide/packages/lucide |
| `lil-gui` | Panel debug material/light | MIT | **0.21.0** | ~8 KB gzip; **hanya** `?debug=1`; dynamic import; **keluar** dari prod path | https://lil-gui.georgealways.com · https://www.npmjs.com/package/lil-gui |
| `stats.js` | Overlay FPS/MS | MIT | **0.17.0** (atau copy `three/addons/libs/stats.module.js`) | Sangat kecil; **hanya** `?debug=1` | https://github.com/mrdoob/stats.js · https://www.npmjs.com/package/stats.js |

## Library testing / quality (standar)
| Library | Fungsi | Lisensi | Versi dicek | Catatan non-coder | Sumber |
|---|---|---|---|---|---|
| `vitest` | Unit test harga, config snapshot, i18n, storage | MIT | **5.x** (butuh Vite ≥6.4, Node modern) | `npm test` | https://vitest.dev · https://www.npmjs.com/package/vitest |
| `@playwright/test` | E2E smoke mobile+desktop + cek fallback AR unsupported | Apache-2.0 | latest stabil | `npm run e2e` (AI install browser sekali) | https://playwright.dev |
| `eslint` (flat config) + `eslint-config-prettier` | Lint JS | MIT | ESLint 9 flat | `npm run lint` | https://eslint.org/docs/latest/use/configure/configuration-files |
| `prettier` | Format | MIT | 3.x | `npm run format` | https://prettier.io |
| `@lhci/cli` | Lighthouse CI + budget skor | Apache-2.0 | **0.15.x** | `npm run lhci` setelah build | https://github.com/GoogleChrome/lighthouse-ci · https://www.npmjs.com/package/@lhci/cli |
| GitHub Actions (gratis) | CI: lint → test → build di PR/push `main` | — | — | Workflow `.github/workflows/ci.yml` | https://docs.github.com/en/actions |

### npm scripts yang wajib ada (setelah T0.5)
| Script | Perintah tipikal | Untuk Barkah |
|---|---|---|
| `npm test` | `vitest run` | Tes logika (cepat, tanpa browser) |
| `npm run test:watch` | `vitest` | AI saat develop |
| `npm run e2e` | `playwright test` | Smoke UI matrix mobile+desktop (butuh `npx playwright install chromium` sekali); video di `test-results/` |
| `npm run e2e:mobile` | `playwright test` 4 project mobile | Sama tanpa desktop |
| `npm run lint` | `eslint .` | Cek gaya kode |
| `npm run format` | `prettier --write .` | Rapikan format |
| `npm run lhci` | `lhci autorun` | Audit performa + budget |
| `npm run optimize:model` | node `scripts/optimize-model.mjs` | Compress GLB |

## Library yang **ditolak** (dengan alasan)
| Library | Alasan | Sumber |
|---|---|---|
| `@google/model-viewer` | Peer `three@^0.183` berisiko; Scene Viewer abaikan material runtime; jalur ganda | D-AR-01 · https://www.npmjs.com/package/@google/model-viewer |
| `KHR_materials_variants` path utama | MVP cukup `material.color` + roughness | D-AR-02 |
| GSAP | Lisensi Webflow proprietary untuk banyak use-case produk web | https://gsap.com/community/standard-license/ |
| Shepherd.js | AGPL | — |
| React / R3F / drei / Motion React-only APIs | Bertentangan vanilla | — |
| Motion+ (berbayar) | Pakai hanya `motion` MIT + `motion/mini` gratis | https://motion.dev |
| `lucide-static` full | Mengekspor semua SVG string — gemuk; salin SVG per ikon saja | Lucide docs |
| Phosphor font/CSS full (`@phosphor-icons/web`) | Font subset penuh lebih berat dari beberapa SVG Lucide | Pilih Lucide SVG individual |
| Cypress | Playwright cukup untuk smoke; hindari dua runner | — |
| Jest | Vitest native Vite | — |
| Storybook | Berat untuk MVP portofolio | — |
| Chart library | Tidak perlu | — |
| `dat.gui` | Diganti `lil-gui` (maintained) | three.js examples |

## Riset AR (wajib, dibuka 2 Nov 2026)
1. **WebXR hit-test** — three.js example `webxr_ar_hittest` + MDN WebXR Device API. Session `immersive-ar`, feature `hit-test`, reticle, place object on tap. Butuh HTTPS + Chrome Android.
2. **USDZExporter** — `parse(scene, { quickLookCompatible: true })` → `Uint8Array` → `Blob` → object URL → `<a rel="ar" href="blob:...">` dengan fallback image. Dok resmi: https://threejs.org/docs/#examples/en/exporters/USDZExporter
3. **model-viewer scene graph** — ditolak MVP (satu renderer three.js). Docs: https://modelviewer.dev/docs/
4. **Bake warna sebelum USDZ** — jika `color` × texture map aneh di iOS, bake tint ke canvas texture sebelum export.

## Visual / UI referensi
- React Bits (https://reactbits.dev/) — **hanya pola CSS** (glow, shimmer, soft shadow); jangan install React.
- QuietCubes / Campooz / IKEA Place swatch UX.
- Mobbin: skip jika paywall (dicek 2 Nov 2026).
- driver.js tour styling: samakan token design-system (accent oak).

## Aset 3D
| Model | Tris (approx) | Sumber | Lisensi |
|---|---|---|---|
| ArmChair_01 (1k) | ~5.6K (GLB optimize ~391 KB) | https://polyhaven.com/a/ArmChair_01 · API `https://api.polyhaven.com/files/ArmChair_01` | CC0 (https://polyhaven.com/license) |
| Sofa_01 (1k) | ~4.1K (GLB optimize ~183 KB) | https://polyhaven.com/a/Sofa_01 | CC0 |
| Cadangan sofa_03 | ~8K, 2 materials | https://polyhaven.com/a/sofa_03 | CC0 |

Pipeline: unduh glTF 1k → `npm run optimize:model` → `public/models/*.glb`.

## Performa (anggaran)
- Initial JS gzip &lt; ~300 KB (three + app); driver.js / AR / lil-gui / stats **tidak** di critical path.
- Tiap GLB &lt; ~1.2 MB setelah compress (ideal &lt; 800 KB).
- Tidak load HDRI besar; pakai RoomEnvironment.
- AR modules + `driver.js` + debug (`lil-gui`, `stats.js`) di-dynamic `import()`.
- Lighthouse mobile Performance ≥ 80 (stretch 85), Accessibility ≥ 90 — ditegakkan lewat `@lhci/cli` budgets.
