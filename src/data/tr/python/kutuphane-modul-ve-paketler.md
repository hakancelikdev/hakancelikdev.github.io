---
publishDate: 2021-08-10T00:00:00Z
author: Hakan Çelik
title: "Kütüphane, Modül ve Paketler"
excerpt: "Pip python için bir paket yöneticisidir."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Kütüphane, Modül ve Paketler

## Pip nedir?

Pip python için bir paket yöneticisidir.

### Linux Sistemler Üzerine Pip Kurulumu

```bash
$ sudo apt-get install python3.8-pip
```

### Windows Üzerine Pip Kurulumu

Masaüstüne **get_pip.py** adında bir python dosyası açın

> Not; Eğer dosyalarınızın uzantısı görünmüyor ise windows arama yerine klasör yazıp,
> çıkan penceredeki ikinci sırada yer alan `bilinen dosya türleri için uzantıları gizle`
> adlı yerin işaretini kaldırın ve kayıt edin.

ve [https://bootstrap.pypa.io/get-pip.py](https://bootstrap.pypa.io/get-pip.py) bu linke
tıklarak karşınıza çıkan kodları açtığınız get_pip.py adındaki dosyanıza kopyalayın
kayıt edip kapatın ve masaüstünde **shift + \(fare sağ tık\)** yaparak shell komut
satırını \( veya cmd \) açın.

`python get_pip.py` yazarsanız pip kurulumuda gerçekleşmiş olacaktır.