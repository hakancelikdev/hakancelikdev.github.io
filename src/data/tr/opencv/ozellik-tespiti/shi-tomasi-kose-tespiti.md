---
publishDate: 2022-05-25T00:00:00Z
author: Hakan Çelik
title: "Shi-Tomasi Köşe Dedektörü ve İzlenecek İyi Özellikler"
excerpt: "Harris'e alternatif olan Shi-Tomasi Köşe Dedektörü'nü öğrenin. cv2.goodFeaturesToTrack() fonksiyonu ile bir görüntüdeki en güçlü köşeleri bulmayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 35
subcategory: Özellik Tespiti
image: /images/posts/opencv/shitomasi_block1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Shi-Tomasi Köşe Dedektörü ve İzlenecek İyi Özellikler

## Hedefler

Bu bölümde:

- Başka bir köşe dedektörü olan Shi-Tomasi Köşe Dedektörü'nü öğreneceğiz
- Şu fonksiyonu göreceğiz: **cv.goodFeaturesToTrack()**

## Teori

Son bölümde Harris Köşe Dedektörü'nü gördük. Daha sonra 1994 yılında J. Shi ve C. Tomasi, **Good Features to Track** adlı makalelerinde Harris Köşe Dedektörü ile karşılaştırıldığında daha iyi sonuçlar gösteren küçük bir değişiklik yaptılar. Harris Köşe Dedektörü'ndeki puanlama fonksiyonu şuydu:

**R = λ₁λ₂ - k(λ₁+λ₂)²**

Bunun yerine Shi-Tomasi şunu önerdi:

**R = min(λ₁, λ₂)**

Eşik değerinden büyükse köşe olarak kabul edilir. λ₁ ve λ₂ uzayında çizildiğinde:

![Shi-Tomasi uzayı](/images/posts/opencv/shitomasi_space.png)

Şekilden, yalnızca λ₁ ve λ₂'nin minimum bir değer olan λ_min'in üzerinde olduğu durumlarda köşe olarak kabul edildiği görülebilir (yeşil bölge).

## Kod

OpenCV'nin **cv.goodFeaturesToTrack()** fonksiyonu vardır. Shi-Tomasi yöntemiyle (veya bunu belirtirseniz Harris Köşe Tespiti ile) görüntüdeki N en güçlü köşeyi bulur. Her zamanki gibi, görüntü gri tonlamalı olmalıdır. Ardından bulmak istediğiniz köşe sayısını belirtirsiniz. Sonra, 0-1 arasında bir değer olan ve reddedilen köşelerin minimum kalitesini belirten kalite düzeyini belirtirsiniz. Ardından tespit edilen köşeler arasındaki minimum Öklid mesafesini sağlarız.

Aşağıdaki örnekte 25 en iyi köşeyi bulmaya çalışacağız:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('blox.jpg')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

corners = cv.goodFeaturesToTrack(gray, 25, 0.01, 10)
corners = np.int0(corners)

for i in corners:
    x, y = i.ravel()
    cv.circle(img, (x, y), 3, 255, -1)

plt.imshow(img), plt.show()
```

Sonuç:

![Shi-Tomasi blok](/images/posts/opencv/shitomasi_block1.jpg)

Bu fonksiyon takip için daha uygundur. Zamanı geldiğinde bunu göreceğiz.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_shi_tomasi/py_shi_tomasi.markdown)
