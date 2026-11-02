# Architecture

## Prinsip
Single-page Vite app. Satu WebGL canvas selalu hidup. UI overlay HTML/CSS. State konfigurasi di memory + mirror localStorage. AR adalah mode sementara di renderer yang sama (WebXR) atau export one-shot (USDZ) — bukan app terpisah. Library UI/testing sesuai `tech-stack.md` (standar, bukan opsional).

## Folder
```
furniture-configurator/
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js          # atau define di vite.config.js
├── playwright.config.js
├── eslint.config.js          # flat config
├── .prettierrc
├── lighthouserc.js           # @lhci/cli budgets
├── vercel.json
├── .env.example              # VITE_UMAMI_WEBSITE_ID=
├── .github/
│   └── workflows/
│       └── ci.yml            # lint + test + build
├── scripts/
│   └── optimize-model.mjs
├── e2e/
│   ├── smoke.spec.js         # configure → swatch → save
│   └── ar-fallback.spec.js   # desktop: AR disabled / pesan
├── tests/                    # Vitest unit
│   ├── pricing.test.js
│   ├── storage.test.js
│   ├── i18n.test.js
│   └── configState.test.js
├── public/
│   ├── models/               # armchair.glb, sofa.glb
│   ├── decoders/             # draco/, basis/, meshopt_decoder.js
│   └── icons/                # favicon, apple-touch, AR badge PNG Quick Look
├── src/
│   ├── main.js
│   ├── styles/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── bottom-sheet-fallback.css  # CSS snap bila Safari < 18.2
│   ├── core/
│   │   ├── app.js
│   │   ├── state.js
│   │   ├── pricing.js        # pure functions — di-unit-test
│   │   ├── storage.js
│   │   ├── i18n.js
│   │   └── analytics.js
│   ├── scene/
│   │   ├── renderer.js
│   │   ├── camera.js
│   │   ├── lights.js
│   │   ├── loader.js
│   │   ├── product.js
│   │   └── screenshot.js
│   ├── ar/
│   │   ├── webxr.js          # dynamic import
│   │   └── usdz.js           # dynamic import
│   ├── ui/
│   │   ├── shell.js
│   │   ├── configPanel.js    # wire pure-web-bottom-sheet ATAU fallback
│   │   ├── bottomSheet.js    # detect support + mount sheet
│   │   ├── swatches.js
│   │   ├── savedList.js
│   │   ├── priceBar.js
│   │   ├── arButton.js
│   │   ├── aboutModal.js
│   │   ├── toast.js          # custom tiny toast
│   │   ├── tooltip.js        # @floating-ui/dom
│   │   ├── onboarding.js     # driver.js dynamic import
│   │   ├── motion.js         # wrapper motion/mini + reduced-motion
│   │   └── icons/            # Lucide SVG individual (ISC)
│   │       ├── save.svg
│   │       ├── share.svg
│   │       ├── camera.svg
│   │       ├── cube.svg      # AR
│   │       ├── info.svg
│   │       ├── x.svg
│   │       └── ...
│   ├── debug/
│   │   └── debugPanel.js     # lil-gui + stats — hanya ?debug=1, dynamic import
│   ├── data/
│   │   ├── products.json
│   │   └── prices.json
│   └── i18n/
│       ├── en.json
│       └── id.json
└── docs/
```

## Alur data
```
UI (swatch/select) → state.setOption() → product.apply() + priceBar.render()
                 ↘ analytics.track('variant_change')
Save → storage.saveConfig(snapshot) → savedList.render()
AR Android → ar/webxr.start(currentSceneRoot)
AR iOS → ar/usdz.exportAndOpen(currentSceneRoot)
First visit → onboarding.js import() driver.js sekali (localStorage flag)
?debug=1 → debug/debugPanel.js import() lil-gui + stats.js
```

## Bottom sheet strategy
1. Deteksi: fitur CSS scroll-driven / Safari version — jika `pure-web-bottom-sheet` didukung (Chrome/Edge 121+, Firefox 123+, Safari/iOS **18.2+**), register web component.
2. Else: aktifkan `bottom-sheet-fallback.css` (scroll-snap + peek 120 → expand) tanpa dependency.
3. Desktop ≥768: panel kanan fixed 320 px (bukan sheet).

## Routing
Hash: `#configure` (default), `#saved`, `#about`. Tidak ada router library.

## Batas modul
- `scene/*` tidak mengimpor DOM UI kecuali lewat callback yang di-inject app.js.
- `ar/*`, `ui/onboarding.js` (driver.js), `debug/*` tidak di-bundle di path kritis: `import()` saat dibutuhkan.
- `storage.js` satu-satunya yang menyentuh `localStorage` (kecuali flag onboarding `furncfg:onboarded` boleh di onboarding.js atau lewat storage helper).
- Logic harga/i18n lookup/state snapshot: pure functions agar Vitest bisa tes tanpa DOM.

## Error boundaries (UX)
- No WebGL → static poster + pesan.
- Model gagal → Retry.
- AR tidak didukung → tombol disabled + tooltip (`@floating-ui/dom`).
- localStorage gagal → toast; sisa fitur jalan.
