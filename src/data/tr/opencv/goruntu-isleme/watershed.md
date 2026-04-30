---
publishDate: 2022-05-22T00:00:00Z
author: Hakan Çelik
title: "Watershed Algoritması ile Görüntü Segmentasyonu"
excerpt: "İşaretçi tabanlı görüntü segmentasyonu için Watershed algoritmasını öğrenin. cv2.watershed() fonksiyonu ile dokunuşan nesneleri ayırmayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 32
subcategory: Görüntü İşleme
image: /images/posts/opencv/water_result.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Watershed Algoritması ile Görüntü Segmentasyonu

## Hedefler

Bu bölümde:

- İşaretçi tabanlı görüntü segmentasyonu için Watershed algoritmasını öğreneceğiz
- **cv.watershed()** fonksiyonunu göreceğiz

## Teori

Her gri tonlamalı görüntü, yüksek yoğunluğun tepe ve tepeleri, düşük yoğunluğun ise vadileri temsil ettiği bir topografik yüzey olarak görülebilir. Her izole vadiyi (yerel minimum) farklı renkli suyla (etiketlerle) doldurmaya başlarsınız. Su yükseldikçe, yakındaki zirvelere (gradyanlara) bağlı olarak, farklı renklerle farklı vadilerden gelen sular birleşmeye başlar. Bunu önlemek için suların birleştiği yerlere bariyerler inşa edersiniz. Tüm tepeler suyun altına girinceye kadar su doldurmaya ve bariyer inşa etmeye devam edersiniz. Oluşturduğunuz bariyerler segmentasyon sonucunu verir. Watershed'in arkasındaki "felsefe" budur.

Ancak bu yaklaşım, görüntüdeki gürültü veya diğer düzensizlikler nedeniyle aşırı segmentlenmiş bir sonuç verir. Bu nedenle OpenCV, hangi vadi noktalarının birleştirilip hangilerinin birleştirilmeyeceğini belirttiğiniz işaretçi tabanlı bir Watershed algoritması uygulamıştır. Bu etkileşimli bir görüntü segmentasyonudur. Bildiğimiz nesneye farklı etiketler veririz: Kesinlikle ön plan veya nesne olduğundan emin olduğumuz bölgeyi bir renkle (veya yoğunlukla), kesinlikle arka plan veya nesne olmadığından emin olduğumuz bölgeyi başka bir renkle etiketleriz ve son olarak hiçbir şeyden emin olmadığımız bölgeyi 0 ile etiketleriz. İşte bu bizim işaretçimizdir. Ardından Watershed algoritmasını uygularız. İşaretçimiz, verdiğimiz etiketlerle güncellenir ve nesnelerin sınırları -1 değerini alır.

## Kod

Aşağıda, birbirine dokunan nesneleri segmentlemek için Mesafe Dönüşümünü Watershed ile birlikte kullanma örneği göreceğiz.

Aşağıdaki madeni para görüntüsünü düşünün; paralar birbirine dokunuyor. Eşikleme yapılsa bile birbirine dokunmaya devam edecekler:

![Madeni paralar](/images/posts/opencv/water_coins.jpg)

Paraların yaklaşık tahminini bulmakla başlıyoruz. Bunun için Otsu'nun ikilileştirmesini kullanabiliriz:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('coins.png')
assert img is not None, "file could not be read, check with os.path.exists()"
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
ret, thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU)
```

Sonuç:

![Eşiklenmiş görüntü](/images/posts/opencv/water_thresh.jpg)

Şimdi görüntüdeki küçük beyaz gürültüleri kaldırmamız gerekiyor. Bunun için morfolojik açma işlemi kullanabiliriz. Nesnedeki küçük delikleri kaldırmak için morfolojik kapama kullanabiliriz. Artık nesnelerin merkezine yakın bölgelerin ön plan, nesneden çok uzak bölgelerin ise arka plan olduğundan eminiz. Tek emin olamadığımız bölge paraların sınır bölgesidir.

Bu nedenle kesinlikle para oldukları alanı çıkarmamız gerekiyor. Erozyon, sınır piksellerini kaldırır. Yani kalan her şeyin para olduğundan emin olabiliriz. Nesneler birbirine dokunmadığında bu işe yarar. Ama birbirine dokundukları için daha iyi bir seçenek, mesafe dönüşümünü bulmak ve uygun bir eşik uygulamaktır. Ardından kesinlikle para olmayan alanı bulmamız gerekiyor. Bunun için sonucu genişletiriz. Dilatasyon nesne sınırını arka plana doğru artırır:

```python
# gürültü giderme
kernel = np.ones((3, 3), np.uint8)
opening = cv.morphologyEx(thresh, cv.MORPH_OPEN, kernel, iterations=2)

# kesin arka plan alanı
sure_bg = cv.dilate(opening, kernel, iterations=3)

# kesin ön plan alanı bulma
dist_transform = cv.distanceTransform(opening, cv.DIST_L2, 5)
ret, sure_fg = cv.threshold(dist_transform, 0.7 * dist_transform.max(), 255, 0)

# bilinmeyen bölgeyi bulma
sure_fg = np.uint8(sure_fg)
unknown = cv.subtract(sure_bg, sure_fg)
```

Sonuca bakın:

![Mesafe dönüşümü](/images/posts/opencv/water_dt.jpg)

Şimdi orijinal görüntüyle aynı boyutta ancak int32 veri tipinde bir işaretçi dizisi oluşturuyoruz. Bildiğimiz bölgeleri (ön plan veya arka plan) pozitif tamsayılarla etiketliyoruz; bilinmeyen bölgeleri ise 0 olarak bırakıyoruz. Bunun için **cv.connectedComponents()** kullanıyoruz:

```python
# İşaretçi etiketleme
ret, markers = cv.connectedComponents(sure_fg)

# Kesin arka planın 0 değil 1 olması için tüm etiketlere 1 ekleyin
markers = markers + 1

# Bilinmeyen bölgeyi 0 ile işaretleyin
markers[unknown == 255] = 0
```

JET renk haritasında gösterilen sonuç:

![İşaretçi görüntüsü](/images/posts/opencv/water_marker.jpg)

Koyu mavi bölge bilinmeyen bölgeyi göstermektedir. Kesin paralar farklı değerlerle renklendirilmiştir.

Şimdi işaretçimiz hazır. Watershed uygulamasının zamanı geldi. Sınır bölgesi -1 ile işaretlenecektir:

```python
markers = cv.watershed(img, markers)
img[markers == -1] = [255, 0, 0]
```

Sonuç:

![Watershed sonucu](/images/posts/opencv/water_result.jpg)

## Ek Kaynaklar

1. CMM sayfası: [Watershed Dönüşümü](https://people.cmm.minesparis.psl.eu/users/beucher/wtshed.html)

## Alıştırmalar

1. OpenCV örnekleri, watershed.py adında etkileşimli bir Watershed segmentasyon örneği içerir. Çalıştırın, tadını çıkarın ve öğrenin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_watershed/py_watershed.markdown)
