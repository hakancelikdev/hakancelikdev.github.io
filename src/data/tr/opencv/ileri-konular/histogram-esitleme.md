---
publishDate: 2022-05-14T00:00:00Z
author: Hakan Çelik
title: "Histogram Eşitleme"
excerpt: "Histogram eşitleme ile görüntü kontrastını iyileştirmeyi öğrenin. cv2.equalizeHist() ve CLAHE (Kontrast Sınırlı Adaptif Histogram Eşitleme) yöntemlerini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 24
subcategory: İleri Konular
image: /images/posts/opencv/equalization_opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Histogram Eşitleme

## Hedefler

Bu bölümde öğrenecekleriniz:

- Histogram eşitleme kavramı
- Görüntülerin kontrastını iyileştirmek için kullanmak

## Teori

Piksel değerlerinin yalnızca belirli bir aralıkla sınırlı olduğu bir görüntüyü düşünün. Örneğin daha parlak bir görüntü, piksellerinin tamamını yüksek değerlerde barındıracaktır. Ancak iyi bir görüntünün pikselleri görüntünün tüm bölgelerinden gelir. Bu nedenle histogramı her iki uca doğru uzatmanız gerekir — Histogram Eşitlemenin kısaca yaptığı şey budur. Bu genellikle görüntünün kontrastını iyileştirir.

![Histogram eşitleme diyagramı](/images/posts/opencv/histogram_equalization.png)

Daha fazla bilgi için [Wikipedia'daki Histogram Eşitleme](http://en.wikipedia.org/wiki/Histogram_equalization) sayfasını okumanızı öneririm. Burada NumPy uygulamasını ve ardından OpenCV fonksiyonunu göreceğiz.

## NumPy ile Histogram Eşitleme

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('wiki.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"

hist, bins = np.histogram(img.flatten(), 256, [0, 256])

cdf = hist.cumsum()
cdf_normalized = cdf * float(hist.max()) / cdf.max()

plt.plot(cdf_normalized, color='b')
plt.hist(img.flatten(), 256, [0, 256], color='r')
plt.xlim([0, 256])
plt.legend(('cdf', 'histogram'), loc='upper left')
plt.show()
```

![Histogram NumPy 1](/images/posts/opencv/histeq_numpy1.jpg)

Histogramın daha parlak bölgede yer aldığını görebilirsiniz. Tam bir spectrum elde etmemiz gerekiyor. Bunun için parlak bölgedeki giriş piksellerini tam bölgedeki çıkış piksellerine eşleyen bir dönüşüm fonksiyonuna ihtiyaç duyarız. Histogram eşitlemenin yaptığı tam da budur.

Şimdi minimum histogram değerini bulun (0 hariç) ve histogramı eşitleyin:

```python
cdf_m = np.ma.masked_equal(cdf, 0)
cdf_m = (cdf_m - cdf_m.min()) * 255 / (cdf_m.max() - cdf_m.min())
cdf = np.ma.filled(cdf_m, 0).astype('uint8')
```

Artık her giriş piksel değeri için çıkış piksel değerini veren bir arama tablosuna sahibiz. Dönüşümü uygulayın:

```python
img2 = cdf[img]
```

Histogram ve kümülatif dağılım fonksiyonu (CDF) hesaplanır ve sonuç aşağıdaki gibi görünür:

![Histogram NumPy 2](/images/posts/opencv/histeq_numpy2.jpg)

Önemli bir özellik: görüntü daha parlak yerine daha karanlık olsa bile eşitlemeden sonra neredeyse aynı sonucu elde ederiz. Bu nedenle bu yöntem, tüm görüntüleri aynı aydınlatma koşullarına getirmek için bir "referans aracı" olarak kullanılır. Örneğin yüz tanımada, yüz verileri eğitilmeden önce görüntüler histogram eşitlemeye tabi tutulur.

## OpenCV ile Histogram Eşitleme

OpenCV bunun için `cv2.equalizeHist()` fonksiyonuna sahiptir. Giriş yalnızca gri tonlamalı görüntüdür ve çıktı histogram eşitlenmiş görüntüdür:

```python
img = cv.imread('wiki.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
equ = cv.equalizeHist(img)
res = np.hstack((img, equ))  # Görüntüleri yan yana yerleştir
cv.imwrite('res.png', res)
```

![OpenCV histogram eşitleme](/images/posts/opencv/equalization_opencv.jpg)

Histogram eşitleme, histogramın belirli bir bölgeyle sınırlı olduğu görüntülerde iyi çalışır. Histogramın büyük bir bölgeyi kapsadığı (hem parlak hem karanlık piksellerin bulunduğu) yerlerde iyi çalışmaz.

## CLAHE (Kontrast Sınırlı Adaptif Histogram Eşitleme)

Az önce gördüğümüz ilk histogram eşitleme, görüntünün **global** kontrastını dikkate alır. Birçok durumda bu iyi bir fikir değildir. Örneğin aşağıdaki görüntü, bir girdi görüntüsünü ve global histogram eşitleme sonrasındaki sonucunu göstermektedir:

![CLAHE karşılaştırma 1](/images/posts/opencv/clahe_1.jpg)

Arka plan kontrastı histogram eşitlemeden sonra iyileşmiş olsa da her iki görüntüdeki heykel yüzünü karşılaştırın. Aşırı parlaklık nedeniyle buradaki bilgilerin çoğunu kaybettik. Bunun nedeni, histogramın önceki durumların aksine belirli bir bölgeyle sınırlı olmamasıdır.

Bu sorunu çözmek için **adaptif histogram eşitleme** kullanılır. Bu yöntemde görüntü, OpenCV'de varsayılan olarak 8×8 boyutunda "döşemeler" (tile) adı verilen küçük bloklara bölünür. Ardından bu blokların her biri normal şekilde histogram eşitlemeye tabi tutulur. Küçük bir alanda histogram belirli bir bölgeyle sınırlı olacaktır (gürültü yoksa). Gürültü varsa yükseltilir. Bunu önlemek için **kontrast sınırlama** uygulanır: herhangi bir histogram çubuğu belirli bir kontrast sınırının üzerindeyse (OpenCV'de varsayılan 40), bu pikseller kırpılır ve histogram eşitlemeden önce diğer çubuklara eşit biçimde dağıtılır. Eşitlemeden sonra, döşeme sınırlarındaki yapay izleri kaldırmak için bilineer enterpolasyon uygulanır.

CLAHE'yi OpenCV'de nasıl uygulayacağınız:

```python
import numpy as np
import cv2 as cv

img = cv.imread('tsukuba_l.png', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"

# CLAHE nesnesi oluştur (argümanlar isteğe bağlıdır)
clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
cl1 = clahe.apply(img)

cv.imwrite('clahe_2.jpg', cl1)
```

Sonucu aşağıda görebilirsiniz; özellikle heykel bölgesiyle yukarıdaki sonuçları karşılaştırın:

![CLAHE sonucu](/images/posts/opencv/clahe_2.jpg)

## Ek Kaynaklar

- [Wikipedia - Histogram Eşitleme](http://en.wikipedia.org/wiki/Histogram_equalization)
- [NumPy Maskeli Diziler](http://docs.scipy.org/doc/numpy/reference/maskedarray.html)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_histograms/py_histogram_equalization/py_histogram_equalization.markdown)
