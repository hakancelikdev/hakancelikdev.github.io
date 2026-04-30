---
publishDate: 2022-03-30T00:00:00Z
author: Hakan Çelik
title: "Performance Measurement and Improvement Techniques"
excerpt: "Hello everyone, in this section we will try to learn how to make the work we do in OpenCV more performant, i.e., faster, etc. As you may already know, when coding with technologies like OpenCV"
category: OpenCV
series: "OpenCV Series"
seriesIndex: 16
subcategory: Basic Operations
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Performance Measurement and Improvement Techniques

Hello everyone, in this section we will try to learn how to make the work we do in
OpenCV more performant — that is, faster and more reliable. As you may already know,
when coding with technologies like OpenCV many operations are performed. Our general
goal is to find the correct result suitable for our purpose, but the fastest and most
reliable way to obtain that correct result is what should be driving our working system
as developers. Anyway, let's get into the topic.

## Goals

- To measure the performance of your code
- Some tips to improve the performance of your code
- And finally we will learn these functions and wrap up: **cv2.getTickCount**,
  **cv2.getTickFrequency**, etc.

## Performance Measurement with OpenCV

First, the **cv2.getTickCount\(\)** function gives the number of clock cycles. As an
example, we get output like this — this function returns the number of clock cycles
elapsed since a reference event \( like when you flipped a switch \) until this function
is called. Therefore, by calling it before and after the code to be executed and looking
at the difference between the elapsed clock cycles, you can get an idea about
performance.

```python
>>> import cv2
>>> e1 = cv2.getTickCount()
>>> e2 = cv2.getTickCount()
>>> e1
311581540258
>>> e2
311594815111
```

Second, the **cv2.getTickFrequency\(\)** function returns the frequency of clock cycles,
or the number of clock cycles per second. To find the execution time in seconds, you can
do the following.

```python
>>> e1 = cv2.getTickCount()
# your code should go here
>>> e2 = cv2.getTickCount()
>>> time = (e2-e1)/cv2.getTickFrequency()
>>> time # here we have found the elapsed time
0.6719153391030833
```

Looking at the example in the documentation, the following example applies median
filtering with a 1D kernel ranging from 5 to 49 \(the result doesn't matter because
that's not our goal\):

```python
import cv2
img1 = cv2.imread('messi5.jpg')
e1 = cv2.getTickCount() # getting the tick count before running our code
for i in xrange(5,49,2):           # our code
    img1 = cv2.medianBlur(img1,i)  # our code - we don't care what it does, because our goal is how many seconds this takes
e2 = cv2.getTickCount() # getting our second tick after the operation is done
t = (e2 - e1)/cv2.getTickFrequency() # calculating elapsed time: dividing the difference between ticks by the number of ticks per second
print t
# result comes out as 0.521107655 seconds. Try it yourself — if the result is higher, reduce the image size; you can use Python's PIL library for resizing. Do something to make it compute as fast as possible — isn't that our goal?
```

You might actually be thinking at this point "why bother, I can do this time calculation
with Python's time module too". Yes, you can — the same way: write `e1 = time.time()`
before your code and then `e2 = time.time()` after the code finishes, and look at the
difference to find how much time has elapsed.

## Default Optimization in OpenCV

Many OpenCV functions have been optimized using **SSE2**, **AVX**, etc. They also
contain unoptimized code. So if our system supports these features we should use them
\(almost all modern processors support them\). They are enabled by default during
compilation. So **OpenCV** runs the optimized code if it is enabled, otherwise it runs
the unoptimized code. You can use **cv2.useOptimized\(\)** to check if it is
enabled/disabled, and **cv2.setUseOptimized\(\)** to enable/disable it. Let's see a
simple example.

```python
# these codes were apparently made using IPython, not entirely sure
import cv2
# checking if optimization is on
# at line 5, that's why img was probably defined in previous lines
In [5]: cv2.useOptimized()# first we'll run the code with optimization on and record the time. IPython already shows us this after every operation, but if you're not using IPython you can use the methods described above or the time module to calculate elapsed time.
Out[5]: True
In [6]: %timeit res = cv2.medianBlur(img,49)
10 loops, best of 3: 34.9 ms per loop # when elapsed time is 34.9 ms
# disabling it
In [7]: cv2.setUseOptimized(False) # turning off optimization and trying
In [8]: cv2.useOptimized()
Out[8]: False # currently off
In [9]: %timeit res = cv2.medianBlur(img,49)
10 loops, best of 3: 64.1 ms per loop # and 64.1 ms, so optimization is good — love it
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_core/py_optimization/py_optimization.markdown)
