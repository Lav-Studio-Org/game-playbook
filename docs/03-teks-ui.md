# 03. Teks UI Bahasa Indonesia

Pemain utama berbahasa Indonesia. Semua teks yang terlihat pemain dalam Bahasa Indonesia, kecuali istilah game yang memang sudah umum dan dipilih dengan sengaja (contoh "FEVER", "Combo").

## Nada

- **Santai dan hangat, seperti teman yang menyemangati.** Pakai "kamu", bukan "Anda". Contoh: "Tipis banget!", "Hampir!", "Ayo, sekali lagi!".
- **Pendek.** Tombol 1-3 kata. Toast maksimal satu kalimat pendek. Penjelasan aturan maksimal 2 baris di HP 360px.
- **Kata kerja di tombol**: "Main", "Lanjut", "Main lagi", "Ambil hadiah", "Tonton iklan", "Klaim".
- **Jangan menghukum.** Layar kalah memberi arah, bukan menyalahkan. Contoh LETUP! v1.3: dari "Kurang 39 · rantai terbaik x0" menjadi judul "Meleset!" + tip sesuai situasi.
- **Pesan sesuai jarak.** Jangan bilang "Hampir!" kalau baru 20% target. Pilih teks dari seberapa dekat pemain.
- **Pemain baru tidak melihat angka nol yang terasa kalah.** "Belum dimainkan" daripada "Terbaik 0"; "-" dan "Mulai streak hari ini" daripada "0 / 0"; streak hanya tampil kalau > 0.
- **Label jelas, bukan ambigu.** "Lihat hasil" daripada "Selesai" (selesai apa?).
- **Jelaskan "kenapa gagal" untuk pemain baru**, beberapa kali pertama saja: "Jalurnya terhalang, cari jalan dengan maksimal 2 belokan".
- **Angka dengan format lokal**: `n.toLocaleString('id-ID')` (1.240, bukan 1,240). Waktu `m:ss`.

## Glosarium (pakai istilah yang sama di semua game)

| Konsep | Pakai | Hindari |
|---|---|---|
| Mulai permainan | **Main** | Play, Mulai Game |
| Lanjut ke level/babak berikut | **Lanjut** | Next |
| Mengulang | **Main lagi** (setelah selesai), **Ulangi** (level yang sama) | Retry, Restart |
| Kembali ke menu | **Menu** | Home, Beranda (kecuali judul layar) |
| Jeda | **Jeda**, tombol kembali **Lanjutkan** | Pause, Resume |
| Pengaturan | **Pengaturan**: Suara, Musik, Getar | Settings, Sound |
| Iklan berhadiah | **Tonton iklan** / "Iklan berhadiah" | Watch Ad, Video |
| Iklan contoh di web | **IKLAN CONTOH** | Mock Ad |
| Hidup lagi setelah kalah | **Hidupkan lagi** / "Lanjut main" | Revive |
| Koin | **koin** | coin, gold |
| Bintang | **bintang** (★ tidak dipakai di teks, pakai ikon) | star |
| Rekor | **Rekor baru!**, **Terbaik** | High score, Best |
| Skor | **Skor** | Score, Poin (boleh di teks panjang) |
| Level | **Level**, kelompok 10 level = **Bab** | Stage, Chapter |
| Ronde dalam satu tingkat (Onet) | **Babak** | Round |
| Tingkat kesulitan | **Sangat Mudah, Mudah, Sedang, Sulit, Sangat Sulit** | Easy, Hard |
| Mode santai / waktu | **Santai**, **Kilat** | Casual, Blitz |
| Petunjuk / acak | **Petunjuk**, **Acak** | Hint, Shuffle |
| Misi harian | **Misi harian** | Daily quest |
| Tantangan harian | **Tantangan Harian** | Daily challenge |
| Hadiah harian / login | **Hadiah harian**, **Hadiah login 7 hari** | Daily reward |
| Toko | **Toko**, tema = **Tema** | Shop, Skin |
| Hapus iklan (IAP) | **Hapus iklan** | Remove ads |
| Kalah | **Game Over** (boleh, sudah umum) atau **Waktu habis!** / **Meleset!** | Kamu kalah |
| Menang | **Mantap!**, **Babak selesai!**, **Level selesai!** | You win |
| Hari beruntun | **hari beruntun** / streak | - |

## Template kalimat yang sering dipakai

- Tutorial: "Ketuk dua gambar yang sama", "Jatuhkan angka, gabungkan yang sama".
- Petunjuk target: "Letupkan 30 gelembung", "Bintang 3: 45".
- Iklan rewarded di tombol: `[ikon video] 2x koin`, `[ikon video] +30 detik`, `[ikon video] +1 Petunjuk`.
- Iklan gagal dimuat: "Iklan belum tersedia, coba lagi sebentar lagi."
- Interstitial contoh: "Lewati dalam 3", lalu "Tutup".
- Rewarded contoh: "Tunggu...", lalu "Ambil hadiah".
- Tujuan berikutnya di beranda: "Bab 4 butuh 50 bintang · kurang 3", "Bos Bab 2 menunggu".
- Misi: "Letupkan 120 gelembung", "Selesaikan 3 level", "Dapat 3 bintang 2 kali".

## Meta dan toko

- `<meta name="description">` dan `og:description` dalam Bahasa Indonesia, satu kalimat ajakan main.
- Listing Play Store ID dan EN: lihat [12-play-store.md](12-play-store.md).

## Cek cepat sebelum rilis

```sh
node scripts/check-no-emoji.js      # gagal kalau ada emoji / simbol ikon di index.html, js/, style.css
grep -rniE "\b(play|next|retry|settings|score|loading)\b" index.html js/ | grep -v "^js/.*//"
```
