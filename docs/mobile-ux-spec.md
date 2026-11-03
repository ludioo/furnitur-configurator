# Mobile UX spec

Target: HP mid-range Indonesia (Android Chrome + iOS Safari). Desktop sudah OK; Fase M memperbaiki layout & interaksi **mobile** tanpa menambah dependency di luar `docs/tech-stack.md`.

Sumber kebenaran layout visual: `docs/design-system.md`. Spec ini merinci viewport, sheet, gesture, safe-area, dan **isu yang sudah ketemu di kode** (bukan tebakan).

## Perangkat & viewport target

| Label | CSS viewport | Catatan |
|---|---|---|
| Narrow Android | 360 × 800 | Banyak HP entry; top bar paling sempit |
| iPhone 13/14 logical | 390 × 844 | Sudah dipakai Playwright `mobile` |
| Pixel-ish large | 412 × 915 | Sheet + CTA spacing |
| iPhone SE | 375 × 667 | Tinggi pendek; peek sheet & landscape risk |
| Tablet portrait | 768 × 1024 | Breakpoint rail desktop (`min-width: 768px`) |
| Landscape phone | ~844 × 390 / 800 × 360 | Canvas hampir habis jika sheet tetap tinggi |

Emulasi Playwright: lihat `docs/mobile-testing.md` (Pixel 7, iPhone 13, iPhone SE, landscape).

## Breakpoints

| Lebar | Layout |
|---|---|
| `< 768px` | Mobile: canvas full-bleed + **bottom sheet** (native `pure-web-bottom-sheet` atau CSS scroll-snap fallback) |
| `≥ 768px` | Desktop: rail kanan `--config-panel-width` (320px); AR CTA dekat pojok bawah |
| `≤ 420px` | Top bar: label About boleh icon-only (sudah ada); Saved & tabs harus tetap usable |
| Landscape + `< 768px` | Mode khusus: sheet peek lebih rendah **atau** sheet collapse + FAB config; jangan biarkan canvas < ~40% tinggi |

Jangan mengandalkan hanya `matchMedia` sekali saat mount — rotasi melewati 768 harus merespon (remount atau toggle class), lihat isu di bawah.

## Layout per layar (mobile)

### Canvas
- Full bleed di `#app`; `touch-action: none` pada canvas (orbit/dolly via camera-controls) — **jangan** biarkan page scroll vertikal pada body (`overflow: hidden` tetap).
- Padding/offset visual untuk top bar + peek sheet agar model tidak tertutup permanen (framing kamera / `fitToBox` jika perlu di task terkait).

### Top bar
- Fixed; `padding-top` + `env(safe-area-inset-top)`.
- Hierarki sempit (360): Logo singkat | tabs Chair/Sofa | lang | Saved (icon atau teks pendek) | About icon.
- Semua kontrol interaktif **≥ 44×44 CSS px** (`--touch-min`). Tombol lang saat ini `min-width: 2rem` — di bawah budget (lihat isu).

### Bottom sheet
- Snap target: **~25% peek / ~55% / ~90%** (sesuai design-system & `bottomSheet.js`).
- Peek harus menampilkan grabber + ringkasan (harga atau heading) tanpa memotong tombol Save/Screenshot.
- Footer sticky di dalam sheet: `safe-area-inset-bottom`.
- Native sheet: pastikan ada **affordances grabber** yang terlihat (fallback sudah punya; native perlu setara).

### AR CTA ("View in your room")
- Jangan hardcode `bottom: 7.5rem` saja. Offset harus mengikuti **tinggi peek sheet aktual** + safe-area, dan naik/menghindar saat sheet 55%/90% (sembunyikan, geser, atau kompres) agar tidak overlap konten sheet.
- Tap target ≥ 44px; kontras accent OK.

### Toast
- Jangan duduk di bawah sheet yang expanded. Prefer di atas peek / di bawah top bar saat sheet tinggi, atau antre di area aman.

### Saved / About
- `max-height` pakai `dvh`/`svh`, bukan `80vh` mentah (chrome URL bar mobile).
- Focus return sudah ada; trap penuh tetap deferred kecuali Fase M memutuskan sebaliknya.

