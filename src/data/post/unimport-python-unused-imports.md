---
publishDate: 2023-06-10T00:00:00Z
author: Hakan Çelik
title: "unimport: Python'da Kullanılmayan Import'ları Temizle"
excerpt: "unimport, Python projelerinizdeki kullanılmayan import ifadelerini bulan ve kaldıran bir linter/formatter. pre-commit hook olarak kolayca entegre edilebilir."
image: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80
category: Python
tags:
  - python
  - open-source
  - linter
  - unimport
---

`unimport`, Python kodunuzdaki kullanılmayan import ifadelerini otomatik olarak bulur ve temizler.

## Kurulum

```bash
pip install unimport
```

## Kullanım

```bash
# Kontrol et
unimport .

# Otomatik düzelt
unimport --remove .

# Diff göster
unimport --diff .
```

## pre-commit Hook Olarak

`.pre-commit-config.yaml` dosyanıza ekleyin:

```yaml
- repo: https://github.com/hakancelikdev/unimport
  rev: 1.2.1
  hooks:
    - id: unimport
      args: [--remove, --include-star-import]
```

Artık her commit öncesinde kullanılmayan importlar otomatik temizlenir.

Daha fazla bilgi için: [unimport.hakancelik.dev](https://unimport.hakancelik.dev)
