---
name: new-game
description: Start a new Lav Studio web game from the game-playbook starter template (no-build HTML/JS, icon sprite, ads layer, audio fix, tests, Pages deploy). Use when the user asks to bikin/buat game baru or a new game repo.
---

# Game baru dari template

Aturan lengkap: `CLAUDE.md` dan `docs/00-prinsip.md` di [game-playbook](https://github.com/Lav-Studio-Org/game-playbook/blob/main/CLAUDE.md).

## Langkah

1. **Repo.** Sesi Claude tidak bisa membuat repo. Minta pemilik membuat repo kosong `Lav-Studio-Org/<nama>` (tanpa README), lalu `add_repo` dengan akses push. Sambil menunggu, kerjakan di folder lokal.
2. **Salin starter**: `cp -r game-playbook/templates/starter/. <repo>/` (termasuk `.github/`, `.nojekyll`, `.gitignore`). Clone playbook dulu kalau belum ada: `git clone --depth 1 https://github.com/Lav-Studio-Org/game-playbook`.
3. **Ganti identitas** di semua file:
   - namespace `GG` -> 2 huruf unik (`grep -rl '\bGG\b' js scripts | xargs sed -i 's/\bGG\b/XX/g'`)
   - `Tangkap!`, `tangkap` (kunci profil, `__tangkap`, `CACHE` di sw.js, release.yml), `NAMA-REPO`
   - warna `--accent`/`--bg*` di style.css, `theme-color`, manifest, icon.svg lalu `node scripts/icons.js`
4. **Ganti gameplay**: tulis aturan di `js/engine.js` (murni, tanpa DOM, RNG ber-seed, bentuk `createWorld/step/stars`), sesuaikan `scripts/test-engine.js`, lalu UI di `js/game.js`. Pertahankan: banner yang menghentikan waktu, `handleBack`, `pause` saat tab disembunyikan, test hook.
5. **Balancing**: ubah bot di `scripts/balance.js` agar mirip pemain, `node scripts/balance.js 400 --write`.
6. **Tes**: `node scripts/test-engine.js && node scripts/check-no-emoji.js`, lalu `python3 -m http.server 8123 &` dan `node scripts/smoke.js http://localhost:8123/ shots`. Lihat screenshot-nya sendiri sebelum bilang selesai.
7. **README** (skill `repo-presentation`), `docs/releases/v0.1.0.md`, commit, push ke `main`.
8. **Minta pemilik** mengaktifkan Pages (Settings > Pages > gh-pages / root) dan mengisi About repo (beri teks siap tempel). Cek run Actions `pages.yml` hijau.

## Jangan
- Emoji atau simbol teks sebagai ikon.
- Framework / build step.
- Tombol hijau yang bukan iklan berhadiah.
- Kesulitan dari tebakan.
