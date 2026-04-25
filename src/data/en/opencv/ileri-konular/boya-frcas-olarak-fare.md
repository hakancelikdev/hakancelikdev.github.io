---
publishDate: 2021-09-01T00:00:00Z
author: Hakan Çelik
title: "Mouse as a Paint Brush"
excerpt: "We will learn how to handle mouse events in OpenCV. We will learn this function: cv2.setMouseCallback()"
category: OpenCV
subcategory: Advanced Topics
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Mouse as a Paint Brush

### Goals

- We will learn how to handle mouse events in OpenCV
- We will learn this function: _**cv2.setMouseCallback\(\)**_

## Simple Demo

We will create a simple application that draws a circle wherever we double-click on the
image.

First we will create a callback function that will be executed when a mouse event
occurs. This event can be anything related to the mouse, for example: left button down,
left button up, left button double-click.

For every mouse event we need to give the \(x,y\) coordinate points. With this event
and coordinate information we can do anything we want.

To list all available events, run the following code in the Python terminal:

```python
>>> import cv2
>>> events = [i for i in dir(cv2) if 'EVENT' in i]
>>> print(events)
```

Creating a mouse callback function has a specific format that is the same everywhere.
Only what the function does is different. So the mouse callback event draws a circle
when double-clicked.

Let's examine the following code; explanations are available in the code lines.

```python
import cv2
import numpy as np
# mouse callback function
def draw_circle(event,x,y,flags,param): # event parameter is the incoming mouse event, x,y are coordinates
    if event == cv2.EVENT_LBUTTONDBLCLK: # if the incoming mouse event is a double click
        cv2.circle(img,(x,y),100,(255,0,0),-1) # we draw a circle in the x,y coordinate region

# create a black image, a window and bind the function to the window
img = np.zeros((512,512,3), np.uint8)
cv2.namedWindow('image')
cv2.setMouseCallback('image',draw_circle) # note that we don't pass draw_circle()
# with parentheses — we send the function directly
while(1):
    cv2.imshow('image',img)
    if cv2.waitKey(20) & 0xFF == 27:
        break
cv2.destroyAllWindows()
```

## More Advanced Demo

Now we will make a better application. Here, we will draw either rectangles or circles
\(depending on the mode we select\) by dragging the mouse, just like in a Paint
application. So the mouse callback function has two parts.

First for drawing a rectangle. Second for drawing a circle. This particular example will
really be helpful in creating some interactive applications like object tracking, image
segmentation, etc.

```python
import cv2
import numpy as np

drawing = False # True if mouse is pressed
mode = True # if True, draw rectangle. Press 'm' to toggle to curve
ix,iy = -1,-1

# mouse callback function
def draw_circle(event,x,y,flags,param):
    global ix,iy,drawing,mode

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix,iy = x,y

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing == True:
            if mode == True:
                cv2.rectangle(img,(ix,iy),(x,y),(0,255,0),-1)
            else:
                cv2.circle(img,(x,y),5,(0,0,255),-1)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        if mode == True:
            cv2.rectangle(img,(ix,iy),(x,y),(0,255,0),-1)
        else:
            cv2.circle(img,(x,y),5,(0,0,255),-1)
```

Next, we have to bind this mouse callback function to the OpenCV window. In the main
loop, we set a keyboard binding for key 'm' to toggle between rectangle and circle.

```python
img = np.zeros((512,512,3), np.uint8)
cv2.namedWindow('image')
cv2.setMouseCallback('image',draw_circle)

while(1):
    cv2.imshow('image',img)
    k = cv2.waitKey(1) & 0xFF
    if k == ord('m'):
        mode = not mode
    elif k == 27:
        break

cv2.destroyAllWindows()
```
