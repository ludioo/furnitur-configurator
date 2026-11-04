# Mobile testing

Cara membuktikan Fase M (polish UI mobile + AR entry) tanpa Barkah membaca kode. Semua angka/skor dilampirkan di `docs/progress.md` / `known-issues.md`.

## Playwright — projects

Matrix di `playwright.config.js` (**M7 done**):

| Project name | Device / viewport | Orientasi |
|---|---|---|
| `mobile-pixel7` | `devices['Pixel 7']` | portrait |
| `mobile-iphone13` | `devices['iPhone 13']` | portrait |
| `mobile-iphone-se` | `devices['iPhone SE (3rd gen)']` (375×667) | portrait |
| `mobile-landscape` | Pixel 7 + 844×390 | landscape |
| `desktop` | Desktop Chrome (regresi) | — |

Catatan: WebXR hit-test & Quick Look **tidak** bisa diverifikasi penuh di Chromium headless — tetap ada checklist perangkat nyata di bawah.

### Video & screenshot

Di `use` (atau per project mobile):

```js
screenshot: 'only-on-failure', // plus explicit page.screenshot di baseline (hanya mobile-iphone13)
video: 'on',
trace: 'on-first-retry',
```

- Folder output default Playwright: `test-results/` (sudah di `.gitignore`); video review: `test-results/**/*.webm`.
- Baseline visual review (bukan flake CI ketat dulu): `docs/_mobile-baselines/m0/` — generate lewat **`npm run e2e:baseline`** (`playwright.baseline.config.js`, D-QA-07). Spec baseline diabaikan oleh `npm run e2e` (`testIgnore`).
- Script: `npm run e2e:mobile` = empat project mobile di atas (tanpa desktop).

### Skenario wajib

| Spec | Apa yang dicek |
|---|---|
| Smoke configure | Splash hilang → canvas terlihat → ganti swatch → Save → toast "Saved" (sudah ada; jalan di semua project mobile) |
| Top bar density | Di 360/SE: tabs + lang + Saved + About tetap bisa di-tap; tidak overflow horizontal |
| Sheet snaps | Peek menampilkan harga/CTA actions tanpa potong; expand ke mid/full scroll options |
| AR CTA placement | CTA tidak menutupi swatch/footer di peek; di mid sheet CTA menghindar atau tersembunyi sesuai spec |
| Tooltip/AR message | Unsupported: tap CTA menampilkan toast atau teks `aria-live` (bukan hanya hover) |
| Saved / About | Buka/tutup; dialog tidak terpotong `vh`; Esc/backdrop |
| Landscape | Canvas tinggi usable; tidak double-scroll body |
| Desktop regress | AR disabled + tooltip/pesan (sesuaikan jika API tip berubah ke tap/toast) |

Jangan `sleep` panjang — pakai locator + `expect`.

## Lighthouse CI — mobile

`lighthouserc.cjs` + `npm run lhci` (task **M8** / lanjutan T3.4):

- Form factor **mobile** (default LHCI sering mobile; dokumentasikan eksplisit di config atau progress).
- Assert tetap: Performance ≥ 0.8 (error), Accessibility ≥ 0.9.
- Jika Perf masih < 80 karena three.js critical path: **jangan** diam-diam longgarkan budget; catat skor + blocker di `known-issues.md` (pola T3.4).
- Output: `.lighthouseci/` — lampirkan ringkasan skor di progress task.

## Manual — perangkat nyata

### Persiapan URL di HP

1. Deploy preview / production: `https://configurator.barkahmauludi.com`
2. Atau LAN: di laptop `npm run dev -- --host` (Vite), buka `http://<IP-laptop>:5173` dari HP (firewall Windows allow Node).
3. Alternatif tunnel gratis bila LAN gagal: Cloudflared quick tunnel / sejenis — **bukan** wajib berbayar ngrok; catat URL di progress.

### Android Chrome (WebXR)

- [ ] Top bar & sheet rapi di portrait 360–412
- [ ] Orbit/pinch canvas; page tidak scroll
- [ ] Ganti warna / finish / size; harga update
- [ ] Save → toast; Saved list load/delete
- [ ] Screenshot share/unduh
- [ ] CTA AR aktif (bukan `aria-disabled`) di device yang support
- [ ] Hit-test place + exit session (HTTPS wajib)
- [ ] Landscape: UI tidak hancur

### iOS Safari (Quick Look)

- [ ] Layout + sheet (native 18.2+ atau fallback)
- [ ] Safe-area notch / home indicator tidak memotong CTA/footer
- [ ] CTA AR → Quick Look dengan warna sesuai config
- [ ] Toast/pesan error jika gagal (bukan blank)
- [ ] Jangan andalkan Chrome iOS untuk Quick Look

### Cara baca hasil

| Artefak | Makna |
|---|---|
| `npm run e2e` / `e2e:mobile` hijau | Regresi layout & alur utama OK di emulasi |
| Video di `test-results/**/*.webm` | Barkah tonton tanpa DevTools |
| Screenshot baseline | Banding before/after Fase M |
| `.lighthouseci` scores | Perf/A11y vs budget |
| Checklist di atas (centang di progress) | Bukti device nyata; AI tidak boleh mengklaim WebXR/Quick Look lulus tanpa ini atau laporan Barkah |

## Perintah cepat

```bash
npm run build
npm test
npm run e2e
npm run e2e:mobile
npm run e2e:baseline
npm run lhci
npm run dev -- --host
```

Jelaskan ke Barkah dalam Bahasa Indonesia: beda emulasi Playwright vs HP fisik.
