# 15. Versi dan rilis

Sesi Claude tidak bisa membuat release atau push tag (proxy 403), jadi release dibuat oleh GitHub Actions dari file di repo.

## Langkah rilis

1. Naikkan `VERSION` (semver: `1.2.0`). Fitur = minor, perbaikan = patch.
2. Tulis `docs/releases/v<VERSION>.md` (Bahasa Indonesia): baris pertama link main, lalu bagian **Baru**, **Tampilan & pengalaman**, **Perbaikan**. Tulis dari sudut pandang pemain, bukan nama file.
3. Naikkan `CACHE` di `sw.js` (`<game>-vN`), dan cek `ASSETS` lengkap.
4. (Android) `VERSION_NAME` di `android.yml` ikut mayor.minor.
5. Push ke `main`. `release.yml` membuat tag `v<VERSION>` dan GitHub Release dengan catatan dari file tadi, hanya kalau belum ada.

```yaml
# .github/workflows/release.yml
on:
  push:
    branches: [main]
    paths: [VERSION]
  workflow_dispatch:
permissions:
  contents: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - env:
          GH_TOKEN: ${{ github.token }}
        run: |
          v="v$(tr -d '[:space:]' < VERSION)"
          if gh release view "$v" >/dev/null 2>&1; then echo "$v exists"; exit 0; fi
          gh release create "$v" --target "$GITHUB_SHA" --title "NamaGame $v" --notes-file "docs/releases/$v.md"
```

## Commit

- Pesan commit bahasa Inggris, kalimat perintah: "Guarantee boards never get stuck; keep sound alive after the first round".
- Langsung ke `main` untuk repo game pribadi kecuali diminta lewat PR.
