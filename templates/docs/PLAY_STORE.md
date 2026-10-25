# Rilis ke Play Store: panduan dan checklist

## Cara kerjanya
| Bagian | Isi |
|---|---|
| Game | HTML/JS biasa. Website: https://lav-studio-org.github.io/NAMA-REPO/ |
| Aplikasi Android | Capacitor, folder `android/` |
| Iklan | AdMob lewat `@capacitor-community/admob`, kode di `js/native.js` |
| Build | `.github/workflows/android.yml` setiap push ke `main` |
| APK untuk dicoba | https://github.com/Lav-Studio-Org/NAMA-REPO/releases/tag/android-latest |
| AAB untuk Play Store | Artifact run Actions, muncul setelah secret keystore dipasang |

## Strategi iklan
| Titik iklan | Jenis | Kapan muncul | Hadiah |
|---|---|---|---|
| | Rewarded | | |
| | Interstitial | Hanya di jeda antar ronde | - |

Aturan interstitial (`js/ads.js`, `POLICY`): tidak di N game pertama, paling sering tiap N game, minimal 90 detik dari iklan lain, tidak pernah di tengah permainan.

## Yang perlu dilakukan pemilik akun
1. **Kunci tanda tangan**: buat upload keystore, tambahkan 4 secret (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`) di Settings > Secrets and variables > Actions. Simpan keystore di tempat aman, di luar repo.
2. **Play Console**: daftar (USD 25), verifikasi. Akun pribadi baru: closed testing 12 penguji x 14 hari.
3. **AdMob**: tambah app, buat unit Rewarded + Interstitial, kirim App ID dan 2 unit ID. Jangan klik iklan sendiri.
4. **Listing**: ikon 512, feature graphic 1024x500, minimal 2 screenshot, deskripsi ID + EN, link privasi, rating konten, target audiens 13+, Data safety, "berisi iklan".
5. **Saat rilis**: ganti ID test di `js/ads-config.js` (`testing: false`) dan `strings.xml`, upload AAB ke Closed testing.

## Catatan teknis
- `appId`: `com.lavaruz.____` (permanen).
- `versionCode` = nomor run Actions.
- Build lokal: `npm ci && npm run android:debug` (Android SDK + JDK 21).
