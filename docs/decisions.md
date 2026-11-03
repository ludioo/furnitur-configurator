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
| D-DBG-01 | `lil-gui` 0.21 + `stats.js` hanya `?debug=1` atau `debug=true` (dynamic import) | Tidak masuk critical/prod path; alias `true` ikut prompt T2.5 | https://lil-gui.georgealways.com · https://github.com/mrdoob/stats.js |
| D-QA-01 | Unit = Vitest 5.x; E2E = Playwright; lint = ESLint flat + Prettier | Native Vite; mudah `npm test` / `npm run e2e` untuk non-coder | https://vitest.dev · https://playwright.dev · eslint.org |
| D-QA-02 | Perf gate = `@lhci/cli` 0.15.x + budgets di `lighthouserc.js` | Otomatisasi T3.4 | https://github.com/GoogleChrome/lighthouse-ci |
| D-QA-03 | CI GitHub Actions gratis: lint + test + build on push/PR `main` | Tanpa biaya; jaga regresi | docs.github.com/actions |
| D-UI-08 | Tolak Cypress, Jest, Storybook, Motion+, lucide-static full, Phosphor web font full | Berat / duplikat / berbayar / bundle gemuk — lihat tech-stack rejected | riset 2 Nov 2026 |

## 2026-11-02 — T0.1 Scaffold

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-SCAFFOLD-01 | Scaffold manual (bukan `create-vite`); T0.1 hanya deps runtime `vite` + `three` + `camera-controls` | Folder sudah berisi AGENTS/docs/.cursor; tooling lint/test ditunda T0.5 | architecture.md · prompts T0.1 |

## 2026-11-02 — T0.5 Quality toolchain

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-QA-04 | CI GitHub Actions pakai Node 22; tidak set `engines` di package.json dulu | cocok `camera-controls` (≥22) + Vite 6 / Vitest 5; engines bisa ditambah nanti di env-setup | npm lockfile · prompts T0.5 |
| D-QA-05 | Stub Vitest `tests/pricing.test.js` + `pricingReady()` di `pricing.js`; CI tanpa `prettier --check`; pin `@eslint/js@9` bersama `eslint@9` | harga asli di T1.4; format lokal saja; `@eslint/js` latest minta ESLint 10 | architecture.md · npm peer deps |

## 2026-11-02 — T0.2 Base scene

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-SCENE-01 | T0.2 pakai RAF continuous (pause `document.hidden`); idle auto-rotate di `camera.js` via `controls.rotate`; No-WebGL poster ditunda T1.1 | Cukup untuk orbit/idle; on-demand di T3.3; i18n belum ada | design-system · prompts T0.2 · performance-budget |

## 2026-11-02 — T0.3 Model + optimize

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-ASSET-01 | Pipeline optimize: gltf-transform **Draco + WebP** (bukan meshopt/KTX2 di MVP); decoder Draco glTF di `/decoders/draco/` | Ukuran masuk ideal (&lt;800 KB) tanpa Basis transcoder | eksperimen T0.3 · gltf-transform.dev |
| D-MAT-01 | `bodyMaterialNames`: armchair = `Armchair_01`; sofa = `Sofa_01`. Satu material per model; **tidak** ada material kaki terpisah (Legs Later tidak dibuka dari aset ini) | Inspeksi GLB setelah optimize | eksperimen T0.3 |
| D-UX-01 | Splash loading EN hardcode sampai T1.1; ganti produk sementara via `window.__furncfgLoad('sofa'\|'armchair')` | i18n & UI switcher belum ada; acceptance mengizinkan console | prompts T0.3 · user-flows UF0 |

## 2026-11-02 — T0.4 Deploy Vercel

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-HOST-02 | Vercel Production Branch = `main` (push tip dari `develop`); GitHub default tetap `develop`; slug repo `furnitur-configurator` tidak di-rename | Selaras CI on `main` (D-QA-03); rename mid-flight berisiko; subdomain sudah Valid + HTTPS | env-setup · T0.4 · github.com/ludioo/furnitur-configurator |

