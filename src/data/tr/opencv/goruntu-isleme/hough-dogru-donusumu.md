---
publishDate: 2022-05-11T00:00:00Z
author: Hakan Çelik
title: "Hough Doğru Dönüşümü"
excerpt: "Hough Dönüşümü ile görüntülerdeki doğruları nasıl tespit edeceğinizi öğrenin. cv2.HoughLines() ve cv2.HoughLinesP() fonksiyonlarını parametreleriyle anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 21
subcategory: Görüntü İşleme
image: /images/posts/opencv/houghlines3.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Hough Doğru Dönüşümü

## Hedefler

Bu bölümde öğrenecekleriniz:

- Hough Dönüşümü kavramını anlamak
- Bir görüntüdeki doğruları tespit etmek için kullanmak
- Şu fonksiyonları göreceksiniz: `cv2.HoughLines()`, `cv2.HoughLinesP()`

## Teori

Hough Dönüşümü, matematiksel olarak ifade edilebilen herhangi bir şekli tespit etmek için kullanılan popüler bir tekniktir. Şekil biraz bozuk veya kırık olsa bile tespit edebilir. Nasıl çalıştığını doğrular üzerinden görelim.

Bir doğru `y = mx + c` şeklinde ya da parametrik biçimde şöyle ifade edilebilir:

`ρ = x·cos(θ) + y·sin(θ)`

Burada `ρ` orijinden doğruya olan dik uzaklık, `θ` ise bu dik çizgi ile yatay eksen arasındaki açıdır (saat yönünün tersine ölçülür). Aşağıdaki görüntüye bakın:

![Hough doğru gösterimi](/images/posts/opencv/houghlines1.svg)

Eğer doğru orijinin altından geçiyorsa `ρ` pozitif ve açı 180 dereceden küçük olur. Orijinin üzerinden geçiyorsa 180 dereceden büyük açı almak yerine açı 180 dereceden küçük alınır ve `ρ` negatif yapılır. Dikey doğrular 0 dereceye, yatay doğrular ise 90 dereceye sahip olur.

Şimdi Hough Dönüşümü'nün doğrular için nasıl çalıştığını görelim. Her doğru bu iki terimle `(ρ, θ)` ifade edilebilir. İlk olarak iki parametrenin değerlerini tutmak için 2B bir dizi (akümülatör) oluşturulur ve başlangıçta 0'a ayarlanır. Satırlar `ρ`'yi, sütunlar `θ`'yı temsil eder. Dizinin boyutu ihtiyaç duyulan doğruluğa göre belirlenir. Örneğin açı doğruluğu 1 derece olmasını istiyorsanız 180 sütuna ihtiyacınız vardır.

Ortada yatay bir çizgi olan 100×100'lük bir görüntüyü düşünün. Çizginin ilk noktasını alın. `(x, y)` değerlerini biliyorsunuz. Şimdi doğru denkleminde `θ = 0, 1, 2, ..., 180` değerlerini koyun ve elde ettiğiniz `ρ` değerini kontrol edin. Her `(ρ, θ)` çifti için akümülatörde karşılık gelen `(ρ, θ)` hücresini bir artırın.

Bu işlemi çizgi üzerindeki tüm noktalar için sürdürün. Her noktada `(50, 90)` hücresi artırılacak ve sonunda en fazla oyu o hücre alacaktır. Akümülatörde en fazla oyu ararsanız `(50, 90)` değerini bulursunuz; bu görüntüde orijinden 50 piksel uzakta ve 90 derecede bir doğru olduğunu söyler. Aşağıdaki animasyon bunu açıkça göstermektedir:

![Hough dönüşümü animasyonu](/images/posts/opencv/houghlinesdemo.gif)

Akümülatör görüntüsü aşağıdadır. Bazı konumlardaki parlak noktalar, görüntüdeki olası doğruların parametrelerini gösterir:

![Hough akümülatörü](/images/posts/opencv/houghlines2.jpg)

## OpenCV'de Hough Dönüşümü

