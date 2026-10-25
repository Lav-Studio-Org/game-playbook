# 00. Prinsip dan checklist game baru

Tiga game pertama (Suika Angka, Onet, LETUP!) dibangun dengan pola yang sama. Dokumen ini merangkum "kenapa"-nya, lalu checklist yang dipakai setiap game baru.

## Prinsip

1. **Game dulu, lapisan lain belakangan, tapi slotnya sudah disiapkan.** Iklan, analitik, Android, dan misi harian selalu datang belakangan. Karena itu sejak hari pertama sudah ada `X.Ads`, `X.track()`, `X.handleBack()`, `X.pause()`, dan profil di `localStorage` dengan versi. Menambah AdMob nanti cukup mengisi satu provider.
2. **Terlihat seperti game jadi, bukan prototipe.** Penyebab terbesar kesan prototipe di audit Suika v1.0 adalah emoji. Ikon SVG sendiri, satu font (Fredoka, self-hosted), satu sistem warna.
3. **Pemain selalu tahu apa yang terjadi dan apa yang dikejar berikutnya.** Aturan baru dijelaskan dengan banner (bukan toast sekilas), info penting tetap terlihat di HUD, layar kalah memberi tips, layar menang menunjukkan bintang kosong yang masih bisa dikejar.
4. **Tidak pernah mencuri waktu atau kemenangan pemain.** Timer berhenti selama banner / jeda / iklan. Papan tidak pernah buntu tanpa jalan keluar gratis. Iklan tidak muncul di tengah permainan.
5. **Diukur, bukan dirasa.** Kesulitan dari simulasi, solvabilitas dari tes ribuan papan, layout dari screenshot di 3 ukuran layar.
6. **Satu repo, satu link.** Setiap push ke `main` langsung bisa dimainkan di `https://lav-studio-org.github.io/<repo>/`.

## Checklist game baru

### Fondasi
- [ ] Repo dibuat di `Lav-Studio-Org/<nama>` (oleh pemilik), template starter disalin
- [ ] Namespace global unik (contoh `SA`, `ON`, `LP`), nama game, warna, `CACHE` di `sw.js` sudah diganti
- [ ] Logika murni di `js/engine.js` (atau `board.js`) + tes Node
- [ ] `window.__<game>` test hook + `scripts/smoke.js`
- [ ] Workflow `pages.yml` dan `test.yml` jalan hijau
- [ ] GitHub Pages aktif (`gh-pages` / root)

### Tampilan dan teks
- [ ] Tidak ada emoji / karakter simbol sebagai ikon (cek dengan `scripts/check-no-emoji.js`)
- [ ] Semua tombol ikon punya `aria-label`, SVG dekoratif `aria-hidden="true"`
- [ ] Warna: hijau+video = iklan, aksen = utama, emas = koin
- [ ] Target sentuh minimal 44px, teks sekunder pakai warna solid (bukan `opacity`)
- [ ] Teks Indonesia sesuai glosarium, tidak ada kata Inggris yang tersisa ("Game Over" boleh hanya jika memang dipilih sebagai gaya)
- [ ] `prefers-reduced-motion` dihormati

### Gameplay
- [ ] Tutorial / petunjuk di level pertama, tidak menutupi area main
- [ ] Banner untuk aturan baru, timer menunggu banner
- [ ] Jeda (tombol + tombol back Android + Escape + tab disembunyikan)
- [ ] Solvabilitas dijamin (kalau genre bisa macet)
- [ ] Kesulitan dibalancing lewat simulasi, kurva tercatat di `docs/LEVEL_DESIGN.md`

### Audio
- [ ] Web Audio sintetis, `unlock()` di setiap `pointerdown`, `recover()` di `visibilitychange` dan setelah iklan
- [ ] Toggle Suara, Musik, Getar di Pengaturan

### Monetisasi dan retensi
- [ ] Placement rewarded terdaftar di header `js/ads.js`
- [ ] Interstitial dibatasi `POLICY`
- [ ] Hadiah harian / misi / streak (opsional tapi disarankan)

### Rilis
- [ ] README format standar + 4 screenshot
- [ ] `VERSION` + `docs/releases/v<ver>.md`
- [ ] Teks About repo (description, website, topics) diberikan ke pemilik
- [ ] (Android) Capacitor, AdMob test id, workflow android.yml, keystore lewat secrets
