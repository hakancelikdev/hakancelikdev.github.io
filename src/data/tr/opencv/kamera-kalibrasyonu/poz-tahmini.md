---
publishDate: 2022-06-06T00:00:00Z
author: Hakan Çelik
title: "Poz Tahmini"
excerpt: "Kamera kalibrasyonundan elde edilen verilerle 3D efektler oluşturmayı öğrenin. cv2.solvePnP() ve cv2.projectPoints() ile satranç tahtasına 3D koordinat ekseni ve küp çizmeyi anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 47
subcategory: Kamera Kalibrasyonu
image: /images/posts/opencv/pose_2.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Poz Tahmini

## Hedefler

Bu bölümde:

- 3D efektler oluşturmak için calib3d modülünü nasıl kullanacağımızı öğreneceğiz

## Temeller

Kamera kalibrasyonu bölümünde kamera matrisini, bozulma katsayılarını vb. bulduk. Bir desen görüntüsü verildiğinde, bu bilgileri kullanarak nesnenin uzaydaki konumunu hesaplayabiliriz: nasıl döndürüldüğü, nasıl yerleştirildiği vb. Düzlemsel bir nesne için Z=0 varsayabiliriz.

Amacımız, satranç tahtasının ilk köşesine 3D koordinat ekseni (X, Y, Z eksenleri) çizmektir. X ekseni mavi, Y ekseni yeşil ve Z ekseni kırmızı renkte olmalıdır.

Önce kalibrasyon sonucundan kamera matrisini ve bozulma katsayılarını yükleyelim:

```python
import numpy as np
import cv2 as cv
import glob

# Önceden kaydedilen veriyi yükle
with np.load('B.npz') as X:
    mtx, dist, _, _ = [X[i] for i in ('mtx', 'dist', 'rvecs', 'tvecs')]
```

Şimdi köşeleri ve eksen noktalarını alan bir `draw` fonksiyonu oluşturalım:

```python
def draw(img, corners, imgpts):
    corner = tuple(corners[0].ravel().astype("int32"))
    imgpts = imgpts.astype("int32")
    img = cv.line(img, corner, tuple(imgpts[0].ravel()), (255, 0, 0), 5)
    img = cv.line(img, corner, tuple(imgpts[1].ravel()), (0, 255, 0), 5)
    img = cv.line(img, corner, tuple(imgpts[2].ravel()), (0, 0, 255), 5)
    return img
```

Şimdi önceki durumda olduğu gibi, sonlandırma kriterleri, nesne noktaları ve eksen noktaları oluşturuyoruz. Eksen noktaları, ekseni çizmek için 3B uzaydaki noktalardır. 3 uzunluğunda eksen çiziyoruz (satranç karesi boyutunda). X eksenimiz (0,0,0)'dan (3,0,0)'a, Y ekseni de benzer. Z ekseni (0,0,0)'dan (0,0,-3)'e (negatif kameraya doğru çizildiği anlamına gelir):

```python
criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 30, 0.001)
objp = np.zeros((6 * 7, 3), np.float32)
objp[:, :2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)

axis = np.float32([[3, 0, 0], [0, 3, 0], [0, 0, -3]]).reshape(-1, 3)

for fname in glob.glob('left*.jpg'):
    img = cv.imread(fname)
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    ret, corners = cv.findChessboardCorners(gray, (7, 6), None)

    if ret == True:
        corners2 = cv.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)

        # Dönme ve öteleme vektörlerini bul
        ret, rvecs, tvecs = cv.solvePnP(objp, corners2, mtx, dist)

        # 3D noktaları görüntü düzlemine projelendir
        imgpts, jac = cv.projectPoints(axis, rvecs, tvecs, mtx, dist)

        img = draw(img, corners2, imgpts)
        cv.imshow('img', img)
        k = cv.waitKey(0) & 0xFF
        if k == ord('s'):
            cv.imwrite(fname[:6] + '.png', img)

cv.destroyAllWindows()
```

Her eksen 3 kare uzunluğundadır:

![3D eksen poz tahmini](/images/posts/opencv/pose_1.jpg)

### Küp Çizme

Küp çizmek istiyorsanız, `draw` fonksiyonunu ve eksen noktalarını şu şekilde değiştirin:

```python
def draw(img, corners, imgpts):
    imgpts = np.int32(imgpts).reshape(-1, 2)

    # zemin katını yeşil renkte çiz
    img = cv.drawContours(img, [imgpts[:4]], -1, (0, 255, 0), -3)

    # sütunları mavi renkte çiz
    for i, j in zip(range(4), range(4, 8)):
        img = cv.line(img, tuple(imgpts[i]), tuple(imgpts[j]), (255), 3)

    # üst katmanı kırmızı renkte çiz
    img = cv.drawContours(img, [imgpts[4:]], -1, (0, 0, 255), 3)

    return img

axis = np.float32([[0, 0, 0], [0, 3, 0], [3, 3, 0], [3, 0, 0],
                   [0, 0, -3], [0, 3, -3], [3, 3, -3], [3, 0, -3]])
```

Sonuç:

![3D küp poz tahmini](/images/posts/opencv/pose_2.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_pose/py_pose.markdown)
