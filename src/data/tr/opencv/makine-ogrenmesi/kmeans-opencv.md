---
publishDate: 2022-06-14T00:00:00Z
author: Hakan Çelik
title: "OpenCV'de K-Ortalamalar Kümeleme"
excerpt: "OpenCV'de cv2.kmeans() fonksiyonunu kullanarak veri kümelemeyi öğrenin. Tek özellikli, çok özellikli ve renk nicemleme uygulamalarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 55
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/kmeans_demo.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OpenCV'de K-Ortalamalar Kümeleme

## Hedefler

- OpenCV'de veri kümeleme için **cv.kmeans()** fonksiyonunu kullanmayı öğreneceğiz

## Parametreleri Anlamak

### Giriş Parametreleri

1. **samples**: **np.float32** veri tipinde olmalıdır.
2. **nclusters (K)**: Sonunda gereken küme sayısı
3. **criteria**: Yinelemeli sonlandırma kriterleri — `(type, max_iter, epsilon)`:
   - `cv.TERM_CRITERIA_EPS` — belirtilen doğruluğa (epsilon) ulaşılınca dur
   - `cv.TERM_CRITERIA_MAX_ITER` — belirtilen yineleme sayısından sonra dur
   - `cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER` — her iki koşuldan biri karşılandığında dur
4. **attempts**: Algoritmanın farklı başlangıç etiketleriyle kaç kez çalıştırılacağını belirler
5. **flags**: Başlangıç merkezlerin nasıl alındığını belirtir: **cv.KMEANS_PP_CENTERS** veya **cv.KMEANS_RANDOM_CENTERS**

### Çıkış Parametreleri

1. **compactness**: Her noktanın karşılık gelen merkezlerine kare uzaklıklarının toplamı
2. **labels**: Etiket dizisi — her eleman '0', '1' vb. ile işaretli
3. **centers**: Küme merkezleri dizisi

## 1. Tek Özellikli Veri

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

x = np.random.randint(25, 100, 25)
y = np.random.randint(175, 255, 25)
z = np.hstack((x, y))
z = z.reshape((50, 1))
z = np.float32(z)

# Kriterleri tanımla
criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
flags = cv.KMEANS_RANDOM_CENTERS

# K-Means uygula
compactness, labels, centers = cv.kmeans(z, 2, None, criteria, 10, flags)

# Şimdi veriyi geri iki gruba ayır
A = z[labels == 0]
B = z[labels == 1]

# Şimdi çiz
plt.hist(A, 256, [0, 256], color='r')
plt.hist(B, 256, [0, 256], color='b')
plt.hist(centers, 32, [0, 256], color='y')
plt.show()
```

## 2. Çok Özellikli Veri

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

X = np.random.randint(25, 50, (25, 2))
Y = np.random.randint(60, 85, (25, 2))
Z = np.vstack((X, Y))
Z = np.float32(Z)

criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
ret, label, center = cv.kmeans(Z, 2, None, criteria, 10, cv.KMEANS_RANDOM_CENTERS)

A = Z[label.ravel() == 0]
B = Z[label.ravel() == 1]

plt.scatter(A[:, 0], A[:, 1])
plt.scatter(B[:, 0], B[:, 1], c='r')
plt.scatter(center[:, 0], center[:, 1], s=80, c='y', marker='s')
plt.xlabel('Height'), plt.ylabel('Weight')
plt.show()
```

## 3. Renk Nicemleme

Renk nicemleme, bir görüntüdeki renk sayısını azaltmaktır. Burada K-Means kullanarak görüntü renklerini nicemleyeceğiz:

```python
import numpy as np
import cv2 as cv

img = cv.imread('home.jpg')
Z = img.reshape((-1, 3))
Z = np.float32(Z)

criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
K = 8
ret, label, center = cv.kmeans(Z, K, None, criteria, 10, cv.KMEANS_RANDOM_CENTERS)

center = np.uint8(center)
res = center[label.flatten()]
res2 = res.reshape((img.shape))

cv.imshow('res2', res2)
cv.waitKey(0)
cv.destroyAllWindows()
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_kmeans/py_kmeans_opencv/py_kmeans_opencv.markdown)