Yukarıda açıklanan her şey OpenCV'nin `cv2.HoughLines()` fonksiyonunda yer almaktadır. Bu fonksiyon `(ρ, θ)` değerlerinden oluşan bir dizi döndürür. `ρ` piksel cinsinden, `θ` ise radyan cinsinden ölçülür.

- **1. parametre:** Girdi görüntüsü — ikili (binary) görüntü olmalıdır; bu nedenle Hough dönüşümü uygulamadan önce eşikleme veya Canny kenar tespiti yapın.
- **2. ve 3. parametreler:** Sırasıyla `ρ` ve `θ` doğrulukları.
- **4. parametre (threshold):** Bir doğru olarak kabul edilmesi için gereken minimum oy sayısı. Oy sayısı doğru üzerindeki nokta sayısına bağlıdır; bu yüzden tespit edilmesi gereken minimum doğru uzunluğunu temsil eder.

```python
import cv2 as cv
import numpy as np

img = cv.imread('sudoku.png')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
edges = cv.Canny(gray, 50, 150, apertureSize=3)

lines = cv.HoughLines(edges, 1, np.pi / 180, 200)
for line in lines:
    rho, theta = line[0]
    a = np.cos(theta)
    b = np.sin(theta)
    x0 = a * rho
    y0 = b * rho
    x1 = int(x0 + 1000 * (-b))
    y1 = int(y0 + 1000 * (a))
    x2 = int(x0 - 1000 * (-b))
    y2 = int(y0 - 1000 * (a))
    cv.line(img, (x1, y1), (x2, y2), (0, 0, 255), 2)

cv.imwrite('houghlines3.jpg', img)
```

Sonuçlara bakın:

![Hough doğru tespiti](/images/posts/opencv/houghlines3.jpg)

## Olasılıksal Hough Dönüşümü (Probabilistic Hough Transform)

Klasik Hough Dönüşümünde, yalnızca iki argümanlı bir doğru için bile çok fazla hesaplama gerekir. Olasılıksal Hough Dönüşümü bu işlemin optimize edilmiş halidir. Tüm noktaları dikkate almak yerine, doğru tespiti için yeterli olan rastgele bir nokta alt kümesi alır. Eşik değerini azaltmak yeterlidir. Aşağıdaki görüntü, Hough Dönüşümü ile Olasılıksal Hough Dönüşümünü Hough uzayında karşılaştırmaktadır:

![Olasılıksal Hough karşılaştırması](/images/posts/opencv/houghlines4.png)

OpenCV uygulaması Matas, Galambos ve Kittler'ın **Kademeli Olasılıksal Hough Dönüşümü** makalesine dayanmaktadır. Kullanılan fonksiyon `cv2.HoughLinesP()`'dir. İki yeni argümana sahiptir:

- **minLineLength:** Minimum doğru uzunluğu. Bundan kısa doğru parçaları reddedilir.
- **maxLineGap:** Tek bir doğru olarak değerlendirilebilmesi için doğru parçaları arasındaki maksimum boşluk.

En güzel yanı doğruların iki uç noktasını doğrudan döndürmesidir. Önceki durumda yalnızca doğrunun parametrelerini alıyordunuz ve tüm noktaları kendiniz bulmak zorundaydınız. Burada her şey doğrudan ve basittir:

```python
import cv2 as cv
import numpy as np

img = cv.imread('sudoku.png')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
edges = cv.Canny(gray, 50, 150, apertureSize=3)

lines = cv.HoughLinesP(edges, 1, np.pi / 180, 100, minLineLength=100, maxLineGap=10)
for line in lines:
    x1, y1, x2, y2 = line[0]
    cv.line(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

cv.imwrite('houghlines5.jpg', img)
```

Sonuçlara bakın:

![Olasılıksal Hough tespiti](/images/posts/opencv/houghlines5.jpg)

## Ek Kaynaklar

- [Wikipedia - Hough Dönüşümü](http://en.wikipedia.org/wiki/Hough_transform)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_houghlines/py_houghlines.markdown)
