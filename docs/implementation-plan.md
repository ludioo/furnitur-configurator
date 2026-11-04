# Implementation plan

Prinsip: MVP dulu, deploy dini (T0.4), task kecil bisa ditest Barkah tanpa baca kode. Satu prompt = satu task ID. Library UI/UX + testing adalah **task standar** (bukan opsional).

## Fase 0 - Fondasi, quality & deploy
| ID | Judul | Depends | Done when (ringkas) |
|---|---|---|---|
| T0.1 | Scaffold Vite + struktur folder + AGENTS di repo | - | `npm run dev` jalan; folder sesuai architecture |
| T0.5 | ESLint flat + Prettier + Vitest + scripts + GitHub Actions CI | T0.1 | `npm run lint`, `npm test`, `npm run build` hijau; CI workflow ada |
| T0.2 | Scene kosong + camera-controls + RoomEnvironment + cube placeholder | T0.1 | Orbit/zoom/idle rotate; latar studio |
| T0.3 | Unduh & optimize ArmChair_01 + Sofa_01 → GLB; mapping material | T0.2 | Kedua model load; `bodyMaterialNames` terisi; GLB < anggaran |
| T0.4 | GitHub + Vercel + domain `configurator.barkahmauludi.com` | T0.3 | HTTPS live; auto-deploy push main |

## Fase 1 - Configurator + UI libs
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T1.1 | Shell UI + i18n EN/ID + Lucide SVG icons | T0.4, T0.5 | Toggle bahasa persist; ikon top bar dari SVG lokal |
| T1.2 | Panel bottom sheet (`pure-web-bottom-sheet` + CSS snap fallback) + swatches warna | T1.1 | Sheet mobile OK; 6 warna instan; Safari tua pakai fallback |
| T1.3 | Finish + size + product switcher Chair/Sofa | T1.2 | Finish/size/harga berubah; ganti produk OK |
| T1.4 | Price bar ilustratif IDR/USD + unit test pricing | T1.3 | Mata uang ikut bahasa; `npm test` cover pricing |
| T1.5 | Save/load/delete localStorage + unit test storage | T1.4 | Refresh tetap ada; max 10; tes Vitest hijau |
| T1.6 | Screenshot + Web Share fallback | T1.5 | PNG terunduh / share sheet |
| T1.7 | motion/mini + toast polish + `@floating-ui/dom` tooltips | T1.6 | Transisi sheet/toast hormati reduced-motion; tooltip AR disabled |
| T1.8 | driver.js onboarding (lazy, once) | T1.7 | Tour 3-5 langkah pertama kali; tidak di bundle awal |

## Fase 2 - AR + debug
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T2.1 | Capability detect + AR button states | T1.8 | Disabled vs ready benar di desktop/Android/iOS sim |
| T2.2 | WebXR immersive-ar + hit-test place (Android) | T2.1 | Place model di lantai; material terkini; exit OK |
| T2.3 | USDZExporter quickLookCompatible + Quick Look link (iOS) | T2.1 | Di iPhone, Quick Look buka model berwarna sesuai config |
| T2.4 | Dynamic import AR modules + error toasts | T2.2, T2.3 | Bundle awal tidak memuat AR; gagal → toast |
| T2.5 | lil-gui + stats.js hanya `?debug=1` | T2.4 | Debug panel/FPS muncul hanya dengan query; prod bundle bersih |

## Fase 3 - Polish, analytics, audit, e2e
| ID | Judul | Depends | Done when |
|---|---|---|---|
| T3.1 | About modal + kredit CC0 + disclaimer | T2.5 | Modal a11y OK |
| T3.2 | Umami + events | T3.1 | Events terlihat (tanpa adblock) |
| T3.3 | Performance pass (lazy, cache headers, loader cleanup) | T3.2 | Transfer awal < 3 MB; hapus loading text dari DOM |
| T3.4 | Lighthouse CI (`@lhci/cli`) + budget + perbaiki issue kritis | T3.3 | `npm run lhci` jalan; Perf ≥ 80 atau blocker di known-issues |
| T3.6 | Playwright e2e smoke (mobile 390 + desktop) + AR unsupported | T3.1 | `npm run e2e` hijau; desktop AR disabled terverifikasi |
| T3.5 | Entry kartu portofolio di barkahmauludi.com | T3.4 | Dilakukan di repo situs utama / Sanity - prompt terpisah |

## Fase M - Mobile polish (setelah MVP feature-complete)

