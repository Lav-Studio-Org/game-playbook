---
name: game-copy-id
description: Write or review Indonesian in-game UI text (buttons, toasts, banners, result screens, store text) for Lav Studio games using the shared glossary and tone. Use when adding UI strings or when asked to cek/perbaiki teks.
---

# Teks UI Bahasa Indonesia

Panduan dan glosarium lengkap: [docs/03-teks-ui.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/03-teks-ui.md).

## Aturan cepat
- "kamu", santai, menyemangati. Tombol 1-3 kata kerja: **Main, Lanjut, Main lagi, Ulangi, Menu, Jeda, Lanjutkan, Klaim, Tonton iklan**.
- Istilah tetap: Pengaturan (Suara, Musik, Getar), Petunjuk, Acak, Koin, Bintang, Rekor baru!, Terbaik, Level/Bab, Babak, Misi harian, Tantangan Harian, Hadiah harian, Toko, Tema, Hapus iklan, IKLAN CONTOH.
- Tidak menghukum: layar kalah memberi judul ringan ("Meleset!", "Waktu habis!") dan tip. Pesan sesuai jarak ("Tipis banget!" / "Hampir!" / "Ayo, sekali lagi!").
- Pemain baru tidak melihat nol yang terasa kalah: "Belum dimainkan", "-", streak disembunyikan kalau 0.
- Label tidak ambigu ("Lihat hasil", bukan "Selesai").
- Angka `toLocaleString('id-ID')`, waktu `m:ss`.
- Tombol iklan: ikon video + hadiahnya ("2x koin", "+10 detik"). Gagal: "Iklan belum tersedia, coba lagi sebentar lagi."
- Tanpa emoji di teks.

## Review
1. Kumpulkan semua string yang terlihat (`index.html`, template string di `js/`).
2. Cek terhadap glosarium, nada, panjang (muat 2 baris di 360px), dan kata Inggris yang tersisa.
3. Laporkan tabel: teks sekarang -> usulan -> alasan, lalu terapkan.
