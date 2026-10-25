---
name: level-balancing
description: Balance difficulty, targets, star thresholds and boss HP for a Lav Studio game by simulating bot players on the pure engine, then audit the result. Use when levels feel too hard/easy, stars feel impossible, or new levels/modes are added.
---

# Balancing lewat simulasi

Panduan: [docs/06-level-balancing.md](https://github.com/Lav-Studio-Org/game-playbook/blob/main/docs/06-level-balancing.md). Contoh nyata: `scripts/sim.js`, `gen-levels.js`, `audit-stars.js` di Lav-Studio-Org/letup; `scripts/balance.js` di starter.

## Langkah
1. Pastikan logika murni bisa dimainkan headless (`createWorld`, input, `step`, `stars`) dengan RNG ber-seed.
2. Tulis bot yang mirip pemain (memilih langkah masuk akal, punya waktu reaksi / ketidakakuratan), bukan acak murni.
3. **Audit dulu**: jalankan N percobaan per level / bab, catat tabel menang / bintang 2 / bintang 3 di `docs/LEVEL_DESIGN.md` (template di playbook).
4. Tentukan **kurva peluang terencana** (contoh bab 1 bintang 1 ~93% turun ke ~45% di bab terakhir; bintang 2 = setengahnya; bintang 3 = seperlima, minimal 7%). Gigi gergaji: bonus di level 5, bos di level 10, bab baru sedikit lebih mudah.
5. Generator: per level jalankan ~240 percobaan pada papan yang sama, ambil kuantil hasil sebagai target / ambang. Pilih papan terbaik dari beberapa seed. Tulis ke file data dengan header "Generated ... Do not edit by hand".
6. **Ukur ulang dengan seed lain**, tulis tabel "sesudah". Kalau meleset, ubah rencana, bukan angka per level.
7. Setiap perubahan konstanta engine -> jalankan generator lagi.

## Laporkan
Tabel sebelum/sesudah per bab dan satu kalimat apa yang dirasakan pemain (contoh "bintang 3 di bab 1 sekarang 30%, sebelumnya mustahil").
