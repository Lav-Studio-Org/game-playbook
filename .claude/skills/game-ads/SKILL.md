---
name: game-ads
description: Add or change ad placements in a Lav Studio game through the X.Ads layer (rewarded-first, capped interstitials, mock ads on web, AdMob via native.js). Use when adding a rewarded reward, an interstitial, or wiring AdMob.
---

# Iklan: rewarded dulu

Panduan: [docs/05-iklan.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/05-iklan.md). Kode acuan: `templates/starter/js/ads.js`, `templates/android/native.js`.

## Menambah placement rewarded
1. Nama `snake_case` yang menjelaskan hadiah (`hint_refill`, `double_coins`).
2. Tambahkan ke komentar header `js/ads.js` dan bagian Iklan di README.
3. Tombol: `class="btn ad"` + `ic('video')` + label hadiah. Tidak lebih menonjol dari aksi utama.
4. Alur:
   ```js
   if (!(await X.Ads.rewarded('hint_refill'))) return; // gagal: lapisan iklan sudah menampilkan toast
   giveReward();
   ```
5. Batasi kalau bisa dieksploitasi (sekali per ronde, maks N per hari, simpan hitungan per tanggal di profil).
6. Hentikan timer selama iklan (state jeda) dan pastikan `Sfx.duck`/`recover` tetap dipanggil oleh lapisan.

## Interstitial
Hanya lewat `X.Ads.maybeInterstitial(placement)` di jeda antar ronde (saat pemain menekan Main lagi / Menu / Lanjut). Panggil `roundFinished()` sekali per ronde selesai. Jangan ubah `POLICY` jadi lebih agresif tanpa persetujuan pemilik.

## AdMob (Android)
Ikuti skill `android-release`. ID test sampai rilis; jangan pernah klik iklan asli.

## Cek
Smoke test dengan `window.X = { fastAds: true }` harus bisa melewati setiap placement baru dan hadiahnya benar-benar masuk.
