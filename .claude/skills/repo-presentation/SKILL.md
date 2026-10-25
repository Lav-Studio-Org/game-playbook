---
name: repo-presentation
description: Make a Lav Studio game repo presentable: standard Indonesian README layout with play badge and 4 screenshots, optimized screenshots, and paste-ready About text (description, website, topics). Use when asked to rapikan repo/README or after a release.
---

# README dan presentasi repo

Panduan: [docs/13-repo-readme.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/13-repo-readme.md). Template: `templates/starter/README.md`.

## Langkah
1. Screenshot 4-6 layar terbaik dengan skrip Playwright repo di 390x844 @2x, profil pemain lama.
2. Perkecil ke lebar 540px + kuantisasi 256 warna (snippet Python di panduan), simpan `docs/screenshots/<nama-indonesia>.png` (~150KB).
3. README sesuai urutan: header tengah (ikon 112, judul, tagline), badge "Main sekarang", badge workflow, 4 screenshot 200px dengan alt, Cara main, Fitur, bagian khusus game, Teknologi (tabel path), Iklan, Jalankan lokal, Tes/Skrip, Deploy dan rilis, Lisensi aset.
4. Semua link ke `Lav-Studio-Org/<repo>` dan `https://lav-studio-org.github.io/<repo>/`.
5. Sesi tidak bisa mengubah About repo: berikan teks siap tempel (Description satu kalimat Indonesia, Website, Topics `game <genre> html5-game javascript pwa browser-game indonesia`).
