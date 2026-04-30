---
publishDate: 2022-05-18T00:00:00Z
author: Hakan Çelik
title: "Kontur Nitelikleri"
excerpt: "Nesnelerin katılık (solidity), eşdeğer çap, maske görüntüsü, ortalama yoğunluk gibi sık kullanılan özelliklerini öğrenin. En uç noktalar, en-boy oranı ve daha fazlası."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 28
subcategory: İleri Konular
image: /images/posts/opencv/extremepoints.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Kontur Nitelikleri

Bu bölümde nesnelerin katılık (solidity), eşdeğer çap, maske görüntüsü, ortalama yoğunluk gibi sık kullanılan özelliklerini çıkarmayı öğreneceğiz.

> **Not:** Ağırlık merkezi, alan, çevre gibi özellikler de bu kategoriye girer; ancak bunları bir önceki bölümde gördük.

## 1. En-Boy Oranı (Aspect Ratio)

Nesnenin sınır dikdörtgeninin genişliğinin yüksekliğine oranıdır:

`En-Boy Oranı = Genişlik / Yükseklik`

```python
x, y, w, h = cv.boundingRect(cnt)
aspect_ratio = float(w) / h
```

## 2. Uzanım (Extent)

Uzanım, kontur alanının sınır dikdörtgeni alanına oranıdır:

`Uzanım = Nesne Alanı / Sınır Dikdörtgeni Alanı`

```python
area = cv.contourArea(cnt)
x, y, w, h = cv.boundingRect(cnt)
rect_area = w * h
extent = float(area) / rect_area
```

## 3. Katılık (Solidity)

Katılık, kontur alanının dışbükey zarf alanına oranıdır:

`Katılık = Kontur Alanı / Dışbükey Zarf Alanı`

```python
area = cv.contourArea(cnt)
hull = cv.convexHull(cnt)
hull_area = cv.contourArea(hull)
solidity = float(area) / hull_area
```

## 4. Eşdeğer Çap (Equivalent Diameter)

Eşdeğer çap, alanı kontur alanıyla aynı olan dairenin çapıdır:

`Eşdeğer Çap = √(4 × Kontur Alanı / π)`

```python
area = cv.contourArea(cnt)
equi_diameter = np.sqrt(4 * area / np.pi)
```

## 5. Yönelim (Orientation)

Yönelim, nesnenin yönlendirildiği açıdır. Aşağıdaki yöntem aynı zamanda ana eksen ve yardımcı eksen uzunluklarını da verir:

```python
(x, y), (MA, ma), angle = cv.fitEllipse(cnt)
```

## 6. Maske ve Piksel Noktaları

Bazı durumlarda nesneyi oluşturan tüm noktalara ihtiyaç duyabiliriz. Bu şu şekilde yapılabilir:

```python
mask = np.zeros(imgray.shape, np.uint8)
cv.drawContours(mask, [cnt], 0, 255, -1)
pixelpoints = np.transpose(np.nonzero(mask))
# pixelpoints = cv.findNonZero(mask)
```

Burada aynı işlemi yapmak için biri NumPy fonksiyonlarını kullanan, diğeri ise OpenCV fonksiyonunu kullanan (son yorum satırı) iki yöntem verilmiştir. Sonuçlar aynıdır, ancak küçük bir fark vardır: NumPy koordinatları **(satır, sütun)** formatında verirken OpenCV **(x, y)** formatında verir. Yani `satır = y` ve `sütun = x`'tir.

## 7. Maksimum Değer, Minimum Değer ve Konumları

Bu parametreleri maske görüntüsü kullanarak bulabiliriz:

```python
min_val, max_val, min_loc, max_loc = cv.minMaxLoc(imgray, mask=mask)
```

## 8. Ortalama Renk veya Ortalama Yoğunluk

Burada bir nesnenin ortalama rengini bulabiliriz. Veya gri tonlamalı modda nesnenin ortalama yoğunluğu olabilir. Yine aynı maskeyi kullanırız:

```python
mean_val = cv.mean(im, mask=mask)
```

## 9. En Uç Noktalar

En uç noktalar nesnenin en üstteki, en alttaki, en sağdaki ve en soldaki noktalarını ifade eder:

```python
leftmost = tuple(cnt[cnt[:, :, 0].argmin()][0])
rightmost = tuple(cnt[cnt[:, :, 0].argmax()][0])
topmost = tuple(cnt[cnt[:, :, 1].argmin()][0])
bottommost = tuple(cnt[cnt[:, :, 1].argmax()][0])
```

Örneğin bunu bir Hindistan haritasına uygularsam şu sonucu alıyorum:

![En uç noktalar](/images/posts/opencv/extremepoints.jpg)

## Alıştırmalar

- Matlab regionprops dokümantasyonunda hâlâ bazı özellikler bulunmaktadır. Bunları uygulamayı deneyin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_contours/py_contour_properties/py_contour_properties.markdown)
