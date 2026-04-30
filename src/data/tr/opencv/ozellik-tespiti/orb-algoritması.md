---
publishDate: 2022-05-30T00:00:00Z
author: Hakan Çelik
title: "ORB (Yönlü FAST ve Döndürülmüş BRIEF)"
excerpt: "SIFT ve SURF'e ücretsiz bir alternatif olan ORB algoritmasını öğrenin. cv2.ORB_create() ile anahtar nokta tespiti ve tanımlayıcı hesaplamasını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 40
subcategory: Özellik Tespiti
image: /images/posts/opencv/orb_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# ORB (Yönlü FAST ve Döndürülmüş BRIEF)

## Hedefler

Bu bölümde ORB'un temellerini göreceğiz.

## Teori

OpenCV meraklısı olarak, ORB hakkındaki en önemli şey "OpenCV Labs"dan gelmesidir. Bu algoritma, Ethan Rublee, Vincent Rabaud, Kurt Konolige ve Gary R. Bradski tarafından 2011 yılındaki **ORB: An efficient alternative to SIFT or SURF** adlı makalede ortaya atılmıştır. Başlıktan da anlaşılacağı gibi, hesaplama maliyeti, eşleştirme performansı ve özellikle de patentler açısından SIFT ve SURF'e iyi bir alternatiftir. Evet, SIFT ve SURF patentlidir ve bunları kullanmak için ödeme yapmanız gerekir. Ancak ORB değil!!!

ORB temel olarak, performansı artırmak için birçok modifikasyon yapılmış FAST anahtar nokta dedektörü ve BRIEF tanımlayıcısının bir füzyonudur. İlk olarak anahtar noktaları bulmak için FAST'ı kullanır, ardından bunlar arasından ilk N noktayı bulmak için Harris köşe ölçüsünü uygular. Çok ölçekli özellikler üretmek için de piramit kullanır.

Ancak FAST yönelimi hesaplamaz. Yazarlar şu modifikasyonu önerdi: Köşeyi merkezde konumlanmış yamanın yoğunluk ağırlıklı centroidini hesaplar. Bu köşe noktasından centroide uzanan vektörün yönü, yönelimi verir.

Tanımlayıcılar için ORB, BRIEF tanımlayıcılarını kullanır. Ancak BRIEF döndürmeyle kötü performans gösterir. Bu nedenle ORB, BRIEF'i anahtar noktaların yönelimine göre "yönlendirir". Bu **rBRIEF** olarak adlandırılır.

Tanımlayıcı eşleştirmesi için, geleneksel LSH'yi geliştiren çok araştırmalı LSH kullanılır. Makale, ORB'un SURF ve SIFT'ten çok daha hızlı olduğunu ve ORB tanımlayıcısının SURF'ten daha iyi çalıştığını söylemektedir. ORB, panorama dikişi vb. için düşük güçlü cihazlarda iyi bir seçimdir.

## OpenCV'de ORB

Her zamanki gibi, **cv.ORB()** fonksiyonu veya feature2d ortak arayüzü kullanılarak bir ORB nesnesi oluşturulur. Birçok isteğe bağlı parametreye sahiptir. En kullanışlıları: varsayılan olarak 500 olan `nFeatures` ve Harris veya FAST skoruna göre özelliklerin sıralanıp sıralanmayacağını belirten `scoreType`. Başka bir parametre olan `WTA_K`, yönlü BRIEF tanımlayıcısının her öğesini üreten nokta sayısına karar verir. Varsayılan olarak ikidir (NORM_HAMMING mesafesi kullanılır). WTA_K 3 veya 4 ise NORM_HAMMING2 kullanılır.

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('simple.jpg', cv.IMREAD_GRAYSCALE)

# ORB dedektörünü başlat
orb = cv.ORB_create()

# ORB ile anahtar noktaları bul
kp = orb.detect(img, None)

# ORB ile tanımlayıcıları hesapla
kp, des = orb.compute(img, kp)

# Yalnızca anahtar nokta konumlarını çiz, boyut ve yönelim değil
img2 = cv.drawKeypoints(img, kp, None, color=(0, 255, 0), flags=0)
plt.imshow(img2), plt.show()
```

Sonuç:

![ORB anahtar noktaları](/images/posts/opencv/orb_kp.jpg)

ORB özellik eşleştirmesini başka bir bölümde yapacağız.

## Ek Kaynaklar

1. Ethan Rublee, Vincent Rabaud, Kurt Konolige, Gary R. Bradski: ORB: An efficient alternative to SIFT or SURF. ICCV 2011: 2564-2571.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_orb/py_orb.markdown)
