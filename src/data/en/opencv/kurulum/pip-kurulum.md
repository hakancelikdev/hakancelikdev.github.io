---
publishDate: 2022-06-19T00:00:00Z
author: Hakan Çelik
title: "Install OpenCV for Python with pip"
excerpt: "The recommended way for most users to get OpenCV in Python: install from PyPI with pip. Covers virtual environments, platform notes, PyPI package variants, and common troubleshooting."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 60
subcategory: Setup
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Install OpenCV for Python with pip

## Quick start

The **recommended** way for most users to get OpenCV in Python is to install from **PyPI** with `pip`:

```bash
# 1) Create and activate a virtual environment (recommended)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 2) Upgrade pip tooling
python -m pip install --upgrade pip setuptools wheel

# 3) Install OpenCV from PyPI (choose ONE)
pip install opencv-python          # main package (most users)
# or
pip install opencv-contrib-python  # + extra modules (contrib)
# or
pip install opencv-python-headless # no GUI/backends (servers/CI)
# or
pip install opencv-contrib-python-headless # no GUI/backends with extra modules
```

### Tiny hello-world

```python
import cv2 as cv
import numpy as np

print("OpenCV:", cv.__version__)
img = np.zeros((120, 400, 3), dtype=np.uint8)
cv.putText(img, "OpenCV OK", (10, 80), cv.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3)
# If you installed a non-headless build, you can display a window:
# cv.imshow("hello", img); cv.waitKey(0)
# Always safe (headless or not): save to file
cv.imwrite("hello.png", img)
```

## Virtual environments and IDEs

Using a virtual environment keeps project dependencies isolated. Tools that create or activate envs include:

- `venv` (built-in) and `virtualenv`
- Conda environments
- IDEs (VS Code, PyCharm) that may **auto-create and auto-activate** an env per workspace

If imports fail inside an IDE, verify the interpreter selected by the IDE matches the environment where you installed OpenCV.

## OS notes

- **Linux:** Your default Python may be `python3`. Use `python3 -m venv .venv` and `python3 -m pip ...`.
- **Windows:** Install Python from python.org. Make sure **"Add python to PATH"** is enabled.
- **macOS:** Use the system `python3` or a managed one (Homebrew or Python.org). Always prefer a virtual environment.
- **Raspberry Pi / ARM boards:** Prebuilt wheels may not exist for some Pi OS / Python combinations.

## Choosing a PyPI variant

- `opencv-python`: core OpenCV modules with GUI/backends
- `opencv-contrib-python`: includes **contrib** modules in addition to the core
- `opencv-python-headless`: no GUI/backends (ideal for servers/containers/CI)
- `opencv-contrib-python-headless`: contrib + headless

Install exactly **one** of these per environment.

## Troubleshooting

**Pip is trying to build from source**
Symptoms: very long build step, CMake errors, compiler errors.
Fixes:
- Upgrade build tooling: `python -m pip install --upgrade pip setuptools wheel`
- Ensure your Python version is supported by the chosen package.

**"No matching distribution found" or "Unsupported wheel"**
- Confirm your Python version (`python -V`). Create a fresh virtual environment with a mainstream Python (3.10–3.12) and reinstall.

**Import works in terminal but fails in IDE**
- The IDE is using a different interpreter. Select the **same** environment inside your IDE's interpreter settings.

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_pip_install/py_pip_install.markdown)
