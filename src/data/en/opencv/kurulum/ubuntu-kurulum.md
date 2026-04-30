---
publishDate: 2022-06-20T00:00:00Z
author: Hakan Çelik
title: "Install OpenCV-Python in Ubuntu"
excerpt: "Learn to setup OpenCV-Python in Ubuntu using two methods: installing from pre-built binaries or compiling from source. Step-by-step guide tested on Ubuntu 16.04 and 18.04."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 61
subcategory: Setup
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Install OpenCV-Python in Ubuntu

> **Note:** Please prefer binaries distributed with PyPI, if possible. See [Install OpenCV with pip](/pip-kurulum) for details.

## Goals

We will learn to setup OpenCV-Python in Ubuntu System. Below steps are tested for Ubuntu 16.04 and 18.04 (both 64-bit).

## Method 1: Install from Pre-built Binaries

This method serves best when using just for programming and developing OpenCV applications.

```bash
sudo apt-get install python3-opencv
```

Open Python IDLE (or IPython) and type following codes in Python terminal:

```python
import cv2 as cv
print(cv.__version__)
```

If the results are printed out without any errors, congratulations! You have installed OpenCV-Python successfully.

**Note:** Apt repositories may not contain the latest version of OpenCV always. For getting latest source codes, use the next method (building from source).

## Method 2: Building OpenCV from Source

Compiling from source may seem a little complicated at first, but once you succeeded in it, there is nothing complicated.

### Required Build Dependencies

```bash
sudo apt-get install cmake
sudo apt-get install gcc g++

# For Python 3 support:
sudo apt-get install python3-dev python3-numpy

# For GUI features, Camera support, and Media Support:
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install libgstreamer-plugins-base1.0-dev libgstreamer1.0-dev

# For GTK 3 support:
sudo apt-get install libgtk-3-dev
```

### Optional Dependencies

```bash
sudo apt-get install libpng-dev
sudo apt-get install libjpeg-dev
sudo apt-get install libopenexr-dev
sudo apt-get install libtiff-dev
sudo apt-get install libwebp-dev
```

### Downloading OpenCV

```bash
sudo apt-get install git
git clone https://github.com/opencv/opencv.git
```

### Configuring and Installing

```bash
cd opencv
mkdir build
cd build
cmake ../
make
sudo make install
```

Installation is over. All files are installed in `/usr/local/` folder. Open a terminal and try importing `cv2`:

```python
import cv2 as cv
print(cv.__version__)
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_ubuntu/py_setup_in_ubuntu.markdown)
