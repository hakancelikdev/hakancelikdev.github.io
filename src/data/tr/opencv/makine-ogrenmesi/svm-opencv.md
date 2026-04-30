---
publishDate: 2022-06-12T00:00:00Z
author: Hakan Çelik
title: "SVM ile El Yazısı OCR"
excerpt: "SVM ve HOG (Yönlendirilmiş Gradyanların Histogramı) kullanarak el yazısı rakamları tanıyın. kNN ile kıyaslandığında yaklaşık %94 doğruluk sağlayan bu yöntemi anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 53
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/svm_icon2.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# SVM ile El Yazısı OCR

## Hedefler

Bu bölümde:

- SVM kullanarak el yazısı veri OCR'sini yeniden ziyaret edeceğiz

## El Yazısı Rakamların OCR'si

kNN'de, özellik vektörü olarak doğrudan piksel yoğunluğunu kullandık. Bu sefer özellik vektörleri olarak **HOG (Yönlendirilmiş Gradyanların Histogramı)** kullanacağız.

HOG bulmadan önce, görüntüyü ikinci dereceden momentlerini kullanarak eğrilik gidermek için `deskew()` fonksiyonu tanımlıyoruz:

```python
import cv2 as cv
import numpy as np

SZ = 20
bin_n = 16

def deskew(img):
    m = cv.moments(img)
    if abs(m['mu02']) < 1e-2:
        return img.copy()
    skew = m['mu11'] / m['mu02']
    M = np.float32([[1, skew, -0.5 * SZ * skew], [0, 1, 0]])
    img = cv.warpAffine(img, M, (SZ, SZ), flags=cv.WARP_INVERSE_MAP | cv.INTER_LINEAR)
    return img

def hog(img):
    gx = cv.Sobel(img, cv.CV_32F, 1, 0)
    gy = cv.Sobel(img, cv.CV_32F, 0, 1)
    mag, ang = cv.cartToPolar(gx, gy)
    bins = np.int32(bin_n * ang / (2 * np.pi))
    bin_cells = bins[:10, :10], bins[10:, :10], bins[:10, 10:], bins[10:, 10:]
    mag_cells = mag[:10, :10], mag[10:, :10], mag[:10, 10:], mag[10:, 10:]
    hists = [np.bincount(b.ravel(), m.ravel(), bin_n) for b, m in zip(bin_cells, mag_cells)]
    hist = np.hstack(hists)
    return hist

img = cv.imread('digits.png', cv.IMREAD_GRAYSCALE)

# Görüntüyü hücrelere böl
cells = [np.hsplit(row, 100) for row in np.vsplit(img, 50)]

# Her hücre için HOG hesapla
x = np.array(cells)
deskewed = [list(map(deskew, row)) for row in x]
hogdata = [list(map(hog, row)) for row in deskewed]

trainData = np.float32(hogdata)[:, :50].reshape(-1, 64)
testData = np.float32(hogdata)[:, 50:].reshape(-1, 64)

# Etiketler
k = np.arange(10)
train_labels = np.repeat(k, 250)[:, np.newaxis]
test_labels = train_labels.copy()

# SVM Eğitimi
svm = cv.ml.SVM_create()
svm.setKernel(cv.ml.SVM_LINEAR)
svm.setType(cv.ml.SVM_C_SVC)
svm.setC(2.67)
svm.setGamma(5.383)
svm.train(trainData, cv.ml.ROW_SAMPLE, train_labels)

# Test
result = svm.predict(testData)[1]
mask = result == test_labels
correct = np.count_nonzero(mask)
print(correct * 100.0 / result.size)
```

Bu yöntem yaklaşık %94 doğruluk sağlar.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_svm/py_svm_opencv/py_svm_opencv.markdown)
