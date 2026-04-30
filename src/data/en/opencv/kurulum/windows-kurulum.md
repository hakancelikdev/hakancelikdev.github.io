---
publishDate: 2022-06-22T00:00:00Z
author: Hakan Çelik
title: "Install OpenCV-Python in Windows"
excerpt: "Learn to setup OpenCV-Python in Windows. Covers quick installation from prebuilt binaries and building from source using CMake and Visual Studio."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 63
subcategory: Setup
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Install OpenCV-Python in Windows

> **Note:** Please prefer binaries distributed with PyPI, if possible. See [Install OpenCV with pip](/pip-kurulum) for details.

## Goals

We will learn to setup OpenCV-Python in your Windows system.

## Method 1: Installing from Prebuilt Binaries

1. Download and install to default locations:
   - Python 3.x (3.4+) from [python.org](https://www.python.org/downloads/)
   - Numpy: `pip install numpy`
   - Matplotlib (optional, recommended): `pip install matplotlib`

2. Download latest OpenCV release from [GitHub](https://github.com/opencv/opencv/releases) and double-click to extract it.

3. Go to **opencv/build/python/3.x** folder.

4. Copy **cv2.pyd** to **C:/Python3x/lib/site-packages**.

5. Copy the **opencv_world.dll** file to **C:/Python3x/lib/site-packages**.

6. Open Python IDLE and type:

```python
import cv2 as cv
print(cv.__version__)
```

## Method 2: Building OpenCV from Source

1. Download and install Visual Studio and CMake.

2. Download and install necessary Python packages to their default locations:
   - Python
   - Numpy

3. Download OpenCV source from [GitHub](https://github.com/opencv/opencv) or [SourceForge](http://sourceforge.net/projects/opencvlibrary/).

4. Extract it to a folder and create a new `build` folder in it.

5. Open **CMake-gui** (Start > All Programs > CMake-gui):
   - Click **Browse Source...** and locate the opencv folder
   - Click **Browse Build...** and locate the build folder
   - Click **Configure** and choose your compiler
   - Configure the **WITH**, **BUILD**, and **ENABLE** fields
   - Click **Generate**

6. Open **OpenCV.sln** from `opencv/build` folder with Visual Studio.

7. Set build mode to **Release**.

8. Right-click on **Solution** (or **ALL_BUILD**) and build it.

9. Right-click on **INSTALL** and build it. OpenCV-Python will be installed.

10. Open Python IDLE and enter `import cv2 as cv` to verify the installation.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_windows/py_setup_in_windows.markdown)