Sumber: `docs/mobile-ux-spec.md`, `docs/mobile-testing.md`, `.cursor/rules/mobile.mdc`. Jangan mengerjakan sebelum T3.6 selesai (kecuali M0 audit paralel). Satu ID per prompt; bukti = screenshot/video Playwright mobile.

| ID | Judul | Depends | Done when (acceptance ringkas) |
|---|---|---|---|
| M0 | Audit UI mobile + baseline screenshot/video | T3.6 | Inventaris isu vs `mobile-ux-spec` "current issues"; folder baseline (Playwright video on) untuk 360/390/375 + landscape; progress mencatat path artefak |
| M1 | Breakpoints + top bar density + hierarchy | M0 | Di 360 & SE: tabs/lang/Saved/About ≥44px, tanpa overflow horizontal; About/Saved icon-first; bukti screenshot |
| M2 | Bottom sheet snap, grabber native, footer & CTA/toast offset | M1 | Peek/mid/full usable; grabber native + fallback; AR CTA & toast tidak overlap konten sheet; offset ikut tinggi peek |
| M3 | Touch / gesture / tooltip tanpa hover-only | M2 | AR unsupported → toast atau aria-live saat tap; canvas `touch-action` tetap; gestur sheet tidak scroll body |
| M4 | viewport-fit=cover, safe-area, dvh/svh, landscape | M3 | Meta `viewport-fit=cover`; panel pakai dvh/svh (bukan 80vh); landscape phone canvas usable; sheet/rail merespon resize/orientasi |
| M5 | Performance pass fokus mobile | M4 | DPR cap tetap ≤1.5; tidak ada regresi transfer; catat fps/jank qualitative + build size; hormati reduced-motion |
| M6 | AR entry UX mobile (CTA copy/state/busy) | M5 | CTA jelas di peek; busy/error toast; instruksi Safari-only bila perlu; tidak klaim WebXR/QL lulus tanpa device/checklist |
| M7 | Playwright suite mobile + recordVideo | M6 | Projects Pixel7 / iPhone13 / SE / landscape; `video: on` (atau retain); spek sheet/CTA/topbar; `npm run e2e` (+ script e2e:mobile) hijau |
| M8 | LHCI mobile eksplisit + ringkas CI notes | M7 | `npm run lhci` skor mobile dilampirkan; Perf ≥80 atau blocker di known-issues; docs testing.mdc / mobile-testing selaras |
| M9 | Mobile polish fixes (QA live 4 Nov 2026) | M8 | Toast 'Saved' & AR CTA tidak berbagi band vertikal di peek; toast identik di-dedupe (refresh timer); SE 375x667 (tinggi <=700): baris swatch pertama utuh; jarak CTA-grabber cukup; header Saved tidak tampak terpilih. Bukti: Playwright bounding-box no-overlap (SE/iPhone13/Pixel7/landscape 844x390), test 5 tap AR = 1 toast, screenshot before/after + video Pixel 7; lint/unit/e2e/build hijau |
| M10 | Mobile performance pass (backlog, terpisah dari M9) | M9 | LHCI mobile Perf >=80 (target; lab live 33, lokal ~58-64); tanpa melonggarkan budget; optimasi load/render three.js |
| M11 | Product polish + rename RoomFit (QA live 4 Nov 2026, pasca M9/M10) | M10 | Brand in-app RoomFit (title/header/About/manifest/meta; domain & deploy TIDAK diubah); share meta OG/Twitter/theme-color/canonical (satu config value, sementara https://configurator.barkahmauludi.com) + og-image 1200x630 + apple-touch-icon/favicon; landscape 844x390 grabber/chevron + peek strip swatch; LHCI mobile Perf median 3 run >=80 (TBT ~900ms turun: split/defer bootViewer, idle init, worker bila wajar), A11y/BP/SEO tetap 100; About CTA 'Work with me' di atas GitHub; Saved empty-state 'Save your first look' + auto-name 'Chair · Sand · Fabric'; toast AR unsupported tidak bersaing dengan CTA; loading indicator swap Chair<->Sofa. Bukti: Playwright + screenshot before/after docs/_mobile-baselines/m11/; lint/unit/e2e/build hijau |

## Later (jangan otomatis)
- PDF quote (jspdf pola APAR).
- Opsi Legs jika material terpisah.
- model-viewer Scene Viewer fallback.
- XREstimatedLight.
- KHR_materials_variants bake untuk discrete SKU.
