---
publishDate: 2022-06-17T00:00:00Z
author: Hakan Çelik
title: "Yüksek Dinamik Aralık (HDR) Görüntüleme"
excerpt: "OpenCV'de farklı pozlama değerlerine sahip fotoğraflardan HDR görüntü oluşturmayı öğrenin. Debevec, Robertson ve Mertens füzyon yöntemlerini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 58
subcategory: Hesaplamalı Fotoğrafçılık
image: /images/posts/opencv/ldr_debevec.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Yüksek Dinamik Aralık (HDR) Görüntüleme

## Hedefler

- Pozlama dizisinden HDR görüntü oluşturmayı ve görüntülemeyi öğreneceğiz
- Pozlama dizisini birleştirmek için exposure fusion kullanacağız

## Teori

Yüksek Dinamik Aralık Görüntüleme (HDRI veya HDR), standart dijital görüntüleme veya fotoğrafçılık tekniklerinden daha geniş bir parlaklık dinamik aralığını yeniden üretmek için kullanılan bir tekniktir. İnsan gözü geniş bir ışık koşulları yelpazesine uyum sağlayabilirken, çoğu görüntüleme cihazı kanal başına 8 bit kullanır ve yalnızca 256 seviyeyle sınırlıdır.

Gerçek dünya sahnelerinin fotoğraflarını çekerken parlak bölgeler aşırı pozlanabilir, karanlık bölgeler ise az pozlanabilir. HDR görüntüleme, kanal başına 8 bitten fazla (genellikle 32 bit float değerler) kullanan görüntülerle çalışır ve çok daha geniş bir dinamik aralıka olanak tanır.

HDR görüntü elde etmenin en yaygın yolu, farklı pozlama değerleriyle çekilen fotoğrafları kullanmaktır. Bu pozlamaları birleştirmek için kameranın yanıt fonksiyonunu bilmek faydalıdır. HDR görüntü oluşturulduktan sonra normal ekranlarda görüntülemek için 8 bit'e dönüştürülmesi gerekir; bu işleme **tonemapping** denir.

Bu öğreticide iki algoritma (Debevec, Robertson) kullanarak pozlama dizisinden HDR görüntü oluşturmayı ve HDR verisi gerektirmeyen bir alternatif olan exposure fusion (Mertens) yaklaşımını göstereceğiz.

## Pozlama Dizisiyle HDR

15, 2.5, 1/4 ve 1/30 saniyelik pozlama sürelerine sahip 4 fotoğraftan oluşan sahneye bakacağız:

![Pozlama Dizisi](/images/posts/opencv/exposures.jpg)

### 1. Pozlama görüntülerini listeye yükleme

İlk aşama tüm görüntüleri bir listeye yüklemektir. Normal HDR algoritmaları için pozlama sürelerine de ihtiyacımız var. Görüntüler 8 bit (np.uint8), pozlama süreleri float32 ve saniye cinsinden olmalıdır:

```python
import cv2 as cv
import numpy as np

# Pozlama görüntülerini listeye yükle
img_fn = ["img0.jpg", "img1.jpg", "img2.jpg", "img3.jpg"]
img_list = [cv.imread(fn) for fn in img_fn]
exposure_times = np.array([15.0, 2.5, 0.25, 0.0333], dtype=np.float32)
```

### 2. Pozlamaları HDR görüntüde birleştirme

İki yöntem sunuyoruz: Debevec ve Robertson. HDR görüntüsü uint8 değil float32 tipindedir:

```python
# Pozlamaları HDR görüntüde birleştir
merge_debevec = cv.createMergeDebevec()
hdr_debevec = merge_debevec.process(img_list, times=exposure_times.copy())
merge_robertson = cv.createMergeRobertson()
hdr_robertson = merge_robertson.process(img_list, times=exposure_times.copy())
```

### 3. HDR görüntüyü tonemapping ile dönüştürme

32 bit float HDR verisini [0..1] aralığına eşliyoruz:

```python
# Gamma düzeltmesi ile tonemapping (standart ekran parlaklığı için gamma=2.2)
tonemap1 = cv.createTonemap(gamma=2.2)
res_debevec = tonemap1.process(hdr_debevec.copy())
res_robertson = tonemap1.process(hdr_robertson.copy())
```

### 4. Mertens füzyonu ile pozlamaları birleştirme

Pozlama sürelerine ihtiyaç duymayan alternatif bir algoritma. Mertens algoritması zaten [0..1] aralığında sonuç verir, tonemapping gerekmez:

```python
# Mertens ile exposure fusion
merge_mertens = cv.createMergeMertens()
res_mertens = merge_mertens.process(img_list)
```

### 5. 8 bit'e dönüştürme ve kaydetme

```python
# 8 bit'e dönüştür ve kaydet
res_debevec_8bit = np.clip(res_debevec * 255, 0, 255).astype('uint8')
res_robertson_8bit = np.clip(res_robertson * 255, 0, 255).astype('uint8')
res_mertens_8bit = np.clip(res_mertens * 255, 0, 255).astype('uint8')

cv.imwrite("ldr_debevec.jpg", res_debevec_8bit)
cv.imwrite("ldr_robertson.jpg", res_robertson_8bit)
cv.imwrite("fusion_mertens.jpg", res_mertens_8bit)
```

## Sonuçlar

Her algoritmanın sonuçlarını görebilirsiniz. Her algoritmanın istenilen sonucu elde etmek için ayarlanabilir ek parametreler olduğunu unutmayın.

### Debevec:

![LDR Debevec](/images/posts/opencv/ldr_debevec.jpg)

### Robertson:

![LDR Robertson](/images/posts/opencv/ldr_robertson.jpg)

### Mertens Füzyonu:

![Mertens Füzyon](/images/posts/opencv/fusion_mertens.jpg)

## Kamera Yanıt Fonksiyonunu Tahmin Etme

Kamera yanıt fonksiyonu (CRF), sahne radyansı ile ölçülen yoğunluk değerleri arasındaki bağlantıyı verir. Ters kamera yanıt fonksiyonunu tahmin edip HDR birleştirme için kullanabiliriz:

```python
# Kamera yanıt fonksiyonunu tahmin et (CRF)
cal_debevec = cv.createCalibrateDebevec()
crf_debevec = cal_debevec.process(img_list, times=exposure_times)
hdr_debevec = merge_debevec.process(img_list, times=exposure_times.copy(), response=crf_debevec.copy())
cal_robertson = cv.createCalibrateRobertson()
crf_robertson = cal_robertson.process(img_list, times=exposure_times)
hdr_robertson = merge_robertson.process(img_list, times=exposure_times.copy(), response=crf_robertson.copy())
```

Kamera yanıt fonksiyonu her renk kanalı için 256 uzunluklu bir vektörle temsil edilir:

![CRF](/images/posts/opencv/crf.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_photo/py_hdr/py_hdr.markdown)
