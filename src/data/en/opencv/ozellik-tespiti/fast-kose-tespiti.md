---
publishDate: 2022-05-28T00:00:00Z
author: Hakan Çelik
title: "FAST Algorithm for Corner Detection"
excerpt: "Learn about FAST (Features from Accelerated Segment Test) algorithm designed for real-time applications. We cover cv.FastFeatureDetector_create() with and without non-maximal suppression."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 38
subcategory: Feature Detection
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# FAST Algorithm for Corner Detection

## Goal

In this chapter,

- We will understand the basics of FAST algorithm
- We will find corners using OpenCV functionalities for FAST algorithm.

## Theory

We saw several feature detectors and many of them are really good. But when looking from a real-time application point of view, they are not fast enough. One best example would be SLAM (Simultaneous Localization and Mapping) mobile robot which have limited computational resources.

As a solution to this, FAST (Features from Accelerated Segment Test) algorithm was proposed by Edward Rosten and Tom Drummond in their paper "Machine learning for high-speed corner detection" in 2006.

### Feature Detection using FAST

1. Select a pixel p in the image which is to be identified as an interest point or not. Let its intensity be Ip.
2. Select appropriate threshold value t.
3. Consider a circle of 16 pixels around the pixel under test:

   ![FAST speed test](/images/posts/opencv/fast_speedtest.jpg)

4. Now the pixel p is a corner if there exists a set of n contiguous pixels in the circle (of 16 pixels) which are all brighter than Ip + t, or all darker than Ip − t. n was chosen to be 12.

5. A **high-speed test** was proposed to exclude a large number of non-corners. This test examines only the four pixels at 1, 9, 5 and 13. If p is a corner, then at least three of these must all be brighter than Ip + t or darker than Ip − t.

There are several weaknesses:

- It does not reject as many candidates for n < 12.
- The choice of pixels is not optimal.
- Multiple features are detected adjacent to one another.

First 3 points are addressed with a machine learning approach. Last one is addressed using non-maximal suppression.

### States diagram

![FAST equations](/images/posts/opencv/fast_eqns.jpg)

### Non-maximal Suppression

Detecting multiple interest points in adjacent locations is another problem. It is solved by using Non-maximum Suppression.

1. Compute a score function V for all the detected feature points. V is the sum of absolute difference between p and 16 surrounding pixels values.
2. Consider two adjacent keypoints and compute their V values.
3. Discard the one with lower V value.

### Summary

It is several times faster than other existing corner detectors. But it is not robust to high levels of noise. It is dependent on a threshold.

## FAST Feature Detector in OpenCV

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('blox.jpg', cv.IMREAD_GRAYSCALE)

# Initiate FAST object with default values
fast = cv.FastFeatureDetector_create()

# find and draw the keypoints
kp = fast.detect(img, None)
img2 = cv.drawKeypoints(img, kp, None, color=(255, 0, 0))

# Print all default params
print("Threshold: {}".format(fast.getThreshold()))
print("nonmaxSuppression:{}".format(fast.getNonmaxSuppression()))
print("neighborhood: {}".format(fast.getType()))
print("Total Keypoints with nonmaxSuppression: {}".format(len(kp)))

cv.imwrite('fast_true.png', img2)

# Disable nonmaxSuppression
fast.setNonmaxSuppression(0)
kp = fast.detect(img, None)

print("Total Keypoints without nonmaxSuppression: {}".format(len(kp)))

img3 = cv.drawKeypoints(img, kp, None, color=(255, 0, 0))
cv.imwrite('fast_false.png', img3)
```

See the results. First image shows FAST with nonmaxSuppression and second one without nonmaxSuppression:

![FAST keypoints](/images/posts/opencv/fast_kp.jpg)

## Additional Resources

1. Edward Rosten and Tom Drummond, "Machine learning for high speed corner detection" in 9th European Conference on Computer Vision, vol. 1, 2006, pp. 430–443.
2. Edward Rosten, Reid Porter, and Tom Drummond, "Faster and better: a machine learning approach to corner detection" in IEEE Trans. Pattern Analysis and Machine Intelligence, 2010, vol 32, pp. 105-119.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_fast/py_fast.markdown)
