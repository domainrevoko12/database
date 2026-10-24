# Add Database

Website **Add Database** untuk Cloudflare Pages. Menyimpan nomor WhatsApp dan token Telegram ke file `database.json` pada repository GitHub, lalu bisa dibaca lewat link **raw.githubusercontent.com**.

Fitur:
- Login password (bukan "Kilua", "Contact Support" dihapus)
- Sidebar slide-in dari tombol hamburger kiri atas: **Whatsapp Number**, **Telegram Token**, **Github Raw**, plus **Logout** di footer
- Tambah & hapus (dengan konfirmasi) nomor WhatsApp dan token Telegram
- Tabel + status pill `active` + kotak pencarian
- Token Telegram ditampilkan ter-mask, klik sel untuk melihat/menyembunyikan
- Tanpa file `.html` — shell HTML dilayani Pages Function, UI penuh dari `app.js`

---

## Struktur File

```
add-database/
├── app.js                 # frontend SPA (vanilla, tanpa build step)
├── functions/
│   └── [[path]].js        # Pages Function: API + shell HTML
├── .env                   # environment (password, session secret, GitHub)
├── .gitignore
├── database.json          # bentuk file database di repo tujuan
├── package.json           # npm scripts
├── build.mjs              # build -> dist/
├── selfcheck.mjs          # tes backend (16 assertion)
├── ui-check.mjs           # tes UI via jsdom (20 assertion)
└── local-test.mjs         # smoke test ke wrangler dev (8 assertion)
```

`npm install` → `npm run build` → upload folder `dist/` (atau `npm run deploy`).

---

## Setup Environment (`.env`)

Isi `ADMIN_PASSWORD` (atau `PW_ADMIN_LOGIN`), lalu isi konfigurasi GitHub repo database:

```env
# --- Login ---
ADMIN_PASSWORD=Riyan.123
SESSION_SECRET=kunci-rahasia-panjang-untuk-session

# --- GitHub (repo database) ---
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_USERNAME=domainrevoko12
GITHUB_REPO_NAME=database
GITHUB_FILE_PATH=database.json
GITHUB_BRANCH=main
```

| Variabel | Alias Kompatibel | Keterangan |
|---|---|---|
| `ADMIN_PASSWORD` | `PW_ADMIN_LOGIN`, `PASSWORD` | Password untuk login ke website |
| `SESSION_SECRET` | `SECRET` | Kunci penanda tangan cookie session |
| `GITHUB_TOKEN` | `GH_TOKEN`, `TOKEN` | Personal access token GitHub, minimal scope `repo` (Contents: RW) |
| `GITHUB_REPO_USERNAME` | `GITHUB_OWNER`, `GITHUB_USER` | Username / owner repo database (default: `domainrevoko12`) |
| `GITHUB_REPO_NAME` | `GITHUB_REPO`, `REPO` | Nama repo database (default: `database`) |
| `GITHUB_FILE_PATH` | `FILE_PATH` | Path file di repo (default: `database.json`) |
| `GITHUB_BRANCH` | `BRANCH` | Branch target (default: `main`) |

> Link Raw otomatis: `https://raw.githubusercontent.com/domainrevoko12/database/main/database.json`
> Repo database berisi file `database.json` dengan format:
> ```json
> { "whatsapp": [], "telegram": [] }
> ```
> *Sistem juga kompatibel dengan database lama bertipe array `[{ "number": "..." }]` secara otomatis.*

---

## Menjalankan Lokal

```bash
npm install
npm run dev
```

`build.mjs` otomatis membuat `.dev.vars` dari `.env` untuk dipakai `wrangler pages dev`. Buka `http://localhost:8788`.

---

## Deploy ke Cloudflare Pages

**Opsi A — CLI**

```bash
npm run deploy
# atau
npx wrangler pages deploy dist --project-name=add-database
```

**Opsi B — Dashboard**

1. Push repo ini ke GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. **Build command:** `npm run build`
4. **Build output directory:** `dist`
5. Settings → Environment variables → isi sama seperti `.env` (Production & Preview)
6. Deploy

> `GITHUB_TOKEN` di environment variable Pages sifatnya secret, jangan pernah ditaruh ke `app.js`.

---

## Format `database.json`

```json
{
  "whatsapp": [
    {
      "id": "uuid",
      "number": "6288985152635",
      "status": "active",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "telegram": [
    {
      "id": "uuid",
      "token": "123456789:AAxxxxx",
      "status": "active",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

Link raw otomatis: `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>`

---

## API

Semua endpoint butuh cookie session valid, kecuali `/api/login` dan `/api/me`.

| Method | Endpoint | Body / Query | Keterangan |
|---|---|---|---|
| POST | `/api/login` | `{ "password": "..." }` | Set cookie `session` (8 jam) |
| POST | `/api/logout` | — | Hapus cookie |
| GET | `/api/me` | — | `{ "authenticated": true }` |
| GET | `/api/data` | — | `{ whatsapp, telegram, rawUrl }` |
| POST | `/api/whatsapp` | `{ "number": "628..." }` | Tambah nomor (validasi 7–15 digit) |
| DELETE | `/api/whatsapp?id=<id>` | — | Hapus nomor |
| POST | `/api/telegram` | `{ "token": "..." }` | Tambah token (min. 10 karakter) |
| DELETE | `/api/telegram?id=<id>` | — | Hapus token |

---

## Test

```bash
npm test
```

Menjalankan tiga lapis uji:
- `selfcheck.mjs` — logika API, session, login, mutasi file GitHub (di-stub), konsistensi frontend↔backend
- `ui-check.mjs` — render `app.js` di jsdom: sidebar, tabel, search, modal hapus, pemanggilan API
- `local-test.mjs` — menyalakan `wrangler pages dev` lalu probe `/`, `/app.js`, `/api/*`

> Tulis-baca file GitHub sungguhan dan tampilan visual di browser asli belum ter-cover otomatis — verifikasi manual setelah deploy.

---

## Catatan Keamanan

- Token bot Telegram tersimpan polos di `database.json` (public repo = Anyone with link bisa baca). Kalau repo publik, daftar token bisa di-index. Repo privat + raw link butuh token GitHub, atau pakai token bot khusus yang nilainya disposable.
- `SESSION_SECRET` wajib diisi. Kosongkan, session bisa ditebak.
- `GITHUB_TOKEN` jangan pernah masuk ke `app.js` (frontend) — hanya backend yang boleh menyentuh GitHub.
