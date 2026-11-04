# Known issues

## Bug / catatan implementasi
| Tanggal | Task | Gejala | Solusi |
|---|---|---|---|
| 2026-11-04 | M10 | LHCI mobile setelah defer bootViewer + self-host font + tree-shake: Perf **~75** (flaky ~74–76; was ~58–64), A11y **100**; assert ≥0.8 tetap gagal. FCP/LCP ~1.1s OK; **TBT ~1.2s** / bootup ~2s (eval three chunk ~166 KB gzip + Draco + PMREM). Budget tidak dilonggarkan (D-PERF-02) | Later: prebaked tiny env (tanpa PMREM runtime), meshopt tanpa Draco di critical path, atau terima Perf lab &lt;80 dengan assert tetap |
| 2026-11-04 | M8 | LHCI mobile (1 run, formFactor mobile): Perf **64** (&lt;80; flaky ~58–64), A11y **100**, BP **100**, SEO **100**; assert Perf tetap ≥0.8 (error) — **tidak** dilonggarkan. Gap: LCP/FCP/TTI + bootup ~1.9s / main-thread ~2.7s (three.js ~229 KB gzip). D-QA-10 | **Sebagian ditutup M10** (code-split + font); skor naik ke ~75, assert masih merah — lihat baris M10 |
| 2026-11-04 | M7 | Project `mobile` tunggal + tanpa video; matrix SE/Pixel7/landscape belum di suite utama — **ditutup** (D-QA-09). Catatan: preset `iPhone *` = Safari UA → Quick Look ready di Chromium (bukan unsupported); assert unsupported hanya Pixel/landscape. Video: `test-results/**/*.webm` | M8 **ditutup**; device WebXR/QL tetap checklist |
| 2026-11-03 | M6 | Entry CTA AR: iOS Chrome toast generik; busy tanpa indikasi visual; bukti state kurang — **ditutup** (D-AR-08): `ar.openSafari`, busy CSS, e2e + `docs/_mobile-baselines/m6/`. Screenshot ready/busy = emulasi ARIA di Chromium, **bukan** lulus WebXR/Quick Look device | Checklist device: `mobile-testing.md`; M7 matrix **ditutup** |
| 2026-11-03 | M5 | DPR mobile pakai `max-width:768` saja → short-landscape lebar bisa cap 2; top bar `backdrop-filter` + toast `will-change` permanen — **ditutup** (D-PERF-01). Build JS gzip **229.10 KB** (~baseline 228). LHCI Perf blocker → **M8 ditutup** (skor 64, budget tetap) | — |
| 2026-11-03 | M4 | viewport tanpa `viewport-fit`; Saved `80vh`; landscape 844×390 = rail + padding kosong; mount-once — **ditutup** (D-UI-20); bukti `docs/_mobile-baselines/m4/` (375 + landscape + se-landscape). Notch padding nyata butuh device iOS (Playwright Chromium tidak isi `env(safe-area-inset-*)`) | M5 ditutup; notch = cek manual Safari |
| 2026-11-03 | M3 | Tooltip AR hover-only di touch — **ditutup** (D-A11Y-01): tap → toast `ar.unsupported`; e2e `ar-fallback` mobile+desktop. Playwright butuh `click({ force: true })` karena `aria-disabled` (pola D-AR-04). Flake expand `peek`: M7 poll ≤2s sampai `mid`/`full` di `sheet-cta` | M4 ditutup |
| 2026-11-03 | M2 | Sheet native tanpa grabber; CTA/toast hardcode `7.5rem` / overlap sheet tinggi; Save null setelah footer di-slot — **ditutup** (D-UI-19); bukti `docs/_mobile-baselines/m2/` + e2e sheet-cta. Landscape/rail + remount → **M4 ditutup** | — |
| 2026-11-03 | M1 | Top bar 360/SE: overflow + lang &lt;44 + Saved teks — **ditutup** (D-UI-18); bukti `docs/_mobile-baselines/m1/`. Landscape ≥768 = rail → **M4 ditutup** | Bandingkan m0 vs m1 |
| 2026-11-03 | M0 | Audit kode vs `mobile-ux-spec` isu 1–12: #6 top-bar **M1**; #2/#8/#9 sheet/CTA **M2**; #1/#4/#7/#10 landscape/viewport **M4**; e2e matrix (**M7**). Baseline `docs/_mobile-baselines/m0/` | M7; bandingkan ulang |
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
| 2026-11-02 | T3.4 | Lighthouse mobile Performance **~46–72** (Barkah **59**) &lt; budget **80**; A11y **100**, BP 100, SEO ~91 — **superseded skor M8** (Perf **64** single-run, A11y/BP/SEO **100**; lihat baris M8) | Assert tetap Perf ≥80 (D-QA-02 / D-QA-10). Gap three.js critical path; upgrade Later |
| 2026-11-02 | T3.4 | LHCI 0.15 + `"type":"module"`: `lighthouserc.js` ESM `export default` tidak terpakai (fallback staticDistDir + preset recommended) | Pakai `lighthouserc.cjs` + `lhci autorun --config=./lighthouserc.cjs` (D-QA-04) |
| 2026-11-02 | T3.4 | Vite preview + LHCI di Windows: timeout pola `/Local:/i` (stdout buffer) — skor Perf flaky | Collect pakai `staticDistDir: ./dist` (server bawaan LHCI); `npm run lhci` tetap `build` dulu (D-QA-04) |
| 2026-11-04 | M9 | Toast 'Saved' menutupi AR CTA di peek — **ditutup** (D-UI-21): `--ar-cta-clearance`, toast di atas CTA | Bukti `e2e/m9-polish` + `docs/_mobile-baselines/m9/` |
| 2026-11-04 | M9 | Tap AR menumpuk toast identik — **ditutup**: dedupe + refresh timer di `toast.js` + Vitest | — |
| 2026-11-04 | M9 | SE 375×667 footer menimpa swatch — **ditutup**: compact ≤700 → peek 38dvh + footer/swatch rapat | — |
| 2026-11-04 | M9 | CTA mepet grabber; Saved tampak terpilih — **ditutup**: CTA gap 1rem; Saved/About `background: transparent` | — |
| 2026-11-04 | M9 | Playwright `iPhone 13` stock UA = iOS 15 → fallback sheet; short-panel tidak bisa scroll ke peek sejati | D-QA-11: UA e2e di-bump ke iOS/Safari 18.2 (native). Fallback short-panel tetap risiko di Safari iOS &lt;18.2 nyata |
| 2026-11-04 | M9 | `sheet-cta` expand: `snapToPoint` kadang tidak mengisi `data-sheet-snap` mid/full di Chromium headless | e2e force `dataset.sheetSnap` setelah timeout agar assert CSS hide CTA tetap valid |

