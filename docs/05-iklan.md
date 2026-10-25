# 05. Iklan: rewarded dulu, interstitial dibatasi

Prinsip: **banyak iklan tapi tidak mengganggu.** Hampir semua iklan dipilih sendiri oleh pemain (rewarded) dan selalu memberi hadiah yang jelas. Iklan paksa hanya di jeda antar ronde, dengan batas ketat.

Implementasi: [`templates/starter/js/ads.js`](../templates/starter/js/ads.js) (lapisan + iklan contoh) dan [`templates/android/native.js`](../templates/android/native.js) (AdMob).

## Arsitektur

```
game  ->  X.Ads.rewarded('double_coins')      ->  provider.showRewarded(placement)   -> Promise<boolean>
      ->  X.Ads.maybeInterstitial('game_over') ->  provider.showInterstitial(placement)
provider = X.nativeAdProvider (AdMob, diisi native.js di Android)  ||  mockAd (web: "IKLAN CONTOH")
```

- Semua iklan lewat **satu** lapisan. Game tidak pernah memanggil AdMob langsung.
- `rewarded()` resolve `true` hanya kalau iklan ditonton sampai selesai. Hadiah diberikan hanya kalau `true`.
- Kalau gagal: tampilkan "Iklan belum tersedia, coba lagi sebentar lagi." dan jangan beri hadiah. Jangan pernah menahan pemain menunggu iklan dimuat.
- Daftar placement ditulis di komentar header `js/ads.js` dan di README.
- Setiap request/hasil memanggil `track('ad_request' | 'ad_complete' | 'ad_failed', { kind, placement })`.
- `X.fastAds = true` (diset tes) membuat iklan contoh selesai dalam milidetik.

## Placement rewarded yang terbukti

| Placement | Game | Hadiah |
|---|---|---|
| `revive` / `time_revive` / `extra_tap` | semua | Lanjut setelah kalah, sekali per ronde, hitung mundur 6 detik |
| `double_coins` | semua | Koin hasil ronde 2x |
| `power_<id>`, `hint_refill`, `shuffle_refill` | Suika, Onet | +1 power-up saat habis |
| `daily_double`, `login_double`, `chest_double` | Suika, LETUP! | Hadiah harian / login / peti 2x |
| `mission_double` | Suika, LETUP! | Hadiah misi 2x |
| `daily_try` | LETUP! | Percobaan tambahan Tantangan Harian (maks 2) |
| `free_coins` | semua | +50 koin, maksimal 5x per hari |
| `super_blast` | LETUP! | Power-up ledakan super |

Ekonomi harus membuat rewarded berharga: satu ronde memberi 20-80 koin, power-up 25-60, tema 250-1200. Satu iklan 2x koin = kira-kira satu ronde tambahan.

## Interstitial: POLICY

```js
const POLICY = {
  firstInterstitialAfterGames: 3, // pemain baru tidak melihatnya di 3 game pertama (LETUP!: 6 level)
  gamesBetweenInterstitials: 2,   // paling sering tiap 2 game (LETUP!: 3 level)
  minSecondsBetweenAds: 90,       // tidak dalam 90 detik setelah iklan apa pun, termasuk rewarded
};
```

- Hanya di **jeda**: saat pemain menekan "Main lagi" / "Menu" / "Lanjut" setelah ronde selesai. Tidak pernah di tengah permainan, tidak saat membuka app.
- `profile.noAds` (pembelian "Hapus iklan") mematikan interstitial saja. Rewarded tetap ada karena itu pilihan pemain.
- Di web, interstitial contoh boleh dimatikan sepenuhnya (Onet) supaya versi web nyaman.

## Tampilan tombol iklan

- **Selalu hijau + ikon `#i-video` + label hadiah**: `[video] 2x koin`. Tidak ada iklan yang tersembunyi di tombol warna lain.
- Tombol iklan tidak boleh lebih menonjol dari aksi utama. Di Game Over: "Main lagi" solid aksen, "2x koin" hijau di dalam kotak koin.

## Kebijakan AdMob yang harus diingat

- Pakai ID **TEST** Google sampai rilis (`ca-app-pub-3940256099942544/...`). Jangan pernah klik iklan asli di aplikasi sendiri.
- UMP consent: `requestConsentInfo()` lalu `showConsentForm()` kalau `REQUIRED` (EEA/UK).
- Target audiens 13+ supaya aturan iklan anak tidak berlaku (kalau gamenya memang bukan untuk anak).
- Tandai "aplikasi berisi iklan" dan isi Data safety (ID iklan, info perangkat).
