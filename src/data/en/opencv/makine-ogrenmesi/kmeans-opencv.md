---
publishDate: 2022-06-14T00:00:00Z
author: Hakan Çelik
title: "K-Means Clustering in OpenCV"
excerpt: "Learn to use cv.kmeans() function in OpenCV for data clustering. We cover single feature, multi-feature data and color quantization of images using K-Means."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 55
subcategory: Machine Learning
image: /images/posts/opencv/kmeans_demo.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# K-Means Clustering in OpenCV

## Goal

- Learn to use **cv.kmeans()** function in OpenCV for data clustering

## Understanding Parameters

### Input parameters

1. **samples**: It should be of **np.float32** data type.
2. **nclusters (K)**: Number of clusters required at end
3. **criteria**: It is the iteration termination criteria — `(type, max_iter, epsilon)`:
   - `cv.TERM_CRITERIA_EPS` — stop if specified accuracy epsilon is reached
   - `cv.TERM_CRITERIA_MAX_ITER` — stop after specified number of iterations
   - `cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER` — stop when any condition is met
4. **attempts**: Number of times the algorithm is executed using different initial labellings
5. **flags**: Specifies how initial centers are taken: **cv.KMEANS_PP_CENTERS** or **cv.KMEANS_RANDOM_CENTERS**

### Output parameters

1. **compactness**: Sum of squared distance from each point to their corresponding centers
2. **labels**: Label array where each element marked '0', '1' etc.
3. **centers**: Array of centers of clusters.

## 1. Data with Only One Feature

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

x = np.random.randint(25, 100, 25)
y = np.random.randint(175, 255, 25)
z = np.hstack((x, y))
z = z.reshape((50, 1))
z = np.float32(z)

# Define criteria
criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
flags = cv.KMEANS_RANDOM_CENTERS

# Apply KMeans
compactness, labels, centers = cv.kmeans(z, 2, None, criteria, 10, flags)

A = z[labels == 0]
B = z[labels == 1]

plt.hist(A, 256, [0, 256], color='r')
plt.hist(B, 256, [0, 256], color='b')
plt.hist(centers, 32, [0, 256], color='y')
plt.show()
```

## 2. Data with Multiple Features

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

X = np.random.randint(25, 50, (25, 2))
Y = np.random.randint(60, 85, (25, 2))
Z = np.vstack((X, Y))
Z = np.float32(Z)

criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
ret, label, center = cv.kmeans(Z, 2, None, criteria, 10, cv.KMEANS_RANDOM_CENTERS)

A = Z[label.ravel() == 0]
B = Z[label.ravel() == 1]

plt.scatter(A[:, 0], A[:, 1])
plt.scatter(B[:, 0], B[:, 1], c='r')
plt.scatter(center[:, 0], center[:, 1], s=80, c='y', marker='s')
plt.xlabel('Height'), plt.ylabel('Weight')
plt.show()
```

## 3. Color Quantization

Color Quantization is the process of reducing number of colors in an image. Here we will use K-Means clustering for color quantization:

```python
import numpy as np
import cv2 as cv

img = cv.imread('home.jpg')
Z = img.reshape((-1, 3))
Z = np.float32(Z)

criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
K = 8
ret, label, center = cv.kmeans(Z, K, None, criteria, 10, cv.KMEANS_RANDOM_CENTERS)

center = np.uint8(center)
res = center[label.flatten()]
res2 = res.reshape((img.shape))

cv.imshow('res2', res2)
cv.waitKey(0)
cv.destroyAllWindows()
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_kmeans/py_kmeans_opencv/py_kmeans_opencv.markdown)
