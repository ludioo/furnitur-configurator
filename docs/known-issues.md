# Known issues

## Bug / catatan implementasi
| Tanggal | Task | Gejala | Solusi |
|---|---|---|---|
| 2026-11-02 | T0.5 | `npm i @eslint/js` tanpa pin menarik v10 (peer ESLint 10) bentrok `eslint@9` | Pin `@eslint/js@9` bersama `eslint@9` |
| 2026-11-02 | T0.2 | Vite warning chunk JS ~739 KB (gzip ~190 KB) setelah scene three.js | Diharapkan (three di critical path); code-split/on-demand di T3.3 — bukan blocker acceptance |
| 2026-11-02 | T0.3 | Teks splash masih hardcode EN | Diganti i18n di T1.1 (keputusan D-UX-01) |

Belum ada isu terbuka yang memblokir acceptance T0.1 / T0.5 / T0.2 / T0.3 / T0.4.

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
