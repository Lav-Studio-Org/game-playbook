# 02. Desain visual: ikon, warna, tipografi, aksesibilitas

## Ikon: sprite SVG sendiri, tanpa emoji

**Kenapa:** emoji tampil berbeda di Samsung, Xiaomi, Pixel, dan iPhone, ukurannya tidak bisa diatur rapi, dan langsung membuat game terlihat seperti prototipe (temuan kritis audit Suika v1.0). Karakter seperti `⏸ ⚙ ✕ ▶ ✓ ★` juga dilarang: tipis, kecil, dan bergantung font.

**Aturan set ikon:**
- Grid `viewBox="0 0 24 24"`.
- Garis `stroke="currentColor" stroke-width="2"`, `stroke-linecap="round" stroke-linejoin="round"`.
- Satu bidang isi memakai `style="fill:var(--acc)"` (warna aksen dua nada). Default `--acc: transparent`, tombol bisa menyalakannya, contoh `.btn.ad .ic { --acc: rgba(255,255,255,.35); }`.
- Ikon padat sederhana (play, pause, star, bolt, flame) boleh `fill="currentColor"`.
- Semua `<symbol id="i-nama">` di satu `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>` di awal `<body>`.
- Pakai lewat helper:
  ```js
  const ic = (id) => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  ```
  ```css
  .ic { width: 1.25em; height: 1.25em; flex: none; vertical-align: middle; --acc: transparent; }
  ```
- Sprite bersama ada di [`assets/icons/sprite.svg`](../assets/icons/sprite.svg) (49 ikon gabungan dari ketiga game: play, pause, close, back, home, restart, gear, help, sound, music, vibe, video, noads, gift, bag, coin, star, star-off, trophy, crown, chest, flag, target, map, calendar, timer, clock, lock, check, share, link, bulb, shuffle, hammer, shake, swap, merge, pairs, bolt, flame, sparkle, palette, leaf, cup, pad, rotate, doc, trash, tap). Ikon berwarna penuh (coin, crown, chest, star-off) memakai warnanya sendiri. Pratinjau: buka `assets/icons/preview.html`.
- Ikon baru: gambar di grid 24, ikuti ketebalan yang sama, cek di 20px dan 32px. Skill `game-icons` memandu langkahnya.

**Gambar dalam game** (ubin, buah, gelembung) juga dibuat sendiri: SVG di `js/tiles.js` (Onet: 38 gambar 64x64 dengan satu warna garis tinta `#2b1d33` dan kilau putih supaya terasa satu keluarga) atau digambar di canvas (Suika: bola berwajah, LETUP!: gelembung neon). Tidak memakai gambar stok.

**Indikator tutorial**: lingkaran berdenyut / riak yang digambar sendiri, bukan emoji tangan.

## Warna: arti tetap di semua game

| Warna | Arti | Dipakai untuk |
|---|---|---|
| **Hijau + ikon `#i-video`** | Iklan berhadiah | Tombol "Tonton iklan" apa pun: hidupkan lagi, 2x koin, isi ulang power-up, koin gratis |
| **Aksen game** (Suika pink `#ff6b81`, Onet oranye `#ff7a59`, LETUP! pink `#ff4fa3`) | Aksi utama | Main, Lanjut, Main lagi, Klaim |
| **Emas** `#ffd23f` | Mata uang dan skor | Koin, harga, angka skor |
| **Garis / transparan** | Aksi sekunder | Menu, Ulangi, Tutup |
| **Netral gelap** | Badge jumlah | Jumlah power-up (bukan merah, merah terbaca sebagai error) |
| **Merah** | Bahaya / waktu hampir habis | Timer < 15 detik, garis bahaya |

Aturan turunan:
- Aksi utama selalu tombol solid terbesar di layar. Di Game Over, "Main lagi" lebih menonjol dari "2x koin".
- Power-up yang habis berubah jadi pil hijau `+` dengan ikon video, bukan tombol mati.
- Harga yang belum terjangkau diredupkan.

## Token CSS

Setiap game mendefinisikan token di `:root`, minimal:

```css
:root {
  --bg0: #08292a; --bg1: #0f3d3e; --bg2: #1b6b63;   /* latar gradasi */
  --ink: #2b1d33;      /* teks di kartu krem */
  --ink-2: #6a5a72;    /* teks sekunder di kartu, kontras >= 4.5:1 */
  --cream: #fff7e8;    /* kartu dan teks di latar gelap */
  --accent: #ff7a59; --accent-d: #d9573a;  /* aksi utama */
  --gold: #ffd23f;     /* koin dan skor */
  --green: #22c55e; --green-d: #15803d;    /* iklan berhadiah */
}
```

Gaya yang terbukti: latar gradasi radial gelap, kartu modal krem dengan bayangan tebal ("mainan"), tombol 3D (`box-shadow: 0 6px 0 <warna gelap>` dan turun 3px saat `:active`).

## Tipografi

- Fredoka 300-700, self-hosted, `font-display: swap`.
- Tombol utama 18-22px tebal. Teks kartu 15-17px. Label HUD minimal 12px huruf kapital dengan `letter-spacing: .08em`.
- Angka skor besar dengan `text-shadow: 0 3px 0 rgba(0,0,0,.25)` dan animasi "bump" kecil saat bertambah.

## Aksesibilitas (wajib lolos)

- Kontras teks AA (4.5:1). **Teks sekunder pakai warna solid** (`--ink-2`), bukan `opacity`, karena kontras opacity berubah sesuai latar.
- Target sentuh minimal 44x44px (tombol tutup juga). Pengecualian yang dicatat: ubin papan padat (Onet Sangat Sulit 34x40px).
- Tombol ikon: `aria-label` Bahasa Indonesia ("Jeda", "Pengaturan", "Tutup"). SVG dekoratif `aria-hidden="true"`. Banner aturan `aria-live="polite"`.
- `@media (prefers-reduced-motion: reduce)` mematikan goyang, denyut, konfeti.

## Umpan balik (juice)

Setiap aksi berhasil memberi beberapa lapis umpan balik sekaligus: nada, partikel, cincin/gelombang, angka melayang, getar layar kecil, `navigator.vibrate` pendek (8-60ms, bisa dimatikan). Perayaan besar (3 bintang, rekor, tamat) memakai konfeti CSS ringan.
