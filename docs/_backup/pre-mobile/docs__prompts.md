# Prompts — copy-paste ke Cursor / Codex

Setiap prompt = **satu task ID**. Alur wajib di dalam setiap prompt: **VALIDASI → PLANNING (tunggu persetujuan) → IMPLEMENTASI → verifikasi → update docs**. Minta agent memakai skills/subagent Cursor yang tersedia (explore untuk investigasi, dll).

Ganti hanya jika AI minta klarifikasi; jangan gabung dua ID.

---

## Meta — cara pakai
1. Pastikan `docs/progress.md` task sebelumnya `done` (urut `implementation-plan.md`; T0.5 boleh paralel setelah T0.1 sebelum/bersamaan T0.2 sesuai depends).
2. Copy prompt task berikutnya.
3. AI harus **berhenti setelah PLAN** sampai kamu bilang "lanjut" / "setuju".
4. Setelah implementasi, cek `acceptance-criteria.md` di HP/laptop.
5. Kalau gagal: pakai **Prompt perbaikan bug** di bawah.

---

## T0.1 — Scaffold
```
Baca AGENTS.md, docs/progress.md, docs/architecture.md, docs/tech-stack.md, dan .cursor/rules yang relevan. Gunakan skills/agent/subagent Cursor yang tersedia. Alur WAJIB berurutan:

FASE 1 — VALIDASI (jangan ubah file): pastikan belum ada scaffold bentrok; laporkan rencana package.json (three, camera-controls, vite) dan struktur folder architecture.md.
FASE 2 — PLANNING: daftar file yang akan dibuat. BERHENTI dan tunggu persetujuan saya.
FASE 3 — IMPLEMENTASI (setelah saya setuju): buat project Vite vanilla JS sesuai architecture.md; pasang three + camera-controls; buat stub file kosong bermakna; copy AGENTS.md & docs & .cursor/rules ke repo bila belum; .gitignore (node_modules, dist, .env.local). Jangan implement scene/AR/lint dulu (lint di T0.5).

Verifikasi: npm install && npm run build sukses. Update docs/progress.md, decisions.md bila perlu, known-issues.md. Ringkas Bahasa Indonesia + saran commit "chore: scaffold furniture configurator".
```

## T0.5 — Quality toolchain
```
Baca AGENTS.md, tech-stack.md (bagian testing/quality), architecture.md (tests/, e2e/, eslint), env-setup.md, T0.5, .cursor/rules/testing.mdc. Skills/subagent Cursor. Alur VALIDASI → PLANNING (tunggu "lanjut") → IMPLEMENTASI.

VALIDASI: cek package.json scripts yang sudah ada; Node/Vite versi.
PLAN: daftar dep dev (vitest, eslint flat, prettier, eslint-config-prettier), file eslint.config.js, prettier, vitest.config, 1–2 tes stub (mis. pricing placeholder atau sanity), .github/workflows/ci.yml (lint → test → build). Jangan Playwright dulu (T3.6). BERHENTI tunggu persetujuan.

IMPLEMENT: pasang toolchain; scripts: "test", "test:watch", "lint", "format". Pastikan npm test & npm run lint hijau. Update env-setup bila perlu. Update progress/decisions/known-issues.

Verifikasi: jalankan npm test && npm run lint && npm run build; jelaskan ke saya kapan pakai npm test. Commit: "chore: eslint prettier vitest and CI".
```

## T0.2 — Scene dasar
```
Baca AGENTS.md, progress.md, design-system.md, tech-stack.md, task T0.2 di implementation-plan.md. Pakai skills/subagent Cursor. Alur VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Tujuan: WebGL canvas full-bleed, RoomEnvironment/PMREM, camera-controls (orbit/dolly/touch), idle auto-rotate 5 dtk, placeholder Mesh (box) warna accent, clear color sesuai design-system, hormati prefers-reduced-motion. Belum load GLB furniture.

Verifikasi: npm run build; beri langkah cek orbit/zoom/idle. Update progress. Commit saran: "feat: base three scene with camera-controls".
```

