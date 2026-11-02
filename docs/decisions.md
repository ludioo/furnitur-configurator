# Decisions log

Format: `YYYY-MM-DD | ID | Keputusan | Alasan | Sumber`

## 2026-11-02 — Kickoff riset (Neo / doc pack)

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-PROD-01 | Produk MVP: **ArmChair_01** + **Sofa_01** (Poly Haven). Cadangan sofa_03. | Furniture = job configurator paling umum; skala kursi cocok AR; CC0 komersial OK | https://polyhaven.com/a/ArmChair_01 · https://polyhaven.com/a/Sofa_01 · https://polyhaven.com/license · API files |
| D-STACK-01 | Vanilla three.js + Vite; tanpa React/TS/Tailwind | Samakan APAR; Codex Barkah sudah terbiasa; portofolio konsisten | `/workspace/local-apar/library-research.md` · APAR tech-stack |
| D-AR-01 | **AR path MVP = three.js WebXR hit-test (Android) + USDZExporter→Quick Look (iOS). Skip `@google/model-viewer` di MVP.** | Satu renderer; hindari peer `three@^0.183`; Scene Viewer mengabaikan material runtime; USDZExporter punya `quickLookCompatible` | https://threejs.org/docs/#examples/en/exporters/USDZExporter · https://threejs.org/examples/#webxr_ar_hittest · https://www.npmjs.com/package/@google/model-viewer (4.4.0, Apache-2.0) · https://modelviewer.dev/docs/ |
| D-AR-02 | Tidak andalkan `KHR_materials_variants` di MVP; pakai `material.color` + roughness/metalness | Lebih sederhana untuk swatch live; variants berguna Later untuk Scene Viewer discrete SKU | https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_variants |
| D-AR-03 | Module AR di-`import()` dinamis saat CTA | Jaga transfer awal < 3 MB | performance budget APAR |
| D-LIB-01 | Izinkan `camera-controls` (MIT) menggantikan OrbitControls | Touch/damping lebih baik; sudah diteliti di APAR research | https://github.com/yomotsu/camera-controls |
| D-LIB-02 | Tolak GSAP & Shepherd | GSAP proprietary Webflow; Shepherd AGPL | gsap.com license · APAR decisions |
| D-LIB-03 | Compress aset dengan gltf-transform (Draco/meshopt/KTX2) | Anggaran ukuran | https://gltf-transform.dev |
| D-LIB-04 | RoomEnvironment, bukan HDRI studio besar | APAR T4.1: HDR 1.5 MB bisa dibuang | APAR known-issues / library-research |
| D-UI-01 | React Bits hanya sebagai inspirasi CSS, tidak diinstall | Project non-React | https://reactbits.dev/ |
| D-HOST-01 | Subdomain `configurator.barkahmauludi.com` di Vercel project terpisah | Sama pola trainer; DNS sudah di Vercel | APAR env-setup · instruksi Barkah |
| D-PRICE-01 | Harga ilustrasi IDR/USD | Bukan toko nyata; hindari klaim palsu | PRD |
| D-I18N-01 | UI penuh EN/ID; docs pack Bahasa Indonesia | Sama APAR; audiens Barkah | instruksi pack |
| D-MOB-01 | Mobbin skip jika paywall | Connector Mobbin butuh plan berbayar (dicek 2 Nov 2026) | Mobbin MCP list_collections error |


## 2026-11-02 — Library UI/UX + testing (otorisasi Barkah)

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-02 | Pakai `pure-web-bottom-sheet` ^1.1.1 + **fallback CSS scroll-snap** | MIT, web component vanilla, native scroll feel; Safari &lt;18.2 tidak didukung lib → fallback wajib | https://github.com/viliket/pure-web-bottom-sheet · npm 1.1.1 |
| D-UI-03 | Onboarding = `driver.js` ^1.10 (lazy import, sekali) | MIT, ~5KB gzip, menggantikan Shepherd AGPL | https://www.npmjs.com/package/driver.js · driverjs.com |
| D-UI-04 | Animasi UI = `motion/mini` (paket `motion` MIT), bukan GSAP/Motion+ | Mini ~3.2KB; free MIT; hormati reduced-motion | https://motion.dev · https://www.npmjs.com/package/motion |
| D-UI-05 | Toast = custom tipis di `toast.js` (tanpa lib) | Cukup untuk MVP; kurangi dep | architecture |
| D-UI-06 | Tooltip AR/help = `@floating-ui/dom` ^1.8 | MIT, ~8KB gzip, positioning kokoh | https://floating-ui.com |
| D-UI-07 | Ikon = SVG Lucide individual (ISC) di `src/ui/icons/` | Tree-shake manual; tolak lucide-static penuh & Phosphor font full | https://lucide.dev · https://github.com/lucide-icons/lucide |
| D-DBG-01 | `lil-gui` 0.21 + `stats.js` hanya `?debug=1` (dynamic import) | Tidak masuk critical/prod path | https://lil-gui.georgealways.com · https://github.com/mrdoob/stats.js |
| D-QA-01 | Unit = Vitest 5.x; E2E = Playwright; lint = ESLint flat + Prettier | Native Vite; mudah `npm test` / `npm run e2e` untuk non-coder | https://vitest.dev · https://playwright.dev · eslint.org |
| D-QA-02 | Perf gate = `@lhci/cli` 0.15.x + budgets di `lighthouserc.js` | Otomatisasi T3.4 | https://github.com/GoogleChrome/lighthouse-ci |
| D-QA-03 | CI GitHub Actions gratis: lint + test + build on push/PR `main` | Tanpa biaya; jaga regresi | docs.github.com/actions |
| D-UI-08 | Tolak Cypress, Jest, Storybook, Motion+, lucide-static full, Phosphor web font full | Berat / duplikat / berbayar / bundle gemuk — lihat tech-stack rejected | riset 2 Nov 2026 |

## 2026-11-02 — T0.1 Scaffold

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-SCAFFOLD-01 | Scaffold manual (bukan `create-vite`); T0.1 hanya deps runtime `vite` + `three` + `camera-controls` | Folder sudah berisi AGENTS/docs/.cursor; tooling lint/test ditunda T0.5 | architecture.md · prompts T0.1 |

## Template keputusan baru
`2026-MM-DD | D-XXX-nn | ... | ... | URL atau "eksperimen T0.3"`
