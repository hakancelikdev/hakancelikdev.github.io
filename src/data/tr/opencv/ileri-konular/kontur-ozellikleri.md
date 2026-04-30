---
publishDate: 2022-05-17T00:00:00Z
author: Hakan Çelik
title: "Kontur Özellikleri"
excerpt: "Konturların alan, çevre, ağırlık merkezi, sınır kutusu gibi farklı özelliklerini bulmayı öğrenin. cv2.moments(), cv2.contourArea(), cv2.minAreaRect() ve daha birçok fonksiyonu anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 27
subcategory: İleri Konular
image: /images/posts/opencv/boundingrect.png
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Kontur Özellikleri

## Hedefler

Bu makalede öğrenecekleriniz:

- Konturların alan, çevre, ağırlık merkezi, sınır kutusu gibi farklı özelliklerini bulmak
- Konturlarla ilgili pek çok fonksiyon göreceksiniz

## 1. Momentler

Görüntü momentleri, nesnenin ağırlık merkezi, alan gibi bazı özellikleri hesaplamanıza yardımcı olur.

`cv2.moments()` fonksiyonu, hesaplanan tüm moment değerlerinin bir sözlüğünü döndürür:

```python
import numpy as np
import cv2 as cv

img = cv.imread('star.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
ret, thresh = cv.threshold(img, 127, 255, 0)
contours, hierarchy = cv.findContours(thresh, 1, 2)

cnt = contours[0]
M = cv.moments(cnt)
print(M)
```

Bu momentlerden alan, ağırlık merkezi gibi faydalı veriler elde edebilirsiniz. Ağırlık merkezi şu bağıntılarla verilir: `Cx = M10 / M00` ve `Cy = M01 / M00`:

```python
cx = int(M['m10'] / M['m00'])
cy = int(M['m01'] / M['m00'])
```

## 2. Kontur Alanı

Kontur alanı `cv2.contourArea()` fonksiyonu veya momentlerden `M['m00']` ile elde edilir:

```python
area = cv.contourArea(cnt)
```

## 3. Kontur Çevresi

Yay uzunluğu olarak da adlandırılır. `cv2.arcLength()` fonksiyonu ile bulunabilir. İkinci argüman şeklin kapalı bir kontur mu (True geçilirse) yoksa sadece bir eğri mi olduğunu belirtir:

```python
perimeter = cv.arcLength(cnt, True)
```

## 4. Kontur Yaklaşımı

Belirlediğimiz hassasiyete bağlı olarak bir kontur şeklini daha az köşe noktalı başka bir şekle yaklaştırır. Bu, [Douglas-Peucker algoritmasının](http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm) bir uygulamasıdır.

Bunu anlamak için görüntüde bir kare bulmaya çalıştığınızı, ancak bazı sorunlar nedeniyle mükemmel bir kare değil "bozuk bir şekil" elde ettiğinizi düşünün. Şimdi bu fonksiyonu kullanarak şekli yaklaştırabilirsiniz. İkinci argüman epsilon'dır; kontur ile yaklaşık kontur arasındaki maksimum uzaklıktır. Doğru çıktıyı elde etmek için epsilon'ın akıllıca seçilmesi gerekir:

```python
epsilon = 0.1 * cv.arcLength(cnt, True)
approx = cv.approxPolyDP(cnt, epsilon, True)
```

Aşağıda ikinci görüntüde yeşil çizgi, yay uzunluğunun %10'u kadar epsilon için yaklaştırılmış eğriyi göstermektedir. Üçüncü görüntü, yay uzunluğunun %1'i kadar epsilon için aynı durumu göstermektedir:

![Kontur yaklaşımı](/images/posts/opencv/approx.jpg)

## 5. Dışbükey Zarf (Convex Hull)

Dışbükey zarf, kontur yaklaşımına benzeyebilir ancak aynı değildir. `cv2.convexHull()` fonksiyonu bir eğriyi dışbükeylik kusurları açısından kontrol eder ve düzeltir. Genel olarak dışbükey eğriler, her zaman dışa doğru şişmiş veya en azından düz olan eğrilerdir. İçe doğru şişmişse buna dışbükeylik kusuru denir. Örneğin el görüntüsüne bakın. Kırmızı çizgi elin dışbükey zarfını göstermektedir. Çift taraflı ok işaretleri, zarfın konturlardan yerel maksimum sapmalarını gösteren dışbükeylik kusurlarını işaret etmektedir:

