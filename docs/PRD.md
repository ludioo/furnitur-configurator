# PRD — Furniture Configurator + AR View in Room

## Ringkasan
Web 3D product configurator furniture (kursi & sofa) mobile-first: ganti warna kain/finishing, lihat harga live (IDR/USD), simpan konfigurasi, screenshot/share, dan **View in your room** lewat AR (WebXR di Android, Quick Look di iPhone). Portofolio untuk leads freelance Upwork (three.js/WebGL configurator + AR place-in-room). Bahasa EN/ID, tanpa login, biaya $0, subdomain `configurator.barkahmauludi.com`.

## Masalah
Job freelance configurator 3D dan AR "try in room" lagi ramai, tapi portofolio Barkah masih dominan VR/safety Unity. Demo live web yang menunjukkan konfigurasi produk + AR di HP belum ada — padahal itu yang paling mudah diklik recruiter/klien.

## Audiens
1. **Klien freelance / recruiter** (utama) — cek link demo di proposal Upwork.
2. **Pengunjung portofolio** barkahmauludi.com — buka di HP, mainin warna, coba AR.
3. **Barkah sendiri** — konten Threads/LinkedIn (video pendek konfigurasi + AR).

## Tujuan & keberhasilan
| Metrik | Target |
|---|---|
| Load awal (4G mid-range) | < 3 detik sampai model interaktif |
| Transfer awal (HTML+JS+CSS+model+decoder) | < 3 MB |
| FPS | 60 desktop, ≥30 HP mid-range |
| Deploy live | `https://configurator.barkahmauludi.com` HTTPS |
| Fitur inti | Konfigurasi warna/finish + harga + save + AR place |
| Bahasa | EN/ID penuh |
| Biaya | $0 (Vercel Hobby + Umami Hobby + aset CC0) |

## Di dalam scope (MVP)
- Satu halaman: viewer 3D + panel konfigurasi (warna kain, finishing, ukuran opsional) + daftar saved configs.
- Dua produk: **ArmChair_01** (utama) dan **Sofa_01** (switcher) — keduanya Poly Haven CC0.
- Harga ilustrasi live IDR/USD mengikuti bahasa.
- Screenshot canvas + Web Share API (fallback unduh PNG).
- Save/load/delete konfigurasi di localStorage (maks 10).
- AR **View in your room**:
  - Android Chrome: WebXR `immersive-ar` + hit-test (three.js ARButton).
  - iOS Safari: USDZExporter (`quickLookCompatible`) → Quick Look via `<a rel="ar">`.
  - Desktop / browser tanpa AR: tombol disabled + penjelasan singkat.
- Toggle EN/ID; About modal (kredit CC0, tech, disclaimer harga ilustrasi).
- Umami events: `product_change`, `variant_change`, `config_save`, `ar_enter`, `screenshot`, `lang_change`.
- Onboarding singkat (driver.js, lazy) + toast + tooltip AR + bottom sheet mobile.
- Quality: Vitest unit, Playwright smoke, ESLint/Prettier, Lighthouse CI, GitHub Actions.
- Deploy Vercel + subdomain + entry portofolio (Later/terpisah di situs utama).

## Di luar scope (Later / jangan kerjakan di MVP)
- Backend, akun, checkout, pembayaran nyata.
- PDF quote lengkap (opsional Later — pola jspdf dari APAR).
- `@google/model-viewer` / Scene Viewer sebagai path utama (lihat decisions).
- `KHR_materials_variants` packing untuk Scene Viewer.
- Multi-room planner, physics, multiplayer.
- GSAP, Shepherd, Motion+ berbayar, React, TypeScript, Tailwind, Cypress/Jest/Storybook.
- Blender re-topology / UV baru (kecuali fase Later eksplisit).
- AR Pet / mini-game.

## Asumsi
- Barkah build 100% lewat Cursor/Codex; tidak menulis kode.
- DNS `barkahmauludi.com` di Vercel (sama seperti trainer) → subdomain tinggal Add Domain.
- Model Poly Haven CC0 boleh dipakai komersial tanpa atribusi wajib (atribusi tetap ditampilkan di About).
- Harga & spek **ilustrasi** (bukan katalog toko nyata).
- WebXR AR butuh Android Chrome + HTTPS + perangkat yang support `hit-test`.
- iOS Quick Look butuh Safari (atau chrome iOS yang handoff ke Quick Look) + file USDZ.

## Risiko
| Risiko | Mitigasi |
|---|---|
| Model single-material → "legs" tidak terpisah | MVP: warna kain + finish (roughness/metalness) + scale; legs sebagai Later jika mesh punya material terpisah (dicek di T0.3) |
| iOS USDZ hilangkan warna runtime | Bake tint ke canvas texture sebelum `USDZExporter.parse` (pola documented di three.js) |
| WebXR tidak support di banyak HP | Tombol AR graceful: cek `navigator.xr.isSessionSupported('immersive-ar')`; fallback teks + tetap bisa konfigurasi 3D |
| model-viewer + three peer conflict | Jangan pakai model-viewer di MVP |
| Bundle > 3 MB | Draco/meshopt + KTX2 via gltf-transform; RoomEnvironment bukan HDRI besar; lazy AR modules |
| Harga dianggap nyata | Label "Illustrative price" / "Harga ilustrasi" di UI + About |

## Referensi produk (riset visual)
- IKEA Place / IKEA web product 3D (place-in-room, swatch warna)
- Nike By You (swatch + live preview)
- Vitra / Muuto configurator (furniture, material chips)
- QuietCubes / Campooz (dari riset APAR — UI studio gelap + panel swatch)
