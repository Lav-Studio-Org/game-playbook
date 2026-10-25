---
name: android-release
description: Wrap a Lav Studio web game as an Android app with Capacitor 8 and AdMob, build APK/AAB in GitHub Actions with signing from secrets, and prepare Play Store listing assets. Use when the user wants an APK, Android version, AdMob, or to publish on Play Store.
---

# Android + Play Store

Panduan: [docs/11-android-capacitor.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/11-android-capacitor.md) dan [docs/12-play-store.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/12-play-store.md). File: `templates/android/`. Contoh jalan: Lav-Studio-Org/suika-merge.

## Langkah
1. `package.json`, `capacitor.config.json` (`appId com.lavaruz.<nama>`, **permanen**, konfirmasi ke pemilik), `scripts/build-www.mjs` (daftar file eksplisit).
2. `npm i`, `npm run build`, `npx cap add android`, tempel snippet build.gradle (version dari env, signing dari env), strings.xml (`admob_app_id` TEST), manifest (meta-data AdMob, portrait). `.gitignore`: `node_modules/`, `www/`.
3. `js/native.js` + `js/ads-config.js` (TEST id, `testing: true`) dimuat sebelum `js/ads.js`.
4. `.github/workflows/android.yml`: APK debug ke release `android-latest`, AAB kalau secrets ada.
5. **Keystore**: pemilik membuat dan menyimpan; 4 secrets dipasang pemilik (sesi tidak bisa). Jangan pernah commit keystore/password atau menyalin dari folder signing project files.
6. `privacy.html` (sebut AdMob), masukkan ke build-www dan sw.js.
7. Aset store: ikon 512, feature graphic 1024x500, screenshot 1080x1920 berkapsi ID + EN dirender Playwright dari game (profil pemain lama). Simpan di project files, bukan repo kalau besar.
8. Teks listing ID + EN (judul <= 30, singkat <= 80). Isi `docs/PLAY_STORE.md` dari template dengan checklist pemilik (Play Console, 12 penguji x 14 hari, AdMob, Data safety, 13+).

## Cek
Run Actions hijau, APK terunduh dari `android-latest`. Tidak bisa dites di HP dari sandbox: minta pemilik mencoba APK (suara setelah iklan, tombol back, rotasi).
