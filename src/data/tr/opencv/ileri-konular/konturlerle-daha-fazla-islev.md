---
publishDate: 2022-05-19T00:00:00Z
author: Hakan Çelik
title: "Konturlerle Daha Fazla İşlev"
excerpt: "Dışbükeylik kusurlarını, nokta-çokgen testini ve şekil eşleştirmeyi öğrenin. cv2.convexityDefects(), cv2.pointPolygonTest() ve cv2.matchShapes() fonksiyonlarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 29
subcategory: İleri Konular
image: /images/posts/opencv/defects.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Konturlerle Daha Fazla İşlev

## Hedefler

Bu bölümde öğrenecekleriniz:

- Dışbükeylik kusurları ve bunları nasıl bulacağınız
- Bir noktadan çokgene en kısa mesafeyi bulmak
- Farklı şekilleri eşleştirmek

## 1. Dışbükeylik Kusurları (Convexity Defects)

Konturlarla ilgili ikinci bölümde dışbükey zarfın ne olduğunu gördük. Nesnenin bu zarftan herhangi bir sapması dışbükeylik kusuru olarak değerlendirilebilir.

OpenCV bunu bulmak için hazır bir fonksiyon sunar: `cv2.convexityDefects()`. Temel bir çağrı şu şekilde görünür:

```python
hull = cv.convexHull(cnt, returnPoints=False)
defects = cv.convexityDefects(cnt, hull)
```

> **Not:** Dışbükeylik kusurlarını bulmak için dışbükey zarfı ararken `returnPoints=False` geçmemiz gerektiğini unutmayın.

Her satırın şu değerleri içerdiği bir dizi döndürür: **[başlangıç noktası, bitiş noktası, en uzak nokta, en uzak noktaya yaklaşık mesafe]**. Bunu bir görüntü kullanarak görselleştirebiliriz. Başlangıç ve bitiş noktalarını birleştiren bir çizgi çiziyoruz, ardından en uzak noktaya bir daire çiziyoruz. İlk üç döndürülen değerin `cnt`'nin indeksleri olduğunu unutmayın:

```python
import cv2 as cv
import numpy as np

img = cv.imread('star.jpg')
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
ret, thresh = cv.threshold(img_gray, 127, 255, 0)
contours, hierarchy = cv.findContours(thresh, 2, 1)
cnt = contours[0]

hull = cv.convexHull(cnt, returnPoints=False)
defects = cv.convexityDefects(cnt, hull)

for i in range(defects.shape[0]):
    s, e, f, d = defects[i, 0]
    start = tuple(cnt[s][0])
    end = tuple(cnt[e][0])
    far = tuple(cnt[f][0])
    cv.line(img, start, end, [0, 255, 0], 2)
    cv.circle(img, far, 5, [0, 0, 255], -1)

cv.imshow('img', img)
cv.waitKey(0)
cv.destroyAllWindows()
```

Sonuç:

![Dışbükeylik kusurları](/images/posts/opencv/defects.jpg)

## 2. Nokta-Çokgen Testi (Point Polygon Test)

Bu fonksiyon, görüntüdeki bir nokta ile bir kontur arasındaki en kısa mesafeyi bulur. Nokta konturun dışındaysa negatif, içindeyse pozitif, kontur üzerindeyse sıfır döndürür.

Örneğin `(50, 50)` noktasını şu şekilde kontrol edebiliriz:

```python
dist = cv.pointPolygonTest(cnt, (50, 50), True)
```

Fonksiyonda üçüncü argüman `measureDist`'tir. True ise işaretli mesafeyi bulur. False ise noktanın konturun içinde mi, dışında mı yoksa üzerinde mi olduğunu bulur (sırasıyla +1, -1, 0 döndürür).

> **Not:** Mesafeyi bulmak istemiyorsanız, üçüncü argümanın False olduğundan emin olun; çünkü bu zaman alıcı bir süreçtir. False yapmak yaklaşık 2-3 kat hızlanma sağlar.

## 3. Şekil Eşleştirme (Match Shapes)

OpenCV, iki şekli veya iki konturu karşılaştırmamızı sağlayan ve benzerliği gösteren bir ölçüm döndüren `cv2.matchShapes()` fonksiyonuna sahiptir. Sonuç ne kadar küçükse o kadar iyi bir eşleşmedir. Hu-moment değerlerine göre hesaplanır:

```python
import cv2 as cv
import numpy as np

img1 = cv.imread('star.jpg', cv.IMREAD_GRAYSCALE)
img2 = cv.imread('star2.jpg', cv.IMREAD_GRAYSCALE)
assert img1 is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
assert img2 is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"

ret, thresh = cv.threshold(img1, 127, 255, 0)
ret, thresh2 = cv.threshold(img2, 127, 255, 0)
contours, hierarchy = cv.findContours(thresh, 2, 1)
cnt1 = contours[0]
contours, hierarchy = cv.findContours(thresh2, 2, 1)
cnt2 = contours[0]

ret = cv.matchShapes(cnt1, cnt2, 1, 0.0)
print(ret)
```

Aşağıdaki farklı şekillerle eşleştirmeyi denedim:

![Şekil eşleştirme](/images/posts/opencv/matchshapes.jpg)

Şu sonuçları aldım:

- A görüntüsünü kendi kendisiyle eşleştirme = 0.0
- A görüntüsünü B görüntüsüyle eşleştirme = 0.001946
- A görüntüsünü C görüntüsüyle eşleştirme = 0.326911

Görüldüğü üzere görüntü döndürme bile bu karşılaştırmayı fazla etkilememektedir.

> **Not:** [Hu-Momentleri](http://en.wikipedia.org/wiki/Image_moment#Rotation_invariant_moments) öteleme, döndürme ve ölçeğe göre değişmez yedi momenttir. Yedinci tanesi de yamukluğa (skew) karşı değişmezdir. Bu değerler `cv2.HuMoments()` fonksiyonu kullanılarak bulunabilir.

## Alıştırmalar

- `cv2.pointPolygonTest()` belgelerini kontrol edin; kırmızı ve mavi renkte güzel bir görüntü bulacaksınız.
- `cv2.matchShapes()` kullanarak rakam veya harf görüntülerini karşılaştırın (OCR'ye doğru basit bir adım olacaktır).

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_contours/py_contours_more_functions/py_contours_more_functions.markdown)
