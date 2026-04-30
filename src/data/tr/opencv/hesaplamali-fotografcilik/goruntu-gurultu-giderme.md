---
publishDate: 2022-06-15T00:00:00Z
author: Hakan Çelik
title: "Görüntü Gürültü Giderme"
excerpt: "OpenCV'de Non-Local Means algoritması ile görüntüdeki gürültüyü nasıl kaldıracağınızı öğrenin. cv.fastNlMeansDenoising() ve çoklu kare denoising fonksiyonlarını inceledik."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 56
subcategory: Hesaplamalı Fotoğrafçılık
image: /images/posts/opencv/nlm_result1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Görüntü Gürültü Giderme

## Hedefler

- Görüntüdeki gürültüyü kaldırmak için Non-Local Means Denoising algoritmasını öğreneceğiz
- **cv.fastNlMeansDenoising()**, **cv.fastNlMeansDenoisingColored()** gibi fonksiyonları inceleyeceğiz

## Teori

Önceki bölümlerde Gauss Bulanıklaştırma, Medyan Bulanıklaştırma gibi pek çok görüntü düzleştirme tekniği gördük. Bu teknikler küçük miktarlardaki gürültüyü belirli ölçüde kaldırmak için iyiydi. Söz konusu tekniklerde pikselin etrafındaki küçük bir komşuluğu alarak gauss ağırlıklı ortalama, medyan gibi işlemler yapıp merkez elemanı değiştiriyorduk. Kısacası gürültü giderme, pikselin yerel komşuluğunda gerçekleşiyordu.

Gürültünün bir özelliği vardır: Gürültü genellikle sıfır ortalamaya sahip rastgele bir değişken kabul edilir. Gürültülü bir piksel düşünün: `p = p0 + n` — burada `p0` pikselin gerçek değeri, `n` ise gürültüdür. Farklı görüntülerden aynı pikselin çok sayıda (N tane) örneğini alıp ortalamasını hesaplarsanız, gürültünün ortalaması sıfır olduğundan `p = p0` elde edersiniz.

Fikir basit: Gürültüyü ortalamayla gidermek için benzer görüntülere ihtiyacımız var. Görüntüde küçük bir pencere (5x5 gibi) düşünün. Aynı yama görüntünün başka bir yerinde de bulunabilir. Bu benzer yamalar bir araya getirilerek ortalamaları alınırsa o piksel değiştirilir. Buna Non-Local Means Denoising denir.

![Non-Local Means Yama](/images/posts/opencv/nlm_patch.jpg)

Görüntüdeki mavi yamalar birbirine benziyor, yeşil yamalar da birbirine benziyor. Bir piksel alınır, etrafında küçük bir pencere oluşturulur, görüntüde benzer pencereler aranır, tüm pencereler ortalaması alınır ve piksel bu sonuçla değiştirilir. Bu yöntem daha önce gördüğümüz bulanıklaştırma tekniklerinden daha fazla zaman alır, ancak sonuçları çok iyidir.

Renkli görüntüler için görüntü CIELAB renk uzayına dönüştürülür, ardından L ve AB bileşenleri ayrı ayrı gürültü giderilir.

## OpenCV'de Görüntü Gürültü Giderme

OpenCV bu tekniğin dört çeşidini sağlar:

1. **cv.fastNlMeansDenoising()** — tek gri tonlamalı görüntüyle çalışır
2. **cv.fastNlMeansDenoisingColored()** — renkli görüntüyle çalışır
3. **cv.fastNlMeansDenoisingMulti()** — kısa sürede çekilen görüntü dizisiyle çalışır (gri tonlamalı)
4. **cv.fastNlMeansDenoisingColoredMulti()** — yukarıdakiyle aynı, renkli görüntüler için

Ortak parametreler:
- **h**: Filtre gücünü belirler. Yüksek h değeri gürültüyü daha iyi giderir ama görüntü detaylarını da kaybeder (10 iyidir)
- **hForColorComponents**: Yalnızca renkli görüntüler için h ile aynı (genellikle h ile aynı)
- **templateWindowSize**: Tek sayı olmalı (7 önerilir)
- **searchWindowSize**: Tek sayı olmalı (21 önerilir)

### 1. cv.fastNlMeansDenoisingColored()

Renkli görüntülerden gürültü kaldırmak için kullanılır (Gauss gürültüsü beklenir):

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('die.png')

dst = cv.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

plt.subplot(121), plt.imshow(img)
plt.subplot(122), plt.imshow(dst)
plt.show()
```

Aşağıda sigma=25 Gauss gürültüsüyle bozulmuş giriş görüntüsünün büyütülmüş sonucu:

![NLM Sonuç](/images/posts/opencv/nlm_result1.jpg)

### 2. cv.fastNlMeansDenoisingMulti()

Aynı yöntemi bir videoya uygulayalım. İlk argüman gürültülü kareler listesi, ikinci argüman `imgToDenoiseIndex` gürültü gidereceğimiz kareyi belirtir, üçüncüsü `temporalWindowSize` gürültü giderme için kullanılacak komşu kare sayısıdır (tek sayı olmalı):

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

cap = cv.VideoCapture('vtest.avi')

# İlk 5 kareyi listeye al
img = [cap.read()[1] for i in range(5)]

# Tümünü gri tonlamaya çevir
gray = [cv.cvtColor(i, cv.COLOR_BGR2GRAY) for i in img]

# float64'e dönüştür
gray = [np.float64(i) for i in gray]

# Varyansı 25 olan gürültü oluştur
noise = np.random.randn(*gray[1].shape) * 10

# Gürültüyü görüntülere ekle
noisy = [i + noise for i in gray]

# uint8'e geri dönüştür
noisy = [np.uint8(np.clip(i, 0, 255)) for i in noisy]

# 3. kareyi, 5 kareyi dikkate alarak gürültü gider
dst = cv.fastNlMeansDenoisingMulti(noisy, 2, 5, None, 4, 7, 35)

plt.subplot(131), plt.imshow(gray[2], 'gray')
plt.subplot(132), plt.imshow(noisy[2], 'gray')
plt.subplot(133), plt.imshow(dst, 'gray')
plt.show()
```

Elde edilen sonucun büyütülmüş görünümü:

![NLM Çoklu Kare](/images/posts/opencv/nlm_multi.jpg)

Hesaplama için önemli miktarda zaman gerektirir. Sonuçta: ilk görüntü orijinal kare, ikincisi gürültülü kare, üçüncüsü gürültü giderilmiş görüntü.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_photo/py_non_local_means/py_non_local_means.markdown)
