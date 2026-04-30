---
publishDate: 2022-05-16T00:00:00Z
author: Hakan Çelik
title: "Histogram Geri Projeksiyonu"
excerpt: "Histogram geri projeksiyonu ile görüntü segmentasyonu ve ilgi alanındaki nesneleri bulmayı öğrenin. cv2.calcBackProject() fonksiyonunu NumPy ve OpenCV ile anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 26
subcategory: İleri Konular
image: /images/posts/opencv/backproject_opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Histogram Geri Projeksiyonu

## Hedefler

Bu bölümde öğrenecekleriniz:

- Histogram geri projeksiyonu hakkında bilgi edinmek

## Teori

Histogram geri projeksiyonu, **Michael J. Swain** ve **Dana H. Ballard** tarafından **"Indexing via color histograms"** (Renk Histogramları Aracılığıyla İndeksleme) adlı makalelerinde önerilmiştir.

**Basit bir anlatımla ne işe yarar?** Görüntü segmentasyonu veya bir görüntüdeki ilgi alanındaki nesneleri bulmak için kullanılır. Kısaca, girdi görüntümüzle aynı boyutta (ancak tek kanallı) bir görüntü oluşturur; burada her piksel, o pikselin nesnemize ait olma olasılığına karşılık gelir. Daha da basit bir ifadeyle çıktı görüntüsü, ilgi alanındaki nesneyi kalan kısmın dışında daha beyaz olarak gösterir. Histogram Geri Projeksiyonu; CamShift algoritması gibi algoritmalarda kullanılır.

**Nasıl yapılır?** İlgi alanındaki nesneyi içeren bir görüntünün histogramını oluşturursunuz (bizim durumumuzda zemin — oyuncu ve diğer şeyler hariç). Nesne, daha iyi sonuçlar için görüntüyü mümkün olduğunca doldurmalıdır. Gri tonlamalı histogram yerine renk histogramı tercih edilir, çünkü nesnenin rengi, gri tonlama yoğunluğuna kıyasla nesneyi tanımlamak için daha iyi bir yoldur. Ardından bu histogramı, nesneyi bulmamız gereken test görüntüsü üzerinde "geri projesyon" yaparız; yani her pikselin zemine ait olma olasılığını hesaplar ve gösteririz.

## NumPy ile Algoritma

1. Bulmak istediğimiz nesnenin (`M`) ve içinde arama yapacağımız görüntünün (`I`) renk histogramlarını hesaplaın:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

# roi: bulmamız gereken nesne veya nesne bölgesi
roi = cv.imread('rose_red.png')
assert roi is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsv = cv.cvtColor(roi, cv.COLOR_BGR2HSV)

# target: içinde arama yaptığımız görüntü
target = cv.imread('rose.png')
assert target is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsvt = cv.cvtColor(target, cv.COLOR_BGR2HSV)

# calcHist kullanarak histogramları bul
M = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
I = cv.calcHist([hsvt], [0, 1], None, [180, 256], [0, 180, 0, 256])
```

2. `R = M / I` oranını bulun. Ardından R'yi geri projesyon yapın; yani R'yi palet olarak kullanın ve her pikseli, hedef olma olasılığı ile yeni bir görüntü oluşturun. Yani `B(x,y) = R[h(x,y), s(x,y)]`, ardından `B(x,y) = min[B(x,y), 1]` koşulunu uygulayın:

```python
R = M / (I + 1e-5)  # Sıfıra bölmeyi önlemek için küçük bir değer ekle
h, s, v = cv.split(hsvt)
B = R[h.ravel(), s.ravel()]
B = np.minimum(B, 1)
B = B.reshape(hsvt.shape[:2])
```

3. Daire disk çekirdeğiyle konvolüsyon uygulayın (`B = D * B`):

```python
disc = cv.getStructuringElement(cv.MORPH_ELLIPSE, (5, 5))
cv.filter2D(B, -1, disc, B)
B = np.uint8(B)
cv.normalize(B, B, 0, 255, cv.NORM_MINMAX)
```

4. Şimdi maksimum yoğunluğun konumu bize nesnenin konumunu verir. Görüntüde bir bölge bekliyorsak uygun bir değer için eşikleme iyi bir sonuç verir:

```python
ret, thresh = cv.threshold(B, 50, 255, 0)
```

## OpenCV ile Geri Projeksiyon

OpenCV, `cv2.calcBackProject()` adında yerleşik bir fonksiyon sağlar. Parametreleri `cv2.calcHist()` fonksiyonuyla neredeyse aynıdır. Parametrelerinden biri, bulmamız gereken nesnenin histogramıdır ve geri projeksiyon fonksiyonuna aktarmadan önce normalize edilmesi gerekir. Olasılık görüntüsünü döndürür. Ardından görüntüyü bir disk çekirdeğiyle konvolüsyon yapıyoruz ve eşikleme uyguluyoruz:

```python
import numpy as np
import cv2 as cv

roi = cv.imread('rose_red.png')
assert roi is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsv = cv.cvtColor(roi, cv.COLOR_BGR2HSV)

target = cv.imread('rose.png')
assert target is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsvt = cv.cvtColor(target, cv.COLOR_BGR2HSV)

# Nesne histogramını hesapla
roihist = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])

# Histogramı normalize et ve geri projeksiyon uygula
cv.normalize(roihist, roihist, 0, 255, cv.NORM_MINMAX)
dst = cv.calcBackProject([hsvt], [0, 1], roihist, [0, 180, 0, 256], 1)

# Daire diskle konvolüsyon uygula
disc = cv.getStructuringElement(cv.MORPH_ELLIPSE, (5, 5))
cv.filter2D(dst, -1, disc, dst)

# Eşikle ve ikili AND uygula
ret, thresh = cv.threshold(dst, 50, 255, 0)
thresh = cv.merge((thresh, thresh, thresh))
res = cv.bitwise_and(target, thresh)

res = np.vstack((target, thresh, res))
cv.imwrite('res.jpg', res)
```

Aşağıda üzerinde çalıştığım bir örnek yer almaktadır. Mavi dikdörtgenin içindeki bölgeyi örnek nesne olarak kullandım ve tam zemini çıkarmak istedim:

![Histogram geri projeksiyon sonucu](/images/posts/opencv/backproject_opencv.jpg)

## Ek Kaynaklar

- "Indexing via color histograms", Swain, Michael J., Third International Conference on Computer Vision, 1990.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_histograms/py_histogram_backprojection/py_histogram_backprojection.markdown)
