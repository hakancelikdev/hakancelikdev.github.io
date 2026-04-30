---
publishDate: 2022-05-31T00:00:00Z
author: Hakan Çelik
title: "Özellik Eşleştirme"
excerpt: "Bir görüntüdeki özellikleri diğerleriyle eşleştirmeyi öğrenin. Kaba Kuvvet eşleştiricisi ve FLANN tabanlı eşleştiriciyi ORB ve SIFT tanımlayıcılarıyla anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 41
subcategory: Özellik Tespiti
image: /images/posts/opencv/matcher_result1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Özellik Eşleştirme

## Hedefler

Bu bölümde:

- Bir görüntüdeki özelliklerin diğerleriyle nasıl eşleştirileceğini göreceğiz
- OpenCV'de Kaba Kuvvet eşleştiricisi ve FLANN Eşleştiricisini kullanacağız

## Kaba Kuvvet Eşleştiricisinin Temelleri

Kaba Kuvvet eşleştiricisi basittir. İlk setin bir özelliğinin tanımlayıcısını alır ve bazı mesafe hesaplamaları kullanarak ikinci setteki diğer tüm özelliklerle eşleştirir. En yakın olan döndürülür.

BF eşleştiricisi için, **cv.BFMatcher()** kullanarak BFMatcher nesnesi oluşturulmalıdır. İki isteğe bağlı parametre alır:
- **normType** — mesafe ölçümünü belirtir. Varsayılan cv.NORM_L2'dir (SIFT, SURF için iyidir). ORB, BRIEF, BRISK gibi ikili dize tabanlı tanımlayıcılar için Hamming mesafesini kullanan cv.NORM_HAMMING kullanılmalıdır.
- **crossCheck** — True ise yalnızca çapraz eşleşmeleri döndürür; bu, SIFT makalesindeki oran testinin iyi bir alternatifidir.

İki önemli yöntem vardır: **BFMatcher.match()** (en iyi eşleşmeyi döndürür) ve **BFMatcher.knnMatch()** (k en iyi eşleşmeyi döndürür).

**cv.drawMatches()** eşleşmeleri çizmemize yardımcı olur. İki görüntüyü yatay olarak yığar ve en iyi eşleşmeleri gösteren çizgiler çizer.

### ORB Tanımlayıcılarıyla Kaba Kuvvet Eşleştirmesi

```python
import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt

img1 = cv.imread('box.png', cv.IMREAD_GRAYSCALE)          # sorgu görüntüsü
img2 = cv.imread('box_in_scene.png', cv.IMREAD_GRAYSCALE)  # eğitim görüntüsü

# ORB dedektörünü başlat
orb = cv.ORB_create()

# ORB ile anahtar noktaları ve tanımlayıcıları bul
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)

# cv.NORM_HAMMING ile BFMatcher nesnesi oluştur
bf = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)

# Tanımlayıcıları eşleştir
matches = bf.match(des1, des2)

# Mesafe sırasına göre sırala
matches = sorted(matches, key=lambda x: x.distance)

# İlk 10 eşleşmeyi çiz
img3 = cv.drawMatches(img1, kp1, img2, kp2, matches[:10], None, flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)

plt.imshow(img3), plt.show()
```

![Eşleştirme sonucu 1](/images/posts/opencv/matcher_result1.jpg)

### DMatch Nesnesi Nedir?

`matches = bf.match(des1, des2)` satırının sonucu bir DMatch nesneleri listesidir. Bu DMatch nesnesi şu özelliklere sahiptir:
- **DMatch.distance** — Tanımlayıcılar arasındaki mesafe. Düşük olan daha iyidir.
- **DMatch.trainIdx** — Eğitim tanımlayıcılarındaki tanımlayıcı indeksi
- **DMatch.queryIdx** — Sorgu tanımlayıcılarındaki tanımlayıcı indeksi
- **DMatch.imgIdx** — Eğitim görüntüsünün indeksi

### SIFT Tanımlayıcılarıyla Kaba Kuvvet Eşleştirmesi ve Oran Testi

```python
import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt

img1 = cv.imread('box.png', cv.IMREAD_GRAYSCALE)
img2 = cv.imread('box_in_scene.png', cv.IMREAD_GRAYSCALE)

# SIFT dedektörünü başlat
sift = cv.SIFT_create()

# SIFT ile anahtar noktaları ve tanımlayıcıları bul
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

# Varsayılan parametrelerle BFMatcher
bf = cv.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)

# Oran testini uygula
good = []
for m, n in matches:
    if m.distance < 0.75 * n.distance:
        good.append([m])

# cv.drawMatchesKnn, eşleşmeler için liste listesi bekler
img3 = cv.drawMatchesKnn(img1, kp1, img2, kp2, good, None, flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)

plt.imshow(img3), plt.show()
```

![Eşleştirme sonucu 2](/images/posts/opencv/matcher_result2.jpg)

## FLANN Tabanlı Eşleştirici

FLANN, Yaklaşık En Yakın Komşular için Hızlı Kütüphane anlamına gelir. Büyük veri setlerinde ve yüksek boyutlu özellikler için hızlı en yakın komşu araması için optimize edilmiş algoritmalar içerir. Büyük veri setleri için BFMatcher'dan daha hızlı çalışır.

FLANN tabanlı eşleştirici için, kullanılacak algoritmayı ve ilgili parametrelerini belirten iki sözlük geçirmemiz gerekir:

```python
# SIFT, SURF vb. için:
FLANN_INDEX_KDTREE = 1
index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)

# ORB için:
FLANN_INDEX_LSH = 6
index_params = dict(algorithm=FLANN_INDEX_LSH,
                    table_number=6,
                    key_size=12,
                    multi_probe_level=1)
```

```python
import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt

img1 = cv.imread('box.png', cv.IMREAD_GRAYSCALE)
img2 = cv.imread('box_in_scene.png', cv.IMREAD_GRAYSCALE)

sift = cv.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

FLANN_INDEX_KDTREE = 1
index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
search_params = dict(checks=50)

flann = cv.FlannBasedMatcher(index_params, search_params)
matches = flann.knnMatch(des1, des2, k=2)

matchesMask = [[0, 0] for i in range(len(matches))]

for i, (m, n) in enumerate(matches):
    if m.distance < 0.7 * n.distance:
        matchesMask[i] = [1, 0]

draw_params = dict(matchColor=(0, 255, 0),
                   singlePointColor=(255, 0, 0),
                   matchesMask=matchesMask,
                   flags=cv.DrawMatchesFlags_DEFAULT)

img3 = cv.drawMatchesKnn(img1, kp1, img2, kp2, matches, None, **draw_params)

plt.imshow(img3), plt.show()
```

![FLANN eşleştiricisi](/images/posts/opencv/matcher_flann.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_matcher/py_matcher.markdown)
