# CLAUDE.md

Game ini dibuat dari template [Lav-Studio-Org/game-playbook](https://github.com/Lav-Studio-Org/game-playbook). Semua aturan di `CLAUDE.md` playbook berlaku di sini; ringkasnya:

- **Tanpa emoji / simbol teks sebagai ikon.** Pakai sprite `#i-*` di `index.html` lewat `ic('nama')`. `node scripts/check-no-emoji.js` harus lolos.
- **Warna**: hijau + ikon video = iklan berhadiah, `--accent` = aksi utama, `--gold` = koin/skor.
- **Teks UI Bahasa Indonesia** sesuai glosarium playbook (`docs/03-teks-ui.md`). Kode dan commit bahasa Inggris.
- **Iklan hanya lewat `GG.Ads`**. Placement baru: tambahkan ke header `js/ads.js` dan README.
- **Logika di `js/engine.js` tetap murni** (tanpa DOM). Ubah aturan -> jalankan `node scripts/test-engine.js` dan `node scripts/balance.js 400 --write`.
- **Audio**: jangan hapus `unlock`/`recover`/`duck` di `js/audio.js`.
- **Rilis**: naikkan `VERSION`, tulis `docs/releases/v<versi>.md`, naikkan `CACHE` di `sw.js`, tambahkan file baru ke `ASSETS`.

## Game ini

- Nama: Tangkap! (ganti)
- Namespace global: `GG` (ganti dengan 2 huruf unik di semua file `js/`)
- Kunci profil: `tangkap.profile.v1`
- Test hook: `window.__tangkap`
- URL: https://lav-studio-org.github.io/NAMA-REPO/

## Perintah

```sh
python3 -m http.server 8123 &
node scripts/test-engine.js && node scripts/check-no-emoji.js
node scripts/smoke.js http://localhost:8123/ shots
```
