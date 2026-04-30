---
publishDate: 2022-06-07T00:00:00Z
author: Hakan Çelik
title: "Epipolar Geometri"
excerpt: "Çok görüntülü geometrinin temellerini öğrenin. Epipol, epilineler, epipolar kısıtlama, Temel Matris ve Temel Matris'i OpenCV ile bulmayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 48
subcategory: Kamera Kalibrasyonu
image: /images/posts/opencv/epiresult.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Epipolar Geometri

## Hedefler

Bu bölümde:

- Çok görüntülü geometrinin temellerini öğreneceğiz
- Epipol, epilineler, epipolar kısıtlama nedir bunları göreceğiz

## Temel Kavramlar

Delikli kamera kullanarak görüntü aldığımızda önemli bir bilgiyi kaybederiz: görüntünün derinliği. 3D'den 2D'ye dönüşüm olduğundan her noktanın kameradan ne kadar uzakta olduğunu bilemeyiz. Bu kameraları kullanarak derinlik bilgisini bulabilir miyiz sorusu ortaya çıkar. Cevap: birden fazla kamera kullanmak.

Aşağıdaki görüntü, aynı sahneyi çeken iki kameraya sahip temel bir kurulumu göstermektedir:

![Epipolar kurulum](/images/posts/opencv/epipolar.jpg)

Yalnızca sol kamerayı kullanıyorsak, OX doğrusu üzerindeki her nokta görüntü düzlemindeki aynı noktaya projeksiyonlandığından, görüntüdeki x noktasına karşılık gelen 3D noktayı bulamayız. Ancak sağ görüntüyü de dikkate alırsak, OX doğrusu üzerindeki farklı noktalar sağ düzlemdeki farklı noktalara (x') projeksiyonlanır. Bu iki görüntüyle doğru 3D noktayı üçgenleyebiliriz.

OX üzerindeki farklı noktaların projeksiyonu sağ düzlemde bir doğru (l') oluşturur. Buna **x noktasına karşılık gelen epilin** diyoruz. Başka bir görüntüdeki eşleşen noktayı bulmak için tüm görüntüyü aramaya gerek yoktur; yalnızca epilin boyunca arama yapılır. Buna **Epipolar Kısıtlama** denir. XOO' düzlemi ise **Epipolar Düzlem** olarak adlandırılır.

O ve O' kamera merkezleridir. Sağ kamera O'nun projeksiyonu, sol görüntüde e noktasında görünür. Buna **epipol** denir. Tüm epilineler epolden geçer.

Bu epilineleri ve epolleri bulmak için iki malzemeye ihtiyacımız var: **Temel Matris (F)** ve **Temel Matris (E)**.

**Temel Matris (E)**, ikinci kameranın birinciye göre konumunu tanımlayan öteleme ve dönme hakkında bilgi içerir:

![Temel matris](/images/posts/opencv/essential_matrix.jpg)

**Temel Matris (F)**, Temel Matrisin aynı bilgisini artı her iki kameranın iç parametrelerini içerir, böylece iki kamerayı piksel koordinatlarında ilişkilendirebiliriz.

## Kod

Temel matrisi bulmak için iki görüntü arasında mümkün olduğunca çok eşleşme bulmamız gerekir. Bunun için SIFT tanımlayıcılarını FLANN tabanlı eşleştirici ve oran testiyle kullanırız:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img1 = cv.imread('myleft.jpg', cv.IMREAD_GRAYSCALE)
img2 = cv.imread('myright.jpg', cv.IMREAD_GRAYSCALE)

sift = cv.SIFT_create()

kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

FLANN_INDEX_KDTREE = 1
index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
search_params = dict(checks=50)

flann = cv.FlannBasedMatcher(index_params, search_params)
matches = flann.knnMatch(des1, des2, k=2)

pts1 = []
pts2 = []

for i, (m, n) in enumerate(matches):
    if m.distance < 0.8 * n.distance:
        pts2.append(kp2[m.trainIdx].pt)
        pts1.append(kp1[m.queryIdx].pt)

# Temel Matrisi bul
pts1 = np.int32(pts1)
pts2 = np.int32(pts2)
F, mask = cv.findFundamentalMat(pts1, pts2, cv.FM_LMEDS)

# Yalnızca inlier noktaları seç
pts1 = pts1[mask.ravel() == 1]
pts2 = pts2[mask.ravel() == 1]
```

Şimdi epilineleri buluyoruz ve görüntülere çiziyoruz:

```python
def drawlines(img1, img2, lines, pts1, pts2):
    r, c = img1.shape
    img1 = cv.cvtColor(img1, cv.COLOR_GRAY2BGR)
    img2 = cv.cvtColor(img2, cv.COLOR_GRAY2BGR)
    for r, pt1, pt2 in zip(lines, pts1, pts2):
        color = tuple(np.random.randint(0, 255, 3).tolist())
        x0, y0 = map(int, [0, -r[2] / r[1]])
        x1, y1 = map(int, [c, -(r[2] + r[0] * c) / r[1]])
        img1 = cv.line(img1, (x0, y0), (x1, y1), color, 1)
        img1 = cv.circle(img1, tuple(pt1), 5, color, -1)
        img2 = cv.circle(img2, tuple(pt2), 5, color, -1)
    return img1, img2

# İkinci görüntüdeki noktalara karşılık gelen birinci görüntüdeki epilineleri bul
lines1 = cv.computeCorrespondEpilines(pts2.reshape(-1, 1, 2), 2, F)
lines1 = lines1.reshape(-1, 3)
img5, img6 = drawlines(img1, img2, lines1, pts1, pts2)

# Birinci görüntüdeki noktalara karşılık gelen ikinci görüntüdeki epilineleri bul
lines2 = cv.computeCorrespondEpilines(pts1.reshape(-1, 1, 2), 1, F)
lines2 = lines2.reshape(-1, 3)
img3, img4 = drawlines(img2, img1, lines2, pts2, pts1)

plt.subplot(121), plt.imshow(img5)
plt.subplot(122), plt.imshow(img3)
plt.show()
```

![Epipolar sonucu](/images/posts/opencv/epiresult.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_epipolar_geometry/py_epipolar_geometry.markdown)
