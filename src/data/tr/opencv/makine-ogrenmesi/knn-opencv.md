---
publishDate: 2022-06-10T00:00:00Z
author: Hakan Çelik
title: "kNN ile El Yazısı OCR"
excerpt: "kNN bilgisini kullanarak temel bir OCR uygulaması oluşturmayı öğrenin. OpenCV'nin digits.png veri seti ile el yazısı rakamları ve İngilizce alfabe tanımayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 51
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/knn_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# kNN ile El Yazısı OCR

## Hedefler

Bu bölümde:

- Temel bir OCR uygulaması oluşturmak için kNN bilgisini kullanacağız
- OpenCV ile gelen Rakamlar ve Alfabe verisi üzerinde uygulamamızı deneyeceğiz

## El Yazısı Rakamların OCR'si

Amacımız, el yazısıyla yazılmış rakamları okuyabilecek bir uygulama oluşturmaktır. OpenCV, 5000 el yazısı rakam içeren bir digits.png görüntüsüyle (her rakam için 500) birlikte gelir. Her rakam 20×20 piksel boyutundadır.

```python
import numpy as np
import cv2 as cv

img = cv.imread('digits.png')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# Görüntüyü 5000 hücreye böl, her biri 20×20 boyutunda
cells = [np.hsplit(row, 100) for row in np.vsplit(gray, 50)]

# Numpy dizisine dönüştür: boyutu (50, 100, 20, 20) olacak
x = np.array(cells)

# Eğitim ve test verisi hazırla
train = x[:, :50].reshape(-1, 400).astype(np.float32)  # Boyut = (2500, 400)
test = x[:, 50:100].reshape(-1, 400).astype(np.float32)  # Boyut = (2500, 400)

# Eğitim ve test verisi için etiketler oluştur
k = np.arange(10)
train_labels = np.repeat(k, 250)[:, np.newaxis]
test_labels = train_labels.copy()

# kNN'i başlat, eğitim verisiyle eğit, ardından k=5 ile test verisiyle test et
knn = cv.ml.KNearest_create()
knn.train(train, cv.ml.ROW_SAMPLE, train_labels)
ret, result, neighbours, dist = knn.findNearest(test, k=5)

# Doğruluğu kontrol et
matches = result == test_labels
correct = np.count_nonzero(matches)
accuracy = correct * 100.0 / result.size
print(accuracy)
```

Bu uygulama yaklaşık %91 doğruluk sağlar. Doğruluğu artırmak için özellikle hata yapılan rakamlar için daha fazla veri ekleyebilirsiniz.

### Veriyi Kaydetme ve Yükleme

Uygulamayı her başlatışımda bu eğitim verisini bulmak yerine kaydetmek daha iyidir:

```python
# Veriyi kaydet
np.savez('knn_data.npz', train=train, train_labels=train_labels)

# Veriyi yükle
with np.load('knn_data.npz') as data:
    print(data.files)
    train = data['train']
    train_labels = data['train_labels']
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_knn/py_knn_opencv/py_knn_opencv.markdown)
