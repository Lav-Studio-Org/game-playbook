# 04. Audio: Web Audio sintetis yang tidak pernah "hilang"

Semua suara dibuat dengan oscillator + noise di Web Audio. Tidak ada file audio, jadi ukuran kecil dan nada bisa mengikuti gameplay (LETUP!: tiap letupan satu nada tangga nada tema, rantai panjang jadi melodi).

Implementasi lengkap: [`templates/starter/js/audio.js`](../templates/starter/js/audio.js).

## Graf audio

```
oscillator/noise -> gain (envelope) -> sfxGain ─┐
                                    musicGain ──┴─> DynamicsCompressor -> destination
```

- `sfxGain` dan `musicGain` terpisah supaya Suara dan Musik bisa dimatikan sendiri-sendiri.
- Kompresor mencegah pecah saat banyak nada sekaligus (combo, rantai).
- Ubah gain dengan `setTargetAtTime`, jangan set `.value` langsung (klik).

## Bug "suara hilang" dan perbaikannya (Onet v1.1, Suika)

Gejala: setelah layar mati, pindah aplikasi, telepon masuk, notifikasi, atau iklan full-screen, game jadi bisu sampai di-reload.

Penyebab dan obat:

| Penyebab | Perbaikan |
|---|---|
| Browser membuat AudioContext `suspended` sampai ada gesture | `unlock()` dipanggil di **setiap** `pointerdown` (capture, passive), bukan sekali saja |
| iOS memberi state `'interrupted'` setelah telepon / app lain | Perlakukan `'interrupted'` sama dengan `'suspended'`: panggil `resume()` |
| Tab kembali dari background | `visibilitychange` -> `if (!document.hidden) Sfx.recover()` |
| Android WebView: context terlihat `running` tapi bisu setelah activity lain (iklan) memegang output | Di native: `close()` context lama, `build()` baru. Dipanggil setelah iklan dan di `appStateChange` aktif |
| Musik "menumpuk" ratusan nada setelah timer di-throttle | Scheduler melompat: kalau `nextT` tertinggal > 0.5s atau terlalu jauh di depan, set ulang ke `currentTime + 0.05`. `resync()` setelah context baru |

```js
unlock() {
  if (!this.ac) this.build();
  if (!this.ac) return;
  if (this.ac.state === 'suspended' || this.ac.state === 'interrupted') this.ac.resume().catch(() => {});
},
recover() {
  if (!this.ac) return;
  if (isNative()) { const old = this.ac; this.ac = null; old.close().catch(() => {}); this.build(); }
  this.unlock();
},
// global
document.addEventListener('pointerdown', () => Sfx.unlock(), { capture: true, passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) Sfx.recover(); });
```

## Iklan dan suara

`X.Ads` memanggil `Sfx.duck(true)` sebelum iklan dan `Sfx.recover(); Sfx.duck(false)` sesudahnya. Iklan tidak boleh tumpang tindih dengan musik game.

## Desain bunyi

- Envelope: attack 5ms, `exponentialRampToValueAtTime` ke 0.0001 (jangan ke 0, exponential ramp ke 0 error).
- Nada naik untuk hal baik (merge, combo, rekor: arpeggio C-E-G-C), nada turun untuk kalah (G-E-C-G turun).
- Tinggi nada mengikuti progres: `base = 260 * 2^((level + combo)/7)`.
- Musik generatif lembut: bass I-V-vi-IV + petikan pentatonik acak, 90-100 BPM, volume musik < efek.
- Per tema boleh punya tangga nada dan bentuk gelombang sendiri (LETUP!: pentatonik, kotak musik, minor, Jepang, blues).
- Pengaturan: **Suara**, **Musik**, **Getar** disimpan di profil, diterapkan lewat `Sfx.configure()`.
