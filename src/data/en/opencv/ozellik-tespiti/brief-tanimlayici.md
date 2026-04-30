---
publishDate: 2022-05-29T00:00:00Z
author: Hakan Çelik
title: "BRIEF (Binary Robust Independent Elementary Features)"
excerpt: "Learn the basics of BRIEF algorithm, a fast binary descriptor that uses only 32 bytes compared to SIFT's 128 dimensions, enabling high-speed matching with Hamming distance."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 39
subcategory: Feature Detection
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# BRIEF (Binary Robust Independent Elementary Features)

## Goal

In this chapter we will see the basics of BRIEF algorithm.

## Theory

We know SIFT uses 128-dim vector for descriptors. Since it is using floating point numbers, it takes basically 512 bytes. Similarly SURF also takes minimum of 256 bytes (for 64-dim). Creating such a vector for thousands of features takes a lot of memory which are not feasible for resource-constraint applications especially for embedded systems.

But all these dimensions may not be needed for actual matching. We can compress it using several methods like PCA, LDA etc. Even other methods like hashing using LSH (Locality Sensitive Hashing) is used to convert these SIFT descriptors in floating point numbers to binary strings. These binary strings are used to match features using Hamming distance. This provides better speed-up because finding hamming distance is just applying XOR and bit count, which are very fast in modern CPUs with SSE instructions.

BRIEF comes into picture at this moment. It provides a shortcut to find the binary strings directly without finding descriptors. It takes smoothened image patch and selects a set of nd (x,y) location pairs in an unique way. Then some pixel intensity comparisons are done on these location pairs. For example, let first location pairs be p and q. If I(p) < I(q), then its result is 1, else it is 0. This is applied for all the nd location pairs to get a nd-dimensional bitstring.

This nd can be 128, 256 or 512. OpenCV supports all of these, but by default, it would be 256 (OpenCV represents it in bytes. So the values will be 16, 32 and 64).

One important point is that BRIEF is a feature descriptor, it doesn't provide any method to find the features. So you will have to use any other feature detectors like SIFT, SURF etc. The paper recommends to use CenSurE which is a fast detector.

In short, BRIEF is a faster method feature descriptor calculation and matching. It also provides high recognition rate unless there is large in-plane rotation.

## BRIEF in OpenCV

Below code shows the computation of BRIEF descriptors with the help of CenSurE detector.

> **Note:** You need [opencv contrib](https://github.com/opencv/opencv_contrib) to use this.

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('simple.jpg', cv.IMREAD_GRAYSCALE)

# Initiate FAST detector
star = cv.xfeatures2d.StarDetector_create()

# Initiate BRIEF extractor
brief = cv.xfeatures2d.BriefDescriptorExtractor_create()

# find the keypoints with STAR
kp = star.detect(img, None)

# compute the descriptors with BRIEF
kp, des = brief.compute(img, kp)

print(brief.descriptorSize())
print(des.shape)
```

The function `brief.getDescriptorSize()` gives the nd size used in bytes. By default it is 32. Next one is matching, which will be done in another chapter.

## Additional Resources

1. Michael Calonder, Vincent Lepetit, Christoph Strecha, and Pascal Fua, "BRIEF: Binary Robust Independent Elementary Features", 11th European Conference on Computer Vision (ECCV), Heraklion, Crete. LNCS Springer, September 2010.
2. [LSH (Locality Sensitive Hashing)](https://en.wikipedia.org/wiki/Locality-sensitive_hashing)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_brief/py_brief.markdown)
