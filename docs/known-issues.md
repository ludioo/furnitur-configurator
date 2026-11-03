# Known issues

## Bug / catatan implementasi
| Tanggal | Task | Gejala | Solusi |
|---|---|---|---|
| 2026-11-03 | M1 | Top bar 360/SE: overflow + lang &lt;44 + Saved teks — **ditutup** (D-UI-18); bukti `docs/_mobile-baselines/m1/`. Sisa isu M0: CTA overlap COLOR, landscape ≥768 = rail (**M2/M4**) | Bandingkan m0 vs m1; lanjut M2 |
| 2026-11-03 | M0 | Audit kode vs `mobile-ux-spec` isu 1–12: #6 top-bar **ditutup di M1**; sisa isu CTA/sheet/landscape. Baseline PNG/WEBM di `docs/_mobile-baselines/m0/` (sebelum densify) | M2 (CTA/sheet), M4 (landscape &lt;768 sheet); bandingkan ulang di M7 |
| 2026-11-03 | Fase M docs | Katalog isu mobile di `mobile-ux-spec.md` (viewport-fit, CTA/toast vs sheet, tooltip hover-only, tap lang <44, sheet tidak re-mount, native grabber, 80vh, e2e/LHCI mobile) | Jalankan task M0–M8; backup docs di `docs/_backup/pre-mobile/` |
| 2026-11-02 | T0.5 | `npm i @eslint/js` tanpa pin menarik v10 (peer ESLint 10) bentrok `eslint@9` | Pin `@eslint/js@9` bersama `eslint@9` |
| 2026-11-02 | T0.2 | Vite warning chunk JS ~739 KB (gzip ~190 KB) setelah scene three.js | T3.3: on-demand RAF (D-SCENE-02); chunk utama ~861 KB / **228 KB gzip** (&lt; ~300 KB budget); warning Vite &gt;500 KB tetap ada (three critical path) |
| 2026-11-02 | T3.3 | Tidak ada HDRI mati di `public/`; `draco_decoder.js` (~512 KB) tetap di repo sebagai fallback Draco | Tidak dihapus tanpa bukti unused di semua browser; path awal pakai wasm + wrapper (~251 KB) |
| 2026-11-02 | T0.3 | Teks splash masih hardcode EN | Diganti i18n di T1.1 (keputusan D-UX-01) — selesai T1.1 |
| 2026-11-02 | T1.1 | Product tabs Chair/Sofa disabled (placeholder) | Selesai T1.3 — tab aktif + `__furncfgLoad` tetap sinkron state |
| 2026-11-02 | T1.2 | `pure-web-bottom-sheet@1.1.1` engines minta Node ≥24 / npm ≥11.7; project CI Node 22 | Warning EBADENGINE saja; runtime browser OK. Tetap pin 1.1.1 per D-UI-02 |
| 2026-11-02 | T1.2 | Safari/iOS &lt; 18.2 tidak support initial snap lib | `html.sheet-fallback` + CSS scroll-snap peek 120px; desktop tetap rail kanan |

