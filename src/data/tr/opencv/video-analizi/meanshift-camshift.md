---
publishDate: 2022-06-02T00:00:00Z
author: Hakan Çelik
title: "Meanshift ve Camshift ile Nesne Takibi"
excerpt: "Meanshift ve Camshift algoritmalarını kullanarak nesneleri görüntülerde takip etmeyi öğrenin. cv2.meanShift() ve cv2.CamShift() fonksiyonlarını renk histogramıyla nesne takibinde anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 43
subcategory: Video Analizi
image: /images/posts/opencv/feature_building.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Meanshift ve Camshift ile Nesne Takibi

## Hedefler

Bu bölümde:

- Nesneleri takip etmek için Meanshift ve Camshift algoritmaları hakkında bilgi edineceğiz
- **cv.meanShift()** ve **cv.CamShift()** fonksiyonlarını öğreneceğiz

## Meanshift

Meanshift algoritmasının arkasındaki fikir çok basittir. Bir nokta setiniz olduğunu varsayalım (piksel dağılımı, histogram gibi olabilir). Küçük bir pencere verildiğinde, bu pencereyi maksimum yoğunluklu bölgeye (veya en fazla nokta sayısına) taşımak istiyorsunuz. Aşağıdaki basit görüntüde gösterildiği gibi:

Başlangıç penceresi mavi daire ile "C1" etiketiyle gösterilir. Orijinal merkezi "C1_o" noktasıyla gösterilen mavi dikdörtgen olarak gösterilir. Pencerenin içindeki tüm noktaların centroidini hesaplarsanız, bu noktaların ağırlık merkezini "C1_r" ile gösterilen bir noktada elde edersiniz ve pencereyi yeni merkeze taşırsınız. Süreci tekrar uygularsınız, pencereyi taşırsınız ta ki yakınsayıncaya kadar, yani pencere merkezi ve centroid aynı yerde olana kadar.

### OpenCV'de Meanshift

OpenCV'de Meanshift kullanmak için önce hedef nesneyi tanımlamamız gerekiyor. Bu nesneyi bir histogram ile temsil ediyoruz. Hedef nesneyi başlangıçta elle seçiyoruz veya buluyoruz. Sonra her karedeki nesneyi takip etmek için `cv.meanShift()` kullanıyoruz.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('slow.flv')

# nesnenin başlangıç konumunu al
ret, frame = cap.read()

# kurulum için r, h, c, w'yi değiştirin
r, h, c, w = 250, 90, 400, 125
track_window = (c, r, w, h)

# ilgi bölgesini kur
roi = frame[r:r+h, c:c+w]
hsv_roi = cv.cvtColor(roi, cv.COLOR_BGR2HSV)
mask = cv.inRange(hsv_roi, np.array((0., 60., 32.)), np.array((180., 255., 255.)))
roi_hist = cv.calcHist([hsv_roi], [0], mask, [180], [0, 180])
cv.normalize(roi_hist, roi_hist, 0, 255, cv.NORM_MINMAX)

# Sonlandırma kriteri: 10 iterasyon veya en az 1 piksel hareket et
term_crit = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 1)

while True:
    ret, frame = cap.read()

    if ret == True:
        hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
        dst = cv.calcBackProject([hsv], [0], roi_hist, [0, 180], 1)

        # meanshift uygula
        ret, track_window = cv.meanShift(dst, track_window, term_crit)

        # sonucu resme çiz
        x, y, w, h = track_window
        img2 = cv.rectangle(frame, (x, y), (x + w, y + h), 255, 2)
        cv.imshow('img2', img2)

        k = cv.waitKey(30) & 0xff
        if k == 27:
            break
    else:
        break
```

## Camshift

Dikkat ettiniz mi, Meanshift pencerenin boyutunu değiştirmiyor. Nesne kameraya yaklaşırken pencere aynı boyutta kalıyor, bu iyi değil. Bu sorunu çözmek için **CAMshift (Sürekli Uyarlanabilir Meanshift)** algoritması önerildi.

Camshift, önce nesnenin renginin geri projeksiyonunu hesaplar. Ardından Meanshift'i uygular. Meanshift yakınsadıktan sonra pencere boyutunu ve yönelimini güncelliyor. Sonra pencereyi küçük bir miktarda genişletiyor ve yeni boyutu bulmak için Meanshift'i yeniden uyguluyor. Bu süreç yakınsamaya kadar devam eder.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('slow.flv')

ret, frame = cap.read()
r, h, c, w = 250, 90, 400, 125
track_window = (c, r, w, h)

roi = frame[r:r+h, c:c+w]
hsv_roi = cv.cvtColor(roi, cv.COLOR_BGR2HSV)
mask = cv.inRange(hsv_roi, np.array((0., 60., 32.)), np.array((180., 255., 255.)))
roi_hist = cv.calcHist([hsv_roi], [0], mask, [180], [0, 180])
cv.normalize(roi_hist, roi_hist, 0, 255, cv.NORM_MINMAX)

term_crit = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 1)

while True:
    ret, frame = cap.read()

    if ret == True:
        hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
        dst = cv.calcBackProject([hsv], [0], roi_hist, [0, 180], 1)

        # Meanshift yerine Camshift uygula
        ret, track_window = cv.CamShift(dst, track_window, term_crit)

        # döndürülmüş dikdörtgen çiz
        pts = cv.boxPoints(ret)
        pts = np.int0(pts)
        img2 = cv.polylines(frame, [pts], True, 255, 2)
        cv.imshow('img2', img2)

        k = cv.waitKey(30) & 0xff
        if k == 27:
            break
    else:
        break
```

Camshift, nesne büyürken veya küçülürken pencereyi uygun şekilde ölçeklendirir, bu onu Meanshift'ten çok daha sağlam kılar.

## Ek Kaynaklar

1. [Camshift algoritması üzerine French Wikipedia makalesine dayalı İngilizce makale](https://en.wikipedia.org/wiki/Camshift)
2. Bradski, G.R., "Computer Vision Face Tracking For Use in a Perceptual User Interface", Intel Technology Journal, Q2 1998

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_video/py_meanshift/py_meanshift.markdown)
