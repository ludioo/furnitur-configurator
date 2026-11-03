# Implementation plan

Prinsip: MVP dulu, deploy dini (T0.4), task kecil bisa ditest Barkah tanpa baca kode. Satu prompt = satu task ID. Library UI/UX + testing adalah **task standar** (bukan opsional).

## Fase 0 — Fondasi, quality & deploy
| ID | Judul | Depends | Done when (ringkas) |
|---|---|---|---|
| T0.1 | Scaffold Vite + struktur folder + AGENTS di repo | — | `npm run dev` jalan; folder sesuai architecture |
| T0.5 | ESLint flat + Prettier + Vitest + scripts + GitHub Actions CI | T0.1 | `npm run lint`, `npm test`, `npm run build` hijau; CI workflow ada |
| T0.2 | Scene kosong + camera-controls + RoomEnvironment + cube placeholder | T0.1 | Orbit/zoom/idle rotate; latar studio |
| T0.3 | Unduh & optimize ArmChair_01 + Sofa_01 → GLB; mapping material | T0.2 | Kedua model load; `bodyMaterialNames` terisi; GLB < anggaran |
| T0.4 | GitHub + Vercel + domain `configurator.barkahmauludi.com` | T0.3 | HTTPS live; auto-deploy push main |

## Fase 1 — Configurator + UI libs
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T1.1 | Shell UI + i18n EN/ID + Lucide SVG icons | T0.4, T0.5 | Toggle bahasa persist; ikon top bar dari SVG lokal |
| T1.2 | Panel bottom sheet (`pure-web-bottom-sheet` + CSS snap fallback) + swatches warna | T1.1 | Sheet mobile OK; 6 warna instan; Safari tua pakai fallback |
| T1.3 | Finish + size + product switcher Chair/Sofa | T1.2 | Finish/size/harga berubah; ganti produk OK |
| T1.4 | Price bar ilustratif IDR/USD + unit test pricing | T1.3 | Mata uang ikut bahasa; `npm test` cover pricing |
| T1.5 | Save/load/delete localStorage + unit test storage | T1.4 | Refresh tetap ada; max 10; tes Vitest hijau |
| T1.6 | Screenshot + Web Share fallback | T1.5 | PNG terunduh / share sheet |
| T1.7 | motion/mini + toast polish + `@floating-ui/dom` tooltips | T1.6 | Transisi sheet/toast hormati reduced-motion; tooltip AR disabled |
| T1.8 | driver.js onboarding (lazy, once) | T1.7 | Tour 3–5 langkah pertama kali; tidak di bundle awal |

## Fase 2 — AR + debug
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T2.1 | Capability detect + AR button states | T1.8 | Disabled vs ready benar di desktop/Android/iOS sim |
| T2.2 | WebXR immersive-ar + hit-test place (Android) | T2.1 | Place model di lantai; material terkini; exit OK |
| T2.3 | USDZExporter quickLookCompatible + Quick Look link (iOS) | T2.1 | Di iPhone, Quick Look buka model berwarna sesuai config |
| T2.4 | Dynamic import AR modules + error toasts | T2.2, T2.3 | Bundle awal tidak memuat AR; gagal → toast |
| T2.5 | lil-gui + stats.js hanya `?debug=1` | T2.4 | Debug panel/FPS muncul hanya dengan query; prod bundle bersih |

## Fase 3 — Polish, analytics, audit, e2e
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T3.1 | About modal + kredit CC0 + disclaimer | T2.5 | Modal a11y OK |
| T3.2 | Umami + events | T3.1 | Events terlihat (tanpa adblock) |
| T3.3 | Performance pass (lazy, cache headers, loader cleanup) | T3.2 | Transfer awal < 3 MB; hapus loading text dari DOM |
| T3.4 | Lighthouse CI (`@lhci/cli`) + budget + perbaiki issue kritis | T3.3 | `npm run lhci` jalan; Perf ≥ 80 atau blocker di known-issues |
| T3.6 | Playwright e2e smoke (mobile 390 + desktop) + AR unsupported | T3.1 | `npm run e2e` hijau; desktop AR disabled terverifikasi |
| T3.5 | Entry kartu portofolio di barkahmauludi.com | T3.4 | Dilakukan di repo situs utama / Sanity — prompt terpisah |

## Later (jangan otomatis)
- PDF quote (jspdf pola APAR).
- Opsi Legs jika material terpisah.
- model-viewer Scene Viewer fallback.
- XREstimatedLight.
- KHR_materials_variants bake untuk discrete SKU.