![Dışbükey zarf](/images/posts/opencv/convexitydefects.jpg)

Sözdizimi hakkında:

```python
hull = cv.convexHull(points[, hull[, clockwise[, returnPoints]]])
```

Argüman ayrıntıları:

- **points:** İçine aktardığımız konturlardır.
- **hull:** Çıktıdır, genellikle atlıyoruz.
- **clockwise:** Yönelim bayrağı. True ise çıktı dışbükey zarfı saat yönünde yönelimlidir; aksi hâlde saat yönünün tersindedir.
- **returnPoints:** Varsayılan olarak True. O zaman zarf noktalarının koordinatlarını döndürür. False ise zarf noktalarına karşılık gelen kontur noktalarının indekslerini döndürür.

Yukarıdaki görüntüdeki gibi bir dışbükey zarf elde etmek için aşağıdaki yeterlidir:

```python
hull = cv.convexHull(cnt)
```

## 6. Dışbükeylik Kontrolü

Bir eğrinin dışbükey olup olmadığını kontrol etmek için `cv2.isContourConvex()` fonksiyonu vardır. Yalnızca True veya False döndürür:

```python
k = cv.isContourConvex(cnt)
```

## 7. Sınır Dikdörtgeni

İki tür sınır dikdörtgeni vardır.

### 7a. Düz Sınır Dikdörtgeni

Nesnenin dönüşünü dikkate almayan düz bir dikdörtgendir. `cv2.boundingRect()` fonksiyonu ile bulunur. `(x, y)` dikdörtgenin sol üst koordinatı, `(w, h)` ise genişliği ve yüksekliğidir:

```python
x, y, w, h = cv.boundingRect(cnt)
cv.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
```

### 7b. Döndürülmüş Dikdörtgen

Burada sınır dikdörtgeni minimum alanla çizilir, bu nedenle dönüşü de dikkate alır. Kullanılan fonksiyon `cv2.minAreaRect()`'tir. Şu ayrıntıları içeren bir Box2D yapısı döndürür: `(merkez (x, y), (genişlik, yükseklik), dönüş açısı)`. Ancak bu dikdörtgeni çizmek için `cv2.boxPoints()` fonksiyonu ile 4 köşeye ihtiyaç duyarız:

```python
rect = cv.minAreaRect(cnt)
box = cv.boxPoints(rect)
box = np.int0(box)
cv.drawContours(img, [box], 0, (0, 0, 255), 2)
```

Her iki dikdörtgen tek bir görüntüde gösterilmiştir. Yeşil dikdörtgen normal sınır dikdörtgeni, kırmızı dikdörtgen ise döndürülmüş dikdörtgendir:

![Sınır dikdörtgenleri](/images/posts/opencv/boundingrect.png)

## 8. Minimum Kapsayan Daire

Sonraki adımda `cv2.minEnclosingCircle()` fonksiyonu ile bir nesnenin çevrel dairesini buluruz. Bu, nesneyi minimum alanla tamamen kapsayan bir dairedir:

```python
(x, y), radius = cv.minEnclosingCircle(cnt)
center = (int(x), int(y))
radius = int(radius)
cv.circle(img, center, radius, (0, 255, 0), 2)
```

![Minimum kapsayan daire](/images/posts/opencv/circumcircle.png)

## 9. Elips Uydurma

Sonraki adım, bir nesneye elips uydurmaktır. Elipsin içine yerleştirildiği döndürülmüş dikdörtgeni döndürür:

```python
ellipse = cv.fitEllipse(cnt)
cv.ellipse(img, ellipse, (0, 255, 0), 2)
```

![Elips uydurma](/images/posts/opencv/fitellipse.png)

## 10. Doğru Uydurma

Benzer biçimde bir dizi noktaya doğru uydurabiliriz. Aşağıdaki görüntü bir dizi beyaz nokta içermektedir. Ona düz bir doğru yaklaştırabiliriz:

```python
rows, cols = img.shape[:2]
[vx, vy, x, y] = cv.fitLine(cnt, cv.DIST_L2, 0, 0.01, 0.01)
lefty = int((-x * vy / vx) + y)
righty = int(((cols - x) * vy / vx) + y)
cv.line(img, (cols - 1, righty), (0, lefty), (0, 255, 0), 2)
```

![Doğru uydurma](/images/posts/opencv/fitline.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.markdown)
