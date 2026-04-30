---
publishDate: 2022-06-19T00:00:00Z
author: Hakan Çelik
title: "pip ile OpenCV Kurulumu"
excerpt: "Python için OpenCV'nin en kolay kurulum yöntemi olan pip'i kullanmayı öğrenin. Sanal ortam kurulumu, PyPI paket seçenekleri ve sık karşılaşılan sorunların çözümünü anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 60
subcategory: Kurulum
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - kurulum
---

# pip ile OpenCV Kurulumu

## Hızlı Başlangıç

Çoğu kullanıcı için önerilen yöntem **pip** kullanarak PyPI üzerinden kurulumu yapmaktır:

```bash
# 1) Sanal ortam oluştur ve etkinleştir (önerilir)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 2) pip araçlarını güncelle
python -m pip install --upgrade pip setuptools wheel

# 3) PyPI'dan OpenCV kur (yalnızca BİRİNİ seç)
pip install opencv-python          # ana paket (çoğu kullanıcı için)
# veya
pip install opencv-contrib-python  # + ekstra modüller (contrib)
# veya
pip install opencv-python-headless # GUI/arka plan olmadan (sunucular/CI)
# veya
pip install opencv-contrib-python-headless # GUI yok + ekstra modüller
```

### Küçük Bir Hello World

```python
import cv2 as cv
import numpy as np

print("OpenCV:", cv.__version__)
img = np.zeros((120, 400, 3), dtype=np.uint8)
cv.putText(img, "OpenCV OK", (10, 80), cv.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3)
# Headless olmayan bir kurulumda pencere gösterebilirsiniz:
# cv.imshow("hello", img); cv.waitKey(0)
# Headless veya normal, her zaman güvenli: dosyaya kaydet
cv.imwrite("hello.png", img)
```

## Sanal Ortamlar ve IDE'ler

Sanal ortam kullanmak, proje bağımlılıklarını izole tutar. Ortam oluşturan veya etkinleştiren araçlar:

- `venv` (yerleşik) ve `virtualenv`
- Conda ortamları
- VS Code, PyCharm gibi IDE'ler (her çalışma alanı için otomatik ortam oluşturabilirler)

IDE içinde import başarısız olursa, IDE'nin seçtiği yorumlayıcının OpenCV'yi yüklediğiniz ortamla aynı olduğunu doğrulayın.

## İşletim Sistemi Notları

- **Linux:** Varsayılan Python `python3` olabilir. `python3 -m venv .venv` ve `python3 -m pip ...` kullanın.
- **Windows:** [python.org](https://python.org)'dan Python kurun, "Add python to PATH" seçeneğini etkinleştirin.
- **macOS:** Sistem `python3`'ünü veya yönetilen (Homebrew ya da Python.org) birini kullanın. Sanal ortamı tercih edin.
- **Raspberry Pi / ARM kartlar:** Bazı Pi OS / Python kombinasyonları için önceden derlenmiş paketler bulunmayabilir.

## PyPI Paketi Seçimi

- `opencv-python`: GUI/arka planları olan temel OpenCV modülleri
- `opencv-contrib-python`: temel modüllere ek olarak **contrib** modüllerini içerir
- `opencv-python-headless`: GUI/arka plan olmadan (sunucular/konteynerler/CI için ideal)
- `opencv-contrib-python-headless`: contrib + headless

Her ortama **yalnızca birini** kurun.

## Sorun Giderme

**pip kaynaktan derlemeye çalışıyor**
Belirtiler: çok uzun derleme adımı, CMake hataları, derleyici hataları.
Çözümler:
- Derleme araçlarını güncelleyin: `python -m pip install --upgrade pip setuptools wheel`
- Python sürümünüzün seçilen paket tarafından desteklendiğinden emin olun.

**"No matching distribution found" veya "Unsupported wheel"**
- Python sürümünüzü doğrulayın (`python -V`). Güncel bir Python (3.10–3.12) kullanarak temiz bir sanal ortam oluşturun.

**IDE'de import çalışıyor, terminalde çalışmıyor (veya tam tersi)**
- IDE farklı bir yorumlayıcı kullanıyor. IDE'nin yorumlayıcı ayarlarında aynı ortamı seçin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_pip_install/py_pip_install.markdown)