## T0.3 — Model + optimize
```
Baca AGENTS.md, content-and-assets.md, data-model.md, performance-budget rule, T0.3. Skills/subagent Cursor. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

VALIDASI: cek URL unduhan Poly Haven ArmChair_01 & Sofa_01 glTF 1k via api.polyhaven.com/files/...; pastikan lisensi CC0.
PLAN: scripts/optimize-model.mjs (gltf-transform draco/meshopt/webp atau ktx2), output public/models/armchair.glb & sofa.glb, copy decoders ke public/decoders.
IMPLEMENT: unduh → optimize → loader.js dengan LoadingManager + splash % + Retry; inspeksi material names → isi bodyMaterialNames di products.json; ganti placeholder dengan armchair default. Jangan AR.

Verifikasi: ukuran file GLB dilaporkan; build OK; acceptance T0.3. Update progress + decisions (catat nama material). Commit: "feat: load optimized armchair and sofa GLBs".
```

## T0.4 — Deploy Vercel + subdomain
```
Baca env-setup.md, T0.4, AGENTS.md. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Siapkan vercel.json cache models/decoders; pastikan build output dist; bantu commit & instruksi Publish GitHub + Import Vercel + Add Domain configurator.barkahmauludi.com (DNS sudah di Vercel — jangan sentuh situs utama). Jangan hardcode secret.

Verifikasi: berikan checklist klik untuk saya; setelah saya konfirmasi live, update progress. Commit: "chore: vercel config for configurator subdomain".
```

## T1.1 — Shell + i18n + Lucide icons
```
Baca design-system.md, content-and-assets.md (ikon), user-flows UF3, i18n-content rule, T1.1, tech-stack Lucide. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Top bar (judul, placeholder product tabs, EN|ID, About stub), i18n en.json/id.json + core/i18n.js, persist furncfg:lang, hash routing dasar #configure. Salin SVG Lucide individual (ISC) ke src/ui/icons/ — jangan package React / lucide-static penuh. Belum swatch/AR.

Verifikasi: toggle bahasa tanpa reload; ikon tampil. Update progress. Commit: "feat: shell UI i18n and Lucide icons".
```

## T1.2 — Bottom sheet + swatch warna
```
Baca data-model.md, design-system (sheet + swatches), architecture bottom sheet strategy, tech-stack pure-web-bottom-sheet, T1.2. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

VALIDASI: baca docs npm/GitHub pure-web-bottom-sheet (Safari 18.2+); rencanakan CSS scroll-snap fallback.
PLAN: bottomSheet.js + configPanel; daftar file. Tunggu "lanjut".
IMPLEMENT: pasang pure-web-bottom-sheet; fallback CSS untuk browser tidak support; desktop panel kanan; 6 swatch dari products.json; apply color ke bodyMaterialNames; state.js; analytics stub boleh no-op. Touch ≥44px. Tambah unit test ringan state bila relevan.

Verifikasi: acceptance T1.2. Update progress + known-issues (catat browser fallback). Commit: "feat: bottom sheet and fabric color swatches".
```

## T1.3 — Finish, size, product switch
```
Baca T1.3, data-model, user-flows UF1. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Chip Finish (roughness/metalness) + Size (scale) + ganti model Chair/Sofa dengan loading state singkat; reset/restore opsi per produk. Jangan pecah budget (dispose geometry lama).

Verifikasi: acceptance T1.3. Update progress + known-issues jika dispose bug. Commit: "feat: finish size and product switcher".
```

## T1.4 — Harga ilustratif + Vitest
```
Baca T1.4, data-model harga, content teks price.illustrative, testing rule. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

priceBar + core/pricing.js pure functions; format id-ID / en-US; label Illustrative. Tulis tests/pricing.test.js (base + addons + currency). npm test harus hijau.

Verifikasi: ganti bahasa → mata uang berubah; npm test. Commit: "feat: illustrative price bar with unit tests".
```

## T1.5 — Save configs + Vitest storage
```
Baca T1.5, data-model localStorage, storage conventions, testing rule. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

storage.js prefix furncfg:; save/load/delete max 10; schemaVersion; auto-save last; empty state; toast; private mode graceful. tests/storage.test.js (mock localStorage). npm test hijau.

Verifikasi: refresh persist; npm test. Commit: "feat: save restore configs with storage tests".
```

