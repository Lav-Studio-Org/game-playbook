# 08. Layout mobile

Target utama HP potret 360-430px. Selalu dicek di **360x640** (HP kecil), **390x844** (HP besar), dan **1280-1366px desktop**.

## Viewport dan dasar halaman

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#...">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="format-detection" content="telephone=no">
```

```css
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; height: 100%; overflow: hidden; overscroll-behavior: none;
  user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
  -webkit-text-size-adjust: 100%; touch-action: none; }
body { position: fixed; inset: 0; }               /* tidak ada bounce / pull-to-refresh */
button { touch-action: manipulation; font-family: inherit; }
#app { height: 100%; max-width: 560px; margin: 0 auto;
  padding: max(8px, env(safe-area-inset-top)) 12px max(8px, env(safe-area-inset-bottom)); }
```

## Pola layar

- **HUD atas** (grid `1fr auto 1fr`): kiri skor / info, tengah info penting (timer, next), kanan koin + tombol ikon. Di menu, HUD dipakai untuk rekor, koin, pengaturan, jangan biarkan ruang HUD kosong.
- **Area main** mengisi sisa tinggi (`flex: 1`), canvas di-scale dari dunia tetap.
- **Dock bawah** untuk power-up / tombol bantuan, dalam jangkauan jempol.
- **Modal / sheet** kartu krem di tengah atau sheet dari bawah. Tombol utama di bawah kartu, lebar penuh.
- **Toast** di bawah HUD, kecil, dengan ikon, tidak menutupi area main atau teks HUD.
- **Banner aturan** di tengah papan, menghentikan timer, `aria-live`.

## Desktop / layar lebar

- Batasi HUD dan header ke kolom tengah (LETUP!: 520px). Jangan menempel ke tepi jendela.
- Papan grid boleh diputar mendatar (Onet: rows x cols ditukar saat layar lebar) supaya ubin tetap besar.
- Ukuran ubin dihitung dari ruang tersedia: `min((availW / cols), (availH / rows) / ratio)`, lalu set sebagai CSS var `--tw`, `--th`.

## Daftar panjang

Peta level dengan ratusan node: ringkas bab yang masih jauh menjadi satu baris berisi syarat, tampilkan tombol tetap "Main Level N" di bawah, dan scroll otomatis ke level saat ini.

## Input

- `pointerdown` untuk aksi game (lebih cepat dari `click`), `click` untuk tombol menu.
- Koordinat canvas -> dunia: `(e.clientX - rect.left) / rect.width * W`.
- Jangan pakai hover sebagai satu-satunya petunjuk.
- Tombol back Android dan browser: `X.handleBack()` menutup panel teratas, menjeda permainan, dan hanya mengembalikan `false` di beranda (app keluar). Di web: `history.pushState` + `popstate`. Keyboard: `Escape` / `p` untuk jeda.
- Saat tab disembunyikan / app ke background: jeda otomatis.

## Cek otomatis

Smoke test memastikan papan tidak overflow di setiap tingkat dan ukuran layar ([07-testing.md](07-testing.md)).
