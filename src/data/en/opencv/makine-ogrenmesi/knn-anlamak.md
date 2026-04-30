---
publishDate: 2022-06-09T00:00:00Z
author: Hakan Çelik
title: "Understanding k-Nearest Neighbour"
excerpt: "Learn the concepts of the k-Nearest Neighbour (kNN) algorithm. We cover classification, feature space, weighted kNN, and implement a simple example with OpenCV."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 50
subcategory: Machine Learning
image: /images/posts/opencv/knn_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Understanding k-Nearest Neighbour

## Goal

In this chapter, we will understand the concepts of the k-Nearest Neighbour (kNN) algorithm.

## Theory

kNN is one of the simplest classification algorithms available for supervised learning. The idea is to search for the closest match(es) of the test data in the feature space.

In the image, there are two families: Blue Squares and Red Triangles. Their houses are shown in their town map which we call the **Feature Space**.

Now consider what happens if a new member comes into the town (green circle). He should be added to one of these Blue or Red families. We call that process, **Classification**.

One simple method is to check who is his nearest neighbour. This method is called **Nearest Neighbour** classification.

But what if there are also a lot of Blue Squares nearby? Instead we may want to check some **k** nearest families. Then whichever family is the majority amongst them, the new guy should belong to that family. This method is called **k-Nearest Neighbour** classification.

We can also give weights to each neighbour depending on their distance to the new-comer: those who are nearer get higher weights. This is called **weighted kNN**.

## kNN in OpenCV

```python
import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt

# Feature set containing (x,y) values of 25 known/training data
trainData = np.random.randint(0, 100, (25, 2)).astype(np.float32)

# Label each one either Red or Blue with numbers 0 and 1
responses = np.random.randint(0, 2, (25, 1)).astype(np.float32)

# Take Red neighbours and plot them
red = trainData[responses.ravel() == 0]
plt.scatter(red[:, 0], red[:, 1], 80, 'r', '^')

# Take Blue neighbours and plot them
blue = trainData[responses.ravel() == 1]
plt.scatter(blue[:, 0], blue[:, 1], 80, 'b', 's')

plt.show()

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

![kNN icon 1](/images/posts/opencv/knn_icon1.jpg)

![kNN icon 2](/images/posts/opencv/knn_icon2.jpg)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_knn/py_knn_understanding/py_knn_understanding.markdown)