## 2026-11-02 — T1.1 Shell + i18n + Lucide

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-I18N-02 | Default bahasa: `furncfg:lang` → else `navigator.language` diawali `id` → else `en`; ganti tanpa reload via `data-i18n` + `t()` | UF3 + i18n-content; portfolio default EN | prompts T1.1 · user-flows UF3 |
| D-UI-09 | Hash `#configure` default, `#about` buka About stub, `#saved` no-op sampai T1.5; Lucide SVG individual (termasuk chevron/trash) di `src/ui/icons/` | Routing architecture; tree-shake manual | architecture · content-and-assets · D-UI-07 |
| D-STORE-01 | `storage.js` helper generik `get`/`set` berprefix `furncfg:` + `getLang`/`setLang` | Dipakai T1.1 sekarang, T1.5 nanti tanpa API kedua | data-model · architecture |

## 2026-11-02 — T1.2 Bottom sheet + swatches

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-10 | Desktop ≥768 = fixed rail kanan 320px (bukan web component); mobile = `pure-web-bottom-sheet` bila `animation-timeline: scroll()` + Safari/iOS ≥18.2, else CSS snap fallback | Lib dioptimasi mobile snap; rail desktop lebih sederhana & a11y | architecture bottom sheet strategy · npm README browserslist |
| D-MAT-02 | Swatch set `material.color` langsung (tanpa lerp) pada `bodyMaterialNames`; map tekstur tetap | &lt;150 ms, paling sedikit kode; lerp boleh di T1.7/polish | design-system · architecture-conventions |

## 2026-11-02 — T1.3 Finish + size + product switch

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-STATE-02 | Ganti produk: simpan opsi terakhir per `productId` di memori sesi (`lastByProduct`); restore atau default | UF1 “last config produk bila ada”; tidak persist dulu (T1.5) | user-flows UF1 · prompts T1.3 |
| D-LOAD-01 | `product.load` terima `isStale()` — buang root baru tanpa swap scene jika generasi load usang | Race A→B→A bisa menimpa model benar dengan GLB lama | eksperimen T1.3 · code review |

## 2026-11-02 — T1.4 Illustrative price bar

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-PRICE-02 | `pricing.js`: `computePrice` + `currencyForLang` + `formatPrice` (Intl); hapus stub `pricingReady`; UI `priceBar` sticky di footer panel | Diganti API murni untuk Vitest + T1.5 `priceSnapshot`; ID→IDR / EN→USD | data-model · i18n-content · D-QA-05 |

## 2026-11-02 — T1.5 Save configs + storage

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-STORE-02 | Max 10: evict tertua otomatis + toast; nama auto `Config #n`; `schemaVersion` mismatch → clear configs+last; `priceSnapshot` dihitung di UI lalu di-pass ke storage | UF1 + Grill T1.5; storage tetap murni untuk Vitest | data-model · prompts T1.5 · user-flows UF1 |
| D-UI-11 | Hash `#saved` aktif (panel list Load/Delete); nav Saved di top bar; toast custom tanpa motion/mini dulu | Menutup no-op D-UI-09; motion polish tetap T1.7 | architecture · prompts T1.5 · D-UI-05 |

## 2026-11-02 — T1.6 Screenshot + share

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-SHOT-01 | Capture = render-once + `toBlob`; tanpa `preserveDrawingBuffer` permanen; satu CTA Screenshot → `navigator.share` bila `canShare({ files })`, else unduh PNG | Hemat VRAM; alur MVP satu tombol di footer panel | prompts T1.6 · performance-budget |
| D-SHOT-02 | `navigator.share` hanya jika UA mobile (Android/iPhone/iPad); desktop selalu unduh PNG | Windows Share sheet Chromium sering hang load apps (validasi Barkah) | known-issues T1.6 · eksperimen desktop |

## 2026-11-02 — T1.7 motion/mini + toast + floating-ui

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-12 | UI motion hanya lewat `src/ui/motion.js` → `import { animate } from 'motion/mini'`; skip animate jika `prefers-reduced-motion`; sheet tidak di-wrap Motion (lib/CSS snap) | Satu gate reduced-motion; hindari double-animate sheet; bukan Motion+ | design-system · D-UI-04 · performance-budget |
| D-UI-13 | Tombol AR stub T1.7 selalu `aria-disabled` + tooltip `ar.unsupported`; deteksi capability tetap T2.1 | Acceptance T1.7 butuh target tooltip desktop sebelum WebXR/USDZ | prompts T1.7 · T2.1 · D-UI-06 |

