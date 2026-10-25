---
name: game-icons
description: Add or design UI icons for a Lav Studio game as SVG sprite symbols (24px grid, 2px rounded strokes, --acc accent) and remove emoji or text-symbol icons. Use when a game needs an icon, or emoji/✓✕▶⏸⚙★ appear in UI.
---

# Ikon SVG sendiri, tanpa emoji

Panduan: [docs/02-desain-visual.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/02-desain-visual.md). Sprite bersama: `assets/icons/sprite.svg` (49 ikon), pratinjau `assets/icons/preview.html`.

## Cari dulu
1. Cek apakah ikon sudah ada di sprite bersama (`grep -o 'symbol id="[^"]*"' assets/icons/sprite.svg`). Kalau ada, salin `<symbol>`-nya ke sprite di `index.html` game.
2. Kalau belum ada, gambar baru.

## Menggambar ikon baru
- `<symbol id="i-nama" viewBox="0 0 24 24">`, isi dalam `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`.
- Bentuk sederhana, menempati kira-kira kotak 3..21. Satu bidang utama diberi `style="fill:var(--acc)"`.
- Ikon padat kecil (play, star, bolt) boleh `fill="currentColor"` tanpa stroke.
- Render cek di 20px dan 32px (buka preview atau screenshot Playwright). Garis tidak boleh menyatu, siluet harus terbaca tanpa warna.
- Tambahkan juga ke `assets/icons/sprite.svg` di playbook kalau berguna untuk game lain.

## Memakai
```js
const ic = (id) => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
```
Tombol ikon saja wajib `aria-label` Bahasa Indonesia. Aksen dinyalakan per konteks: `.btn.ad .ic { --acc: rgba(255,255,255,.35); }`.

## Menghapus emoji
`node scripts/check-no-emoji.js` menunjukkan setiap baris yang melanggar. Ganti dengan ikon sprite (di HTML/JS) atau gambar canvas sendiri (indikator tutorial: lingkaran berdenyut, bukan tangan emoji). Teks seperti "Tutup ✕" jadi `ic('close') + 'Tutup'`.
