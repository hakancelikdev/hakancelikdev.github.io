---
publishDate: 2022-06-16T00:00:00Z
author: Hakan Çelik
title: "Görüntü Onarımı (Inpainting)"
excerpt: "Eski fotoğraflardaki hasarları, çizikleri ve lekeleri OpenCV'nin cv.inpaint() fonksiyonu ile nasıl onaracağınızı öğrenin. Telea ve Navier-Stokes algoritmalarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 57
subcategory: Hesaplamalı Fotoğrafçılık
image: /images/posts/opencv/inpaint_result.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Görüntü Onarımı (Inpainting)

## Hedefler

- Eski fotoğraflardaki küçük gürültüleri, çizikleri vb. **inpainting** adı verilen bir yöntemle nasıl kaldıracağımızı öğreneceğiz
- OpenCV'deki inpainting işlevlerini göreceğiz

## Temel Kavramlar

Evinizde siyah noktalar veya çizikler içeren eski, bozulmuş fotoğraflarınız olabilir. Bunları bir boyama aracında silmek işe yaramaz çünkü siyah yapıları yalnızca beyazla değiştirir. Bu durumlarda **görüntü onarımı (image inpainting)** tekniği kullanılır. Temel fikir basit: Bozuk işaretleri komşu piksellerle değiştirerek komşuluk gibi görünmesini sağlamak.

![Inpainting Temelleri](/images/posts/opencv/inpaint_basics.jpg)

Bu amaç için çeşitli algoritmalar tasarlanmıştır ve OpenCV bunlardan ikisini sağlar. Her ikisine de aynı fonksiyon olan **cv.inpaint()** ile erişilir.

### Algoritma 1: Telea (INPAINT_TELEA)

Alexandru Telea'nın 2004 tarihli **"An Image Inpainting Technique Based on the Fast Marching Method"** makalesine dayanır. Hızlı Yürüyüş Yöntemi (Fast Marching Method) tabanlıdır. Algoritma, onarılacak bölgenin sınırından başlar ve içeri doğru ilerleyerek her şeyi doldurur. Onarılacak pikselin komşuluğundaki tüm bilinen piksellerin normalize ağırlıklı toplamıyla pikseli değiştirir.

### Algoritma 2: Navier-Stokes (INPAINT_NS)

Bertalmio vd.'nin 2001 tarihli **"Navier-Stokes, Fluid Dynamics, and Image and Video Inpainting"** makalesine dayanır. Akışkanlar dinamiği ve kısmi diferansiyel denklemleri kullanır. Bilinen bölgelerden bilinmeyen bölgelere doğru kenarlar boyunca ilerler. Onarım bölgesinin sınırındaki gradyan vektörlerini eşleştirirken izofotları (eşit yoğunluklu noktaları birleştiren çizgiler) sürdürür.

## Kod

Giriş görüntüsüyle aynı boyutta bir maske oluşturmamız gerekiyor; maskedeki sıfır olmayan pikseller onarılacak alanı gösterir:

```python
import numpy as np
import cv2 as cv

img = cv.imread('messi_2.jpg')
mask = cv.imread('mask2.png', cv.IMREAD_GRAYSCALE)

dst = cv.inpaint(img, mask, 3, cv.INPAINT_TELEA)

cv.imshow('dst', dst)
cv.waitKey(0)
cv.destroyAllWindows()
```

Aşağıda sonucu görebilirsiniz. İlk görüntü bozulmuş giriş, ikincisi maske, üçüncüsü birinci algoritmanın sonucu, sonuncusu ikinci algoritmanın sonucu:

![Inpainting Sonuç](/images/posts/opencv/inpaint_result.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_photo/py_inpainting/py_inpainting.markdown)