## 2026-11-02 — T1.8 driver.js onboarding

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-14 | Tour visibility mobile = `scrollIntoView` pada step target; tidak menambah API expand bottom-sheet | `mountBottomSheet` belum expose expand; scrollIntoView cukup tanpa dep baru | UF6 · Grill T1.8 · architecture |
| D-UI-15 | `maybeStartTour` di-dynamic-import dari `app.js` setelah `hideSplash`; flag `furncfg:onboarded` via `storage` `set('onboarded','1')` pada Skip/Done (`onDestroyed`) | Jaga critical path bersih; Skip dan selesai sama-sama once | D-UI-03 · prompts T1.8 · acceptance T1.8 |

## 2026-11-02 — T2.1 AR capability states

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-AR-04 | Deteksi AR di `src/ar/capability.js`: WebXR `immersive-ar` menang; else Safari iOS (iPhone/iPad/iPod + iPadOS MacIntel `maxTouchPoints>1`, exclude CriOS/FxiOS/EdgiOS/OPiOS) = Quick Look; desktop/unsupported tetap `aria-disabled` + tooltip. Klik belum start session/export | T2.1 hanya state CTA; WebXR/USDZ di T2.2–T2.3; heuristic Quick Look tanpa API native | D-AR-01 · UF2 · prompts T2.1 · D-UI-13 |
| D-UI-16 | Tema tour di `src/styles/onboarding.css`, di-`import()` **setelah** `driver.js/dist/driver.css` | CSS driver load belakangan + `all:unset` mengalahkan tema di `components.css` → teks terang di latar putih | T1.8 · driver.js · validasi Barkah |

## 2026-11-02 — T2.2 WebXR hit-test

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-AR-05 | WebXR via CTA T2.1 + `startWebxr` (bukan addon `ARButton`); `setReferenceSpaceType('local')`; reticle hit-test; place root produk live; tanpa DOM overlay exit | Satu tombol; default three `local-floor` sering gagal di HP; overlay exit = scope ekstra; UI sistem Chrome cukup | D-AR-01 · webxr_ar_hittest · ARButton.js · UF2 · prompts T2.2 |

## 2026-11-02 — T2.3 USDZ Quick Look

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-AR-06 | `ar/usdz.exportAndOpen`: clone root + bake `color×map` ke CanvasTexture; `USDZExporter.parseAsync({ quickLookCompatible: true })`; `<a rel="ar">` + img 1×1; revoke blob ~60s; warm-import chunk saat capability=quicklook; gagal = console saja (toast T2.4); desktop CTA tetap disabled, non-iOS set `download` | Warna Quick Look beda bila color×map; blob revoke 0ms sering putus WebKit; import di tap makan user-activation | D-AR-01 · USDZExporter docs · prompts T2.3 · known-issues bake |

## 2026-11-02 — T2.4 Lazy AR + errors

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-AR-07 | Lazy AR: promise cache `loadWebxr`/`loadUsdz` (reset bila import reject); CTA busy + `aria-busy` + toast `toast.arFail`; `ar_enter` hanya setelah session WebXR siap / setelah Quick Look `a.click()`; warm-import USDZ Quick Look tetap (AC Network = WebXR tidak preload) | Double-load & spam tap; gagal tidak blank; Umami tanpa noise gagal; D-AR-06 tetap | prompts T2.4 · UF2 · D-AR-06 |

## 2026-11-02 — T3.1 About modal

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-17 | About: fokus return ke `.top-bar__about` setelah Close/Esc/backdrop; `close({ restoreFocus: false })` saat syncRoute (mis. buka Saved); focus trap penuh tetap deferred | AC T3.1 fokus kembali; trap penuh bukan AC; hindari curi fokus dari Saved | UF4 · acceptance T3.1 · known-issues T1.5 |

## 2026-11-02 — T3.2 Umami

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-AN-01 | `initAnalytics` setelah model load sukses + `requestIdleCallback` (fallback timeout); script hanya jika `VITE_UMAMI_WEBSITE_ID`; `data-domains=configurator.barkahmauludi.com`; `track` no-op aman; `lang_change` hanya saat bahasa benar-benar berubah | Critical path bersih; lokal/staging tanpa noise; privasi tanpa cookie banner | analytics.mdc · env-setup §7 · prompts T3.2 |
| D-AN-02 | Live Umami Cloud untuk configurator **ditunda**; jangan Pro berbayar; env ID boleh kosong sampai slot/domain tersedia | Hobby = 1 website; slot penuh; MVP tidak bergantung dashboard Events | Barkah 2026-11-02 · umami.is/pricing |

