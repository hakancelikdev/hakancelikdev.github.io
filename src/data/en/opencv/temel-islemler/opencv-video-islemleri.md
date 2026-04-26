---
publishDate: 2022-03-02T00:00:00Z
author: Hakan Çelik
title: "OpenCV Video Operations"
excerpt: "We will learn how to read videos, how to open and save them. We will learn how to record video with the camera and run it in a window. We will learn these functions: cv2.VideoCapture(), cv2.VideoWriter()"
category: OpenCV
series: "OpenCV Series"
seriesIndex: 14
subcategory: Basic Operations
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OpenCV Video Operations

## OpenCV Video Operations

### Goals

- We will learn how to read videos, how to open and save them
- We will learn how to record video with the camera and run it in a window
- We will learn these functions: cv2.VideoCapture\(\), cv2.VideoWriter\(\)

## Recording Video with the Camera

We often need to capture live streams from a camera; OpenCV provides a simple way to do
this. Let's record video with the camera \( I am using my own laptop's camera \).

A simple task to start: capture video from the camera, convert it to grayscale, and
display it.

To record video, you must create a **VideoCapture** object; do this using a variable,
for example with the variable name `cap`.

The parameter given to this object allows you to choose which camera to use. If you have
one camera connected \( like me \), you should give the value 0 or -1.

For a second camera, give the value 1, and so on.

```python
import numpy as np
import cv2

cap = cv2.VideoCapture(0) # we created the object

while(True):
    # we started capturing frame by frame
    ret, frame = cap.read() # we read the data from the camera, it's continuous.
    # frame operations go here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # we convert the incoming instant data to grayscale
    cv2.imshow('frame',gray)# we display the frame on screen (window name is "frame", the data to be read is the second parameter, gray, just as explained in the previous lesson on image processing)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# when everything is done, the screen closes
cap.release()
cv2.destroyAllWindows()
```

Here, just like in image processing, an instantaneous image file comes in and we
continuously read and display it on screen using a while loop; because it happens so
fast it becomes a video. There isn't much difference.

The cap.read\(\) function returns a bool **True** or **False**. Sometimes cap might not
start recording — in this case these lines of code will show an error. You can check
whether it has started or use **cap.isOpened\(\)** to check this.

If this function returns **True**, then **cap** is starting and video recording is
possible, meaning there is no issue. If it returns **False**, open it using the
**cap.open\(\)** function.

Also, you can enable some properties on this video using the **cap.get\(propId\)**
function. The **propId** parameter in this function takes values between 0 and 18; each
number refers to a property of the video. To see all details for that video if they are
available, click here. Some of these values can be changed using **cap.set\(propId,
value\)** where value can be any number you want.

### For example;

Using **cap.get\(3\)** and **cap.get\(4\)** I can check the frame width and height. By
default it gives me 640x480. But I can change this to 320x240 simply by using
**ret = cap.set\(3,320\)** and **ret = cap.set\(4,240\)**

## Playing Video from File

Same as recording video from the camera; we just change the camera index to the video
file name. Also, when displaying the frame we will use the appropriate time for
**cv2.waitKey\(\)**. If it is much less, the video will be too fast; if quality is very
high, the video will be slow \( so how can you watch videos in slow motion? \)

Under normal conditions, 25 milliseconds should work fine.

```python
import numpy as np
import cv2

cap = cv2.VideoCapture('vtest.avi') # opening video file named vtest.avi

while(cap.isOpened()): # while the variable cap is open, i.e. as long as the video file is open
    ret, frame = cap.read() # we read the data instantly

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # converted to COLOR_BGR2GRAY mode

    cv2.imshow('frame',gray) # wrote the window name and the data to be displayed, and got output on screen
    if cv2.waitKey(1) & 0xFF == ord('q'): # added closing operations with the keyboard, to stop reading data i.e. stop the loop
        break

cap.release()
cv2.destroyAllWindows() # destroyed the windows
```

## Saving Videos

Yes, we captured video frame by frame from the camera and wanted to save it after the
changes we made. For images this was very easy — we just used **cv2.imwrite\(\)**. Here
it requires a bit more work.

This time we need to create a **VideoWriter** object. We must specify the output file
name, for example: output.avi.

Then we must specify the **FourCC** code which we'll explain in the next paragraph.
After that we give the number of frames per second \( fps \) value and move on to the
frame size. Finally we must give the **isColor** flag — if True, the encoder expects a
color frame; otherwise it works with a grayscale frame.

FourCC is a 4-byte code used to specify the video codec. A list of available codes can
be found at:

[https://en.wikipedia.org/wiki/FourCC](https://en.wikipedia.org/wiki/FourCC)

[fourcc](http://www.free-codecs.com/guides/fourcc.htm) — found something like this,
not sure if it's the same but take a look.

> - On Fedora: DIVX, XVID, MJPG, X264, WMV1, WMV2. \(XVID is more preferable. MJPG
>   results in high size video. X264 gives very small size video.\)
> - On Windows: DIVX \(More to be tested and added\)
> - On OSX: \(I don't have access to OSX. Can someone fill this in?\) \( that's how it
>   is in the documentation, I'm not asking you :D \)
>
>   FourCC code is passed as cv2.VideoWriter_fourcc \('M', 'J', 'P', 'G'\) or
>   cv2.VideoWriter_fourcc \(\* 'MJPG\) for MJPG.

#### Let's capture and save video from the camera

```python
import numpy as np
import cv2

cap = cv2.VideoCapture(0)

# creating the VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output.avi',fourcc, 20.0, (640,480))

while(cap.isOpened()):
    ret, frame = cap.read()
    if ret==True:
        frame = cv2.flip(frame,0)

        # writing the flipped frame
        out.write(frame)

        cv2.imshow('frame',frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

# when everything is done
cap.release()
out.release()
cv2.destroyAllWindows()
```
