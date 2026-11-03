# AGENTS.md — Furniture Configurator + AR View in Room
Kamu (AI di Cursor) membangun seluruh project ini. Pemilik (Barkah) TIDAK menyentuh kode; dia hanya mengirim prompt dari `docs/prompts.md` dan mengecek hasil via `docs/acceptance-criteria.md`.

## Cursor rules
Aturan rinci ada di `.cursor/rules/*.mdc` (core-rules, lazy-senior-dev selalu aktif; lainnya aktif sesuai file/situasi). Jika ada konflik, AGENTS.md dan `docs/decisions.md` yang berlaku.

## Wajib dibaca sebelum setiap task
1. `docs/progress.md` (status terakhir) dan `docs/known-issues.md`
2. Task terkait di `docs/implementation-plan.md` (ID mis. `T1.3`)
3. Dokumen yang dirujuk task: `PRD.md`, `architecture.md`, `data-model.md`, `design-system.md`, `content-and-assets.md`, `tech-stack.md`; untuk Fase M juga `mobile-ux-spec.md` + `mobile-testing.md`
4. `docs/decisions.md` — jangan membalik keputusan tanpa mencatat keputusan baru.

## Konvensi
- Vanilla JavaScript (ES modules), three.js, Vite. TANPA framework UI (no React/Vue/Svelte), tanpa TypeScript, tanpa Tailwind.
- File & identifier bahasa Inggris, camelCase untuk variabel, kebab-case untuk nama file.
- Semua teks UI lewat `src/i18n/en.json` & `src/i18n/id.json` — jangan hardcode string di HTML/JS.
- Data produk (varian, harga, spek) hanya di `src/data/*.json`.
- Satu modul = satu tanggung jawab (lihat `architecture.md`). Maks ~300 baris per file.
- Penyimpanan hanya `localStorage` via `src/core/storage.js` (key berprefix `furncfg:`), kecuali flag onboarding boleh lewat helper yang sama.
- Mobile-first (Fase M: `docs/mobile-ux-spec.md`); target load < 3 dtk di 4G, total transfer awal < 3 MB, 60 fps desktop, ≥30 fps HP mid-range.
- AR: WebXR hit-test di Android Chrome; USDZExporter → Quick Look di iOS. Jangan pakai `@google/model-viewer` di MVP (lihat `decisions.md`).
- Library UI/QA yang diizinkan tercantum di `tech-stack.md` (bottom sheet, driver.js lazy, motion/mini, floating-ui, Lucide SVG, lil-gui/stats debug, Vitest, Playwright, ESLint, Prettier, LHCI). Jangan menambah dep di luar daftar tanpa keputusan baru.
- Logic murni (pricing, storage serialize, i18n lookup) wajib punya tes Vitest saat task terkait.

## Scripts yang Barkah / CI pakai
- `npm test` — Vitest unit
- `npm run e2e` — Playwright smoke
- `npm run lint` / `npm run format`
- `npm run lhci` — Lighthouse CI
- `npm run build` — wajib hijau di akhir setiap task implementasi

## Dilarang
- Menambah backend, login, database, atau layanan berbayar. Satu-satunya layanan pihak ketiga yang diizinkan: Umami Cloud (Hobby, gratis) lewat `src/core/analytics.js`.
- Memakai Blender atau memotong mesh kecuali fase Later yang eksplisit.
- Memakai aset 3D/gambar/font/audio yang lisensinya bukan CC0/OFL/MIT/Apache-2.0/ISC atau tidak dicatat di `content-and-assets.md`.
- Menyimpan secret/API key di repo.
- Menghapus atau menulis ulang file docs selain update yang diminta.
- Mengerjakan lebih dari satu task ID per prompt.
- Menambah GSAP (lisensi proprietary Webflow), Shepherd (AGPL), Motion+ berbayar, Cypress/Jest/Storybook, atau `lucide-static` penuh.

## Di akhir SETIAP task
1. Jalankan `npm run build` — harus sukses tanpa error. Jika menyentuh logic murni / tooling: `npm test` (dan `npm run lint` bila menyentuh style/config).
2. Update `docs/progress.md` (status task, tanggal, catatan singkat).
3. Catat keputusan teknis baru di `docs/decisions.md` (tanggal + alasan).
4. Catat bug/solusi di `docs/known-issues.md`.
5. Tulis ringkasan untuk Barkah dalam Bahasa Indonesia: apa yang berubah, cara mengecek (langkah klik / perintah npm), dan commit message yang disarankan.

## Untuk Codex (dan agent selain Cursor)
Codex tidak memuat `.cursor/rules` otomatis, jadi baca sendiri file-file itu sebagai aturan yang sama wajibnya:
- **Selalu**, di awal setiap task: `.cursor/rules/core-rules.mdc` dan `.cursor/rules/lazy-senior-dev.mdc`.
- Saat menyentuh `src/**`, `index.html`, `vite.config.js`, `vercel.json`, `scripts/**`: `.cursor/rules/architecture-conventions.mdc`.
- Saat menyentuh teks UI, `src/i18n`, `src/data`, PDF: `.cursor/rules/i18n-content.mdc`.
- Saat menyentuh render/aset/efek/loading/AR: `.cursor/rules/performance-budget.mdc`.
- Saat menyentuh analytics atau tracking event: `.cursor/rules/analytics.mdc`.
- Saat menyentuh `tests/**`, `e2e/**`, eslint/prettier/vitest/playwright/lhci/CI: `.cursor/rules/testing.mdc`.
- Saat UI mobile / sheet / CTA / viewport / e2e mobile: `.cursor/rules/mobile.mdc` (selalu aktif) + `docs/mobile-ux-spec.md` / `mobile-testing.md`.
- **Setiap task selesai**: `.cursor/rules/step-validation.mdc` (checklist, langkah cek, tunggu konfirmasi Barkah).
Abaikan frontmatter (`description`/`globs`/`alwaysApply`) di file .mdc; isinya yang berlaku. Sebelum mulai, baca `docs/progress.md` untuk tahu task terakhir yang selesai, lalu lanjutkan dari situ.
