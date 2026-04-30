---
publishDate: 2022-05-10T00:00:00Z
author: Hakan Çelik
title: "Şablon Eşleştirme"
excerpt: "Şablon eşleştirme ile büyük bir görüntü içinde küçük bir şablonun konumunu bulabilirsiniz. cv2.matchTemplate() ve cv2.minMaxLoc() fonksiyonlarını örneklerle anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 20
subcategory: Görüntü İşleme
image: /images/posts/opencv/template_ccoeff_1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Şablon Eşleştirme

## Hedefler

Bu bölümde öğrenecekleriniz:

- Şablon eşleştirme kullanarak bir görüntüdeki nesneleri bulmak
- Şu fonksiyonları göreceksiniz: `cv2.matchTemplate()`, `cv2.minMaxLoc()`

## Teori

Şablon eşleştirme, bir şablon görüntüsünün daha büyük bir görüntü içindeki konumunu araştırmak ve bulmak için kullanılan bir yöntemdir. OpenCV bu amaç için `cv2.matchTemplate()` fonksiyonuna sahiptir. Bu fonksiyon, şablon görüntüyü girdi görüntüsü üzerinde kaydırır (2B konvolüsyona benzer şekilde) ve şablon ile şablonun altındaki girdi görüntüsü yamasını karşılaştırır. OpenCV'de birçok karşılaştırma yöntemi uygulanmıştır. Sonuç olarak her piksel değerinin şablonla ne kadar eşleştiğini gösteren gri tonlamalı bir görüntü döner.

Girdi görüntüsü `(W x H)` boyutundaysa ve şablon görüntü `(w x h)` boyutundaysa, çıktı görüntüsü `(W-w+1, H-h+1)` boyutunda olacaktır. Sonucu aldıktan sonra en yüksek/en düşük değerin nerede olduğunu bulmak için `cv2.minMaxLoc()` fonksiyonunu kullanabilirsiniz. Bu değeri dikdörtgenin sol üst köşesi olarak alın ve `(w, h)` değerlerini dikdörtgenin genişliği ve yüksekliği olarak kullanın. O dikdörtgen şablonunuzun bölgesidir.

> **Not:** `cv2.TM_SQDIFF` karşılaştırma yöntemini kullanıyorsanız minimum değer en iyi eşleşmeyi verir.

## OpenCV'de Şablon Eşleştirme

Örnek olarak Messi'nin fotoğrafında yüzünü arayacağız. Bu amaç için aşağıdaki şablonu oluşturduk:

![Messi yüz şablonu](/images/posts/opencv/messi_face.jpg)

Sonuçların nasıl göründüğünü görmek için tüm karşılaştırma yöntemlerini deneyelim:

```python
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt

img = cv.imread('messi5.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
img2 = img.copy()
template = cv.imread('template.jpg', cv.IMREAD_GRAYSCALE)
assert template is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
w, h = template.shape[::-1]

# Karşılaştırma için 6 yöntemin listesi
methods = ['TM_CCOEFF', 'TM_CCOEFF_NORMED', 'TM_CCORR',
            'TM_CCORR_NORMED', 'TM_SQDIFF', 'TM_SQDIFF_NORMED']

for meth in methods:
    img = img2.copy()
    method = getattr(cv, meth)

    # Şablon eşleştirmeyi uygula
    res = cv.matchTemplate(img, template, method)
    min_val, max_val, min_loc, max_loc = cv.minMaxLoc(res)

    # TM_SQDIFF veya TM_SQDIFF_NORMED ise minimum değeri al
    if method in [cv.TM_SQDIFF, cv.TM_SQDIFF_NORMED]:
        top_left = min_loc
    else:
        top_left = max_loc
    bottom_right = (top_left[0] + w, top_left[1] + h)

    cv.rectangle(img, top_left, bottom_right, 255, 2)

    plt.subplot(121), plt.imshow(res, cmap='gray')
    plt.title('Eşleştirme Sonucu'), plt.xticks([]), plt.yticks([])
    plt.subplot(122), plt.imshow(img, cmap='gray')
    plt.title('Tespit Edilen Nokta'), plt.xticks([]), plt.yticks([])
    plt.suptitle(meth)

    plt.show()
```

Sonuçlara bakın:

- **cv2.TM_CCOEFF**

![TM_CCOEFF sonucu](/images/posts/opencv/template_ccoeff_1.jpg)

- **cv2.TM_CCOEFF_NORMED**

![TM_CCOEFF_NORMED sonucu](/images/posts/opencv/template_ccoeffn_2.jpg)

- **cv2.TM_CCORR**

![TM_CCORR sonucu](/images/posts/opencv/template_ccorr_3.jpg)

- **cv2.TM_CCORR_NORMED**

![TM_CCORR_NORMED sonucu](/images/posts/opencv/template_ccorrn_4.jpg)

- **cv2.TM_SQDIFF**

![TM_SQDIFF sonucu](/images/posts/opencv/template_sqdiff_5.jpg)

- **cv2.TM_SQDIFF_NORMED**

![TM_SQDIFF_NORMED sonucu](/images/posts/opencv/template_sqdiffn_6.jpg)

Gördüğünüz gibi `cv2.TM_CCORR` yöntemi beklediğimiz kadar iyi bir sonuç vermemektedir.

## Birden Fazla Nesneyle Şablon Eşleştirme

Önceki bölümde Messi'nin yüzünü aradık ve bu yüz görüntüde yalnızca bir kez geçiyordu. Birden fazla kez geçen bir nesne arıyorsanız `cv2.minMaxLoc()` size tüm konumları vermez. Bu durumda eşik değeri (thresholding) kullanırız. Bu örnekte ünlü Mario oyununun ekran görüntüsünü kullanarak içindeki paraları bulacağız:

```python
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt

img_rgb = cv.imread('mario.png')
assert img_rgb is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
img_gray = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
template = cv.imread('mario_coin.png', cv.IMREAD_GRAYSCALE)
assert template is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
w, h = template.shape[::-1]

res = cv.matchTemplate(img_gray, template, cv.TM_CCOEFF_NORMED)
threshold = 0.8
loc = np.where(res >= threshold)
for pt in zip(*loc[::-1]):
    cv.rectangle(img_rgb, pt, (pt[0] + w, pt[1] + h), (0, 0, 255), 2)

cv.imwrite('res.png', img_rgb)
```

Sonuç:

![Mario para tespiti](/images/posts/opencv/res_mario.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown)
