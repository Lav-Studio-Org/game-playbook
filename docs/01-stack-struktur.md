# 01. Stack dan struktur repo

## Stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Bahasa | HTML, CSS, JavaScript biasa (ES2020+) | Tidak ada build step, GitHub Pages bisa langsung menyajikan repo |
| Gambar | `<canvas>` untuk game yang bergerak (Suika, LETUP!), DOM + SVG untuk papan berpetak (Onet) | Canvas cepat untuk partikel; DOM gampang dites dan diakses |
| Fisika | Matter.js 0.20.0 di `vendor/` hanya kalau perlu | Versi terkunci, jalan offline |
| Font | Fredoka (OFL), `fonts/fredoka-latin.woff2`, `@font-face` + `<link rel="preload">` | Rapi di semua HP, offline |
| Suara | Web Audio sintetis, tanpa file audio | Ukuran kecil, nada bisa mengikuti gameplay |
| Simpan data | `localStorage`, satu kunci berversi (`<game>.profile.v1`) | Cukup untuk game kasual |
| Offline | Service worker cache-first + refresh di belakang | PWA, bisa dipasang di layar utama |
| Android | Capacitor 8 + `@capacitor-community/admob` | Bungkus web yang sama |
| Tes | Node (logika) + Playwright (browser) | Chromium sudah ada di sandbox |

## Struktur file

```
index.html            layar-layar, sprite ikon #i-*, <html lang="id">
style.css             token warna di :root, komponen .btn .icon-btn .chip
js/engine.js          LOGIKA MURNI: tanpa DOM, jalan di Node (module.exports) dan browser
js/levels.js          tabel kesulitan / data level (dipakai game + skrip)
js/levels-data.js     (opsional) hasil generator, "Do not edit by hand"
js/meta.js            profil, koin, misi, hadiah harian, event bus, track()
js/audio.js           Sfx + Music, unlock/recover/duck
js/ads-config.js      ID AdMob (TEST dulu)
js/native.js          jembatan Capacitor: AdMob, tombol back, lifecycle (tidak melakukan apa-apa di web)
js/ads.js             X.Ads: rewarded(placement), maybeInterstitial(placement), POLICY, iklan contoh
js/render.js          (canvas) gambar, partikel, getar layar
js/game.js / main.js  alur layar dan UI
sw.js                 cache offline, CACHE = '<game>-vN'
manifest.webmanifest  nama, warna, ikon
icon.svg, icon-180.png, icon-512.png
scripts/              tes, simulasi, smoke, screenshot, render ikon
docs/                 UX_AUDIT.md, LEVEL_DESIGN.md, releases/, screenshots/
.github/workflows/    pages.yml, test.yml, release.yml, (android.yml)
VERSION               contoh 1.1.0
.nojekyll             supaya Pages menyajikan file apa adanya
```

Urutan `<script>` di `index.html`: `levels/engine` -> `meta` -> `audio` -> `ads-config` -> `native` -> `ads` -> `render` -> `game`. `native.js` harus sebelum `ads.js` supaya `X.nativeAdProvider` sudah ada.

## Pola kode

- **Satu namespace global per game**: `const SA = (window.SA = window.SA || {});` di setiap file, dibungkus IIFE + `'use strict'`. Starter memakai `GG`, ganti dengan 2 huruf unik.
- **Logika murni bisa di-`require`**:
  ```js
  (function (root) {
    'use strict';
    const E = { /* ... */ };
    if (typeof module !== 'undefined' && module.exports) module.exports = E;
    else (root.GG = root.GG || {}).Engine = E;
  })(typeof window !== 'undefined' ? window : globalThis);
  ```
- **RNG ber-seed** (`mulberry32` + `hashStr`) untuk papan harian, misi harian, dan tes yang bisa diulang. Jangan pakai `Math.random()` di logika yang perlu direplay.
- **Dunia tetap** untuk canvas (LETUP! 360x640): gameplay sama di semua layar, canvas hanya di-scale. `devicePixelRatio` dibatasi 2.
- **Event bus kecil + `track()`**: `X.on`, `X.emit`, `X.track(name, data)` (no-op kecuali `X.debug`). Semua momen penting sudah memanggil `track`, jadi Firebase/GameAnalytics tinggal disambung.
- **Profil**: `DEFAULT` + `Object.assign(structuredClone(DEFAULT), raw)` saat load, `try/catch` di setiap akses storage. Field baru ditambahkan dengan migrasi di tempat (contoh LETUP! v1.2 `legacyMax`), jangan pernah menghapus progres pemain lama.
- **Komentar** dalam bahasa Inggris, menjelaskan alasan ("why"), bukan mengulang kode.
