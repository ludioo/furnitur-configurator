# User flows

Single page. Top bar: product switcher (Chair / Sofa), EN/ID, About. Canvas 3D tetap. Panel konfigurasi kanan/bottom sheet. Hash: `#configure`, `#saved`, `#about`.

## UF0 — Masuk & loading
1. Buka URL → splash nama "Furniture Configurator", progress % (LoadingManager), teks "Loading 3D model…".
2. Model armchair default tampil, auto-rotate pelan, panel Configure terbuka.
- **No WebGL**: poster + pesan.
- **Gagal load**: Retry.
- **> 8 dtk**: "Slow connection, still loading…".

## UF1 — Konfigurasi produk (inti)
1. Orbit/zoom (drag/pinch). Idle 5 dtk → auto-rotate.
2. Ganti product tab Chair ↔ Sofa → model diganti, opsi di-reset ke default produk itu (atau last config produk bila ada).
3. Pilih swatch warna → material fabric berubah < 150 ms; harga update.
4. Pilih Finish Fabric/Leather → roughness/metalness berubah; harga update.
5. Pilih Size Standard/Large → scale berubah; harga update.
6. Label "Illustrative price" / "Harga ilustrasi" selalu terlihat dekat harga.
7. **Save configuration** → nama (default "Config #n") → toast Saved → muncul di daftar Saved.
8. **Screenshot** → unduh PNG atau share lewat Web Share API bila ada.
9. Daftar Saved: Load / Delete. Maks 10; jika penuh, tawarkan hapus tertua.
- localStorage gagal → toast; konfigurasi tetap bisa dicoba sesi ini.

## UF2 — View in your room (AR)
1. User tap **View in your room**.
2. Capability check:
   - **Android Chrome + WebXR immersive-ar**: dynamic import `ar/webxr.js` → Enter AR → reticle hit-test → tap lantai untuk place → model dengan material terkini muncul → Exit AR kembali ke viewer.
   - **iOS Safari (Quick Look)**: dynamic import `ar/usdz.js` → export USDZ dari scene terkini → buka `<a rel="ar">` → Quick Look → user selesai → kembali ke Safari.
   - **Tidak support**: tombol disabled; teks "AR needs Chrome on Android or Safari on iPhone" + tooltip floating-ui.
3. Analytics `ar_enter` dengan `{ platform: 'webxr'|'quicklook' }`.
- Gagal export/session → toast error + tetap di viewer.

## UF3 — Bahasa
Toggle EN/ID → UI, label opsi, mata uang (USD↔IDR), pesan AR, About. Disimpan di `furncfg:lang`.

## UF4 — About
Modal: deskripsi demo, tech (three.js, WebXR, USDZ), kredit Poly Haven CC0 (ArmChair_01, Sofa_01), disclaimer harga ilustrasi, link barkahmauludi.com + GitHub. Close: tombol, Esc, backdrop.

## UF5 — Analytics
Umami tanpa cookie banner. Ad-blocker → no-op.

## UF6 — Onboarding (driver.js)
1. Kunjungan pertama (`furncfg:onboarded` kosong) → setelah model load, dynamic import driver.js → tour 3–5 langkah: orbit canvas → pilih warna → save → tombol AR.
2. User bisa **Skip** kapan saja → set flag onboarded.
3. Kunjungan berikutnya: tidak auto-start. (Opsional Later: link "Show tips" di About.)
4. `prefers-reduced-motion`: kurangi animasi highlight tour bila memungkinkan.

## UF7 — Debug
URL `?debug=1` → lil-gui + stats.js. Tanpa query → tidak ada overlay debug.
