# CLAUDE.md: aturan main untuk setiap game Lav Studio

Repo ini adalah **playbook**: kumpulan aturan, panduan, skills, dan template yang dipakai setiap kali membuat game baru. Aturannya disarikan dari tiga game yang sudah jadi: [Suika Angka](https://github.com/Lav-Studio-Org/suika-merge), [Onet](https://github.com/Lav-Studio-Org/onet), dan [LETUP!](https://github.com/Lav-Studio-Org/letup).

Saat bekerja di repo game mana pun, baca file ini dulu, lalu buka panduan di `docs/` yang relevan dengan tugasnya. Kalau repo game punya `CLAUDE.md` sendiri (dari `templates/starter/CLAUDE.md`), aturan di sana menambah aturan ini, bukan menggantinya.

## Aturan keras (tidak boleh dilanggar)

1. **Tidak ada emoji dan tidak ada karakter simbol sebagai ikon.** Bukan di UI, bukan di toast, bukan di tombol (termasuk `✓ ✕ ▶ ⏸ ⚙ ★`). Semua ikon dari sprite SVG sendiri `#i-*` (24px grid, garis 2px rounded, satu warna aksen `--acc`). Lihat [docs/02-desain-visual.md](docs/02-desain-visual.md).
2. **Arti warna tombol tetap di semua game:**
   - **hijau + ikon video** = iklan berhadiah (rewarded). Tidak ada tombol lain yang hijau.
   - **warna aksen utama** (pink / oranye, per game) = aksi utama (Main, Lanjut, Main lagi).
   - **emas** = mata uang (koin) dan skor saja.
   - **garis / transparan** = aksi sekunder (Menu, Ulangi).
3. **Teks UI dalam Bahasa Indonesia** yang santai, pendek, dan konsisten dengan glosarium di [docs/03-teks-ui.md](docs/03-teks-ui.md). `<html lang="id">`. Kode, komentar, nama file, dan pesan commit dalam bahasa Inggris.
4. **Iklan rewarded dulu.** Iklan selalu dipilih pemain dan selalu memberi hadiah yang jelas. Interstitial hanya di jeda antar ronde, dibatasi (bukan di N game pertama, paling sering tiap N game, minimal 90 detik dari iklan lain, tidak pernah di tengah permainan). Semua iklan lewat satu lapisan `X.Ads`. Lihat [docs/05-iklan.md](docs/05-iklan.md).
5. **Suara harus bisa pulih.** Web Audio dibuka ulang pada setiap sentuhan (`pointerdown` capture), saat tab kembali terlihat, dan setelah iklan. State `'interrupted'` (iOS) diperlakukan seperti `'suspended'`. Di Android (Capacitor) buat AudioContext baru setelah iklan / kembali dari background. Lihat [docs/04-audio.md](docs/04-audio.md).
6. **Logika game murni dipisah dari DOM** (`js/engine.js` / `js/board.js`) supaya bisa dites di Node dan dipakai skrip simulasi.
7. **Papan / level tidak boleh mustahil.** Kalau game bisa macet (tidak ada langkah), harus ada fallback yang terbukti selalu berhasil, dan tes di CI yang memainkan ribuan papan. Lihat [docs/07-testing.md](docs/07-testing.md).
8. **Kesulitan diatur dengan simulasi, bukan tebakan.** Target, ambang bintang, HP bos dihitung dari distribusi hasil bot. Lihat [docs/06-level-balancing.md](docs/06-level-balancing.md).
9. **Tanpa build step dan tanpa framework** untuk web: HTML, CSS, JS biasa. Library hanya kalau benar-benar perlu (contoh Matter.js untuk fisika), dan di-vendor di `vendor/` dengan versi tetap.
10. **Rahasia tidak pernah masuk repo.** Keystore, password, dan ID iklan asli lewat GitHub Secrets atau file config yang jelas. Jangan pernah menyalin isi folder signing / keystore dari project files.

## Alur kerja standar game baru

1. Salin `templates/starter/` ke repo baru (lihat skill `new-game`). Ganti namespace `GG`, nama, warna, dan `CACHE` di `sw.js`.
2. Tulis logika murni + tes Node dulu, baru UI.
3. Pasang test hook `window.__<game>` dan smoke test Playwright sejak awal.
4. Deploy ke GitHub Pages lewat workflow `pages.yml` (main -> gh-pages).
5. Setelah fitur inti jalan: audit UI/UX (skill `ux-audit`), simpan di `docs/UX_AUDIT.md`, kerjakan prioritasnya.
6. README sesuai format di [docs/13-repo-readme.md](docs/13-repo-readme.md), dengan screenshot.
7. Android + AdMob + Play Store kalau diminta ([docs/11-android-capacitor.md](docs/11-android-capacitor.md), [docs/12-play-store.md](docs/12-play-store.md)).

## Batasan lingkungan Claude (sudah terbukti)

- Sesi Claude **tidak bisa membuat repo**, mengubah Settings repo (About, topics, Pages), menambah Actions secrets, membuat release, atau push tag. Minta pemilik melakukannya, dan beri teks siap tempel. Release dibuat oleh workflow `release.yml` dari file `VERSION`.
- `*.github.io` tidak bisa dibuka dari sandbox. Cek deploy lewat status run Actions.
- GitHub Pages kadang perlu diaktifkan manual: Settings > Pages > Deploy from a branch > `gh-pages` / root.
- Detail lain di [docs/16-jebakan.md](docs/16-jebakan.md).

## Peta isi

| Path | Isi |
|---|---|
| `docs/` | Panduan bernomor, dari prinsip sampai rilis |
| `.claude/skills/*/SKILL.md` | Skills Claude untuk tugas yang berulang |
| `templates/starter/` | Game kerangka yang langsung jalan (semua pola di atas sudah terpasang) |
| `templates/android/` | Potongan Capacitor + AdMob + workflow build Android |
| `templates/docs/` | Template UX_AUDIT, LEVEL_DESIGN, PLAY_STORE, catatan rilis |
| `assets/icons/` | Sprite ikon SVG bersama + halaman pratinjau |
