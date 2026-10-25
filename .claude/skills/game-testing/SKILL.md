---
name: game-testing
description: Add tests to a Lav Studio game: pure-logic tests vs brute force, solvability tests that play thousands of boards, a window.__game test hook, Playwright smoke tests on 3 viewports, and screenshots. Use when adding features, fixing bugs, or a board can get stuck.
---

# Tes game

Panduan: [docs/07-testing.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/07-testing.md). Contoh: Lav-Studio-Org/onet `scripts/test-board.js`, `test-solvable.js`, `smoke.js`.

## Lapisan
1. **Logika** (`scripts/test-*.js`, Node, CI): bandingkan fungsi cepat dengan brute force pada ratusan papan acak ber-seed; cek invarian.
2. **Solvabilitas** (genre yang bisa macet): bot memainkan setiap tingkat x babak sampai habis persis seperti game (termasuk gravity dan acak otomatis); gagal kalau buntu setelah acak. Fallback harus terbukti (contoh `forcePair`) dan dites di ribuan layout jarang. Cetak seed saat gagal.
3. **Test hook** `window.__<game>`: getter state, `start()`, `skipIntro()`, aksi lewat handler sungguhan (`playOne`, `tapBubble`), setter kondisi (`setTime`), posisi layar untuk klik pointer nyata.
4. **Smoke** Playwright: 390x844 mobile, 360x640, 1366x768. `addInitScript` untuk `fastAds` dan profil. Gagal pada `pageerror`/`console.error`, overflow papan, alur yang tidak sampai (menang, kalah, iklan, jeda, menu). Simpan screenshot dan **lihat** hasilnya.
5. Tambah langkah ke `.github/workflows/test.yml`.

## Aturan
- Bug -> tes yang gagal dulu.
- Jangan skip / hapus tes demi CI hijau.
- Chromium sudah terpasang di sandbox: `require('playwright')` langsung jalan, jangan `playwright install`.
