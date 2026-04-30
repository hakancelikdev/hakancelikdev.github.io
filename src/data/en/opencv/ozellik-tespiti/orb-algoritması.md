---
publishDate: 2022-05-30T00:00:00Z
author: Hakan Çelik
title: "ORB (Oriented FAST and Rotated BRIEF)"
excerpt: "Learn about ORB, a free alternative to SIFT or SURF. We cover cv.ORB_create() for keypoint detection and descriptor computation using FAST + rBRIEF combination."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 40
subcategory: Feature Detection
image: /images/posts/opencv/orb_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# ORB (Oriented FAST and Rotated BRIEF)

## Goal

In this chapter, we will see the basics of ORB.

## Theory

As an OpenCV enthusiast, the most important thing about the ORB is that it came from "OpenCV Labs". This algorithm was brought up by Ethan Rublee, Vincent Rabaud, Kurt Konolige and Gary R. Bradski in their paper **ORB: An efficient alternative to SIFT or SURF** in 2011. As the title says, it is a good alternative to SIFT and SURF in computation cost, matching performance and mainly the patents. Yes, SIFT and SURF are patented and you are supposed to pay them for its use. But ORB is not!!!

ORB is basically a fusion of FAST keypoint detector and BRIEF descriptor with many modifications to enhance the performance. First it use FAST to find keypoints, then apply Harris corner measure to find top N points among them. It also use pyramid to produce multiscale-features.

But one problem is that, FAST doesn't compute the orientation. So what about rotation invariance? Authors came up with following modification: It computes the intensity weighted centroid of the patch with located corner at center. The direction of the vector from this corner point to centroid gives the orientation.

For descriptors, ORB use BRIEF descriptors. But BRIEF performs poorly with rotation. So ORB "steers" BRIEF according to the orientation of keypoints. The result is called **rBRIEF**.

For descriptor matching, multi-probe LSH which improves on the traditional LSH, is used. The paper says ORB is much faster than SURF and SIFT and ORB descriptor works better than SURF. ORB is a good choice in low-power devices for panorama stitching etc.

## ORB in OpenCV

As usual, we have to create an ORB object with the function, **cv.ORB()** or using feature2d common interface. Most useful optional parameters: `nFeatures` (maximum features to retain, default 500), `scoreType` (Harris or FAST score), `WTA_K` (number of points producing each oriented BRIEF element, default 2 uses NORM_HAMMING; 3 or 4 uses NORM_HAMMING2).

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('simple.jpg', cv.IMREAD_GRAYSCALE)

# Initiate ORB detector
orb = cv.ORB_create()

# find the keypoints with ORB
kp = orb.detect(img, None)

# compute the descriptors with ORB
kp, des = orb.compute(img, kp)

# draw only keypoints location, not size and orientation
img2 = cv.drawKeypoints(img, kp, None, color=(0, 255, 0), flags=0)
plt.imshow(img2), plt.show()
```

See the result below:

![ORB keypoints](/images/posts/opencv/orb_kp.jpg)

ORB feature matching, we will do in another chapter.

## Additional Resources

1. Ethan Rublee, Vincent Rabaud, Kurt Konolige, Gary R. Bradski: ORB: An efficient alternative to SIFT or SURF. ICCV 2011: 2564-2571.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_orb/py_orb.markdown)
