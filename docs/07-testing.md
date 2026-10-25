# 07. Testing: logika, solvabilitas, smoke test, screenshot

Empat lapis tes, semuanya tanpa framework tes (Node biasa + Playwright yang sudah terpasang di sandbox).

## 1. Tes logika murni (Node, di CI)

- File `scripts/test-<logic>.js`, keluar dengan `process.exit(bad ? 1 : 0)`.
- Teknik terbaik: **bandingkan dengan implementasi brute force.** Onet: `Board.path` (jalur 2 belokan yang cepat) dibandingkan BFS penghitung belokan pada 300 papan acak. Bug yang tidak terlihat oleh tes contoh langsung ketemu.
- Invarian: jumlah ubin tetap setelah gravity, skor tidak negatif, level-data lengkap 1..MAX.

## 2. Tes solvabilitas (Node, di CI)

Untuk genre yang bisa macet (match, sambung, sliding):

1. Bot memainkan setiap tingkat x babak x orientasi ratusan kali, **persis seperti game**: hapus pasangan, terapkan gravity babak itu, acak otomatis kalau buntu.
2. Gagal kalau setelah acak otomatis tetap tidak ada langkah.
3. Fallback harus **terbukti selalu bekerja**, bukan "biasanya". Onet `forcePair()`: dua ubin pertama dalam urutan baca selalu bisa disambung (sebaris tanpa penghalang, atau keduanya naik ke tepi atas yang kosong), jadi taruh pasangan yang cocok di sana. Diuji pada 20.000 layout acak yang jarang.
4. RNG ber-seed dan seed dicetak saat gagal, supaya bisa direplay.

```yaml
# .github/workflows/test.yml
- run: node scripts/test-board.js
- run: node scripts/test-solvable.js 200
```

## 3. Test hook + smoke test (Playwright)

Setiap game mengekspos hook debug (tidak dipakai UI):

```js
window.__onet = { G, start(i, stage), skipIntro(), playOne(), setTime(s) };
window.__suika = { state, score, orbs(), drop(x), spawn(level, x, y), setMode(id), profile };
window.__letup = { state, world, cluster(), tapWorld(x, y), startLevel(L), goHome(), loginSheet() };
```

Aturan hook: `playOne()` / `tapWorld()` lewat **handler sungguhan** (bukan memanipulasi state), getter untuk state, dan setter untuk memaksa kondisi sulit dicapai (waktu habis, profil pemain lama).

`scripts/smoke.js`:
- Viewport HP 390x844 @2x `isMobile, hasTouch`, plus 360x640 (HP kecil) dan 1366x768 (desktop).
- Kumpulkan `pageerror` dan `console.error`; **gagal kalau ada**.
- `addInitScript` untuk mengisi `localStorage` (lewati tutorial) dan `window.X = { fastAds: true }`.
- Mainkan alur nyata: menu -> main -> menang -> lanjut -> kalah -> hidupkan lagi lewat iklan contoh -> jeda -> pengaturan.
- Minimal satu interaksi dengan **klik pointer sungguhan** pada elemen (bukan hanya hook), dan cek hasilnya (skor > 0).
- Cek layout: papan tidak keluar layar (`getBoundingClientRect` vs `innerWidth/innerHeight`).
- Simpan screenshot di folder output (`shots/`, di-gitignore).

```sh
python3 -m http.server 8123 &
node scripts/smoke.js http://localhost:8123/ shots
```

## 4. Screenshot semua layar untuk audit

`scripts/shots.js <w> <h> <prefix>` membuka setiap layar dan sheet (beranda baru, beranda pemain lama, main, menang, kalah, jeda, misi, toko, pengaturan, peta) di ukuran tertentu. Dipakai untuk audit UI/UX ([14-ux-audit.md](14-ux-audit.md)) dan README ([13-repo-readme.md](13-repo-readme.md)).

## Kebiasaan

- Jalankan tes logika + smoke sebelum setiap push yang menyentuh gameplay.
- Bug yang ditemukan pemain: tulis tes yang gagal dulu, baru perbaiki.
- Jangan menonaktifkan / melewati tes supaya CI hijau.
