---
name: ux-audit
description: Run a UI/UX design audit of a Lav Studio game from screenshots of every screen at 3 sizes, write docs/UX_AUDIT.md with severity-ranked findings, then implement the priorities. Use when asked to audit, polish, cek UI/UX, or before a release.
---

# Audit UI/UX

Panduan dan daftar pertanyaan: [docs/14-ux-audit.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/14-ux-audit.md). Template: `templates/docs/UX_AUDIT.md`.

## Langkah
1. Screenshot semua layar (beranda baru dan pemain lama, tutorial, main tiap tingkat, menang, kalah, jeda, iklan contoh, toko, misi, pengaturan, peta) di 360x640, 390x844, 1366x768 dengan skrip Playwright repo. Buat profil "pemain lama" lewat test hook.
2. Lihat setiap gambar. Fokus pemain baru di menit pertama: apakah tahu target dan di mana mengetuk? Info penting selalu terlihat? Ada yang menutupi HUD/timer? Aksi utama paling menonjol? Warna iklan benar? Emoji? Angka nol yang terasa kalah? Target sentuh, kontras, aria-label, reduced motion?
3. Tulis `docs/UX_AUDIT.md` (atau `UX_AUDIT_v<versi>.md` kalau sudah ada) dengan tabel Temuan / Tingkat / Rekomendasi, Hierarki, Konsistensi, Aksesibilitas, Yang sudah bagus, Prioritas.
4. Kerjakan prioritas Kritis dan Sedang, screenshot ulang, bandingkan.
5. Catat di `docs/releases/v<versi>.md` bagian "Tampilan & pengalaman".

Kalau skill `design:design-critique` tersedia, boleh dipakai untuk langkah 2, tapi hasil tetap ditulis dengan template ini dan Bahasa Indonesia.