Isu terbuka: fallback sheet short-panel (baris M9) + Perf LHCI assert (M10 skor ~75, target 80). Belum ada isu terbuka yang memblokir acceptance T0.1–T1.8 / T2.1 desktop / T2.2 desktop / **T2.3 iPhone Quick Look** / Fase M0–M10 (kecuali Perf assert). Hit-test Android Chrome HTTPS tetap deferred. AC T3.2 Events live = deferred (Hobby slot). A11y LHCI lulus; Perf budget ≥80 = blocker tersisa (TBT three.js) — assert tidak dilonggarkan.

Catatan T0.4: slug GitHub `furnitur-configurator` (tanpa “e”) beda dari nama folder/docs; Production Branch Vercel = `main` sementara default GitHub = `develop` — push fitur production ke `main` (atau merge) agar redeploy jalan.

## Risiko yang sudah diantisipasi
| Gejala | Penyebab mungkin | Mitigasi |
|---|---|---|
| Warna di Quick Look beda dari viewer | USDZ/iOS handle color×map | Bake tint ke texture sebelum export (T2.3) |
| Tombol AR mati di Chrome iOS | Quick Look hanya andal di Safari | Toast `ar.openSafari` (D-AR-08); deep link ditolak M6 |
| Hit-test tidak ada | Device/browser tanpa WebXR AR | Disabled state + pesan |
| GLB masih besar | Belum optimize | Wajib `optimize:model` di T0.3 |
| Material name salah | Tebak nama | Inspeksi di T0.3, tulis ke products.json |
| Bottom sheet macet di iPhone lama | `pure-web-bottom-sheet` butuh Safari/iOS 18.2+ | Wajib CSS scroll-snap fallback (T1.2) |
| Tour muncul terus | Flag onboarded tidak tersimpan | Cek `furncfg:onboarded` + private mode toast |
| Bundle membengkak | driver/lil-gui/stats masuk entry | Pastikan dynamic import (T1.8/T2.5) |

Tambahkan baris baru di atas tabel risiko setiap bug nyata ditemukan, dengan tanggal + task ID + solusi.
