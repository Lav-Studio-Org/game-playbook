# 14. Audit UI/UX

Setiap game melewati minimal satu audit sebelum dianggap siap rilis. Ketiga game mendapat perbaikan terbesarnya dari sini (ikon emoji, warna iklan, timer yang tercuri, peta yang terlalu panjang, layar kalah yang menghukum).

## Cara

1. Ambil screenshot **semua layar** (beranda baru, beranda pemain lama, tutorial, main tiap tingkat, menang, kalah, jeda, iklan contoh, toko, misi, pengaturan, peta) di 360x640, 390x844, dan desktop (`scripts/shots.js`).
2. Lihat setiap screenshot sebagai senior UI/UX designer yang fokus ke pemain baru di menit pertama. Pakai skill `design:design-critique` kalau tersedia.
3. Tulis `docs/UX_AUDIT.md` (template: [`templates/docs/UX_AUDIT.md`](../templates/docs/UX_AUDIT.md)) dengan bagian: Konteks, Kesan pertama, Usability (tabel Temuan / Tingkat / Rekomendasi), Hierarki visual, Konsistensi, Aksesibilitas, Yang sudah bagus, Prioritas.
4. Kerjakan prioritas, lalu screenshot ulang dan bandingkan.
5. Versi audit berikutnya: `docs/UX_AUDIT_v13.md` dst, jangan menimpa yang lama.

## Pertanyaan yang selalu ditanyakan

- Apakah ada emoji / simbol teks sebagai ikon?
- Apakah warna tombol mengikuti aturan (hijau+video = iklan)? Apakah aksi utama paling menonjol?
- Apakah pemain baru tahu **apa targetnya** dan **di mana mengetuk** dalam 5 detik?
- Apakah aturan baru dijelaskan dengan banner yang menghentikan waktu?
- Apakah info penting (waktu, target, arah geser, sisa pasangan) **terus terlihat**?
- Apakah ada toast / banner yang menutupi HUD, timer, atau papan?
- Apakah layar menang menunjukkan apa yang masih bisa dikejar? Apakah layar kalah memberi tips?
- Apakah ada angka 0 / bintang abu-abu yang membuat pemain baru merasa gagal?
- Apakah ada tombol ikon tanpa label teks di layar hasil?
- Target sentuh >= 44px? Kontras teks sekunder AA? `aria-label`? reduced motion?
- Di desktop: apakah HUD menempel ke tepi? Apakah papan memakai ruang dengan baik?

## Tingkat

| Tingkat | Arti |
|---|---|
| Kritis | Membuat pemain bingung / dirugikan atau membuat game terlihat belum jadi. Wajib diperbaiki sebelum rilis |
| Sedang | Mengganggu alur atau kejelasan |
| Kecil | Polish |
