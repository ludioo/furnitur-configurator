# Acceptance criteria (dicek tanpa baca kode)

Uji di Chrome desktop + 1 HP Android + 1 iPhone bila ada.

## T0.1
- [x] localhost dari AI terbuka tanpa error.
- [x] Folder sesuai architecture.md.

## T0.5
- [x] Di terminal, `npm test` selesai tanpa gagal (boleh 1–2 tes stub dulu).
- [x] `npm run lint` selesai tanpa error.
- [x] File `.github/workflows/ci.yml` ada (AI tunjukkan isinya: lint → test → build).
- [x] AI jelaskan dalam Bahasa Indonesia: kapan menjalankan `npm test` vs `npm run e2e`.

## T0.2
- [x] Placeholder 3D (cube/kursi kasar) di studio gelap.
- [x] Orbit + zoom; tidak tembus lantai.
- [x] Idle 5 dtk → auto-rotate (mati jika OS "reduce motion").

## T0.3
- [x] Armchair lalu sofa bisa diload (switch sementara boleh via console/UI kasar).
- [x] Laporan AI: nama material body; ukuran tiap GLB; keduanya dalam anggaran.
- [x] Offline saat load → error + Retry.

## T0.4
- [ ] https://configurator.barkahmauludi.com HTTPS.
- [ ] Domain Valid Configuration di project Vercel yang benar.
- [ ] barkahmauludi.com tetap normal.
- [ ] Push main → redeploy otomatis.

## T1.1
- [x] EN/ID berganti tanpa reload; refresh tetap.
- [x] Ikon top bar / tombol terlihat tajam (SVG), bukan kotak pecah.

## T1.2
- [x] 6 swatch mengubah warna armchair instan; touch target ≥44 px di HP.
- [x] Di HP: panel bisa di-drag/snap (peek → expand); di desktop panel di kanan.
- [x] Jika AI laporkan Safari tua: fallback CSS tetap bisa dibuka/tutup tanpa macet.

## T1.3
- [x] Finish Fabric/Leather & Size mengubah tampilan + (nanti) harga.
- [x] Tab Chair/Sofa mengganti model tanpa crash.

## T1.4
- [x] Harga IDR/USD ikut bahasa; label Illustrative/Harga ilustrasi terlihat.
- [x] `npm test` memuat tes pricing yang lulus.

## T1.5
- [x] Save → muncul di list; refresh persist; load restore; delete hilang; empty state.
- [x] `npm test` memuat tes storage yang lulus.

## T1.6
- [x] Screenshot menghasilkan PNG; di HP yang support, Share sheet muncul atau fallback unduh.

## T1.7
- [x] Toast muncul halus lalu hilang; dengan "reduce motion" tetap muncul tanpa animasi aneh.
- [x] Hover/fokus lama di tombol AR disabled (desktop) → tooltip terbaca.

## T1.8
- [x] Kunjungan pertama (localStorage kosong untuk onboard): tour 3–5 langkah bisa di-Skip.
- [x] Refresh kedua: tour tidak muncul lagi.
- [x] Network: `driver.js` tidak ke-load sebelum tour mulai.

## T2.1
- [x] Desktop: tombol AR disabled + pesan/tooltip.
- [ ] Android Chrome support: tombol aktif.
- [ ] iPhone Safari: tombol aktif (jalur Quick Look).

## T2.2 (Android)
- [ ] Enter AR → reticle → tap lantai → furniture muncul dengan warna/finish terkini.
- [ ] Exit AR kembali ke viewer aman.

> Kode T2.2 merged 2026-11-02 (desktop no-regression OK). Kedua checkbox di atas deferred sampai ada Android Chrome HTTPS — lihat `docs/known-issues.md`.

## T2.3 (iPhone)
- [x] Tap CTA → Quick Look membuka model; warna kira-kira sesuai swatch aktif.
- [x] Tutup Quick Look → kembali ke halaman.

> Diverifikasi Barkah 2026-11-02: Safari iPhone + live HTTPS. Catatan: UI mobile overall masih buruk (di luar AC T2.3) — polish terpisah.

## T2.4
- [x] Network tab / build: chunk `webxr-*` & `usdz-*` terpisah dari entry; WebXR tidak preload sebelum CTA (desktop).
- [x] Gagal AR → toast, app tidak blank.

> Catatan D-AR-07: di iOS Safari, warm-import `usdz` sebelum tap CTA sengaja (D-AR-06) — bukan regresi.

## T2.5
- [x] Tanpa `?debug=1`: tidak ada panel FPS/GUI.
- [x] Dengan `?debug=1`: stats FPS dan/atau lil-gui muncul.
- [x] Build produksi: AI konfirmasi debug di-dynamic-import (bukan di entry kritis).

## T3.1
- [x] About: kredit Poly Haven, disclaimer harga, Close/Esc/backdrop.
- [x] Fokus kembali ke pemicu setelah tutup.

## T3.2
- [x] Kode analytics: no-op tanpa `VITE_UMAMI_WEBSITE_ID`; events wired (`product_change`, `variant_change`, `config_save`, `ar_enter`, `screenshot`, `lang_change`) — Vitest + build OK.
- [ ] Umami events muncul di dashboard untuk ganti warna, save, AR, bahasa (tanpa adblock) — **ditunda** (Hobby 1 website; lihat known-issues T3.2).

## T3.3
- [x] Teks Loading hilang dari DOM setelah load.
- [x] AI laporkan transfer awal < 3 MB (atau blocker tercatat). — ~1.46 MB raw / ~0.9 MB wire-ish (HTML+CSS+JS gzip+armchair+Draco); lihat progress T3.3

## T3.4
- [x] `npm run lhci` (atau setara) dijalankan AI; skor + assert budget dilampirkan. — AI: Perf ~46–72 / A11y 100; Barkah: Perf 59, tanpa timeout server; A11y assert OK; Perf &lt;80 → known-issues
- [x] Issue kritis/high yang aman sudah diperbaiki atau dicatat di known-issues. — meta description, favicon.svg, skip tour webdriver; Perf gap dicatat; collect = staticDistDir

## T3.6
- [x] `npm run e2e` lulus: alur ganti swatch + save di viewport ~390 dan desktop. — 3 passed / 1 skipped (AR mobile skip)
- [x] Spec AR fallback: di Chromium desktop, CTA AR disabled atau menampilkan pesan unsupported.
- [x] AI kasih perintah satu baris untuk Barkah menjalankan ulang e2e.

## T3.5 (repo situs utama)
- [ ] Kartu Furniture Configurator muncul di portofolio barkahmauludi.com (tahun 2026).
- [ ] Link live ke https://configurator.barkahmauludi.com berfungsi.
- [ ] Entri APAR tidak rusak.

## M0 (baseline mobile)
- [x] Isu di `mobile-ux-spec` "Current issues found" diaudit vs kode; yang masih valid tercatat di known-issues.
- [x] Folder `docs/_mobile-baselines/m0/` berisi PNG + WEBM untuk 360 / 390 / 375 / landscape.
- [x] Perintah: `npm run e2e:baseline` (tidak mengubah hasil `npm run e2e`).
