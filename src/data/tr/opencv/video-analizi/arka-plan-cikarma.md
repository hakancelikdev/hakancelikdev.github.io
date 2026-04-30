---
publishDate: 2022-06-04T00:00:00Z
author: Hakan Çelik
title: "Arka Plan Çıkarma"
excerpt: "Video akışlarındaki hareketli nesneleri tespit etmek için arka plan çıkarma tekniklerini öğrenin. cv2.createBackgroundSubtractorMOG2() ve KNN yöntemlerini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 45
subcategory: Video Analizi
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Arka Plan Çıkarma

## Hedefler

Bu bölümde:

- Arka plan çıkarmanın temellerini öğreneceğiz
- **cv.BackgroundSubtractorMOG2** ve **cv.BackgroundSubtractorKNN** algoritmalarını göreceğiz

## Temeller

Arka plan çıkarma, video gözetlemesinde yaygın ve kritik bir görevdir. Çoğu zaman hareketli nesnelerin olduğunu bildirmeniz gerekir. Genellikle, statik kamerayla alınan bir videonun arka planı sabittir. Bu nedenle arka plan modelini tahmin etmek ve ardından gelen kareleri bu arka plan modeline kıyasla kontrol ederek hareketli nesneleri tespit etmek mantıklıdır.

Arka plan modelini oluşturmak kolay değildir:
- Aydınlatma değişimleri
- Gölgeler
- Arka plan nesnelerinin hareketi (yavaş hareket eden nesneler, yapraklar vs.)

OpenCV'de bu sorunu çözmek için kullanabileceğiniz güçlü algoritmalar bulunmaktadır.

## MOG2 — Gauss Karışım Modeli (MOG2)

Bu Gauss tabanlı arka plan/ön plan segmentasyon algoritması, Z. Zivkovic tarafından 2004 ve 2006 yıllarında yayınlanan makalelere dayanmaktadır. Bu algoritmanın temel özelliği, her piksel için uygun Gauss bileşeni sayısını seçmesidir. Her piksel için bir çok Gauss dağılımı olabileceğini kabul eder, bu sayede ışık değişimleri ve arka plan nesnelerinin hareketi gibi durumlara daha iyi uyum sağlar.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('vtest.avi')

fgbg = cv.createBackgroundSubtractorMOG2()

while True:
    ret, frame = cap.read()

    if not ret:
        break

    fgmask = fgbg.apply(frame)

    cv.imshow('frame', fgmask)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
```

### Gölgeleri Yönetme

MOG2 algoritması, ön plan maskesinde gölgeleri tespit edebilir. Varsayılan olarak etkindir. Gölgeler 127 değeri ile işaretlenir. Bu davranışı `detectShadows=False` parametresiyle devre dışı bırakabilirsiniz:

```python
fgbg = cv.createBackgroundSubtractorMOG2(detectShadows=True)
```

## KNN — K En Yakın Komşu (KNN)

Bu algoritma de Backer tarafından 2006 yılında önerilen KNN tabanlı bir arka plan çıkarma algoritmasıdır.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('vtest.avi')

fgbg = cv.createBackgroundSubtractorKNN()

while True:
    ret, frame = cap.read()

    if not ret:
        break

    fgmask = fgbg.apply(frame)

    cv.imshow('frame', fgmask)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
```

## Ek Kaynaklar

1. Zivkovic, Z. "Improved adaptive Gaussian mixture model for background subtraction", Proceedings of the 17th International Conference on Pattern Recognition, 2004.
2. Zivkovic, Z. and van der Heijden, F. "Efficient adaptive density estimation per image pixel for the task of background subtraction", Pattern Recognition Letters, 2006.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_video/py_bg_subtraction/py_bg_subtraction.markdown)