| 2026-11-02 | T1.5 | Panel Saved `aria-modal` tanpa focus-trap penuh (hanya fokus Close) | Cukup untuk MVP; trap/inert ditunda (bukan AC T1.7) — boleh About/Saved nanti |
| 2026-11-02 | T3.1 | About juga tanpa focus trap penuh; fokus return ke tombol About sudah ada (D-UI-17) | Trap/inert tetap deferred seperti Saved; AC T3.1 lolos tanpa trap |
| 2026-11-02 | T1.6 | Windows desktop Share sheet (Chrome/Edge) sering hang saat load target apps; dialog tidak bisa ditutup, scene 3D tetap animasi di belakang | Skip `navigator.share` di non-mobile UA → unduh PNG langsung (D-SHOT-02). Share tetap di Android/iPhone |
| 2026-11-02 | T1.7 | Tombol AR selalu disabled (stub) sampai T2.1 | Selesai T2.1 — capability detect (D-AR-04) |
| 2026-11-02 | T1.8 | Di mobile native sheet, langkah swatch/save bisa highlight elemen di luar snap terlihat meski `scrollIntoView` | Sengaja D-UI-14 (tanpa API expand); user bisa geser sheet / Next. Upgrade: expand snap sebelum step bila lib expose API |
| 2026-11-02 | T2.1 | State “siap” Android Chrome / iPhone Safari tidak diverifikasi di perangkat nyata (hanya Vitest + desktop headless) | Desktop + tooltip OK Barkah; cek tombol aktif di HP teman/keluarga bila ada |
| 2026-11-02 | T1.8/T2.1 | Teks tour driver.js hampir tak terbaca (putih/abu di latar putih) | `onboarding.css` diimpor setelah `driver.css` (D-UI-16); kontras OK Barkah |
| 2026-11-02 | T2.2 | Hit-test place/exit tidak diverifikasi di Android Chrome HTTPS (mesin AI Windows; emulator tanpa hit-test) | Kode + Vitest pose + desktop no-regression OK; tes HP: Chrome Android ke HTTPS (deploy atau `chrome://inspect` port-forward) |
| 2026-11-02 | T2.3 | Export USDZ masih `await parseAsync` di dalam tap — model besar bisa habiskan user-activation sebelum `a.click()` | Warm-import chunk sudah; Quick Look OK Barkah di iPhone live. Upgrade dua-ketukan hanya bila gagal buka di device lambat |
| 2026-11-02 | UI | Layout/UX mobile (sheet, CTA, hierarchy) terasa buruk di iPhone meski fitur AR jalan | Spec rinci + temuan kode: `docs/mobile-ux-spec.md`. Dikerjakan **Fase M** (M0–M8) di implementation-plan / prompts |
| 2026-11-02 | T2.4 | AC “modul AR tidak ke-load sebelum CTA” vs warm-import USDZ Quick Look | Sengaja D-AR-07 / D-AR-06: WebXR strict lazy; `usdz` boleh warm di iOS Safari saja |
| 2026-11-02 | T3.2 | AC “Umami events muncul” belum diverifikasi live; Hobby Cloud limit **1 website** (slot sudah terpakai) | Kode wired + no-op tanpa env ID (D-AN-01/D-AN-02). Nanti: reuse situs Hobby (tambah domain configurator) atau slot baru; set `VITE_UMAMI_WEBSITE_ID` + redeploy |
| 2026-11-02 | T3.4 | Lighthouse mobile Performance **~46–72** (Barkah **59**) &lt; budget **80**; A11y **100**, BP 100, SEO ~91 | Assert tetap Perf ≥80 (D-QA-02). Gap utama: JS three.js critical path (~228 KB gzip) + main-thread/bootup — bukan regresi fitur. AC T3.4: skor dilampirkan + blocker dicatat. Upgrade: code-split three lebih agresif / self-host font (Later) |
| 2026-11-02 | T3.4 | LHCI 0.15 + `"type":"module"`: `lighthouserc.js` ESM `export default` tidak terpakai (fallback staticDistDir + preset recommended) | Pakai `lighthouserc.cjs` + `lhci autorun --config=./lighthouserc.cjs` (D-QA-04) |
| 2026-11-02 | T3.4 | Vite preview + LHCI di Windows: timeout pola `/Local:/i` (stdout buffer) — skor Perf flaky | Collect pakai `staticDistDir: ./dist` (server bawaan LHCI); `npm run lhci` tetap `build` dulu (D-QA-04) |

Belum ada isu terbuka yang memblokir acceptance T0.1–T1.8 / T2.1 desktop / T2.2 desktop / **T2.3 iPhone Quick Look**. Hit-test Android Chrome HTTPS tetap deferred. AC T3.2 Events live = deferred (Hobby slot). T3.4 A11y budget lulus; Perf budget = blocker di atas.

Catatan T0.4: slug GitHub `furnitur-configurator` (tanpa “e”) beda dari nama folder/docs; Production Branch Vercel = `main` sementara default GitHub = `develop` — push fitur production ke `main` (atau merge) agar redeploy jalan.

## Risiko yang sudah diantisipasi
| Gejala | Penyebab mungkin | Mitigasi |
|---|---|---|
| Warna di Quick Look beda dari viewer | USDZ/iOS handle color×map | Bake tint ke texture sebelum export (T2.3) |
| Tombol AR mati di Chrome iOS | Quick Look hanya andal di Safari | Deep link / instruksi "Buka di Safari" |
| Hit-test tidak ada | Device/browser tanpa WebXR AR | Disabled state + pesan |
| GLB masih besar | Belum optimize | Wajib `optimize:model` di T0.3 |
| Material name salah | Tebak nama | Inspeksi di T0.3, tulis ke products.json |
| Bottom sheet macet di iPhone lama | `pure-web-bottom-sheet` butuh Safari/iOS 18.2+ | Wajib CSS scroll-snap fallback (T1.2) |
| Tour muncul terus | Flag onboarded tidak tersimpan | Cek `furncfg:onboarded` + private mode toast |
| Bundle membengkak | driver/lil-gui/stats masuk entry | Pastikan dynamic import (T1.8/T2.5) |

Tambahkan baris baru di atas tabel risiko setiap bug nyata ditemukan, dengan tanggal + task ID + solusi.