## Tap targets & tipografi

- Minimum sentuh: **44×44** (`--touch-min`).
- Swatch disc 40px boleh jika hit area tombol ≥ 44 (padding).
- Label swatch ≥ ~12px efektif; `0.7rem` terlalu kecil di beberapa HP — naikkan di polish.
- Jangan andalkan `:hover` untuk info penting (lihat tooltip).

## Safe-area & viewport units

- Meta viewport wajib menyertakan **`viewport-fit=cover`** agar `env(safe-area-inset-*)` aktif di iPhone ber-notch (saat ini hanya `width=device-width, initial-scale=1.0` di `index.html`).
- Prefer **`dvh` / `svh`** untuk tinggi panel/sheet; hindari `100vh` / `80vh` untuk UI yang harus lolos address-bar show/hide.
- `#app` sudah `min-height: 100dvh` — bagus; samakan pola di Saved/modal.

## Gesture vs page scroll

- Canvas: `touch-action: none` (sudah) — orbit jangan scroll body.
- Sheet scroller: `overscroll-behavior: contain`; jangan biarkan gestur sheet mencuri pan canvas secara tidak sengaja di area handle.
- Satu jari = orbit; pinch = zoom (camera-controls). Documentkan di onboarding bila perlu.

## Performance budget (mobile)

Ikuti `.cursor/rules/performance-budget.mdc` + tambahan:

- `renderer.setPixelRatio` cap sheet/mobile **≤ 1.5** lewat `isDesktopLayout()` / `pixelRatioCap` (`layoutMode.js`) — jangan naikkan; short-landscape ikut 1.5.
- Tekstur GLB tetap ≤ 1024; jangan naikkan resolusi demi "tajam di Retina".
- Hormati `prefers-reduced-motion`.
- Target: ≥ 30 fps mid-range; transfer awal < 3 MB; LHCI mobile Perf stretch tetap 80 (blocker sudah dicatat T3.4).

## Aksesibilitas mobile

- Fokus keyboard tetap terlihat.
- Info AR unsupported harus tersedia **tanpa hover** (tap → toast atau `aria-live`, bukan hanya tooltip pointerenter).
- Tour driver.js: langkah yang targetnya di dalam sheet harus me-expand snap dulu atau skip highlight off-screen (lihat known-issues T1.8).

## Current issues found (kode)

Temuan read-only 2026-11-03 — status diperbarui setelah M0–M4:

1. **`index.html`** — **ditutup M4** (`viewport-fit=cover`). Notch nyata: cek manual Safari.
2. **`src/styles/components.css` (`.ar-cta`)** — **ditutup M2** (`--sheet-peek-height` + hide mid/full).
3. **`src/styles/components.css` (`.toast-host`)** — **ditutup M2** (naik saat sheet mid/full).
4. **`src/styles/components.css` (`.saved-panel__dialog`)** — **ditutup M4** (`80dvh`).
5. **`src/ui/tooltip.js` / AR tap** — **ditutup M3** (tap → toast `ar.unsupported`).
6. **`src/styles/layout.css` (top bar)** — **ditutup M1** (densitas &lt;768, lang ≥44).
7. **`src/ui/bottomSheet.js` remount** — **ditutup M4** (`subscribeLayoutMode` + short-landscape = sheet).
8. **`src/ui/bottomSheet.js` native grabber** — **ditutup M2** (`slot=header`).
9. **Peek/CTA drift** — **ditutup M2** (satu token `--sheet-peek-height`; native short-landscape `18svh` di M4).
10. **Landscape CSS** — **ditutup M4** (peek rendah + undo rail chrome di short-landscape).
11. **`playwright.config.js` matrix** — **masih terbuka → M7** (baseline ada di `e2e:baseline`; suite utama belum SE/Pixel7/landscape).
12. **`lighthouserc.cjs` / Perf mobile** — **masih terbuka → M8** (Perf ~59 blocker; M5 = DPR/jank saja, bukan skor LHCI).
13. **Fase M task** — **berjalan** (M0–M6 done; lanjut M7–M8).

Prioritas sisa: `M7`–`M8` di `docs/implementation-plan.md`.
