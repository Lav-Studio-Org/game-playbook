# 16. Jebakan yang sudah pernah terjadi

Daftar masalah nyata dari tiga game pertama, supaya tidak terulang.

## Gameplay dan logika

| Masalah | Game | Pelajaran |
|---|---|---|
| Papan buntu tanpa langkah walau sudah diacak | Onet | Acak 200x lalu fallback `forcePair()` yang terbukti; tes 50.000 papan di CI |
| Bintang 3 mustahil di level awal, terlalu mudah di level akhir | LETUP! | Ambang bintang dari kuantil simulasi, bukan "habiskan semua" |
| Kesulitan naik turun acak | LETUP! | Kurva peluang terencana + generator |
| Bola menembus dinding (tunneling) saat banyak bola | Suika (Gelas) | Dinding fisika tebal 80px di luar area terlihat |
| Toast "Babak 1" menutupi timer dan waktu sudah berjalan | Onet | Banner aturan + timer menunggu |
| Pemain lupa aturan geser di tengah babak | Onet | Chip arah permanen di HUD |
| Mode yang tidak disukai pemilik (Goyang) | Suika | Fitur eksperimental gampang dihapus kalau tiap mode terisolasi di `MODES` |
| Combo terbawa antar drop di mode waktu | Suika (Kilat) | Reset combo per aksi kalau aturan mode membutuhkannya |

## Audio

| Masalah | Pelajaran |
|---|---|
| Suara hilang setelah ronde pertama / layar mati / telepon | `unlock()` di setiap pointerdown, `'interrupted'`, `visibilitychange`, context baru di Android ([04-audio.md](04-audio.md)) |
| Musik "meledak" setelah tab kembali | Scheduler melompat kalau tertinggal |

## UI

| Masalah | Pelajaran |
|---|---|
| Emoji tampil beda di tiap HP | Sprite SVG sendiri |
| Tombol iklan 3 gaya berbeda | Satu aturan: hijau + video |
| Badge jumlah merah terbaca sebagai error | Badge netral gelap |
| Teks sekunder `opacity .6` gagal kontras | Warna solid `--ink-2` |
| Tombol tutup 36px | Minimal 44px |
| Peta 200 level terlalu panjang | Ringkas bab jauh |
| "Terbaik 0" dan bintang abu-abu untuk pemain baru | "Belum dimainkan" |
| `-webkit-text-stroke` tebal pada Fredoka meninggalkan titik di dalam huruf | Outline judul pakai beberapa `text-shadow` |
| Screenshot README: emas berubah pink setelah dikuantisasi | `quantize(256, method=FASTOCTREE)` |
| Komentar HTML berisi `<svg` ikut tersalin saat menempel sprite | Tempel mulai dari `<svg width="0"`, cek screenshot |

## Infrastruktur / sesi Claude

| Masalah | Pelajaran |
|---|---|
| Tidak bisa membuat repo | Minta pemilik membuat repo kosong di org, lalu `add_repo` dan push |
| Pages tidak aktif setelah push gh-pages | Pemilik aktifkan manual di Settings > Pages |
| Push tag / buat release ditolak 403 | `VERSION` + `release.yml` |
| Tidak bisa set secrets / About / topics | Beri teks dan langkah siap tempel |
| `*.github.io` tidak bisa dibuka dari sandbox | Cek status Actions |
| Repo dipindah ke org, nama sama di akun pribadi | Push ke remote lama tetap di-redirect; URL Pages pindah ke `lav-studio-org.github.io` |
| Lupa naikkan `CACHE` service worker | Pemain dapat file lama; masukkan ke checklist rilis |
| `upload-keystore.jks` dan password ada di project files | Jangan pernah disalin ke repo, chat, atau dokumen |
