---
publishDate: 2022-06-21T00:00:00Z
author: Hakan Çelik
title: "Install OpenCV-Python in Fedora"
excerpt: "Learn to setup OpenCV-Python in Fedora using pre-built binaries or building from source. Includes CMake configuration, GCC setup, optional dependencies like TBB and Eigen."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 62
subcategory: Setup
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Install OpenCV-Python in Fedora

> **Note:** Please prefer binaries distributed with PyPI, if possible. See [Install OpenCV with pip](/pip-kurulum) for details.

## Goals

We will learn to setup OpenCV-Python in your Fedora system. Below steps are tested for Fedora 18 (64-bit) and Fedora 19 (32-bit).

## Method 1: Install from Pre-built Binaries

Install all packages with following command in terminal as root:

```bash
yum install numpy opencv*
```

Open Python IDLE (or IPython) and type following codes in Python terminal:

```python
import cv2 as cv
print(cv.__version__)
```

**Note:** Yum repositories may not contain the latest version of OpenCV always. There may also be issues with camera support and video playback depending on ffmpeg/gstreamer packages present.

## Method 2: Building OpenCV from Source

### Compulsory Dependencies

```bash
yum install cmake
yum install python-devel numpy
yum install gcc gcc-c++

# GTK and media support:
yum install gtk2-devel
yum install libdc1394-devel
yum install ffmpeg-devel
yum install gstreamer-plugins-base-devel
```

### Optional Dependencies

```bash
yum install libpng-devel
yum install libjpeg-turbo-devel
yum install jasper-devel
yum install openexr-devel
yum install libtiff-devel
yum install libwebp-devel

# For TBB support:
yum install tbb-devel

# For Eigen support:
yum install eigen3-devel

# For documentation generation:
yum install doxygen
```

### Downloading OpenCV

```bash
yum install git
git clone https://github.com/opencv/opencv.git
cd opencv
mkdir build
cd build
```

### Configuring and Installing

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..

# With TBB and Eigen support:
cmake -D WITH_TBB=ON -D WITH_EIGEN=ON ..

# Without tests and examples:
cmake -D BUILD_DOCS=ON -D BUILD_TESTS=OFF -D BUILD_PERF_TESTS=OFF -D BUILD_EXAMPLES=OFF ..

make
su
make install
```

Installation goes to `/usr/local/`. To make Python find the OpenCV module, add to `~/.bashrc`:

```bash
export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python2.7/site-packages
```

Then test with `import cv2 as cv`.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_fedora/py_setup_in_fedora.markdown)
