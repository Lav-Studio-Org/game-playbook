---
name: game-release
description: Ship a new version of a Lav Studio game: bump VERSION, write player-facing Indonesian release notes, bump the service worker cache, and let release.yml create the GitHub release. Use when the user says rilis, versi baru, or after a batch of changes.
---

# Rilis versi baru

Panduan: [docs/15-rilis.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/15-rilis.md).

## Checklist
1. Tes lolos: tes logika, `check-no-emoji.js`, smoke test (lihat screenshot).
2. `VERSION` naik (fitur = minor, perbaikan = patch).
3. `docs/releases/v<VERSION>.md`: link main, **Baru**, **Tampilan & pengalaman**, **Perbaikan**; bahasa pemain, tanpa nama file.
4. `sw.js`: `CACHE` naik, `ASSETS` berisi semua file yang dimuat `index.html`.
5. (Android) `VERSION_NAME` di `android.yml` ikut mayor.minor.
6. README: fitur baru dan screenshot kalau tampilan berubah.
7. Commit bahasa Inggris, push ke `main`. `release.yml` membuat tag dan release (sesi sendiri tidak bisa push tag / membuat release).
8. Cek run Actions `pages.yml` dan `release.yml` hijau, lalu kirim link rilis dan link main ke pemilik.
