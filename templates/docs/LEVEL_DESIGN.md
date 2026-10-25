# NAMA GAME: desain level dan balancing

## 1. Audit (sebelum)
Bot: (jelaskan bagaimana bot meniru pemain). Percobaan per level: N.

| Level / Bab | Menang | Bintang 2 | Bintang 3 |
|---|---|---|---|

Masalah utama:
-

## 2. Prinsip desain
1. **Ambang dari distribusi simulasi**, bukan tebakan atau "habiskan semua".
2. **Ritme**: (contoh gigi gergaji 10 level: 1-4 naik, 5 bonus, 6-9 naik, 10 bos).
3. **Mekanik baru** per bab / tingkat:
4. **Kurasi papan**: (berapa kandidat seed, kriteria pilih).

Peluang terencana per percobaan (bintang 1 / 2 / 3):

## 3. Hasil (diukur ulang dengan seed berbeda)
| Level / Bab | Bintang 1 | Bintang 2 | Bintang 3 |
|---|---|---|---|

## 4. Fitur progres dan retensi
| Fitur | Tujuan |
|---|---|

## 5. Alat
```
node scripts/gen-levels.js 240
node scripts/audit-stars.js 100
```
Setiap perubahan konstanta engine harus diikuti generator.
