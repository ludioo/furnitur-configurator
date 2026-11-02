# Env setup, run, build, deploy (panduan non-coder)

Kamu tidak menulis kode. Yang kamu lakukan: klik di GitHub/Vercel/Umami dan tempel nilai. Sisanya minta AI di Cursor.

## 1. Alat sekali pakai (gratis)
1. Node.js LTS / modern (Vite 6 + Vitest 5; CI GitHub Actions memakai **Node 22**) — https://nodejs.org
2. Git — https://git-scm.com
3. Cursor (sudah ada) + login GitHub
4. Akun: GitHub, Vercel (sama dengan barkahmauludi.com), Umami Cloud Hobby — https://cloud.umami.is

## 2. Jalankan lokal
Bilang ke AI: **"jalankan project ini di lokal"**. AI: `npm install` → `npm run dev` → buka `http://localhost:5173`.

### Perintah yang perlu kamu hafal (copy ke Terminal bila AI minta)
| Perintah | Arti |
|---|---|
| `npm run dev` | Jalankan app lokal |
| `npm run build` | Build produksi |
| `npm run preview` | Pratinjau hasil build |
| `npm test` | Tes logika (Vitest) — **cepat, tanpa buka browser** |
| `npm run test:watch` | Tes sambil AI coding |
| `npm run e2e` | Tes klik otomatis (Playwright) di Chrome headless |
| `npm run lint` | Cek gaya kode |
| `npm run format` | Rapikan format |
| `npm run lhci` | Audit Lighthouse + budget |
| `npm run optimize:model` | Compress model 3D |

### E2E sekali setup
Pertama kali sebelum `npm run e2e`, AI menjalankan: `npx playwright install chromium` (unduh browser tes). Tidak perlu kamu paham isinya.

## 3. Env variables
| Nama | Isi | Di mana |
|---|---|---|
| `VITE_UMAMI_WEBSITE_ID` | Website ID Umami | Vercel → Settings → Environment Variables + `.env.local` (di-.gitignore) |

Kosong = analytics mati; app tetap jalan.

## 4. GitHub
AI: buat commit pertama, repo publik `furniture-configurator`. Cursor Source Control → Publish to GitHub → Public.  
Setelah T0.5: tiap push/PR ke `main` menjalankan CI (lint + test + build) otomatis. Kalau CI merah, minta AI perbaiki sebelum merge.

## 5. Vercel (project TERPISAH)
1. Add New → Project → import `furniture-configurator`.
2. Preset **Vite**, output `dist`.
3. Env `VITE_UMAMI_WEBSITE_ID` (boleh nanti).
4. Deploy → dapat `*.vercel.app`.
5. Push ke `main` = auto redeploy.

## 6. Subdomain `configurator.barkahmauludi.com`
DNS domain utama sudah di Vercel (sama pola trainer).
1. Project furniture-configurator → Settings → Domains → Add `configurator.barkahmauludi.com`.
2. Tunggu **Valid Configuration** + HTTPS.
3. Jika minta CNAME: Domains tingkat tim → `barkahmauludi.com` → DNS → CNAME Name `configurator`, Value = hostname yang ditampilkan Vercel (jangan salin contoh lama).
4. Fallback Rumahweb hanya jika nameserver bukan vercel-dns.

Sumber: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## 7. Umami
1. Add website: name `Furniture Configurator`, domain `configurator.barkahmauludi.com`.
2. Salin Website ID → Vercel env → Redeploy.
3. Tes events `variant_change`, `ar_enter` (matikan ad-blocker).

## 8. vercel.json
Cache panjang untuk `/models/*`, `/decoders/*`.

## 9. Debug lokal
Tambahkan `?debug=1` di URL (contoh `http://localhost:5173/?debug=1`) untuk panel lil-gui + FPS. Jangan pakai ini di demo klien.

## 10. Gagal?
Screenshot / Build Logs / output `npm test` atau `npm run e2e` ke AI + "Prompt perbaikan bug" di `prompts.md`.
