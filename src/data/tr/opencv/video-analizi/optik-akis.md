---
publishDate: 2022-06-03T00:00:00Z
author: Hakan Çelik
title: "Optik Akış"
excerpt: "Lucas-Kanade ve Farneback yöntemlerini kullanarak optik akışı öğrenin. cv2.calcOpticalFlowPyrLK() ile seyrek ve cv2.calcOpticalFlowFarneback() ile yoğun optik akışı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 44
subcategory: Video Analizi
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Optik Akış

## Hedefler

Bu bölümde:

- Optik akış kavramlarını anlayacağız
- Lucas-Kanade yöntemi kullanılarak optik akış tahmini için **cv.calcOpticalFlowPyrLK()** kullanacağız
- Yoğun optik akış için **cv.calcOpticalFlowFarneback()** kullanacağız

## Optik Akış

Optik akış, görüntüdeki nesnelerin ardışık kareler arasındaki görünür hareketi ifade eder. Bu, görüntü yüzeyindeki parlaklık desenlerinin görünür hareketinin 2B vektör alanıdır. Nesne hareketi veya kamera hareketi tarafından oluşturulur.

Şu varsayımları yapar:
1. Birbirini takip eden kareler arasında piksellerin yoğunluğu değişmez.
2. Komşu pikseller benzer harekete sahiptir (komşuluk kısıtlaması).

### Lucas-Kanade Yöntemi

Lucas-Kanade yöntemi, yerel bir bölgede sabit bir akış olduğunu varsayan seyrek bir optik akış yöntemidir. Küçük bir pencerede yoğunluk eşitliği denklemini çözer.

OpenCV, bu algoritmanın piramit tabanlı bir versiyonunu sunar; bu sayede büyük hareketler de yakalanabilir.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('slow.flv')

# ShiTomasi köşe tespiti için parametreler
feature_params = dict(maxCorners=100,
                      qualityLevel=0.3,
                      minDistance=7,
                      blockSize=7)

# lucas kanade optik akış için parametreler
lk_params = dict(winSize=(15, 15),
                 maxLevel=2,
                 criteria=(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03))

# Rastgele renkler oluştur
color = np.random.randint(0, 255, (100, 3))

# İlk kareyi al ve köşeleri bul
ret, old_frame = cap.read()
old_gray = cv.cvtColor(old_frame, cv.COLOR_BGR2GRAY)
p0 = cv.goodFeaturesToTrack(old_gray, mask=None, **feature_params)

# Çizim için maske görüntüsü oluştur
mask = np.zeros_like(old_frame)

while True:
    ret, frame = cap.read()
    if not ret:
        print('Daha fazla kare yok.')
        break

    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

    # optik akışı hesapla
    p1, st, err = cv.calcOpticalFlowPyrLK(old_gray, frame_gray, p0, None, **lk_params)

    # iyi noktaları seç
    if p1 is not None:
        good_new = p1[st == 1]
        good_old = p0[st == 1]

    # izleri çiz
    for i, (new, old) in enumerate(zip(good_new, good_old)):
        a, b = new.ravel().astype(int)
        c, d = old.ravel().astype(int)
        mask = cv.line(mask, (a, b), (c, d), color[i].tolist(), 2)
        frame = cv.circle(frame, (a, b), 5, color[i].tolist(), -1)

    img = cv.add(frame, mask)
    cv.imshow('frame', img)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

    # bir sonraki karede önceki kareler ve noktaları güncelle
    old_gray = frame_gray.copy()
    p0 = good_new.reshape(-1, 1, 2)

cv.destroyAllWindows()
```

### Yoğun Optik Akış

Lucas-Kanade yöntemi, seyrek bir özellik kümesi için optik akışı hesaplar. OpenCV, Gunnar Farneback tarafından 2003 yılındaki makalesi "Two-Frame Motion Estimation Based on Polynomial Expansion" ile önerilen yoğun bir optik akış yöntemi sağlar.

Aşağıdaki örnek, yoğun optik akışı göstermektedir. Sonuç, yönü gösteren açıyla birlikte renk kodlamasıyla gösterilir:

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture("vtest.avi")

ret, frame1 = cap.read()
prvs = cv.cvtColor(frame1, cv.COLOR_BGR2GRAY)
hsv = np.zeros_like(frame1)
hsv[..., 1] = 255

while True:
    ret, frame2 = cap.read()
    if not ret:
        print('Daha fazla kare yok.')
        break

    next = cv.cvtColor(frame2, cv.COLOR_BGR2GRAY)
    flow = cv.calcOpticalFlowFarneback(prvs, next, None, 0.5, 3, 15, 3, 5, 1.2, 0)

    mag, ang = cv.cartToPolar(flow[..., 0], flow[..., 1])
    hsv[..., 0] = ang * 180 / np.pi / 2
    hsv[..., 2] = cv.normalize(mag, None, 0, 255, cv.NORM_MINMAX)

    bgr = cv.cvtColor(hsv, cv.COLOR_HSV2BGR)
    cv.imshow('frame2', bgr)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

    prvs = next

cv.destroyAllWindows()
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_video/py_lucas_kanade/py_lucas_kanade.markdown)
