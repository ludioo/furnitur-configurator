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
- [ ] Screenshot menghasilkan PNG; di HP yang support, Share sheet muncul atau fallback unduh.

## T1.7
- [ ] Toast muncul halus lalu hilang; dengan "reduce motion" tetap muncul tanpa animasi aneh.
- [ ] Hover/fokus lama di tombol AR disabled (desktop) → tooltip terbaca.

## T1.8
- [ ] Kunjungan pertama (localStorage kosong untuk onboard): tour 3–5 langkah bisa di-Skip.
- [ ] Refresh kedua: tour tidak muncul lagi.
- [ ] Network: `driver.js` tidak ke-load sebelum tour mulai.

## T2.1
- [ ] Desktop: tombol AR disabled + pesan/tooltip.
- [ ] Android Chrome support: tombol aktif.
- [ ] iPhone Safari: tombol aktif (jalur Quick Look).

## T2.2 (Android)
- [ ] Enter AR → reticle → tap lantai → furniture muncul dengan warna/finish terkini.
- [ ] Exit AR kembali ke viewer aman.

## T2.3 (iPhone)
- [ ] Tap CTA → Quick Look membuka model; warna kira-kira sesuai swatch aktif.
- [ ] Tutup Quick Look → kembali ke halaman.

## T2.4
- [ ] Network tab: modul AR tidak ke-load sebelum CTA.
- [ ] Gagal AR → toast, app tidak blank.

## T2.5
- [ ] Tanpa `?debug=1`: tidak ada panel FPS/GUI.
- [ ] Dengan `?debug=1`: stats FPS dan/atau lil-gui muncul.
- [ ] Build produksi: AI konfirmasi debug di-dynamic-import (bukan di entry kritis).

## T3.1
- [ ] About: kredit Poly Haven, disclaimer harga, Close/Esc/backdrop.
- [ ] Fokus kembali ke pemicu setelah tutup.

## T3.2
- [ ] Umami events muncul untuk ganti warna, save, AR, bahasa (tanpa adblock).

## T3.3
- [ ] Teks Loading hilang dari DOM setelah load.
- [ ] AI laporkan transfer awal < 3 MB (atau blocker tercatat).

## T3.4
- [ ] `npm run lhci` (atau setara) dijalankan AI; skor + assert budget dilampirkan.
- [ ] Issue kritis/high yang aman sudah diperbaiki atau dicatat di known-issues.

## T3.6
- [ ] `npm run e2e` lulus: alur ganti swatch + save di viewport ~390 dan desktop.
- [ ] Spec AR fallback: di Chromium desktop, CTA AR disabled atau menampilkan pesan unsupported.
- [ ] AI kasih perintah satu baris untuk Barkah menjalankan ulang e2e.

## T3.5 (repo situs utama)
- [ ] Kartu Furniture Configurator muncul di portofolio barkahmauludi.com (tahun 2026).
- [ ] Link live ke https://configurator.barkahmauludi.com berfungsi.
- [ ] Entri APAR tidak rusak.
