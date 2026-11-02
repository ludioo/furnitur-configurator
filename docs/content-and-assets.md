# Content & assets

## Produk 3D (wajib CC0)
| ID file output | Sumber | Halaman | Lisensi | Catatan |
|---|---|---|---|---|
| `public/models/armchair.glb` | Poly Haven **ArmChair_01** glTF 1k | https://polyhaven.com/a/ArmChair_01 | CC0 (https://polyhaven.com/license) | Primari; ~6K tris; unduh via API files |
| `public/models/sofa.glb` | Poly Haven **Sofa_01** glTF 1k | https://polyhaven.com/a/Sofa_01 | CC0 | Produk kedua |
| Cadangan | **sofa_03** | https://polyhaven.com/a/sofa_03 | CC0 | Pakai jika Sofa_01 gagal UV/material; Mixos catat ~8K tris, 2 materials |

API contoh: `https://api.polyhaven.com/files/ArmChair_01` → pilih `gltf` → `1k` → url unduhan.

Kredit About (meski CC0 tidak wajib): "ArmChair_01 & Sofa_01 by Poly Haven (CC0)".

## Font
- DM Sans — Google Fonts, SIL OFL.
- DM Mono atau IBM Plex Mono — OFL.

## Ikon
- **UI icons:** salin SVG individual dari **Lucide** (ISC) ke `src/ui/icons/` — https://lucide.dev · https://github.com/lucide-icons/lucide. Jangan `lucide-static` penuh; jangan package React. Set awal: save, share, camera, box (AR), info, x, chevron, trash. Kredit About: "Icons by Lucide (ISC)".
- Favicon sederhana SVG/PNG buatan sendiri (boleh turunan Lucide).
- Badge Apple Quick Look: buat glyph "AR" sederhana sendiri (hindari aset proprietary Apple).

## Teks UI inti (ringkas — lengkap di i18n JSON saat implementasi)
| Key | EN | ID |
|---|---|---|
| app.title | Furniture Configurator | Konfigurator Furnitur |
| cta.ar | View in your room | Lihat di ruanganmu |
| cta.save | Save configuration | Simpan konfigurasi |
| cta.screenshot | Screenshot | Screenshot |
| price.illustrative | Illustrative price | Harga ilustrasi |
| ar.unsupported | AR needs Chrome on Android or Safari on iPhone | AR butuh Chrome di Android atau Safari di iPhone |
| about.disclaimer | Prices are illustrative for portfolio demo, not a real store. | Harga bersifat ilustrasi untuk demo portofolio, bukan toko nyata. |

## Swatch nama
Sand/Pasir, Terracotta/Terakota, Forest/Hijau hutan, Slate/Abu, Ivory/Gading, Navy/Navy.

## Yang tidak boleh
- Foto stock berbayar.
- Model Sketchfab restricted / Poly Pizza non-CC0 tanpa cek ulang.
- HDRI besar di production path (pakai RoomEnvironment).
