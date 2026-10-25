# 11. Android: Capacitor + AdMob

Game web yang sama dibungkus Capacitor. Contoh lengkap yang sudah jalan: [Lav-Studio-Org/suika-merge](https://github.com/Lav-Studio-Org/suika-merge). File siap salin di [`templates/android/`](../templates/android/).

## Komponen

| Bagian | Isi |
|---|---|
| `package.json` | `@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor-community/admob` (semua ^8), dev `@capacitor/cli` |
| `capacitor.config.json` | `appId`, `appName`, `webDir: "www"`, `android.backgroundColor` |
| `scripts/build-www.mjs` | Menyalin file game ke `www/` (daftar FILES + DIRS eksplisit) |
| `js/native.js` | AdMob + tombol back + lifecycle, hanya aktif kalau `Capacitor.isNativePlatform()` |
| `js/ads-config.js` | ID unit AdMob, `testing: true` |
| `android/app/src/main/res/values/strings.xml` | `admob_app_id` |
| `AndroidManifest.xml` | `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id"/>`, `screenOrientation="portrait"` |
| `android/app/build.gradle` | versionCode/Name dari env, signing dari env |
| `.github/workflows/android.yml` | Build APK debug setiap push, AAB bertanda tangan kalau secrets ada |

## Langkah membuat

```sh
npm init -y && npm i @capacitor/core @capacitor/android @capacitor/app @capacitor-community/admob && npm i -D @capacitor/cli
npx cap init "Nama Game" com.lavaruz.namagame --web-dir www
node scripts/build-www.mjs && npx cap add android && npx cap sync android
```
Lalu tempel potongan di `templates/android/` (build.gradle signing + version, strings.xml, manifest meta-data). `.gitignore`: `node_modules/`, `www/`.

- **`appId` permanen** setelah upload pertama ke Play Store. Pola: `com.lavaruz.<namagame>` tanpa tanda hubung.
- `versionCode` = `github.run_number`, `versionName` = `<mayor>.<minor>.<run>`. Setiap build otomatis lebih tinggi.

## Signing tanpa rahasia di repo

```gradle
signingConfigs {
    release {
        def ks = System.getenv("ANDROID_KEYSTORE_FILE")
        if (ks) {
            storeFile file(ks)
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
}
buildTypes { release { if (System.getenv("ANDROID_KEYSTORE_FILE")) signingConfig signingConfigs.release } }
```

Secrets yang dipasang **pemilik** di Settings > Secrets and variables > Actions: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Sesi Claude tidak bisa menambah secrets.

Membuat upload keystore (sekali per aplikasi, simpan di luar repo, password acak kuat):
```sh
keytool -genkeypair -v -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 upload-keystore.jks   # isi ANDROID_KEYSTORE_BASE64
```
Kehilangan keystore = tidak bisa update aplikasi (kecuali Play App Signing reset). Jangan commit, jangan tempel di chat, jangan salin dari folder signing project.

## Build di CI

`android.yml`: Node 22 + JDK 21 (temurin), `npm ci && npm run build && npx cap sync android`, `./gradlew assembleDebug`, `bundleRelease` hanya kalau keystore ada. APK debug dipublikasikan ke release tetap `android-latest` (link stabil untuk dicoba di HP). AAB sebagai artifact run.

## native.js: hal penting

- Inisialisasi: UMP consent (`requestConsentInfo` -> `showConsentForm` kalau `REQUIRED`), lalu `AdMob.initialize`, lalu muat rewarded + interstitial di depan.
- Rewarded: dengarkan `onRewardedVideoAdReward` (earned) dan tunggu `onRewardedVideoAdDismissed`; hadiah hanya kalau earned. Muat iklan berikutnya setelah ditutup.
- Interstitial: kalau belum termuat, **langsung return false** (jangan bikin pemain menunggu).
- Timeout 120 detik untuk setiap penantian event.
- `App.addListener('backButton')` -> `X.handleBack()`, kalau `false` -> `App.exitApp()`.
- `appStateChange`: tidak aktif -> `X.pause()`, aktif -> `Sfx.recover()`.

## Sebelum rilis

1. Ganti ID test di `js/ads-config.js` (`testing: false`) dan `strings.xml` (`admob_app_id`).
2. Tambah `privacy.html` (kebijakan privasi Bahasa Indonesia + Inggris, sebut AdMob) dan masukkan ke `build-www.mjs` + `sw.js`.
3. Lanjut ke [12-play-store.md](12-play-store.md).
