# 13. README dan presentasi repo

Semua repo game memakai satu format README (Bahasa Indonesia). Template: [`templates/starter/README.md`](../templates/starter/README.md).

## Urutan bagian

1. **Header tengah** (`<div align="center">`): ikon 112px, `# Nama Game`, tagline tebal satu baris, satu kalimat penjelas.
2. **Badge "Main sekarang"** besar (shields.io `for-the-badge`, warna aksen game) ke URL Pages.
3. **Badge workflow**: Tes, Deploy, (Rilis), PWA "bisa offline", "HTML/CSS/JS tanpa build".
4. **4 screenshot** lebar 200px dengan `alt` deskriptif Bahasa Indonesia.
5. `## Cara main`: 3-4 langkah bernomor.
6. `## Fitur`: daftar dengan **kata kunci tebal** di depan.
7. Bagian khusus game (tabel tingkat kesulitan, skor, mode).
8. `## Teknologi`: kalimat stack + tabel `Path | Isi`, lalu `### Iklan` dengan daftar placement.
9. `## Jalankan lokal`: clone + `python3 -m http.server 8123`, lalu `### Tes` / `### Skrip`.
10. `## Deploy` (dan rilis).
11. `## Lisensi aset`: Fredoka OFL, semua grafis dan suara dibuat khusus.

## Screenshot

- Diambil dengan skrip Playwright repo di **390x844 @2x**, lalu diperkecil ke lebar 540px dan dikuantisasi 256 warna dengan FASTOCTREE (sekitar 30-150KB per file; metode default bisa mengubah emas jadi pink):
  ```sh
  python3 - <<'EOF'
  from PIL import Image; import glob
  for f in glob.glob('docs/screenshots/*.png'):
      im = Image.open(f).convert('RGB'); w, h = im.size
      im = im.resize((540, round(h * 540 / w)), Image.LANCZOS).quantize(256, method=Image.Quantize.FASTOCTREE)
      im.save(f, optimize=True)
  EOF
  ```
- Simpan di `docs/screenshots/<nama-layar>.png` (nama Indonesia: `menu`, `main`, `menang`, `peta`).
- Pakai profil pemain lama supaya layar tidak terlihat kosong.

## Pengaturan repo (pemilik)

About: description, website, topics; centang "Use your GitHub Pages website"; matikan Packages / Environments kalau tidak dipakai.
