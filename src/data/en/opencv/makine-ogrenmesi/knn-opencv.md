---
publishDate: 2022-06-10T00:00:00Z
author: Hakan Çelik
title: "OCR of Hand-written Data using kNN"
excerpt: "Learn to build a basic OCR application using kNN knowledge. We use OpenCV's digits.png dataset to recognize handwritten digits achieving ~91% accuracy."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 51
subcategory: Machine Learning
image: /images/posts/opencv/knn_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OCR of Hand-written Data using kNN

## Goal

In this chapter:

- We will use our knowledge on kNN to build a basic OCR (Optical Character Recognition) application.
- We will try our application on Digits and Alphabets data that comes with OpenCV.

## OCR of Hand-written Digits

Our goal is to build an application which can read handwritten digits. OpenCV comes with an image digits.png (in the folder opencv/samples/data/) which has 5000 handwritten digits (500 for each digit). Each digit is a 20x20 image.

```python
import numpy as np
import cv2 as cv

img = cv.imread('digits.png')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# Now we split the image to 5000 cells, each 20x20 size
cells = [np.hsplit(row, 100) for row in np.vsplit(gray, 50)]

# Make it into a Numpy array: its size will be (50,100,20,20)
x = np.array(cells)

# Now we prepare the training data and test data
train = x[:, :50].reshape(-1, 400).astype(np.float32)  # Size = (2500,400)
test = x[:, 50:100].reshape(-1, 400).astype(np.float32)  # Size = (2500,400)

# Create labels for train and test data
k = np.arange(10)
train_labels = np.repeat(k, 250)[:, np.newaxis]
test_labels = train_labels.copy()

# Initiate kNN, train it on the training data, then test it with the test data with k=5
knn = cv.ml.KNearest_create()
knn.train(train, cv.ml.ROW_SAMPLE, train_labels)
ret, result, neighbours, dist = knn.findNearest(test, k=5)

# Now we check the accuracy of classification
matches = result == test_labels
correct = np.count_nonzero(matches)
accuracy = correct * 100.0 / result.size
print(accuracy)
```

So our basic OCR app is ready. This particular example gave an accuracy of 91%. One option to improve accuracy is to add more data for training, especially for the digits where we had more errors.

### Saving and Loading Data

Instead of finding this training data every time, we can save it:

```python
# Save the data
np.savez('knn_data.npz', train=train, train_labels=train_labels)

# Now load the data
with np.load('knn_data.npz') as data:
    print(data.files)
    train = data['train']
    train_labels = data['train_labels']
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_knn/py_knn_opencv/py_knn_opencv.markdown)
