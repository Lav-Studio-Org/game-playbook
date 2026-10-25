# 10. Deploy ke GitHub Pages dan PWA

## Deploy: main -> gh-pages

Setiap push ke `main` di-mirror ke branch `gh-pages`, dan GitHub Pages menyajikan branch itu. Tidak perlu build.

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: git push --force origin HEAD:gh-pages
```

- Tambahkan file kosong `.nojekyll` di root supaya file disajikan apa adanya.
- **Aktifkan Pages sekali** (pemilik repo): Settings > Pages > Source "Deploy from a branch" > `gh-pages` / `/ (root)`. Di Suika ini otomatis aktif, di Onet harus manual. Sesi Claude tidak bisa mengubahnya (API Pages diblokir).
- URL: `https://lav-studio-org.github.io/<repo>/`. Semua path di game harus **relatif** (`js/game.js`, bukan `/js/game.js`).
- Sandbox tidak bisa membuka `*.github.io`; cek keberhasilan dari status run Actions.

## PWA

`manifest.webmanifest`:
```json
{
  "name": "Nama Game", "short_name": "Nama Game",
  "start_url": "./", "display": "standalone", "orientation": "portrait",
  "background_color": "#0f3d3e", "theme_color": "#0f3d3e",
  "icons": [
    { "src": "icon.svg", "sizes": "any", "type": "image/svg+xml" },
    { "src": "icon-180.png", "sizes": "180x180", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
```

`sw.js` (cache-first, refresh di belakang, hapus cache lama):
```js
const CACHE = 'namagame-v1';   // NAIKKAN setiap rilis
const ASSETS = ['./', 'index.html', 'style.css', /* semua js, font, ikon */];
```

- **Naikkan `CACHE` setiap rilis** dan tambahkan setiap file baru ke `ASSETS`. Kalau lupa, pemain tetap mendapat versi lama atau offline rusak.
- Daftarkan dengan `if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')` setelah `load`, dan jangan di `localhost` saat debugging kalau mengganggu.
- Ikon PNG dirender dari `icon.svg` dengan `scripts/icons.js` (Playwright).

## Meta sosial

`<title>`, `<meta name="description">`, `og:title`, `og:description` dalam Bahasa Indonesia. Ikon `apple-touch-icon` 180px.
