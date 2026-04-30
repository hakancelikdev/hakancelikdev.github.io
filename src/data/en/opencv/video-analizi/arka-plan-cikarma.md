---
publishDate: 2022-06-04T00:00:00Z
author: Hakan Çelik
title: "Background Subtraction"
excerpt: "Learn background subtraction techniques to detect moving objects in video streams. We cover cv.createBackgroundSubtractorMOG2() and KNN-based background subtraction."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 45
subcategory: Video Analysis
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Background Subtraction

## Goal

In this chapter,

- We will familiarize with the background subtraction methods available in OpenCV.

## Basics

Background subtraction is a major preprocessing step in many vision-based applications. For example, a customer counter using a static camera, or a traffic analysis system. In all these cases, you first need to extract the person or vehicles alone. Background subtraction achieves this by creating a model of the background.

OpenCV has implemented three such algorithms, among which we will talk about two:
- **MOG2** (Gaussian Mixture-based Background/Foreground Segmentation Algorithm)
- **KNN** (K-Nearest Neigbours based Background/Foreground Segmentation)

## BackgroundSubtractorMOG2

It is a Gaussian Mixture-based Background/Foreground Segmentation Algorithm. It is based on two papers by Z.Zivkovic, "Improved adaptive Gaussian mixture model for background subtraction" in 2004 and "Efficient Adaptive Density Estimation per Image Pixel for the Task of Background Subtraction" in 2006. One important feature of this algorithm is that it selects the appropriate number of gaussian distribution for each pixel.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('vtest.avi')

fgbg = cv.createBackgroundSubtractorMOG2()

while True:
    ret, frame = cap.read()

    if not ret:
        break

    fgmask = fgbg.apply(frame)

    cv.imshow('frame', fgmask)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
```

### Shadow Detection

MOG2 algorithm can detect shadows. It is enabled by default. Shadows are marked with value 127 in the mask. You can disable this behavior:

```python
fgbg = cv.createBackgroundSubtractorMOG2(detectShadows=True)
```

## BackgroundSubtractorKNN

It is a K-nearest neighbours based Background/Foreground Segmentation Algorithm.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('vtest.avi')

fgbg = cv.createBackgroundSubtractorKNN()

while True:
    ret, frame = cap.read()

    if not ret:
        break

    fgmask = fgbg.apply(frame)

    cv.imshow('frame', fgmask)

    k = cv.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
```

## Additional Resources

1. Zivkovic, Z. "Improved adaptive Gaussian mixture model for background subtraction", 2004.
2. Zivkovic, Z. and van der Heijden, F. "Efficient adaptive density estimation per image pixel for the task of background subtraction", Pattern Recognition Letters, 2006.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_video/py_bg_subtraction/py_bg_subtraction.markdown)
