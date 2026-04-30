---
publishDate: 2022-06-18T00:00:00Z
author: Hakan Çelik
title: "Face Detection using Haar Cascades"
excerpt: "Learn to use Haar Cascade classifiers in OpenCV for face and eye detection. This tutorial covers the theory behind Haar features, integral images, AdaBoost, and cascade classifiers."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 59
subcategory: Object Detection
image: /images/posts/opencv/haar_features.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Face Detection using Haar Cascades

## Goal

- Learn to use Haar cascade classifiers for face detection
- See how to use **cv.CascadeClassifier** in OpenCV

## Theory

Object Detection using Haar feature-based cascade classifiers is an effective object detection method proposed by Paul Viola and Michael Jones in their paper "Rapid Object Detection using a Boosted Cascade of Simple Features" in 2001. It is a machine learning based approach where a cascade function is trained from a lot of positive images (images of faces) and negative images (images without faces).

### Haar Features

In the first stage, the algorithm collects **Haar features**. A feature is a single value computed by subtracting the sum of pixel intensities in adjacent rectangular regions. Various kernel sizes create a large set of features.

### Integral Image

To speed up the computation of features, an **integral image** technique is used. The integral image at any pixel contains the sum of all pixels above and to its left. This allows the sum of any rectangular region to be computed in constant time with just 4 references.

### AdaBoost

From the large set of computed Haar features, the best ones are selected using **AdaBoost** algorithm. In a 24x24 window over 160,000 features can be computed. AdaBoost selects only the most effective ~6000.

### Cascade Classifier

Applying all 6000 features to every window is slow. The **cascade classifier** approach groups features into stages. If a window fails a stage it is immediately rejected. This avoids unnecessary computation for non-candidate regions.

## Face Detection in OpenCV

OpenCV comes with many trained cascade XML files in `opencv/data/haarcascades/`. Here is how to detect faces and eyes:

```python
import numpy as np
import cv2 as cv

face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_eye.xml')

img = cv.imread('sachin.jpg')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)

for (x, y, w, h) in faces:
    cv.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
    roi_gray = gray[y:y+h, x:x+w]
    roi_color = img[y:y+h, x:x+w]

    eyes = eye_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in eyes:
        cv.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)

cv.imshow('img', img)
cv.waitKey(0)
cv.destroyAllWindows()
```

The result will show faces marked with blue rectangles and eyes with green rectangles.

## Real-time Face Detection (Camera)

For real-time face detection from a camera:

```python
import numpy as np
import cv2 as cv

face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_eye.xml')

cap = cv.VideoCapture(0)

while True:
    ret, img = cap.read()
    if not ret:
        break
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]

        eyes = eye_cascade.detectMultiScale(roi_gray)
        for (ex, ey, ew, eh) in eyes:
            cv.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)

    cv.imshow('img', img)
    if cv.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv.destroyAllWindows()
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_objdetect/py_face_detection/py_face_detection.markdown)
