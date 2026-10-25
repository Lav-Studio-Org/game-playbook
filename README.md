<div align="center">

# Lav Studio Game Playbook

**Panduan, skills Claude, dan template untuk setiap game baru.**
Disarikan dari tiga game yang sudah jadi: [Suika Angka](https://github.com/Lav-Studio-Org/suika-merge), [Onet](https://github.com/Lav-Studio-Org/onet), dan [LETUP!](https://github.com/Lav-Studio-Org/letup).

[![Cek template](https://github.com/Lav-Studio-Org/game-playbook/actions/workflows/check.yml/badge.svg)](https://github.com/Lav-Studio-Org/game-playbook/actions/workflows/check.yml)

</div>

## Isi

| Bagian | Untuk apa |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | 10 aturan keras + alur kerja standar. Claude membaca ini setiap mengerjakan game |
| [`docs/`](docs) | 17 panduan bernomor (lihat daftar di bawah) |
| [`.claude/skills/`](.claude/skills) | 10 skills Claude untuk tugas yang berulang |
| [`templates/starter/`](templates/starter) | Game kecil "Tangkap!" yang langsung jalan, semua pola sudah terpasang |
| [`templates/android/`](templates/android) | Capacitor + AdMob + workflow build APK/AAB |
| [`templates/docs/`](templates/docs) | Template UX_AUDIT, LEVEL_DESIGN, PLAY_STORE, catatan rilis |
| [`assets/icons/`](assets/icons) | Sprite 49 ikon SVG bersama + halaman pratinjau |

## Aturan paling penting

1. **Tidak ada emoji.** Semua ikon dari sprite SVG sendiri.
2. **Warna punya arti tetap**: hijau + ikon video = iklan berhadiah, warna aksen = aksi utama, emas = koin.
3. **Teks Bahasa Indonesia** dengan glosarium yang sama di semua game.
4. **Iklan rewarded dulu**, interstitial hanya di jeda dan dibatasi.
5. **Suara tidak boleh hilang** setelah layar mati, telepon, atau iklan.
6. **Kesulitan dari simulasi**, papan dijamin tidak pernah buntu.

Selengkapnya di [`CLAUDE.md`](CLAUDE.md).

## Panduan

| # | Topik |
|---|---|
| [00](docs/00-prinsip.md) | Prinsip dan checklist game baru |
| [01](docs/01-stack-struktur.md) | Stack, struktur file, pola kode |
| [02](docs/02-desain-visual.md) | Ikon SVG, arti warna, token CSS, tipografi, aksesibilitas, juice |
| [03](docs/03-teks-ui.md) | Teks UI Bahasa Indonesia: nada dan glosarium |
| [04](docs/04-audio.md) | Web Audio sintetis dan perbaikan "suara hilang" |
| [05](docs/05-iklan.md) | Iklan: placement rewarded, POLICY interstitial |
| [06](docs/06-level-balancing.md) | Desain level dan balancing lewat simulasi |
| [07](docs/07-testing.md) | Tes logika, solvabilitas, test hook, smoke test |
| [08](docs/08-layout-mobile.md) | Layout HP, safe area, desktop, tombol back |
| [09](docs/09-meta-retensi.md) | Koin, misi, hadiah harian, streak, peta, analitik |
| [10](docs/10-deploy-pwa.md) | GitHub Pages dan PWA |
| [11](docs/11-android-capacitor.md) | Android: Capacitor + AdMob + signing |
| [12](docs/12-play-store.md) | Play Store: aset, listing, kewajiban akun |
| [13](docs/13-repo-readme.md) | README dan presentasi repo |
| [14](docs/14-ux-audit.md) | Audit UI/UX |
| [15](docs/15-rilis.md) | Versi dan rilis |
| [16](docs/16-jebakan.md) | Jebakan yang sudah pernah terjadi |

## Skills Claude

| Skill | Dipakai saat |
|---|---|
| `new-game` | Membuat game baru dari template |
| `game-icons` | Menambah ikon atau menghapus emoji |
| `game-copy-id` | Menulis / mengecek teks UI Indonesia |
| `game-ads` | Menambah placement iklan atau AdMob |
| `level-balancing` | Mengatur kesulitan lewat simulasi |
| `game-testing` | Tes logika, solvabilitas, smoke |
| `ux-audit` | Audit UI/UX dari screenshot |
| `android-release` | APK, AdMob, Play Store |
| `repo-presentation` | README, screenshot, teks About |
| `game-release` | Rilis versi baru |

Cara memakai:
- **Di repo game**: salin folder yang dibutuhkan ke `.claude/skills/` repo game itu, atau
- **Untuk semua proyek**: salin `.claude/skills/*` ke `~/.claude/skills/`, atau
- Minta Claude: "pakai game-playbook" dan Claude akan meng-clone repo ini lalu mengikuti `CLAUDE.md`-nya.

## Mulai game baru

```sh
git clone https://github.com/Lav-Studio-Org/game-playbook
cp -r game-playbook/templates/starter/. game-baru/
cd game-baru
python3 -m http.server 8123          # buka http://localhost:8123/
node scripts/test-engine.js          # tes logika
node scripts/check-no-emoji.js       # tidak ada emoji
node scripts/smoke.js http://localhost:8123/ shots
```

Langkah lengkap ada di skill [`new-game`](.claude/skills/new-game/SKILL.md).

<div align="center">
<img src="templates/starter/docs/screenshots/menu.png" width="180" alt="Template starter: menu">
<img src="templates/starter/docs/screenshots/main.png" width="180" alt="Template starter: bermain">
<img src="templates/starter/docs/screenshots/hasil.png" width="180" alt="Template starter: hasil">
<img src="templates/starter/docs/screenshots/hadiah.png" width="180" alt="Template starter: hadiah harian">
</div>
