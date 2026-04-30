---
publishDate: 2022-06-23T00:00:00Z
author: Hakan Çelik
title: "How OpenCV-Python Bindings Work"
excerpt: "Learn how OpenCV-Python bindings are generated from C++ headers. We cover CV_EXPORTS_W, CV_WRAP, and other macros, plus the gen2.py generator and hdr_parser.py header parser scripts."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 64
subcategory: Python Bindings
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# How OpenCV-Python Bindings Work

## Goal

- Learn how OpenCV-Python bindings are generated
- Learn how to extend new OpenCV modules to Python

## How OpenCV-Python Bindings Are Generated

In OpenCV, all algorithms are implemented in C++. But these algorithms can be used from different languages like Python, Java etc. This is made possible by the **bindings generators**. These generators create a bridge between C++ and Python which enables users to call C++ functions from Python.

OpenCV generates wrapper functions automatically from the C++ headers using Python scripts located in `modules/python/src2/`. The process works as follows:

1. **`modules/python/CMakeFiles.txt`** — A CMake script that checks which modules should be extended to Python. It automatically grabs their header files.

2. **`modules/python/src2/gen2.py`** — The Python bindings generator script. It calls `hdr_parser.py`.

3. **`modules/python/src2/hdr_parser.py`** — The header parser script. It splits the complete header file into small Python lists. Each list contains all details about a particular function, class etc. (function name, return type, input arguments, argument types etc.).

The header parser only parses functions/classes that the developer has marked for Python export using special macros.

## How to Extend New Modules to Python

### Functions: `CV_EXPORTS_W`

```cpp
CV_EXPORTS_W void equalizeHist( InputArray src, OutputArray dst );
```

The header parser understands input and output arguments from keywords like `InputArray`, `OutputArray` etc. `CV_OUT` and `CV_IN_OUT` macros handle reference parameters explicitly:

```cpp
CV_EXPORTS_W void minEnclosingCircle( InputArray points,
                                     CV_OUT Point2f& center, CV_OUT float& radius );
```

### Classes: `CV_EXPORTS_W` and `CV_WRAP`

Large classes use `CV_EXPORTS_W`. Class methods are extended with `CV_WRAP`, fields with `CV_PROP`:

```cpp
class CV_EXPORTS_W CLAHE : public Algorithm
{
public:
    CV_WRAP virtual void apply(InputArray src, OutputArray dst) = 0;

    CV_WRAP virtual void setClipLimit(double clipLimit) = 0;
    CV_WRAP virtual double getClipLimit() const = 0;
};
```

### Overloaded Functions: `CV_EXPORTS_AS`

Overloaded functions are extended with new names so each can be called by that name in Python:

```cpp
CV_EXPORTS_W void integral( InputArray src, OutputArray sum, int sdepth = -1 );

CV_EXPORTS_AS(integral2) void integral( InputArray src, OutputArray sum,
                                        OutputArray sqsum, int sdepth = -1, int sqdepth = -1 );

CV_EXPORTS_AS(integral3) void integral( InputArray src, OutputArray sum,
                                        OutputArray sqsum, OutputArray tilted,
                                        int sdepth = -1, int sqdepth = -1 );
```

### Small Structs: `CV_EXPORTS_W_SIMPLE`

Small classes/structs like `KeyPoint`, `DMatch` are extended using `CV_EXPORTS_W_SIMPLE`. Methods use `CV_WRAP` and fields use `CV_PROP_RW`:

```cpp
class CV_EXPORTS_W_SIMPLE DMatch
{
public:
    CV_WRAP DMatch();
    CV_WRAP DMatch(int _queryIdx, int _trainIdx, float _distance);

    CV_PROP_RW int queryIdx;
    CV_PROP_RW int trainIdx;
    CV_PROP_RW int imgIdx;
    CV_PROP_RW float distance;
};
```

### Export to Python Dictionary: `CV_EXPORTS_W_MAP`

Some small classes/structs can be exported to a Python native dictionary. `Moments()` is an example:

```cpp
class CV_EXPORTS_W_MAP Moments
{
public:
    CV_PROP_RW double m00, m10, m01, m20, m11, m02, m30, m21, m12, m03;
    CV_PROP_RW double mu20, mu11, mu02, mu30, mu21, mu12, mu03;
    CV_PROP_RW double nu20, nu11, nu02, nu30, nu21, nu12, nu03;
};
```

## Summary

When you call `res = equalizeHist(img1, img2)` in Python, you pass two numpy arrays. These numpy arrays are converted to `cv::Mat`, then `equalizeHist()` is called in C++. The result `res` is converted back into a Numpy array. So almost all operations are done in C++ which gives us almost the same speed as that of C++.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_bindings/py_bindings_basics/py_bindings_basics.markdown)
