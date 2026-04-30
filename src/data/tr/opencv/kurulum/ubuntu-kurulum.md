---
publishDate: 2022-06-20T00:00:00Z
author: Hakan Çelik
title: "Ubuntu'da OpenCV-Python Kurulumu"
excerpt: "Ubuntu'da OpenCV-Python'u iki farklı yöntemle kurmayı öğrenin: önceden derlenmiş paketlerden ve kaynak koddan derleme. Adım adım Ubuntu kurulum kılavuzu."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 61
subcategory: Kurulum
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Ubuntu'da OpenCV-Python Kurulumu

> **Not:** Mümkünse PyPI ile dağıtılan ikilileri tercih edin. Ayrıntılar için [pip ile OpenCV Kurulumu](/pip-kurulum) konusuna bakın.

## Hedefler

Ubuntu sistemde OpenCV-Python'u kurmayı öğreneceğiz. Bu adımlar Ubuntu 16.04 ve 18.04 (her ikisi de 64-bit) üzerinde test edilmiştir.

## Yöntem 1: Önceden Derlenmiş Paketlerden Kurulum

Bu yöntem yalnızca OpenCV uygulamaları geliştirmek için en uygunudur.

```bash
sudo apt-get install python3-opencv
```

Ardından Python IDLE veya IPython'da şunu yazın:

```python
import cv2 as cv
print(cv.__version__)
```

Hatalar olmadan sonuçlar yazdırılıyorsa, tebrikler! OpenCV-Python başarıyla kuruldu.

**Not:** Apt depoları her zaman OpenCV'nin en son sürümünü içermeyebilir. En son kaynak kodlar için kaynak koddan derleme yöntemini kullanın.

## Yöntem 2: Kaynak Koddan Derleme

Kaynak koddan derleme başlangıçta biraz karmaşık görünebilir, ancak bir kez başarılı olduktan sonra karmaşık bir şey yoktur.

### Gerekli Derleme Bağımlılıkları

```bash
sudo apt-get install cmake
sudo apt-get install gcc g++

# Python 3 desteği için:
sudo apt-get install python3-dev python3-numpy

# GUI özellikleri, kamera ve medya desteği için:
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install libgstreamer-plugins-base1.0-dev libgstreamer1.0-dev

# GTK 3 desteği için:
sudo apt-get install libgtk-3-dev
```

### İsteğe Bağlı Bağımlılıklar

```bash
sudo apt-get install libpng-dev
sudo apt-get install libjpeg-dev
sudo apt-get install libopenexr-dev
sudo apt-get install libtiff-dev
sudo apt-get install libwebp-dev
```

### OpenCV'yi İndirme

```bash
sudo apt-get install git
git clone https://github.com/opencv/opencv.git
```

### Yapılandırma ve Kurulum

```bash
cd opencv
mkdir build
cd build
cmake ../
make
sudo make install
```

Kurulum tamamdır. Tüm dosyalar `/usr/local/` klasörüne kurulur. Bir terminal açın ve `import cv2 as cv` yazarak test edin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_ubuntu/py_setup_in_ubuntu.markdown)
