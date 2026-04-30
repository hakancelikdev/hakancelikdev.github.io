---
publishDate: 2022-02-16T00:00:00Z
author: Hakan Çelik
title: "OpenCV Image Operations"
excerpt: "The cv2.imread() function is used to read an image file and takes two arguments."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 13
subcategory: Basic Operations
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OpenCV Image Operations

## Reading an Image File

The **cv2.imread\(\)** function is used to read an image file and takes two arguments.

- The first is the file name or full path of the file to be read.
- The second is how the file should be read; the second argument can take 3 values:
  - **cv2.IMREAD_COLOR** comes as the default and gives a color output
  - **cv2.IMREAD_GRAYSCALE** reads in grayscale mode
  - **cv2.IMREAD_UNCHANGED** reads with the alpha channel

Example code:

```python
import cv2
import numpy as np

# we read the image in grayscale mode
img = cv2.imread('messi5.jpg',0)
```

## Displaying an Image

**cv2.imshow\(\)** is the function used to display an image; you can use it to see the
changes you made after processing. It takes two arguments:

- The name of the window to be opened \( each window name must be different \)
- The image to be displayed

```python
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

**cv2.waitKey\(\)** is a function that listens for keyboard events; the argument it
takes is in milliseconds. If any key is pressed at any time, it allows the program to
continue from where it left off.

If 0 is passed, it waits indefinitely for a key press. It can also be set to detect
specific key presses as we will discuss below.

**cv2.destroyAllWindows\(\)** is the function that allows us to close the windows that
appear. You can also close a specific window by providing its name.

```python
cv2.namedWindow('image', cv2.WINDOW_NORMAL)
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

## Saving an Image

With the **cv2.imwrite\(\)** function, we can save the image files we have modified. It
takes two arguments:

- The name of the image file to be saved \( if only a name is given, it is saved to the
  current directory; if a full path is given, it is saved to that path \)
- The image to be saved

```python
cv2.imwrite('messigray.png',img)
# saved in PNG format to the current directory
```

As a summary, the code snippet below loads the image in grayscale mode, displays it by
opening a window, saves it if the 's' key is pressed and exits, or exits without saving
if Esc is pressed.

```python
import cv2
import numpy as np

img = cv2.imread('messi5.jpg',0)
cv2.imshow('image',img)
k = cv2.waitKey(0)
if k == 27:         # exit if Esc is pressed
    cv2.destroyAllWindows()
elif k == ord('s'): # if 's' key is pressed
    cv2.imwrite('messigray.png',img) # save
    cv2.destroyAllWindows() # and close the window
```

### Warning!

If you are using a 64-bit machine, you should change this:

```python
k = cv2.waitKey(0) # this line

k = cv2.waitKey(0) & 0xFF # should be done this way
```

**Using Matplotlib** — Matplotlib is a plotting library for Python that provides a wide
variety of plotting methods.

Here you will learn how to open an image file with Matplotlib; you can zoom into the
image and save it using Matplotlib.

```python
import numpy as np
import cv2
from matplotlib import pyplot as plt

img = cv2.imread('messi5.jpg',0)
plt.imshow(img, cmap = 'gray', interpolation = 'bicubic')
plt.xticks([]), plt.yticks([])  # hides tick values on X and Y axis
plt.show()
```

It will look like this.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_gui/py_image_display/py_image_display.markdown)
