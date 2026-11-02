# Data model

Teks bilingual: `{ "en": "...", "id": "..." }`. Semua harga `illustrative: true`.

## products.json
```json
{
  "products": [
    {
      "id": "armchair",
      "label": { "en": "Armchair", "id": "Kursi" },
      "modelUrl": "/models/armchair.glb",
      "bodyMaterialNames": ["<diisi T0.3 setelah inspeksi GLB>"],
      "defaultScale": 1.0,
      "basePrice": { "IDR": 1850000, "USD": 119, "illustrative": true },
      "options": {
        "fabricColor": [
          { "id": "sand", "hex": "#D4C4A8", "label": { "en": "Sand", "id": "Pasir" }, "priceAdd": { "IDR": 0, "USD": 0 } },
          { "id": "terracotta", "hex": "#C56A4A", "label": { "en": "Terracotta", "id": "Terakota" }, "priceAdd": { "IDR": 50000, "USD": 5 } },
          { "id": "forest", "hex": "#3F5D4E", "label": { "en": "Forest", "id": "Hijau hutan" }, "priceAdd": { "IDR": 50000, "USD": 5 } },
          { "id": "slate", "hex": "#5B6570", "label": { "en": "Slate", "id": "Abu" }, "priceAdd": { "IDR": 0, "USD": 0 } },
          { "id": "ivory", "hex": "#F0E6D8", "label": { "en": "Ivory", "id": "Gading" }, "priceAdd": { "IDR": 0, "USD": 0 } },
          { "id": "navy", "hex": "#2C3E5A", "label": { "en": "Navy", "id": "Navy" }, "priceAdd": { "IDR": 75000, "USD": 6 } }
        ],
        "finish": [
          { "id": "fabric", "label": { "en": "Fabric", "id": "Kain" }, "roughness": 0.85, "metalness": 0.0, "priceAdd": { "IDR": 0, "USD": 0 } },
          { "id": "leather", "label": { "en": "Leather", "id": "Kulit" }, "roughness": 0.45, "metalness": 0.05, "priceAdd": { "IDR": 350000, "USD": 25 } }
        ],
        "size": [
          { "id": "standard", "scale": 1.0, "label": { "en": "Standard", "id": "Standar" }, "priceAdd": { "IDR": 0, "USD": 0 } },
          { "id": "large", "scale": 1.12, "label": { "en": "Large", "id": "Besar" }, "priceAdd": { "IDR": 250000, "USD": 18 } }
        ]
      }
    },
    {
      "id": "sofa",
      "label": { "en": "Sofa", "id": "Sofa" },
      "modelUrl": "/models/sofa.glb",
      "bodyMaterialNames": ["<diisi T0.3>"],
      "defaultScale": 1.0,
      "basePrice": { "IDR": 4250000, "USD": 279, "illustrative": true },
      "options": { "...sama struktur...": "salin pola armchair dengan id warna sama" }
    }
  ]
}
```
Catatan: nilai harga placeholder; Barkah boleh koreksi di Sanity/JSON nanti. Label UI wajib "Illustrative price".

## Konfigurasi aktif (memory — `state.js`)
```json
{
  "productId": "armchair",
  "fabricColor": "sand",
  "finish": "fabric",
  "size": "standard"
}
```
`priceSnapshot` dihitung: `base + Σ priceAdd` untuk IDR & USD.

## localStorage (prefix `furncfg:`, `schemaVersion: 1`)
| Key | Isi |
|---|---|
| `furncfg:lang` | `"en"` / `"id"` |
| `furncfg:configs` | `[{ id, name, createdAt, productId, fabricColor, finish, size, priceSnapshot }]` maks 10 |
| `furncfg:last` | konfigurasi terakhir (auto-restore on load) |

## Material mapping
Di T0.3 AI wajib: load GLB → log semua `mesh.name` + `material.name` → pilih material yang di-tint (fabric) → tulis nama pastinya ke `bodyMaterialNames`. Jika ada material kaki terpisah, catat di `decisions.md` sebagai kandidat opsi "Legs" Later.
