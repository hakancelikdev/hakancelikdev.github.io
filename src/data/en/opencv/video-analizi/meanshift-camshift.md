---
publishDate: 2022-06-02T00:00:00Z
author: Hakan Çelik
title: "Meanshift and Camshift"
excerpt: "Learn to use Meanshift and Camshift algorithms for object tracking in video. We cover cv.meanShift() and cv.CamShift() for histogram-based object tracking."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 43
subcategory: Video Analysis
image: /images/posts/opencv/feature_building.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Meanshift and Camshift

## Goal

In this chapter,

- We will learn about Meanshift and Camshift algorithms to find and track objects in videos.
- We will see: **cv.meanShift()** and **cv.CamShift()**

## Meanshift

The intuition behind the meanshift is simple. Consider you have a set of points. (It can be a pixel distribution like histogram backprojection). You are given a small window (may be a circle) and you have to move that window to the area of maximum pixel density (or maximum number of points).

It keep on moving the window until convergence, i.e., until the window center and the centroid are at the same location.

### Meanshift in OpenCV

To use meanshift in OpenCV, first we need to setup the target, find its histogram so that we can backproject the target on each frame for calculation of meanshift. We also need to provide initial location of window.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('slow.flv')

# take first frame of the video
ret, frame = cap.read()

# setup initial location of window
r, h, c, w = 250, 90, 400, 125
track_window = (c, r, w, h)

# set up the ROI for tracking
roi = frame[r:r+h, c:c+w]
hsv_roi = cv.cvtColor(roi, cv.COLOR_BGR2HSV)
mask = cv.inRange(hsv_roi, np.array((0., 60., 32.)), np.array((180., 255., 255.)))
roi_hist = cv.calcHist([hsv_roi], [0], mask, [180], [0, 180])
cv.normalize(roi_hist, roi_hist, 0, 255, cv.NORM_MINMAX)

# Setup the termination criteria: either 10 iteration or move by atleast 1 pt
term_crit = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 1)

while True:
    ret, frame = cap.read()

    if ret == True:
        hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
        dst = cv.calcBackProject([hsv], [0], roi_hist, [0, 180], 1)

        # apply meanshift to get the new location
        ret, track_window = cv.meanShift(dst, track_window, term_crit)

        # Draw it on image
        x, y, w, h = track_window
        img2 = cv.rectangle(frame, (x, y), (x + w, y + h), 255, 2)
        cv.imshow('img2', img2)

        k = cv.waitKey(30) & 0xff
        if k == 27:
            break
    else:
        break
```

## Camshift

Did you closely watch the last result? There is a problem. Our window always has the same size when object is farther away and it is very close. That is not good. We need to adapt the window size with size and rotation of the target. Once again, the solution came from "OpenCV Labs" and it is called **CAMshift** (Continuously Adaptive Meanshift).

It applies meanshift first. Once meanshift converges, it updates the window size and also calculates the orientation of best fitting ellipse to it. Again it applies the meanshift with new scaled search window and previous window location.

```python
import numpy as np
import cv2 as cv

cap = cv.VideoCapture('slow.flv')

ret, frame = cap.read()
r, h, c, w = 250, 90, 400, 125
track_window = (c, r, w, h)

roi = frame[r:r+h, c:c+w]
hsv_roi = cv.cvtColor(roi, cv.COLOR_BGR2HSV)
mask = cv.inRange(hsv_roi, np.array((0., 60., 32.)), np.array((180., 255., 255.)))
roi_hist = cv.calcHist([hsv_roi], [0], mask, [180], [0, 180])
cv.normalize(roi_hist, roi_hist, 0, 255, cv.NORM_MINMAX)

term_crit = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 1)

while True:
    ret, frame = cap.read()

    if ret == True:
        hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
        dst = cv.calcBackProject([hsv], [0], roi_hist, [0, 180], 1)

        # apply camshift to get the new location
        ret, track_window = cv.CamShift(dst, track_window, term_crit)

        # Draw it on image
        pts = cv.boxPoints(ret)
        pts = np.int0(pts)
        img2 = cv.polylines(frame, [pts], True, 255, 2)
        cv.imshow('img2', img2)

        k = cv.waitKey(30) & 0xff
        if k == 27:
            break
    else:
        break
```

## Additional Resources

1. French Wikipedia article on [Camshift](https://en.wikipedia.org/wiki/Camshift)
2. Bradski, G.R., "Computer Vision Face Tracking For Use in a Perceptual User Interface", Intel Technology Journal, Q2 1998

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_video/py_meanshift/py_meanshift.markdown)
