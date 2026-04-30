---
publishDate: 2022-06-09T00:00:00Z
author: Hakan Çelik
title: "k-En Yakın Komşuyu Anlamak"
excerpt: "k-En Yakın Komşu (kNN) algoritmasının kavramlarını öğrenin. Sınıflandırma, özellik uzayı ve ağırlıklı kNN'yi OpenCV ile basit bir 2D örnek üzerinde anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 50
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/knn_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# k-En Yakın Komşuyu Anlamak

## Hedefler

Bu bölümde, k-En Yakın Komşu (kNN) algoritmasının kavramlarını anlayacağız.

## Teori

kNN, denetimli öğrenme için mevcut en basit sınıflandırma algoritmalarından biridir. Fikir, özellik uzayındaki test verilerinin en yakın eşleşmelerini aramaktır.

Görüntüde iki aile var: Mavi Kareler ve Kırmızı Üçgenler. Her aileye **Sınıf** diyoruz. Onların evleri, **Özellik Uzayı** adını verdiğimiz kasaba haritalarında gösterilir.

Şimdi kasabaya yeni bir üye gelir ve yeni bir ev kurulur (yeşil daire). Bu yeni üyeyi Mavi veya Kırmızı ailelerden birine eklememiz gerekir. Bu sürece **Sınıflandırma** diyoruz.

Basit bir yöntem, en yakın komşunun kim olduğunu kontrol etmektir. Bu durumda Kırmızı Üçgen ailesidir. Bu **En Yakın Komşu** sınıflandırması olarak adlandırılır.

Ancak bu yaklaşımla bir sorun var: Kırmızı Üçgen en yakın komşu olabilir, ama yakında çok sayıda Mavi Kare de varsa? Bunun yerine **k** en yakın aile kontrol edilebilir — hangi aile çoğunluktaysa yeni üye o aileye ait olur. Bu yönteme **k-En Yakın Komşu** denir.

Hepsine eşit önem vermek yerine, uzaklığa göre ağırlık verilebilir: yeni gelene daha yakın olanlar daha yüksek ağırlık alır. Buna **ağırlıklı kNN** denir.

## OpenCV'de kNN

```python
import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt

# 25 bilinen/eğitim verisinin (x, y) değerlerini içeren özellik seti
trainData = np.random.randint(0, 100, (25, 2)).astype(np.float32)

# Her birini Kırmızı (0) veya Mavi (1) olarak etiketle
responses = np.random.randint(0, 2, (25, 1)).astype(np.float32)

# Kırmızı komşuları al ve çiz
red = trainData[responses.ravel() == 0]
plt.scatter(red[:, 0], red[:, 1], 80, 'r', '^')

# Mavi komşuları al ve çiz
blue = trainData[responses.ravel() == 1]
plt.scatter(blue[:, 0], blue[:, 1], 80, 'b', 's')

plt.show()

# Şimdi yeni bir girdi al ve onun nasıl sınıflandırıldığına bak
newcomer = np.random.randint(0, 100, (1, 2)).astype(np.float32)
plt.scatter(newcomer[:, 0], newcomer[:, 1], 80, 'g', 'o')

knn = cv.ml.KNearest_create()
knn.train(trainData, cv.ml.ROW_SAMPLE, responses)
ret, results, neighbours, dist = knn.findNearest(newcomer, 3)

print("result:  {}\n".format(results))
print("neighbours:  {}\n".format(neighbours))
print("distance:  {}\n".format(dist))
plt.show()
```

![kNN ikonu 1](/images/posts/opencv/knn_icon1.jpg)

![kNN ikonu 2](/images/posts/opencv/knn_icon2.jpg)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_knn/py_knn_understanding/py_knn_understanding.markdown)
