# 09. Meta game dan retensi

Fitur di luar ronde yang membuat pemain kembali. Semuanya ada di `js/meta.js` dan memakai tanggal lokal `YYYY-MM-DD`.

| Fitur | Cara kerja | Game |
|---|---|---|
| **Koin** | Dari ronde (20-80), misi, hadiah. Dipakai untuk tema dan power-up | semua |
| **Rekor per mode / tingkat** | `profile.bests[mode]`, tampil "Rekor baru!" + konfeti | semua |
| **Bintang 1-3** | Dari ambang simulasi atau sisa waktu. Slot kosong selalu terlihat | Onet, LETUP! |
| **Peta level + gerbang bintang** | Bab terbuka dengan total bintang | LETUP! |
| **Lanjutkan** | Simpan babak terakhir yang belum tamat; tawarkan "Lanjut babak N" / "Mulai dari babak 1" | Onet |
| **Misi harian** | 3 misi dari pool, diacak dengan seed tanggal, target naik sesuai progres pemain, klaim bisa 2x lewat iklan | Suika, LETUP! |
| **Hadiah harian / login 7 hari** | Hari ke-7 hadiah besar, putus kalau bolong sehari, 2x lewat iklan | Suika, LETUP! |
| **Tantangan Harian** | Papan sama untuk semua pemain (seed dari tanggal), 1 percobaan gratis + 2 lewat iklan, streak hari beruntun | LETUP! |
| **Peti bintang** | Tiap 15 bintang: koin + power-up | LETUP! |
| **Tema** | Warna (dan tangga nada) berbeda, harga 250-1200 koin | semua |
| **Koin gratis** | Rewarded, maks 5x per hari | semua |

## Aturan

- **Selalu tunjukkan tujuan berikutnya** di beranda: satu baris "Bab 4 butuh 50 bintang · kurang 3" / "Bos Bab 2 menunggu" / progres bintang bab, bukan statistik seumur hidup.
- Angka progres yang hanya naik (total bintang) lebih baik daripada yang bisa jatuh ke 0 (streak) untuk pemain baru.
- Misi yang belum relevan disaring (contoh misi bos hanya setelah level 11).
- Klaim selalu menampilkan jumlahnya ("Klaim 60" dan tombol hijau "2x").
- Badge notifikasi kecil di tombol menu kalau ada yang bisa diklaim.
- Profil lama tidak boleh kehilangan progres saat fitur baru ditambahkan (migrasi di tempat).

## Analitik

`X.track(name, data)` sudah dipanggil di: mulai/akhir ronde, level, iklan, koin (dengan `why`), klaim misi/login/peti. Saat analitik sungguhan ditambahkan, cukup ganti isi `track`.