## T1.6 — Screenshot / share
```
Baca T1.6, scene/screenshot. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

preserveDrawingBuffer atau render-once toBlob; unduh PNG; jika navigator.share + canShare file → share; analytics screenshot.

Verifikasi: file gambar muncul. Commit: "feat: canvas screenshot and share".
```

## T1.7 — motion/mini + toast + floating-ui
```
Baca design-system Motion, tech-stack motion/mini + floating-ui, T1.7, performance-budget. Skills/subagent. VALIDASI → PLANNING (tunggu "lanjut") → IMPLEMENTASI.

VALIDASI: pastikan import dari "motion/mini" (bukan Motion+); cek prefers-reduced-motion plan.
PLAN: ui/motion.js wrapper, polish toast.js, ui/tooltip.js dengan @floating-ui/dom untuk AR disabled / help. Tunggu persetujuan.
IMPLEMENT: pasang motion + @floating-ui/dom; animasi toast/modal/sheet ringan; skip animasi jika reduced-motion; jangan animasi heavy di loop render 3D.

Verifikasi: acceptance T1.7; laporkan KB gzip tambahan. Commit: "feat: motion mini toast and floating-ui tooltips".
```

## T1.8 — driver.js onboarding
```
Baca user-flows (tambah onboarding), design-system onboarding, tech-stack driver.js, T1.8. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Tour 3–5 langkah (canvas, swatch, save, AR CTA); teks i18n EN/ID; Skip; flag furncfg:onboarded; dynamic import("driver.js") hanya saat tour dimulai; jangan load di main entry. Hormati reduced-motion bila API memungkinkan.

Verifikasi: acceptance T1.8 (tour sekali, Network bersih sebelum start). Commit: "feat: lazy driver.js onboarding tour".
```

## T2.1 — AR capability + tombol
```
Baca decisions D-AR-01, user-flows UF2, T2.1. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Deteksi: navigator.xr?.isSessionSupported('immersive-ar'); iOS Safari heuristic untuk Quick Look; desktop disabled. arButton.js + i18n unsupported + tooltip T1.7. Belum start session/export.

Verifikasi: states benar di platform yang tersedia (laporkan yang tidak bisa kamu tes). Commit: "feat: AR CTA capability states".
```

## T2.2 — WebXR hit-test
```
Baca tech-stack WebXR, three example webxr_ar_hittest, T2.2, performance-budget (dynamic import). Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

ar/webxr.js: immersive-ar, hit-test, reticle, place root produk dengan material terkini, end session cleanup. Jangan rusak viewer desktop. Hanya aktif jika supported.

Verifikasi: langkah tes Android Chrome HTTPS (atau catat blocker emulator). Commit: "feat: WebXR hit-test place furniture".
```

## T2.3 — USDZ Quick Look
```
Baca USDZExporter docs (quickLookCompatible), D-AR-01, T2.3. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

ar/usdz.js: clone/export scene produk; bake color tint ke map jika perlu; Blob USDZ; <a rel="ar"> dengan fallback image; revokeObjectURL; handle gagal.

Verifikasi: instruksi tes iPhone Safari; desktop boleh trigger download usdz untuk inspeksi. Commit: "feat: USDZ export for iOS Quick Look".
```

## T2.4 — Lazy AR + errors
```
Baca T2.4, architecture dynamic import. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Pastikan webxr.js & usdz.js hanya import() saat CTA; toast error; tidak double-load; track ar_enter.

Verifikasi: bundle analyzer kasar atau Network tab notes. Commit: "perf: dynamic import AR modules".
```

## T2.5 — Debug lil-gui + stats
```
Baca tech-stack lil-gui + stats.js, performance-budget, T2.5, architecture debug/. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Hanya jika URL punya ?debug=1 (atau debug=true): dynamic import lil-gui + stats.js; panel material/light kasar + FPS. Tanpa query: zero import debug. Pastikan tidak masuk critical chunk produksi.

Verifikasi: acceptance T2.5. Commit: "chore: debug lil-gui and stats behind query flag".
```

