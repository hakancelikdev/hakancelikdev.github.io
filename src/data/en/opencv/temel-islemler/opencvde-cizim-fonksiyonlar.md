---
publishDate: 2022-03-16T00:00:00Z
author: Hakan Çelik
title: "Drawing Functions in OpenCV"
excerpt: "We will learn how to draw different geometric shapes with OpenCV. We will learn these functions: cv2.line(), cv2.circle(), cv2.rectangle(), cv2.ellipse(), cv2.putText(), etc."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 15
subcategory: Basic Operations
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Drawing Functions in OpenCV

### Goals

- We will learn how to draw different geometric shapes with OpenCV
- We will learn these functions: **cv2.line \(\)**, **cv2.circle \(\)**, **cv2.rectangle
  \(\)**, **cv2.ellipse \(\)**, **cv2.putText \(\)** etc.

### Code

In all the functions above, you will see common arguments as given below.

**img**: the image where you want to draw the shapes. **color**: color of the shape. For
BGR, passed as a tuple, for example \(255,0,0\) for blue; for grayscale, just pass the
scalar value. **thickness**: thickness of the line or circle; for closed shapes like
circles, if -1 is passed it will fill the shape. Default thickness = 1. **lineType**:
type of line, 8-connected, anti-aliased line, etc. By default, it is 8-connected.
cv2.LINE_AA gives an anti-aliased line which looks great for curves.

## Drawing a Line

To draw a line, you need to provide the starting and ending coordinates of the line. We
will create a black image and draw a blue line from the top-left corner to the
bottom-right corner.

```python
import numpy as np
import cv2

# creating a black image
img = np.zeros((512,512,3), np.uint8)

# drawing a diagonal blue line with 5 px thickness
img = cv2.line(img,(0,0),(511,511),(255,0,0),5)
```

## Drawing a Rectangle

To draw a rectangle, you need the top-left corner and bottom-right corner of the
rectangle. This time, let's draw a green rectangle in the top-right corner of the image.

```python
img = cv2.rectangle(img,(384,0),(510,128),(0,255,0),3)
```

## Drawing a Circle

To draw a circle, you need the center coordinates and radius. We will draw a circle
inside the rectangle drawn above.

```python
img = cv2.circle(img,(447,63), 63, (0,0,255), -1)
```

## Drawing an Ellipse

To draw an ellipse, we need a few arguments.

The first argument is the image you want to draw on — the read image file or the
instantaneous data of the read video file. The second argument is the center location
\(x,y\). The third argument is the axis lengths \(major axis length, minor axis length\).
**angle** is the angle of rotation of the ellipse in counter-clockwise direction.
**startAngle** and **endAngle** denote the starting and ending of ellipse arc measured
in clockwise direction from major axis. Giving values of 0 and 360 gives a full ellipse.

For more details, check the documentation for **cv2.ellipse\(\)**. The example below
draws a half ellipse at the center of the image.

```python
img = cv2.ellipse(img,(256,256),(100,50),0,0,180,255,-1)
```

## Drawing a Polygon

To draw a polygon, first you need the coordinates of the vertices. Make these points
into an array \( array \) of shape, where the rows are the number of vertices — here it
is **ROWSx1x2** — and the type must be **int**.

Here we draw a small polygon with four vertices in yellow color.

```python
pts = np.array([[10,5],[20,30],[70,20],[50,10]], np.int32)
pts = pts.reshape((-1,1,2))
img = cv2.polylines(img,[pts],True,(0,255,255))
```

If you make the third argument **False**, instead of a closed shape you will get a
polyline joining all the points.

## Adding Text to Images

To put text in images, you need to specify the following things.

The data you want to write. The coordinates of where you want to place the text. Font
type \( check cv2.putText \(\) docs for supported fonts \). Font scale \( specifies
font size \). Color, thickness, line type, and other regular things. For better
appearance lineType = cv2.LINE_AA is recommended. Now let's write OpenCV in white color
on our image.

```python
font = cv2.FONT_HERSHEY_SIMPLEX # our font type
cv2.putText(img,'OpenCV',(10,500), font, 4,(255,255,255),2,cv2.LINE_AA)
# first argument is the image (data) we want to write on
# second is the data to be written
# third argument is the coordinates
# fourth argument is our font
# sixth argument is text color
# fifth and seventh arguments are thickness etc
```

**Result**

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_gui/py_drawing_functions/py_drawing_functions.markdown)
