---
publishDate: 2022-05-29T00:00:00Z
author: Hakan Çelik
title: "BRIEF — İkili Sağlam Bağımsız Temel Özellikler"
excerpt: "BRIEF özellik tanımlayıcısının temellerini öğrenin. SIFT'in 128 boyutuna kıyasla sadece 32 byte kullanan bu hızlı ikili tanımlayıcının OpenCV ile nasıl kullanılacağını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 39
subcategory: Özellik Tespiti
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# BRIEF — İkili Sağlam Bağımsız Temel Özellikler

## Hedefler

Bu bölümde BRIEF algoritmasının temellerini göreceğiz.

## Teori

SIFT'in tanımlayıcılar için 128 boyutlu bir vektör kullandığını biliyoruz. Kayan nokta sayıları kullandığından temel olarak 512 bayt alır. Benzer şekilde SURF de minimum 256 bayt alır (64 boyut için). Binlerce özellik için böyle bir vektör oluşturmak, özellikle gömülü sistemler gibi kaynak kısıtlı uygulamalar için uygulanabilir olmayan çok fazla bellek alır.

Ama bu boyutların tümü gerçek eşleştirme için gerekli olmayabilir. PCA, LDA gibi çeşitli yöntemler kullanılarak sıkıştırılabilir. Hatta bu SIFT tanımlayıcılarını kayan nokta sayılarından ikili dizilere dönüştürmek için LSH (Yerel Duyarlı Hashing) kullanan karma yöntemler gibi diğer yöntemler de kullanılır. Bu ikili diziler, Hamming mesafesini kullanarak özellikleri eşleştirmek için kullanılır. Bu çok daha hızlıdır.

**BRIEF** tam bu noktada devreye girer. Tanımlayıcılar bulmadan doğrudan ikili dizileri bulmak için bir kısayol sağlar. Düzleştirilmiş görüntü yamasını alır ve benzersiz bir şekilde nd (x,y) konum çiftleri seçer. Ardından bu konum çiftlerinde bazı piksel yoğunluğu karşılaştırmaları yapılır. Örneğin, birinci konum çifti p ve q olsun. I(p) < I(q) ise sonuç 1, aksi takdirde 0'dır. Bu, nd boyutlu bir bit dizisi elde etmek için tüm nd konum çiftlerine uygulanır.

Bu nd 128, 256 veya 512 olabilir. OpenCV bunların hepsini destekler, ancak varsayılan olarak 256'dır (OpenCV bayt cinsinden temsil eder, yani değerler 16, 32 ve 64 olur).

Bir önemli nokta: BRIEF bir özellik tanımlayıcısıdır, özellik bulmak için herhangi bir yöntem sağlamaz. Bu nedenle SIFT, SURF gibi başka özellik dedektörlerini kullanmanız gerekir. Makale, hızlı bir dedektör olan CenSurE kullanılmasını tavsiye eder.

Kısaca BRIEF, daha hızlı bir özellik tanımlayıcı hesaplama ve eşleştirme yöntemidir. Büyük bir düzlemde döndürme olmadıkça yüksek tanıma oranı da sağlar.

## OpenCV'de BRIEF

Aşağıdaki kod, CenSurE dedektörü yardımıyla BRIEF tanımlayıcılarının hesaplanmasını göstermektedir.

> **Not:** Bunun için [opencv contrib](https://github.com/opencv/opencv_contrib) gereklidir.

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('simple.jpg', cv.IMREAD_GRAYSCALE)

# STAR dedektörünü başlat
star = cv.xfeatures2d.StarDetector_create()

# BRIEF çıkarıcısını başlat
brief = cv.xfeatures2d.BriefDescriptorExtractor_create()

# STAR ile anahtar noktaları bul
kp = star.detect(img, None)

# BRIEF ile tanımlayıcıları hesapla
kp, des = brief.compute(img, kp)

print(brief.descriptorSize())
print(des.shape)
```

`brief.getDescriptorSize()` fonksiyonu, bayt cinsinden nd boyutunu verir. Varsayılan olarak 32'dir.

## Ek Kaynaklar

1. Michael Calonder, Vincent Lepetit, Christoph Strecha, and Pascal Fua, "BRIEF: Binary Robust Independent Elementary Features", 11th European Conference on Computer Vision (ECCV), Heraklion, Crete. LNCS Springer, September 2010.
2. [LSH (Locality Sensitive Hashing)](https://en.wikipedia.org/wiki/Locality-sensitive_hashing)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_brief/py_brief.markdown)