## T3.1 — About
```
Baca content-and-assets kredit, UF4, T3.1. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

About modal a11y (Esc, backdrop, focus return, Close ≥44); teks EN/ID; link portofolio; disclaimer harga; kredit Poly Haven CC0 + sebut Lucide ISC bila dipakai.

Verifikasi: acceptance T3.1. Commit: "feat: about modal and credits".
```

## T3.2 — Umami
```
Baca analytics rule, env-setup Umami, T3.2. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

analytics.js no-op tanpa VITE_UMAMI_WEBSITE_ID; events: product_change, variant_change, config_save, ar_enter, screenshot, lang_change. Jangan load script bila ID kosong.

Verifikasi: instruksi cek Umami Events. Commit: "feat: umami analytics events".
```

## T3.3 — Performance pass
```
Baca performance-budget, T3.3, known-issues. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Ukur transfer awal; pastikan loader text dihapus/aria-hidden setelah load; cache headers; buang aset mati (HDRI dll); tree-shake imports; pastikan driver/AR/debug tetap lazy.

Verifikasi: angka MB + build. Commit: "perf: initial load under budget".
```

## T3.4 — Lighthouse CI
```
Baca T3.4, tech-stack @lhci/cli, performance-budget. Skills/subagent. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Pasang @lhci/cli; lighthouserc.js dengan startServerCommand preview Vite; budgets Performance ≥80, Accessibility ≥90 (atau assert skor); script npm run lhci; perbaiki issue kritis/high yang aman; jangan ubah fitur. Lampiran skor di progress/known-issues.

Verifikasi: npm run lhci (atau laporan blocker lingkungan). Commit: "chore: lighthouse CI budgets and fixes".
```

## T3.6 — Playwright e2e
```
Baca T3.6, architecture e2e/, env-setup e2e, testing rule. Skills/subagent. VALIDASI → PLANNING (tunggu "lanjut") → IMPLEMENTASI.

VALIDASI: pastikan app bisa di-preview; daftar alur smoke.
PLAN: playwright.config.js (webServer vite preview), e2e/smoke.spec.js (viewport 390 + desktop: ganti swatch → save terlihat), e2e/ar-fallback.spec.js (desktop AR disabled/pesan). Script "e2e". Tunggu persetujuan.
IMPLEMENT: pasang @playwright/test; tulis spec; dokumentasikan npx playwright install chromium di env-setup bila belum. Jangan flaky sleep panjang — pakai locator/assert.

Verifikasi: npm run e2e hijau; jelaskan satu perintah untuk saya ulang. Commit: "test: playwright smoke and AR fallback".
```

## T3.5 — Portofolio entry (repo lain)
```
Baca AGENTS situs utama bila ada. Task ini di repo barkahmauludi.com / Sanity, BUKAN repo configurator. VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Tambah kartu project Furniture Configurator + AR: year 2026, link https://configurator.barkahmauludi.com, tech three.js/WebXR/Vite, results bullets EN, tanpa testimonial palsu. Jangan rusak entri APAR.

Verifikasi: homepage + /work/<slug>. Commit di repo situs: "portfolio: add furniture configurator entry".
```

---

## Prompt perbaikan bug
```
Baca AGENTS.md, progress.md, known-issues.md, decisions.md. Skills/subagent Cursor. Alur VALIDASI → PLANNING (tunggu) → IMPLEMENTASI.

Bug: <deskripsi + screenshot/langkah + browser/HP>.
Jangan perluas scope. Repro dulu, lalu perbaikan minimal, lalu npm run build (dan npm test bila menyentuh logic), update known-issues.md dan progress.md. Ringkas Bahasa Indonesia.
```

## Prompt "lanjut dari terakhir"
```
Baca AGENTS.md dan docs/progress.md. Kerjakan task pending berikutnya sesuai implementation-plan.md dengan alur VALIDASI → PLANNING (tunggu persetujuan) → IMPLEMENTASI. Pakai skills/subagent Cursor yang relevan.
```
