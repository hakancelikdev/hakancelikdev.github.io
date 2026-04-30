---
publishDate: 2022-06-05T00:00:00Z
author: Hakan Çelik
title: "Kamera Kalibrasyonu"
excerpt: "Kamera bozulma türlerini ve kameranın iç/dış parametrelerini bulmayı öğrenin. cv2.calibrateCamera() ve cv2.undistort() fonksiyonlarını satranç tahtası deseni ile kalibrasyonda anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 46
subcategory: Kamera Kalibrasyonu
image: /images/posts/opencv/calib_result.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Kamera Kalibrasyonu

## Hedefler

Bu bölümde:

- Kameraların neden olduğu bozulma türlerini öğreneceğiz
- Kameranın iç ve dış parametrelerini nasıl bulacağımızı öğreneceğiz
- Bu parametrelere dayanarak görüntüleri nasıl düzelteceğimizi öğreneceğiz

## Temeller

Bazı delikli kameralar görüntülere önemli bozulmalar ekler. İki ana bozulma türü vardır: radyal bozulma ve teğetsel bozulma.

**Radyal bozulma**, düz çizgilerin eğri görünmesine neden olur. Görüntünün merkezinden uzaklaştıkça daha fazla radyal bozulma olur:

![Radyal bozulma](/images/posts/opencv/calib_radial.jpg)

Radyal bozulma şu şekilde temsil edilebilir:

x_bozulmus = x(1 + k₁r² + k₂r⁴ + k₃r⁶)
y_bozulmus = y(1 + k₁r² + k₂r⁴ + k₃r⁶)

**Teğetsel bozulma**, görüntü çekme merceği görüntüleme düzlemine tam olarak paralel hizalanmadığında ortaya çıkar:

x_bozulmus = x + [2p₁xy + p₂(r² + 2x²)]
y_bozulmus = y + [p₁(r² + 2y²) + 2p₂xy]

Kısa özetle, beş bozulma katsayısını bulmamız gerekir: **(k₁, k₂, p₁, p₂, k₃)**

Bunlara ek olarak, odak uzunlukları (fx, fy) ve optik merkezler (cx, cy) gibi bilgileri içeren iç parametreler gereklidir. Kamera matrisi şu 3×3 matris olarak ifade edilir:

```
kamera_matrisi = [[fx, 0, cx],
                   [0, fy, cy],
                   [0,  0,  1]]
```

Kamera matrisine erişmek için iyi tanımlanmış bir desen (örneğin satranç tahtası) içeren bazı örnek görüntüler sağlamalıyız. Gerçek dünya uzayındaki koordinatlarını ve görüntüdeki koordinatlarını bildiğimiz noktalar üzerinden bozulma katsayılarını çözebiliriz. Daha iyi sonuçlar için en az 10 test deseni gereklidir.

## Kod

```python
import numpy as np
import cv2 as cv
import glob

# Sonlandırma kriterleri
criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 30, 0.001)

# Nesne noktalarını hazırla (0,0,0), (1,0,0), (2,0,0) ..., (6,5,0)
objp = np.zeros((6 * 7, 3), np.float32)
objp[:, :2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)

# Tüm görüntülerden nesne noktaları ve görüntü noktalarını saklayacak diziler
objpoints = []  # 3D gerçek dünya noktaları
imgpoints = []  # 2D görüntü düzlemi noktaları

images = glob.glob('*.jpg')

for fname in images:
    img = cv.imread(fname)
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    # Satranç tahtası köşelerini bul
    ret, corners = cv.findChessboardCorners(gray, (7, 6), None)

    # Bulunursa, nesne noktaları ve görüntü noktaları ekle
    if ret == True:
        objpoints.append(objp)

        corners2 = cv.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
        imgpoints.append(corners2)

        # Köşeleri çiz ve göster
        cv.drawChessboardCorners(img, (7, 6), corners2, ret)
        cv.imshow('img', img)
        cv.waitKey(500)

cv.destroyAllWindows()
```

Desen üzerine çizilmiş bir görüntü:

![Kalibrasyon deseni](/images/posts/opencv/calib_pattern.jpg)

### Kalibrasyon

Nesne noktaları ve görüntü noktalarımız hazır. Kalibrasyon için kamera matrisini, bozulma katsayılarını, dönme ve öteleme vektörlerini döndüren **cv.calibrateCamera()** fonksiyonunu kullanırız:

```python
ret, mtx, dist, rvecs, tvecs = cv.calibrateCamera(objpoints, imgpoints, gray.shape[::-1], None, None)
```

### Bozulmayı Giderme

**Yöntem 1: cv.undistort() kullanarak**

```python
img = cv.imread('left12.jpg')
h, w = img.shape[:2]
newcameramtx, roi = cv.getOptimalNewCameraMatrix(mtx, dist, (w, h), 1, (w, h))

# Bozulmayı gider
dst = cv.undistort(img, mtx, dist, None, newcameramtx)

# Görüntüyü kırp
x, y, w, h = roi
dst = dst[y:y + h, x:x + w]
cv.imwrite('calibresult.png', dst)
```

**Yöntem 2: Yeniden Eşleme kullanarak**

```python
mapx, mapy = cv.initUndistortRectifyMap(mtx, dist, None, newcameramtx, (w, h), 5)
dst = cv.remap(img, mapx, mapy, cv.INTER_LINEAR)

x, y, w, h = roi
dst = dst[y:y + h, x:x + w]
cv.imwrite('calibresult.png', dst)
```

Her iki yöntem de aynı sonucu verir:

![Kalibrasyon sonucu](/images/posts/opencv/calib_result.jpg)

Tüm kenarların düz olduğunu görebilirsiniz.

### Yeniden Projeksiyon Hatası

Yeniden projeksiyon hatası, bulunan parametrelerin ne kadar doğru olduğu hakkında iyi bir tahmin sağlar:

```python
mean_error = 0
for i in range(len(objpoints)):
    imgpoints2, _ = cv.projectPoints(objpoints[i], rvecs[i], tvecs[i], mtx, dist)
    error = cv.norm(imgpoints[i], imgpoints2, cv.NORM_L2SQR) / len(imgpoints2)
    mean_error += error

print("toplam hata: {}".format(np.sqrt(mean_error / len(objpoints))))
```

## Alıştırmalar

1. Dairesel ızgara ile kamera kalibrasyonunu deneyin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_calibration/py_calibration.markdown)
