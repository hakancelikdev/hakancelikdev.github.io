---
publishDate: 2022-05-12T00:00:00Z
author: Hakan Çelik
title: "Hough Daire Dönüşümü"
excerpt: "Hough Dönüşümü kullanarak görüntülerdeki daireleri nasıl tespit edeceğinizi öğrenin. cv2.HoughCircles() fonksiyonu ile pratik örnekler."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 22
subcategory: Görüntü İşleme
image: /images/posts/opencv/houghcircles2.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Hough Daire Dönüşümü

## Hedefler

Bu bölümde öğrenecekleriniz:

- Bir görüntüdeki daireleri bulmak için Hough Dönüşümünü kullanmak
- Şu fonksiyonu göreceksiniz: `cv2.HoughCircles()`

## Teori

Bir daire matematiksel olarak şöyle ifade edilir:

`(x - x_merkez)² + (y - y_merkez)² = r²`

Burada `(x_merkez, y_merkez)` dairenin merkezi, `r` ise yarıçapıdır. Bu denklemden 3 parametremiz olduğu görülmektedir; dolayısıyla Hough dönüşümü için 3 boyutlu bir akümülatöre ihtiyaç duyulur ve bu oldukça verimsiz olur. Bu nedenle OpenCV, kenarların gradyan bilgisini kullanan daha akıllı bir yöntem olan **Hough Gradyan Yöntemi**ni kullanır.

## OpenCV'de Hough Daire Dönüşümü

Kullanacağımız fonksiyon `cv2.HoughCircles()`'dır. Pek çok argümanı vardır ve bunlar dokümantasyonda ayrıntılı biçimde açıklanmıştır. Doğrudan koda geçelim:

```python
import numpy as np
import cv2 as cv

img = cv.imread('opencv-logo-white.png', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
img = cv.medianBlur(img, 5)
cimg = cv.cvtColor(img, cv.COLOR_GRAY2BGR)

circles = cv.HoughCircles(img, cv.HOUGH_GRADIENT, 1, 20,
                           param1=50, param2=30, minRadius=0, maxRadius=0)

circles = np.uint16(np.around(circles))
for i in circles[0, :]:
    # Dış daireyi çiz
    cv.circle(cimg, (i[0], i[1]), i[2], (0, 255, 0), 2)
    # Dairenin merkezini çiz
    cv.circle(cimg, (i[0], i[1]), 2, (0, 0, 255), 3)

cv.imshow('Tespit Edilen Daireler', cimg)
cv.waitKey(0)
cv.destroyAllWindows()
```

### Fonksiyon Parametreleri

- **image:** 8-bit, tek kanallı gri tonlamalı girdi görüntüsü.
- **method:** Tespit yöntemi — şu an için yalnızca `cv2.HOUGH_GRADIENT` desteklenmektedir.
- **dp:** Akümülatör çözünürlüğünün görüntü çözünürlüğüne oranı. Örneğin `dp=1` ile akümülatör görüntüyle aynı çözünürlüğe sahip olur, `dp=2` ile yarı çözünürlükte olur.
- **minDist:** Tespit edilen dairelerin merkezleri arasındaki minimum mesafe. Çok küçük bir değer birden fazla iç içe daire tespit edebilir; çok büyük ise bazı daireler kaçırılabilir.
- **param1:** Yönteme özgü ilk parametre. `HOUGH_GRADIENT` için Canny kenar tespitine geçirilen üst eşik değeridir (alt eşik yarısı kadar olur).
- **param2:** Yönteme özgü ikinci parametre. `HOUGH_GRADIENT` için akümülatör eşiğidir. Küçüldükçe daha fazla (yanlış) daire tespit edilir.
- **minRadius:** Minimum daire yarıçapı.
- **maxRadius:** Maksimum daire yarıçapı.

Sonuç aşağıda gösterilmektedir:

![Hough daire tespiti](/images/posts/opencv/houghcircles2.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_houghcircles/py_houghcircles.markdown)
