---
publishDate: 2022-04-27T00:00:00Z
author: Hakan Çelik
title: "Trackbar as a Color Palette"
excerpt: "We will learn how to bind a Trackbar to OpenCV windows. We will learn these functions: cv2.getTrackbarPos(), cv2.createTrackbar(), etc."
category: OpenCV
subcategory: Advanced Topics
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Trackbar as a Color Palette

## Goals

- We will learn how to bind a **Trackbar** to OpenCV windows
- We will learn these functions: **cv2.getTrackbarPos \(\)**, **cv2.createTrackbar\(\)**
  etc.

## Demo

Here we will create a simple application that shows the color you specify. You have a
window showing the color and three trackbars to specify each of B, G and R colors. You
slide the trackbar and the corresponding color in the window changes. By default, the
initial color will be set to Black.

For the **cv2.getTrackbarPos\(\)** function:

- The first argument is the trackbar name
- The second is the name of the window it is attached to
- The third argument is the default value
- The fourth is the maximum value
- The fifth is the callback function which is executed every time the trackbar value
  changes.

The callback function always has a default argument which is the trackbar position. In
our case, the function does nothing, so we simply pass.

Another important application of trackbar is to use it as a button or switch. OpenCV
does not have button functionality by default.

So you can use trackbar for such operations. In our application, we created a switch
where the application runs only when the switch is ON; otherwise the screen is always
black.

```python
import cv2
import numpy as np

def nothing(x):
    pass

# created a black image, a window
img = np.zeros((300,512,3), np.uint8)
cv2.namedWindow('image')
# created trackbars for color change
cv2.createTrackbar('R','image',0,255,nothing)
cv2.createTrackbar('G','image',0,255,nothing)
cv2.createTrackbar('B','image',0,255,nothing)
# create switch for ON/OFF functionality
switch = '0 : OFF \n1 : ON'
cv2.createTrackbar(switch, 'image',0,1,nothing)
while(1):
    cv2.imshow('image',img)
    k = cv2.waitKey(1) & 0xFF
    if k == 27:
        break
    # get current positions of four trackbars
    r = cv2.getTrackbarPos('R','image')
    g = cv2.getTrackbarPos('G','image')
    b = cv2.getTrackbarPos('B','image')
    s = cv2.getTrackbarPos(switch,'image')

    if s == 0:
        img[:] = 0
    else:
        img[:] = [b,g,r]
cv2.destroyAllWindows()
```

Screenshot;
