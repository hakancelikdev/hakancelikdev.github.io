---
publishDate: 2022-05-12T00:00:00Z
author: Hakan Çelik
title: "Hough Circle Transform"
excerpt: "Learn to use Hough Transform to find circles in an image. We will see cv2.HoughCircles() function with practical examples."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 22
subcategory: Image Processing
image: /images/posts/opencv/houghcircles2.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Hough Circle Transform

## Goals

In this chapter:

- We will learn to use Hough Transform to find circles in an image.
- We will see these functions: `cv2.HoughCircles()`

## Theory

A circle is represented mathematically as:

`(x - x_center)² + (y - y_center)² = r²`

where `(x_center, y_center)` is the center of the circle, and `r` is the radius. From the equation, we can see we have 3 parameters, so we need a 3D accumulator for hough transform, which would be highly ineffective. So OpenCV uses a more trickier method, **Hough Gradient Method**, which uses the gradient information of edges.

## Hough Circle Transform in OpenCV

The function we use here is `cv2.HoughCircles()`. It has plenty of arguments which are well explained in the documentation. So we directly go to the code:

```python
import numpy as np
import cv2 as cv

img = cv.imread('opencv-logo-white.png', cv.IMREAD_GRAYSCALE)
assert img is not None, "file could not be read, check with os.path.exists()"
img = cv.medianBlur(img, 5)
cimg = cv.cvtColor(img, cv.COLOR_GRAY2BGR)

circles = cv.HoughCircles(img, cv.HOUGH_GRADIENT, 1, 20,
                           param1=50, param2=30, minRadius=0, maxRadius=0)

circles = np.uint16(np.around(circles))
for i in circles[0, :]:
    # draw the outer circle
    cv.circle(cimg, (i[0], i[1]), i[2], (0, 255, 0), 2)
    # draw the center of the circle
    cv.circle(cimg, (i[0], i[1]), 2, (0, 0, 255), 3)

cv.imshow('detected circles', cimg)
cv.waitKey(0)
cv.destroyAllWindows()
```

### Function Parameters

- **image:** 8-bit, single-channel, grayscale input image.
- **method:** Detection method — currently only `cv2.HOUGH_GRADIENT` is supported.
- **dp:** Inverse ratio of the accumulator resolution to the image resolution. For example, `dp=1` means the accumulator has the same resolution as the input image, `dp=2` means half as big.
- **minDist:** Minimum distance between the centers of the detected circles. Too small a value may result in multiple circles being detected; too large a value may miss some circles.
- **param1:** First method-specific parameter. For `HOUGH_GRADIENT`, it is the higher threshold of the two passed to Canny edge detector (the lower one is twice smaller).
- **param2:** Second method-specific parameter. For `HOUGH_GRADIENT`, it is the accumulator threshold. Smaller value means more (false) circles may be detected.
- **minRadius:** Minimum circle radius.
- **maxRadius:** Maximum circle radius.

Result is shown below:

![Hough circle detection](/images/posts/opencv/houghcircles2.jpg)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_houghcircles/py_houghcircles.markdown)
