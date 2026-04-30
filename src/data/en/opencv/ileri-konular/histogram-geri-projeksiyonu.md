---
publishDate: 2022-05-16T00:00:00Z
author: Hakan Çelik
title: "Histograms - Histogram Backprojection"
excerpt: "Learn about histogram backprojection for image segmentation and object finding. We cover cv2.calcBackProject() with both NumPy and OpenCV implementations."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 26
subcategory: Advanced Topics
image: /images/posts/opencv/backproject_opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Histogram Backprojection

## Goals

In this chapter, we will learn about histogram backprojection.

## Theory

It was proposed by **Michael J. Swain, Dana H. Ballard** in their paper **Indexing via color histograms**.

**What is it actually in simple words?** It is used for image segmentation or finding objects of interest in an image. In simple words, it creates an image of the same size (but single channel) as that of our input image, where each pixel corresponds to the probability of that pixel belonging to our object. In more simpler words, the output image will have our object of interest in more white compared to remaining part. Histogram Backprojection is used with camshift algorithm etc.

**How do we do it?** We create a histogram of an image containing our object of interest (in our case, the ground, leaving player and other things). The object should fill the image as far as possible for better results. And a color histogram is preferred over grayscale histogram, because color of the object is a better way to define the object than its grayscale intensity. We then "back-project" this histogram over our test image where we need to find the object, ie we calculate the probability of every pixel belonging to the ground and show it.

## Algorithm in Numpy

1. First we need to calculate the color histogram of both the object we need to find (let it be `M`) and the image where we are going to search (let it be `I`):

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

# roi is the object or region of object we need to find
roi = cv.imread('rose_red.png')
assert roi is not None, "file could not be read, check with os.path.exists()"
hsv = cv.cvtColor(roi, cv.COLOR_BGR2HSV)

# target is the image we search in
target = cv.imread('rose.png')
assert target is not None, "file could not be read, check with os.path.exists()"
hsvt = cv.cvtColor(target, cv.COLOR_BGR2HSV)

# Find the histograms using calcHist. Can be done with np.histogram2d also
M = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
I = cv.calcHist([hsvt], [0, 1], None, [180, 256], [0, 180, 0, 256])
```

2. Find the ratio `R = M / I`. Then backproject R, ie use R as palette and create a new image with every pixel as its corresponding probability of being target. ie `B(x,y) = R[h(x,y), s(x,y)]` where h is hue and s is saturation of the pixel at (x,y). After that apply the condition `B(x,y) = min[B(x,y), 1]`:

```python
R = M / (I + 1e-5)
h, s, v = cv.split(hsvt)
B = R[h.ravel(), s.ravel()]
B = np.minimum(B, 1)
B = B.reshape(hsvt.shape[:2])
```

3. Now apply a convolution with a circular disc, `B = D * B`, where D is the disc kernel:

```python
disc = cv.getStructuringElement(cv.MORPH_ELLIPSE, (5, 5))
cv.filter2D(B, -1, disc, B)
B = np.uint8(B)
cv.normalize(B, B, 0, 255, cv.NORM_MINMAX)
```

4. Now the location of maximum intensity gives us the location of object. Thresholding for a suitable value gives a nice result:

```python
ret, thresh = cv.threshold(B, 50, 255, 0)
```

## Backprojection in OpenCV

OpenCV provides an inbuilt function `cv2.calcBackProject()`. Its parameters are almost same as the `cv2.calcHist()` function. One of its parameter is histogram which is histogram of the object and we have to find it. Also, the object histogram should be normalized before passing on to the backproject function. It returns the probability image. Then we convolve the image with a disc kernel and apply threshold:

```python
import numpy as np
import cv2 as cv

roi = cv.imread('rose_red.png')
assert roi is not None, "file could not be read, check with os.path.exists()"
hsv = cv.cvtColor(roi, cv.COLOR_BGR2HSV)

target = cv.imread('rose.png')
assert target is not None, "file could not be read, check with os.path.exists()"
hsvt = cv.cvtColor(target, cv.COLOR_BGR2HSV)

# calculating object histogram
roihist = cv.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])

# normalize histogram and apply backprojection
cv.normalize(roihist, roihist, 0, 255, cv.NORM_MINMAX)
dst = cv.calcBackProject([hsvt], [0, 1], roihist, [0, 180, 0, 256], 1)

# Now convolute with circular disc
disc = cv.getStructuringElement(cv.MORPH_ELLIPSE, (5, 5))
cv.filter2D(dst, -1, disc, dst)

# threshold and binary AND
ret, thresh = cv.threshold(dst, 50, 255, 0)
thresh = cv.merge((thresh, thresh, thresh))
res = cv.bitwise_and(target, thresh)

res = np.vstack((target, thresh, res))
cv.imwrite('res.jpg', res)
```

Below is one example I worked with. I used the region inside blue rectangle as sample object and I wanted to extract the full ground:

![Histogram backprojection result](/images/posts/opencv/backproject_opencv.jpg)

## Additional Resources

- "Indexing via color histograms", Swain, Michael J., Third international conference on computer vision, 1990.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_histograms/py_histogram_backprojection/py_histogram_backprojection.markdown)
