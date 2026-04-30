---
publishDate: 2022-05-24T00:00:00Z
author: Hakan Çelik
title: "Harris Köşe Tespiti"
excerpt: "Harris Köşe Tespiti'nin arkasındaki kavramları öğrenin. cv2.cornerHarris() ve cv2.cornerSubPix() fonksiyonlarını alt piksel hassasiyetiyle köşe tespiti için anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 34
subcategory: Özellik Tespiti
image: /images/posts/opencv/harris_result.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Harris Köşe Tespiti

## Hedefler

Bu bölümde:

- Harris Köşe Tespiti'nin arkasındaki kavramları anlayacağız
- Şu fonksiyonları göreceğiz: **cv.cornerHarris()**, **cv.cornerSubPix()**

## Teori

Son bölümde, görüntüdeki köşelerin tüm yönlerde yoğunluk açısından büyük varyasyon gösteren bölgeler olduğunu gördük. Bu köşeleri bulmak için ilk girişimlerden biri, 1988 yılında **A Combined Corner and Edge Detector** adlı makalelerinde **Chris Harris & Mike Stephens** tarafından yapılmıştır; şimdi Harris Köşe Dedektörü olarak adlandırılır.

Temel fikir, tüm yönlerde (u, v) kaydırma için yoğunluktaki farkı bulmaktır:

**E(u,v) = Σ w(x,y) [I(x+u,y+v) - I(x,y)]²**

Pencere fonksiyonu, altındaki piksellere ağırlık veren dikdörtgen veya Gauss penceresidir.

Bu fonksiyonu köşe tespiti için maksimize etmemiz gerekir. Taylor açılımı ve bazı matematiksel adımlar uygulandıktan sonra:

**E(u,v) ≈ [u v] M [u; v]**

burada:

**M = Σ w(x,y) [[Ix²  IxIy]; [IxIy  Iy²]]**

Burada Ix ve Iy, sırasıyla x ve y yönlerindeki görüntü türevidir.

Ardından bir pencerenin köşe içerip içermediğini belirleyen bir skor denklemi oluşturulur:

**R = det(M) - k(trace(M))²**

burada:
- det(M) = λ₁λ₂
- trace(M) = λ₁ + λ₂
- λ₁ ve λ₂, M'nin özdegerleridir

Özdegerlerin büyüklükleri, bir bölgenin köşe, kenar veya düz olup olmadığını belirler:

- |R| küçükse (λ₁ ve λ₂ küçük) → düz bölge
- R < 0 ise (λ₁ >> λ₂ veya tersi) → kenar
- R büyükse (λ₁ ve λ₂ büyük ve λ₁ ≈ λ₂) → köşe

Bu güzel bir resimle gösterilebilir:

![Harris bölgesi](/images/posts/opencv/harris_region.jpg)

## OpenCV'de Harris Köşe Dedektörü

OpenCV bu amaç için **cv.cornerHarris()** fonksiyonuna sahiptir. Argümanları:

- **img** — Giriş görüntüsü. Gri tonlamalı ve float32 tipinde olmalıdır.
- **blockSize** — Köşe tespiti için dikkate alınan komşuluk boyutu
- **ksize** — Kullanılan Sobel türevinin açıklık parametresi
- **k** — Harris dedektörünün serbest parametresi

Aşağıdaki örneğe bakın:

```python
import numpy as np
import cv2 as cv

filename = 'chessboard.png'
img = cv.imread(filename)
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

gray = np.float32(gray)
dst = cv.cornerHarris(gray, 2, 3, 0.04)

# Köşeleri işaretlemek için sonuç genişletilir
dst = cv.dilate(dst, None)

# Optimal değer için eşik, görüntüye göre değişebilir
img[dst > 0.01 * dst.max()] = [0, 0, 255]

cv.imshow('dst', img)
if cv.waitKey(0) & 0xff == 27:
    cv.destroyAllWindows()
```

Aşağıda sonuç gösterilmektedir:

![Harris sonucu](/images/posts/opencv/harris_result.jpg)

## Alt Piksel Hassasiyetiyle Köşe Tespiti

Bazen köşeleri maksimum hassasiyetle bulmanız gerekebilir. OpenCV, alt piksel hassasiyetiyle tespit edilen köşeleri daha da geliştiren **cv.cornerSubPix()** fonksiyonuna sahiptir. Aşağıda bir örnek verilmiştir. Harris köşelerini bulduktan sonra bu köşelerin centroidlerini fonksiyona geçiriyoruz. Harris köşeleri kırmızı piksellerle, rafine edilmiş köşeler ise yeşil piksellerle işaretlenir:

```python
import numpy as np
import cv2 as cv

filename = 'chessboard2.jpg'
img = cv.imread(filename)
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# Harris köşelerini bul
gray = np.float32(gray)
dst = cv.cornerHarris(gray, 2, 3, 0.04)
dst = cv.dilate(dst, None)
ret, dst = cv.threshold(dst, 0.01 * dst.max(), 255, 0)
dst = np.uint8(dst)

# Centroidleri bul
ret, labels, stats, centroids = cv.connectedComponentsWithStats(dst)

# Durma ve köşeleri rafine etme kriterini tanımla
criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 100, 0.001)
corners = cv.cornerSubPix(gray, np.float32(centroids), (5, 5), (-1, -1), criteria)

# Çiz
res = np.hstack((centroids, corners))
res = np.int0(res)
img[res[:, 1], res[:, 0]] = [0, 0, 255]
img[res[:, 3], res[:, 2]] = [0, 255, 0]

cv.imwrite('subpixel5.png', img)
```

Aşağıda bazı önemli konumların yakınlaştırılmış pencerede gösterildiği sonuç verilmiştir:

![Alt piksel hassasiyeti](/images/posts/opencv/subpixel3.png)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_features_harris/py_features_harris.markdown)
