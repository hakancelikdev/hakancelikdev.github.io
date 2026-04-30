---
publishDate: 2022-06-01T00:00:00Z
author: Hakan Çelik
title: "Özellik Eşleştirme + Nesneleri Bulmak için Homografi"
excerpt: "Karmaşık bir görüntüde bilinen nesneleri bulmak için özellik eşleştirme ve findHomography'yi birleştirmeyi öğrenin. RANSAC ile sağlam perspektif dönüşümü hesaplamayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 42
subcategory: Özellik Tespiti
image: /images/posts/opencv/homography_findobj.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Özellik Eşleştirme + Nesneleri Bulmak için Homografi

## Hedefler

Bu bölümde:

- Karmaşık bir görüntüde bilinen nesneleri bulmak için calib3d modülünden özellik eşleştirme ve findHomography'yi birleştireceğiz

## Temel Bilgiler

Son oturumda ne yaptık? Bir sorgu görüntüsü aldık, içinde bazı özellik noktaları bulduk, başka bir eğitim görüntüsü aldık, o görüntüdeki özellikleri bulduk ve aralarındaki en iyi eşleşmeleri bulduk. Kısacası, bir nesnenin bazı bölgelerini karmaşık başka bir görüntüde bulduk. Bu bilgi, nesneyi eğitim görüntüsünde tam olarak bulmak için yeterlidir.

Bunun için calib3d modülünden **cv.findHomography()** fonksiyonunu kullanabiliriz. Her iki görüntüden nokta setini geçirirsek, o nesnenin perspektif dönüşümünü bulur. Ardından nesneyi bulmak için **cv.perspectiveTransform()** kullanabiliriz. Dönüşümü bulmak için en az dört doğru nokta gereklidir.

Eşleştirme sırasında bazı hatalar olabilir. Bu sorunu çözmek için algoritma RANSAC veya LEAST_MEDIAN kullanır. İyi eşleşmeler inlier, geri kalanlar ise outlier olarak adlandırılır. **cv.findHomography()** inlier ve outlier noktaları belirten bir maske döndürür.

## Kod

Önce görüntülerde SIFT özelliklerini bulalım ve en iyi eşleşmeleri bulmak için oran testini uygulayalım:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

MIN_MATCH_COUNT = 10

img1 = cv.imread('box.png', cv.IMREAD_GRAYSCALE)          # sorgu görüntüsü
img2 = cv.imread('box_in_scene.png', cv.IMREAD_GRAYSCALE)  # eğitim görüntüsü

sift = cv.SIFT_create()

kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

FLANN_INDEX_KDTREE = 1
index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
search_params = dict(checks=50)

flann = cv.FlannBasedMatcher(index_params, search_params)
matches = flann.knnMatch(des1, des2, k=2)

# Lowe'un oran testine göre tüm iyi eşleşmeleri sakla
good = []
for m, n in matches:
    if m.distance < 0.7 * n.distance:
        good.append(m)
```

Şimdi en az 10 eşleşme olması koşulunu belirliyoruz. Yeterli eşleşme bulunursa, eşleştirilen anahtar noktaların konumlarını her iki görüntüden çıkarıyoruz. Perspektif dönüşümü bulmak için bunlar geçirilir. Bu 3×3 dönüşüm matrisini elde ettikten sonra, sorgu görüntüsünün köşelerini eğitim görüntüsündeki karşılıklı noktalara dönüştürmek için kullanırız:

```python
if len(good) > MIN_MATCH_COUNT:
    src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

    M, mask = cv.findHomography(src_pts, dst_pts, cv.RANSAC, 5.0)
    matchesMask = mask.ravel().tolist()

    h, w = img1.shape
    pts = np.float32([[0, 0], [0, h - 1], [w - 1, h - 1], [w - 1, 0]]).reshape(-1, 1, 2)
    dst = cv.perspectiveTransform(pts, M)

    img2 = cv.polylines(img2, [np.int32(dst)], True, 255, 3, cv.LINE_AA)

else:
    print("Yeterli eşleşme bulunamadı - {}/{}".format(len(good), MIN_MATCH_COUNT))
    matchesMask = None

draw_params = dict(matchColor=(0, 255, 0),  # eşleşmeleri yeşil çiz
                   singlePointColor=None,
                   matchesMask=matchesMask,  # yalnızca inlierleri çiz
                   flags=2)

img3 = cv.drawMatches(img1, kp1, img2, kp2, good, None, **draw_params)

plt.imshow(img3, 'gray'), plt.show()
```

Aşağıda sonuca bakın. Nesne, karmaşık görüntüde beyaz renkle işaretlenmiştir:

![Homografi nesne bulma](/images/posts/opencv/homography_findobj.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_feature_homography/py_feature_homography.markdown)
