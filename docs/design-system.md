# Design system

Mood: **studio furniture premium** — gelap hangat, swatch besar, tipografi bersih. Bukan game, bukan dashboard enterprise.

## Warna
| Token | Hex | Pakai |
|---|---|---|
| `--bg` | `#0F1115` | Latar app |
| `--bg-elevated` | `#1A1E26` | Panel, bottom sheet |
| `--bg-soft` | `#242A35` | Chip / input |
| `--text` | `#F3F1EC` | Teks utama |
| `--text-muted` | `#A8A29A` | Secondary |
| `--accent` | `#D4A373` | CTA, harga, fokus (oak warm) |
| `--accent-press` | `#B8895A` | Pressed |
| `--success` | `#3DDC97` | Saved / AR ready |
| `--danger` | `#E85D5D` | Delete / error |
| `--border` | `#2E3542` | Divider |
| `--swatch-ring` | `#FFFFFF` | Ring swatch aktif |

Canvas clear: `#12151C`. Lantai/ground soft shadow plane gelap, bukan grid neon.

## Tipografi
- UI: `DM Sans` (Google Fonts, OFL) — 400/500/700.
- Mono spek/harga: `IBM Plex Mono` atau `DM Mono` (OFL).
- Jangan load > 2 family. `font-display: swap`.

## Spasi & radius
Base 4 px. Panel padding 16. Radius card 12, chip 999, tombol 10. Safe-area insets untuk notch.

## Komponen
1. **Top bar** — logo teks "Configurator", product tabs (Chair / Sofa), lang EN|ID, About. Ikon dari Lucide SVG di `src/ui/icons/` (stroke currentColor, 20–24 px).
2. **Canvas** — full bleed; gesture orbit/zoom; idle auto-rotate 5 dtk.
3. **Config panel** — desktop kanan 320 px; mobile: `pure-web-bottom-sheet` (snap ~25% peek / ~55% / ~90%) **atau** CSS scroll-snap fallback (peek 120 → expand).
4. **Swatches** — lingkaran 40×40 (touch ≥44), ring 2 px saat aktif, label di bawah.
5. **Finish chips** — Fabric / Leather (teks).
6. **Size chips** — Standard / Large.
7. **Price bar** — sticky bawah panel: "Illustrative · Rp x" / "$ x".
8. **Primary CTA** — "View in your room" (accent) + ikon cube/AR.
9. **Secondary** — Save, Screenshot, Share (ikon Lucide).
10. **Saved list** — kartu nama + tanggal + thumbnail opsional (boleh tanpa thumb di MVP).
11. **Toast** — custom `toast.js`, 2.5 dtk, pojok bawah; enter/exit via `motion/mini` (opacity/transform).
12. **Tooltip** — `@floating-ui/dom` untuk AR disabled / help; max-width 240 px; kontras AA.
13. **About modal** — fokus trap, Esc, backdrop click, Close ≥44 px; buka/tutup soft dengan motion/mini.
14. **AR reticle** — lingkaran tipis putih di hit-test (hanya sesi AR).
15. **Onboarding (driver.js)** — 3–5 langkah: canvas orbit → swatch → save → AR CTA; tema overlay gelap + accent; teks dari i18n; skip + dont-show-again (`furncfg:onboarded`).
16. **Debug (`?debug=1`)** — lil-gui + stats.js pojok; tidak terlihat di produksi normal.

## Motion
Sumber: **`import { animate } from "motion/mini"`** (~3.2 KB) — https://motion.dev  
- Swatch / material change: lerp ≤150 ms (boleh di three.js loop, bukan wajib Motion).
- Sheet expand / toast / modal: Motion mini 150–220 ms, ease out.
- **Wajib** hormati `prefers-reduced-motion: reduce` → matikan auto-rotate, skip Motion (set state langsung), matikan driver.js animasi highlight bila memungkinkan.
- Jangan parallax berat; jangan Motion+ berbayar.

## Ikon
- Salin SVG individual dari **Lucide** (ISC) ke `src/ui/icons/`. Jangan install package React; jangan `lucide-static` penuh.
- Stroke 1.75–2, `currentColor`, ukuran touch target tetap di button (≥44).
- Set awal: save, share, camera, box/cube (AR), info, x, chevron, trash.

## Breakpoints
- ≤390 mobile default layout (bottom sheet).
- ≥768 panel samping.
- ≥1200 max content width canvas letterbox opsional.

## Aksesibilitas
- Kontras teks ≥ WCAG AA.
- Fokus keyboard terlihat di swatch/tombol.
- `aria-label` pada swatch warna (nama warna, bukan hanya hex).
- Tombol AR `aria-disabled` + tooltip penjelasan saat tidak support.
- Tour driver.js bisa di-Skip; jangan blokir keyboard trap permanen.
