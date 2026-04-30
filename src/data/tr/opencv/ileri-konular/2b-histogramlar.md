---
publishDate: 2022-05-15T00:00:00Z
author: Hakan Çelik
title: "2B Histogramlar"
excerpt: "2B histogramları bulup çizmeyi öğrenin. Renk histogramları için Ton (Hue) ve Doygunluk (Saturation) değerlerini kullanan cv2.calcHist() ve np.histogram2d() fonksiyonlarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 25
subcategory: İleri Konular
image: /images/posts/opencv/2dhist_matplotlib.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# 2B Histogramlar

## Hedefler

Bu bölümde öğrenecekleriniz:

- 2B histogramları bulmak ve çizmek

## Giriş

İlk makalede tek boyutlu histogramı hesaplayıp çizdik. Tek boyutlu olmasının nedeni yalnızca bir özelliği — pikselin gri tonlama yoğunluk değerini — dikkate almamızdır. Ancak iki boyutlu histogramlarda iki özelliği göz önünde bulundurursunuz. Genellikle iki özelliğin her pikselin **Ton (Hue)** ve **Doygunluk (Saturation)** değerleri olduğu renk histogramlarını bulmak için kullanılır.

OpenCV-Python örneklerinde renk histogramları için hazır bir örnek kod mevcuttur (`samples/python/color_histogram.py`). Bu renk histogramının nasıl oluşturulacağını anlamaya çalışacağız; bu Histogram Geri Projeksiyon gibi ileri konuları anlamak için de faydalı olacaktır.

## OpenCV'de 2B Histogram

Oldukça basittir ve aynı `cv2.calcHist()` fonksiyonu kullanılarak hesaplanır. Renk histogramları için görüntüyü BGR'den HSV'ye dönüştürmemiz gerekir (1B histogram için BGR'den Gri tonlamaya dönüştürmüştük). 2B histogramlar için parametreler şu şekilde değişir:

- **channels = [0, 1]** — Hem H hem de S düzlemini işlememiz gerektiği için.
- **bins = [180, 256]** — H düzlemi için 180, S düzlemi için 256.
- **range = [0, 180, 0, 256]** — Ton değeri 0-180 arasında, Doygunluk 0-256 arasındadır.

Koda bakın:

```python
import numpy as np
import cv2 as cv

img = cv.imread('home.jpg')
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)

hist = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
```

## NumPy'da 2B Histogram

NumPy da bunun için özel bir fonksiyon sağlar: `np.histogram2d()` (1B histogram için `np.histogram()` kullandığımızı hatırlayın):

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('home.jpg')
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
h, s, v = cv.split(hsv)

hist, xbins, ybins = np.histogram2d(h.ravel(), s.ravel(), [180, 256], [[0, 180], [0, 256]])
```

İlk argüman H düzlemi, ikincisi S düzlemi, üçüncüsü her biri için kutu sayısı, dördüncüsü ise aralıklarıdır.

## 2B Histogramları Çizmek

### Yöntem 1: `cv2.imshow()` Kullanmak

Elde ettiğimiz sonuç 180×256 boyutunda iki boyutlu bir dizidir. Onu `cv2.imshow()` ile gösterebilirsiniz. Ancak gri tonlamalı bir görüntü olacak ve farklı renklerin Ton değerlerini bilmiyorsanız hangi renklerin mevcut olduğu hakkında çok az fikir verecektir.

### Yöntem 2: Matplotlib Kullanmak

Farklı renk haritalarıyla 2B histogramı çizmek için `matplotlib.pyplot.imshow()` kullanabiliriz. Bu bize farklı piksel yoğunluğu hakkında çok daha iyi bir fikir verir.

> **Not:** Bu fonksiyonu kullanırken, daha iyi sonuçlar için interpolasyon bayrağının `nearest` olmasını unutmayın.

Örnek koda bakın:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('home.jpg')
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
hist = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])

plt.imshow(hist, interpolation='nearest')
plt.show()
```

Aşağıda girdi görüntüsü ve renk histogram çizimi yer almaktadır. X ekseni S değerlerini, Y ekseni ise Ton değerlerini göstermektedir:

![2B histogram matplotlib](/images/posts/opencv/2dhist_matplotlib.jpg)

Histogramda H ≈ 100 ve S ≈ 200 civarında yüksek değerler görebilirsiniz. Bu gökyüzünün mavisiyle örtüşür. Benzer biçimde H ≈ 25 ve S ≈ 100 civarında başka bir zirve görülebilir; bu da sarayın sarısıyla örtüşür. GIMP gibi herhangi bir resim düzenleme aracıyla doğrulayabilirsiniz.

### Yöntem 3: OpenCV Örnek Stili

OpenCV-Python örneklerinde renk histogramı için örnek bir kod bulunmaktadır (`samples/python/color_histogram.py`). Bu kodu çalıştırırsanız histogramın ilgili rengi de gösterdiğini göreceksiniz; yani renk kodlu bir histogram çıktısı üretir. Yazar HSV renk haritası oluşturmuş, bunu BGR'ye dönüştürmüş ve elde edilen histogram görüntüsünü bu renk haritasıyla çarpmıştır. Sonuç, yukarıdakiyle aynı görüntü için aşağıdaki gibidir:

![2B histogram OpenCV](/images/posts/opencv/2dhist_opencv.jpg)

Histogramda hangi renklerin bulunduğunu açıkça görebilirsiniz: mavi var, sarı var ve satranç tahtasından kaynaklanan biraz beyaz da mevcut.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_histograms/py_2d_histogram/py_2d_histogram.markdown)
