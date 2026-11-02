# Known issues

## Bug / catatan implementasi
| Tanggal | Task | Gejala | Solusi |
|---|---|---|---|
| 2026-11-02 | T0.5 | `npm i @eslint/js` tanpa pin menarik v10 (peer ESLint 10) bentrok `eslint@9` | Pin `@eslint/js@9` bersama `eslint@9` |
| 2026-11-02 | T0.2 | Vite warning chunk JS ~739 KB (gzip ~190 KB) setelah scene three.js | Diharapkan (three di critical path); code-split/on-demand di T3.3 — bukan blocker acceptance |
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
| 2026-11-02 | UI | Layout/UX mobile (sheet, CTA, hierarchy) terasa buruk di iPhone meski fitur AR jalan | Spec mobile-first ada di design-system; implementasi Fase 1 lebih “desktop ok + sheet ada”. Polish UI mobile = task terpisah (bukan T2.4) |
| 2026-11-02 | T2.4 | AC “modul AR tidak ke-load sebelum CTA” vs warm-import USDZ Quick Look | Sengaja D-AR-07 / D-AR-06: WebXR strict lazy; `usdz` boleh warm di iOS Safari saja |
| 2026-11-02 | T3.2 | AC “Umami events muncul” belum diverifikasi live; Hobby Cloud limit **1 website** (slot sudah terpakai) | Kode wired + no-op tanpa env ID (D-AN-01/D-AN-02). Nanti: reuse situs Hobby (tambah domain configurator) atau slot baru; set `VITE_UMAMI_WEBSITE_ID` + redeploy |

Belum ada isu terbuka yang memblokir acceptance T0.1–T1.8 / T2.1 desktop / T2.2 desktop / **T2.3 iPhone Quick Look**. Hit-test Android Chrome HTTPS tetap deferred. AC T3.2 Events live = deferred (Hobby slot).

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
