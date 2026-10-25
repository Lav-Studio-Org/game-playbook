# Potongan Android (Capacitor + AdMob)

Panduan lengkap: [`docs/11-android-capacitor.md`](../../docs/11-android-capacitor.md). Contoh yang sudah jalan: [suika-merge](https://github.com/Lav-Studio-Org/suika-merge).

| File | Taruh di |
|---|---|
| `package.json` | root repo game (ganti `NAMAGAME`) |
| `capacitor.config.json` | root (ganti `appId`, permanen setelah upload pertama) |
| `build-www.mjs` | `scripts/build-www.mjs` (sesuaikan daftar FILES/DIRS) |
| `native.js`, `ads-config.js` | `js/` (starter sudah punya keduanya) |
| `workflows/android.yml` | `.github/workflows/android.yml` (ganti `NAMAGAME`) |
| `build.gradle.snippet` | tempel ke `android/app/build.gradle` |
| `strings.xml.snippet`, `AndroidManifest.snippet.xml` | tempel ke file Android yang sesuai |

Urutan: `npm i` -> `npx cap init` -> `npm run build` -> `npx cap add android` -> tempel snippet -> `npx cap sync android` -> push. Secrets keystore dipasang pemilik repo.
