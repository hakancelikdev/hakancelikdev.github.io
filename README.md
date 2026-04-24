# hakancelik.dev

Kişisel site — [hakancelik.dev](https://hakancelik.dev)

**Astro 5 + Tailwind CSS** (AstroWind template)

## Geliştirme

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/ klasörüne build et
npm run preview   # build sonucunu önizle
```

## Yapı

```
src/
  pages/
    index.astro      # Ana sayfa
    about.astro      # Hakkımda
    contact.astro    # İletişim
    [...blog]/       # Blog route'ları
  data/post/         # Blog yazıları (.md / .mdx)
  assets/images/     # Görseller
  navigation.ts      # Header / footer linkleri
  config.yaml        # Site ayarları
```

## Deploy

`main` branch'e her push'ta GitHub Actions otomatik olarak build eder ve GitHub Pages'e deploy eder.

## Blog yazısı eklemek

`src/data/post/` klasörüne `.md` dosyası ekle:

```markdown
---
publishDate: 2026-01-01T00:00:00Z
author: Hakan Çelik
title: Yazı Başlığı
excerpt: Kısa açıklama
image: https://...
category: Python
tags:
  - python
---

İçerik buraya...
```