## 2026-11-02 — T3.3 Performance pass

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-SCENE-02 | Studio loop on-demand: RAF hanya saat dirty / kamera bergerak / idle spin; `invalidate()` + idle `setTimeout(5s)`; pause `document.hidden`; splash teks dikosongkan + `aria-hidden` setelah load; cache immutable `/assets` | Ganti D-SCENE-01 continuous RAF; hemat CPU HP; AC teks loading hilang dari DOM; Vite hashed assets | performance-budget · prompts T3.3 · D-SCENE-01 |

## 2026-11-02 — T3.4 Lighthouse CI

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-QA-04 | Config LHCI = `lighthouserc.cjs` (CJS) + `--config`; collect = `staticDistDir: ./dist` (bukan Vite preview); `numberOfRuns: 1`; upload `filesystem` → `.lighthouseci/`; assert hanya kategori Perf ≥0.8 & A11y ≥0.9; **tidak** di GHA | Package `"type":"module"`; ESM rc diabaikan LHCI 0.15; Vite preview di Windows sering timeout pola `Local:` (stdout buffer) meski server hidup; static server LHCI = artefak build yang sama; D-QA-03 tetap lint/test/build | D-QA-02 · prompts T3.4 |
| D-QA-05 | Skip onboarding tour bila `navigator.webdriver` | Audit LHCI tanpa driver.js `aria-expanded` di canvas; user nyata tidak terpengaruh | axe aria-allowed-attr · prompts T3.4 |

## 2026-11-02 — T3.6 Playwright e2e

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-QA-06 | E2E = `@playwright/test` Chromium only; `webServer` = `build && vite preview`; projects mobile 390 + desktop; `locale: en-US`; **tidak** di GHA (D-QA-03 tetap) | Smoke lokal untuk Barkah; hindari install browser di CI gratis dulu; EN stabil di mesin ID | prompts T3.6 · testing.mdc · D-QA-01 |

## 2026-11-03 — M0 Mobile baseline

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-QA-07 | Baseline M0 = `playwright.baseline.config.js` + `npm run e2e:baseline` (Chromium, 4 viewport, `video: on`); artefak di `docs/_mobile-baselines/m0/`; **tidak** menambah project ke `playwright.config.js` | Agar `npm run e2e` / CI tidak menggandakan smoke; M7 baru perluasan project permanen | mobile-testing.md · prompts M0 · D-QA-06 |

## 2026-11-03 — M1 Top bar density

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-18 | Top bar mobile (`max-width: 767px`): brand visually hidden; Saved/About icon-first (label clip); lang `min-width: var(--touch-min)`; tabs tetap berlabel `flex-shrink: 0`. Desktop ≥768 tetap logo + label teks | Di 360–480 logo+teks Saved/About menekan tab Chair/Sofa (scrollWidth terpotong); spek prioritas tabs + tap ≥44 | mobile-ux-spec · prompts M1 · isu #6 |
| D-QA-08 | `e2e/mobile-baseline.spec.js` tulis ke `docs/_mobile-baselines/${BASELINE_TAG\|\|'m0'}` | Banding M0 vs M1 tanpa menimpa artefak; M7 tetap project terpisah | prompts M1 · D-QA-07 |

## 2026-11-03 — M2 Sheet snaps + CTA/toast

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-UI-19 | Satu token `--sheet-peek-height` (fallback `7.5rem`, native override `25dvh`); `data-sheet-snap` peek/mid/full dari `snap-position-change` (index lib 1=peek) / scroll fallback; mid/full sembunyikan `.ar-cta`, toast ke bawah top bar; native: grabber `slot=header`, price/actions `slot=footer`, `nested-scroll` | Hindari hardcode `7.5rem` tersebar; CTA di atas sheet tinggi bentrok konten; footer slot mencegah potong Save di peek | mobile-ux-spec · prompts M2 · pure-web-bottom-sheet README |

## 2026-11-03 — M3 AR message tanpa hover-only

| ID | Keputusan | Alasan | Sumber dibuka |
|---|---|---|---|
| D-A11Y-01 | Klik CTA AR saat unsupported → `showToast(t('ar.unsupported'))` (host toast sudah `aria-live`); `tooltip.js` hover/focus desktop tidak diubah; `aria-disabled` tetap (D-AR-04) | Spek mobile: info AR tanpa hover; toast reuse key + live region; ubah tooltip generik / lepaskan aria-disabled = scope lebih besar | mobile-ux-spec a11y · prompts M3 · D-AR-04 |

## Template keputusan baru
`2026-MM-DD | D-XXX-nn | ... | ... | URL atau "eksperimen T0.3"`

