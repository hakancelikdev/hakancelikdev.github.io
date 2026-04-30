---
publishDate: 2022-01-05T00:00:00Z
author: Hakan Çelik
title: "Contours"
excerpt: "We will understand what contours are. We will learn to find and draw contours. We will learn these functions: cv2.findContours(), cv2.drawContours()"
category: OpenCV
series: "OpenCV Series"
seriesIndex: 10
subcategory: Advanced Topics
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Contours

## Contours: Getting Started

### Goals

- We will understand what contours are.
- We will learn to find and draw contours.
- We will learn these functions: `cv2.findContours()`, `cv2.drawContours()`

### What are Contours?

Contours can be simply explained as a curve joining all the continuous points \(along
the boundary\) having the same color or intensity. Contours are a useful tool for shape
analysis and object detection and recognition.

- For better accuracy, binary images are used \( binary images. \). So before finding
  contours, apply threshold or canny edge detection.
- **findContours** function modifies the source image. So if you want to keep the source
  image even after finding contours, store it in some other variable.
- Finding contours in OpenCV is like finding white object from black background.
  Remember, object to be found should be white and background should be black.

Let's see how to find contours of a binary image:

```python
import numpy as np
import cv2
im = cv2.imread('test.jpg')
imgray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(imgray, 127, 255, 0)
image, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
```

You can see that the `cv2.findContours()` function has 3 arguments:

- Source image
- Contour retrieval mode \( contour retrieval mode \)
- Contour approximation method \( contour approximation method \)

And it outputs the image, contours and hierarchy.

contours is a Python list of all the contours in the image. Each individual contour is a
Numpy array of \(x,y\) coordinates of boundary points of the object.

### How to Draw Contours?

To draw the contours, `cv2.drawContours` function is used. It can also be used to draw
any shape provided you have its boundary points.

- First argument is source image \( source image \)
- Second argument is the contours which should be passed as a Python list.
- Third argument is index of contours \(useful when drawing individual contour. To draw
  all contours, pass -1\) and remaining arguments are color \( color \), thickness
  \( thickness \) etc.

To draw all the contours in an image:

`img = cv2.drawContours(img, contours, -1, (0,255,0), 3)`

To draw an individual contour, say 4th contour:

`img = cv2.drawContours(img, contours, 3, (0,255,0), 3)`

But most of the time, below method will be useful:

```python
cnt = contours[4]
img = cv2.drawContours(img, [cnt], 0, (0,255,0), 3)
```

Note: The last two methods are same, but when you go forward, you will see that the last
one is more useful.

### Contour Approximation Method

> Contour Approximation Method

This is the third argument of the `cv2.findContours` function. What does it actually
mean?

Above, we told that contours are the boundaries of a shape with same intensity. It
stores the \(x, y\) coordinates of the boundary of a shape. But does it store all the
coordinates? That is specified by this contour approximation method.

If you pass `cv2.CHAIN_APPROX_NONE`, all the boundary points are stored. But actually,
do we need all the points? For example, you found the contour of a straight line. Do you
need all the points on the line to represent that line? No, we need just two end points
of that line. This is what `cv2.CHAIN_APPROX_SIMPLE` does. It removes all redundant
points and compresses the contour, thereby saving memory.

The below image of a rectangle demonstrate this technique. Just draw a circle on all the
coordinates in the contour array \(drawn in blue color\). First image shows points I got
with `cv2.CHAIN_APPROX_NONE` \(734 points\) and second image shows the one with
`cv2.CHAIN_APPROX_SIMPLE` \(only 4 points\). See, how much memory it saves!!!


## Contour Features

### Goals

- We will find different properties of contours such as area, perimeter, centroid,
  bounding box, etc.
- We will see many functions related to contours.

Translation reference:
[https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.html](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.html)

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_contours/py_contours_begin/py_contours_begin.markdown)
