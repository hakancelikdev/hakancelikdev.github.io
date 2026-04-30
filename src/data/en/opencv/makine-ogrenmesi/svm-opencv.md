---
publishDate: 2022-06-12T00:00:00Z
author: Hakan Çelik
title: "OCR of Hand-written Data using SVM"
excerpt: "Learn to use SVM with HOG (Histogram of Oriented Gradients) features for OCR of handwritten digits. This approach achieves ~94% accuracy, better than kNN with raw pixels."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 53
subcategory: Machine Learning
image: /images/posts/opencv/svm_icon2.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OCR of Hand-written Data using SVM

## Goal

In this chapter we will revisit the hand-written data OCR, but, with SVM instead of kNN.

## OCR of Hand-written Digits

In kNN, we directly used pixel intensity as the feature vector. This time we will use **HOG (Histogram of Oriented Gradients)** as feature vectors.

Before finding the HOG, we deskew the image using its second order moments. We define a function `deskew()` which takes a digit image and deskew it:

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

cells = [np.hsplit(row, 100) for row in np.vsplit(img, 50)]

x = np.array(cells)
deskewed = [list(map(deskew, row)) for row in x]
hogdata = [list(map(hog, row)) for row in deskewed]

trainData = np.float32(hogdata)[:, :50].reshape(-1, 64)
testData = np.float32(hogdata)[:, 50:].reshape(-1, 64)

k = np.arange(10)
train_labels = np.repeat(k, 250)[:, np.newaxis]
test_labels = train_labels.copy()

# SVM Training
svm = cv.ml.SVM_create()
svm.setKernel(cv.ml.SVM_LINEAR)
svm.setType(cv.ml.SVM_C_SVC)
svm.setC(2.67)
svm.setGamma(5.383)
svm.train(trainData, cv.ml.ROW_SAMPLE, train_labels)

result = svm.predict(testData)[1]
mask = result == test_labels
correct = np.count_nonzero(mask)
print(correct * 100.0 / result.size)
```

This particular technique gave nearly 94% accuracy.

## Additional Resources

1. [Histograms of Oriented Gradients Video](https://www.youtube.com/watch?v=0Zib1YEE4LU)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_svm/py_svm_opencv/py_svm_opencv.markdown)
