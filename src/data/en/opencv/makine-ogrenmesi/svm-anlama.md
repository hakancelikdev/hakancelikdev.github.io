---
publishDate: 2022-06-11T00:00:00Z
author: Hakan Çelik
title: "Understanding SVM"
excerpt: "Learn an intuitive understanding of Support Vector Machines (SVM). We cover decision boundaries, support vectors, margin maximization, and kernel trick for non-linearly separable data."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 52
subcategory: Machine Learning
image: /images/posts/opencv/svm_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Understanding SVM

## Goal

In this chapter we will see an intuitive understanding of SVM.

## Theory

### Linearly Separable Data

Consider an image below which has two types of data, red and blue. We find a line, f(x) = ax₁ + bx₂ + c which divides both the data to two regions. When we get a new test_data X, just substitute it in f(X). If f(X) > 0, it belongs to blue group, else it belongs to red group. We can call this line as **Decision Boundary**.

So what SVM does is to find a straight line (or hyperplane) with largest minimum distance to the training samples. These points closest to the decision boundary are called **Support Vectors** and the lines passing through them are called **Support Planes**.

### Non-Linearly Separable Data

Consider some data which can't be divided into two with a straight line. For example, one-dimensional data where 'X' is at -3 & +3 and 'O' is at -1 & +1. If we map this data set with a function f(x) = x², we get 'X' at 9 and 'O' at 1 which are linear separable.

In general, it is possible to map points in a d-dimensional space to some D-dimensional space (D > d) to check the possibility of linear separability. The **kernel function** helps compute the dot product in the high-dimensional (kernel) space by performing computations in the low-dimensional input (feature) space.

## SVM in OpenCV

```python
import cv2 as cv
import numpy as np

# Training data
labels = np.array([1, 1, -1, -1])
trainingData = np.matrix([[501, 10], [255, 10], [501, 255], [10, 501]], dtype=np.float32)

# Create SVM and train
svm = cv.ml.SVM_create()
svm.setType(cv.ml.SVM_C_SVC)
svm.setKernel(cv.ml.SVM_LINEAR)
svm.setTermCriteria((cv.TERM_CRITERIA_MAX_ITER, 100, 1e-6))
svm.train(trainingData, cv.ml.ROW_SAMPLE, labels)
```

![SVM icon 1](/images/posts/opencv/svm_icon1.jpg)

![SVM icon 2](/images/posts/opencv/svm_icon2.jpg)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_svm/py_svm_basics/py_svm_basics.markdown)
