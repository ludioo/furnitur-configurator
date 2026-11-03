# Progress

MVP fitur (T0–T3.6) selesai kecuali T3.5 portfolio. Fase M: **M0–M4 done**. **Berikutnya: M5** (perf pass fokus mobile).

| Task | Status | Tanggal | Catatan |
|---|---|---|---|
| Doc pack | done | 2026-11-02 | Pack dibuat Neo; UI/QA libs ditambahkan 2 Nov 2026 |
| T0.1 | done | 2026-11-02 | Scaffold Vite + three + camera-controls; stub runtime folder; `npm run build` hijau |
| T0.5 | done | 2026-11-02 | ESLint 9 flat + Prettier 3 + Vitest 5 + CI Node 22; stub `tests/pricing.test.js` |
| T0.2 | done | 2026-11-02 | Scene WebGL full-bleed + RoomEnvironment/PMREM + camera-controls idle 5s; box accent + ground; reduced-motion |
| T0.3 | done | 2026-11-02 | Draco+WebP GLB armchair 391 KB / sofa 183 KB; bodyMaterialNames Armchair_01 / Sofa_01; splash+Retry; `__furncfgLoad` |
| T0.4 | done | 2026-11-02 | `vercel.json` cache models/decoders; `origin/main` + Vercel project terpisah; https://configurator.barkahmauludi.com HTTPS live |
| T1.1 | done | 2026-11-02 | Top bar + EN/ID persist + Lucide SVG lokal + About stub + hash #configure; acceptance OK Barkah |
| T1.2 | done | 2026-11-02 | Bottom sheet native/fallback + desktop rail 320px; 6 swatch tint bodyMaterialNames; Vitest state; acceptance OK Barkah |
| T1.3 | done | 2026-11-02 | Finish/Size chips + tab Chair/Sofa; session restore opsi; stale-load guard + dispose; acceptance OK Barkah |
| T1.4 | done | 2026-11-02 | priceBar sticky + pricing.js (compute/format) + Vitest; IDR↔USD ikut bahasa |
| T1.5 | done | 2026-11-02 | save/load/delete max 10 + last restore + toast tipis; `tests/storage.test.js` |
| T1.6 | done | 2026-11-02 | Screenshot PNG render-once; desktop unduh, mobile Web Share (D-SHOT-02); analytics `screenshot`; acceptance OK Barkah |
| T1.7 | done | 2026-11-02 | motion/mini + toast/modal polish + floating-ui tooltip; AR CTA stub disabled; +~10 KB gzip JS; acceptance OK Barkah |
| T1.8 | done | 2026-11-02 | Lazy driver.js tour 4 langkah + `furncfg:onboarded`; chunk terpisah di build; acceptance OK Barkah |
| T2.1 | done | 2026-11-02 | Capability WebXR + Safari iOS heuristic; tombol disabled/ready; Vitest arCapability; desktop + tooltip OK Barkah; HP device deferred; tour CSS after driver.css (kontras) |
| T2.2 | done | 2026-11-02 | WebXR immersive-ar + hit-test + reticle; place root live; dynamic import chunk `webxr`; desktop viewer + aria-disabled OK; hit-test nyata deferred ke Android Chrome HTTPS |
| T2.3 | done | 2026-11-02 | USDZExporter + Quick Look; acceptance OK Barkah (Safari iPhone live). UI mobile overall masih jelek — polish terpisah (bukan T2.3) |
| T2.4 | done | 2026-11-02 | Promise cache webxr/usdz + busy/toast.arFail; ar_enter sukses; warm Quick Look tetap; chunk terpisah build |
| T2.5 | done | 2026-11-02 | lil-gui + stats hanya `?debug=1|true`; chunk terpisah build |
| T3.1 | done | 2026-11-02 | About UF4: Poly Haven + Lucide + disclaimer + tech + links; Esc/backdrop/Close; fokus return ke About; trap tetap deferred |
| T3.2 | done | 2026-11-02 | Kode + Vitest OK (`initAnalytics`/`lang_change`); **live Umami ditunda** — Hobby 1 website (slot penuh); tanpa `VITE_UMAMI_WEBSITE_ID` = no-op |
| T3.3 | done | 2026-11-02 | Splash clear text + aria-hidden; on-demand RAF; `/assets` cache; transfer awal ~1.46 MB raw / ~0.9 MB wire-ish (HTML+CSS+JS gzip+armchair+Draco); lazy AR/driver/debug tetap chunk terpisah; JS gzip 228 KB |
| T3.4 | done | 2026-11-02 | `@lhci/cli` 0.15.1 + `lighthouserc.cjs` (`staticDistDir: ./dist`); Barkah verify: tanpa timeout server, Perf **59** (&lt;80 blocker), A11y assert OK sebelumnya **100**; fix aman: meta description, favicon.svg, skip tour `navigator.webdriver` |
| T3.6 | done | 2026-11-02 | `@playwright/test` 1.64 + smoke (390+desktop) + AR fallback desktop; `npm run e2e` 3 passed / 1 skipped |
| T3.5 | pending | — | Repo situs utama |
| M0 | done | 2026-11-03 | Audit isu 1–12 masih valid (#6/#13 partial). Baseline: `npm run e2e:baseline` → `docs/_mobile-baselines/m0/` (360/390/375/landscape `.png`+`.webm`). Temuan visual: top bar + CTA overlap di 360; landscape 844px kena rail desktop (≥768) |
| M1 | done | 2026-11-03 | Top bar densitas &lt;768: brand hide + Saved/About icon-first; lang ≥44; bukti `docs/_mobile-baselines/m1/` (360/375); `BASELINE_TAG` di e2e baseline |
| M2 | done | 2026-11-03 | Grabber native + footer slot; `--sheet-peek-height`; CTA hide / toast naik saat mid/full; bukti `docs/_mobile-baselines/m2/` + `e2e/sheet-cta.spec.js`; `npx playwright test --project=mobile` 3 passed / 1 skipped |
| M3 | done | 2026-11-03 | Tap AR unsupported → `showToast(ar.unsupported)` (aria-live); tooltip hover desktop tetap; e2e mobile tap + desktop hover/click (`force` karena aria-disabled) |
| M4 | done | 2026-11-03 | `viewport-fit=cover`; Saved `80dvh`; short-landscape = sheet + peek `18svh` (bukan rail); remount rail↔sheet via `subscribeLayoutMode`; bukti `docs/_mobile-baselines/m4/` (+ se-landscape); Vitest `layoutMode` |
| M5 | pending | - | Perf pass fokus mobile |
| M6 | pending | - | AR entry UX mobile |
| M7 | pending | - | Playwright mobile projects + video |
| M8 | pending | - | LHCI mobile + docs |

Status: `pending` | `in_progress` | `done` | `blocked`
