# 12. Play Store: listing dan aset

Template checklist lengkap: [`templates/docs/PLAY_STORE.md`](../templates/docs/PLAY_STORE.md). Contoh nyata: `docs/PLAY_STORE.md` di suika-merge.

## Aset

| Aset | Ukuran | Cara membuat |
|---|---|---|
| Ikon | 512x512 PNG | Dirender dari gambar game sendiri (canvas / SVG) lewat Playwright (`scripts/make-art.cjs`) |
| Feature graphic | 1024x500 PNG | Latar gradasi tema + karakter game + nama game, dirender dari canvas |
| Screenshot HP | 1080x1920 (min 2, idealnya 6) | Playwright viewport 360x640 @3x dengan profil "pemain lama" yang diisi lewat `addInitScript`, papan disusun lewat test hook |
| Screenshot berkapsi | sama | Kapsi besar di atas (ID dan EN terpisah), satu manfaat per gambar |
| Ikon adaptif + splash Android | res/mipmap-*, drawable | Script yang sama, foreground di dalam safe zone (sekitar 56% dari sisi) |

Urutan screenshot yang terbukti: 1 main (momen paling seru), 2 power-up, 3 tema, 4 tantangan harian, 5 misi, 6 beranda. Simpan hasil di project files (`<game>-play-store/screenshots-id|en/`), bukan di repo kalau besar.

## Teks listing

- **Judul** maks 30 karakter, format `Nama: Penjelas` dalam dua bahasa. Contoh: "Suika Angka: Gabung Angka" / "Suika Angka: Number Merge".
- **Deskripsi singkat** maks 80 karakter: satu kalimat ajakan dengan inti mekaniknya.
- **Deskripsi panjang** maks 4000: paragraf pembuka, daftar fitur dengan kata kerja, mode, "bisa offline", tanpa klaim palsu ("#1").
- Kategori: Puzzle / Casual. Audiens 13+ (kalau bukan game anak).
- Buat listing ID sebagai bahasa default dan EN sebagai terjemahan.

## Kewajiban akun (pemilik)

- Play Console (USD 25 sekali), verifikasi identitas.
- **Akun pribadi baru: closed testing minimal 12 penguji selama 14 hari berturut-turut** sebelum boleh production.
- AdMob: tambah app (belum dipublikasikan), buat unit Rewarded + Interstitial, kirim 3 ID (App ID `~`, dua unit `/`), lengkapi pembayaran dan pajak. Setelah live, tautkan app store details.
- Isi: kuesioner rating konten (IARC), target audiens, Data safety (AdMob: ID iklan, info perangkat), "berisi iklan", link kebijakan privasi `https://lav-studio-org.github.io/<repo>/privacy.html`.

## Teks About repo

Sesi Claude tidak bisa mengubah About repo. Berikan teks siap tempel (contoh di project files `repo-settings/about-repo.md`): Description satu kalimat Indonesia, Website = URL Pages, Topics `game` `<genre>` `html5-game` `javascript` `pwa` `browser-game` `indonesia`.
