---
publishDate: 2022-05-27T00:00:00Z
author: Hakan Çelik
title: "Introduction to SURF (Speeded-Up Robust Features)"
excerpt: "Learn the basics of SURF algorithm, a speeded-up version of SIFT that uses box filters and integral images to achieve 3x speedup while maintaining comparable performance."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 37
subcategory: Feature Detection
image: /images/posts/opencv/sift_keypoints.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Introduction to SURF (Speeded-Up Robust Features)

## Goal

In this chapter,

- We will see the basics of SURF
- We will see SURF functionalities in OpenCV

## Theory

In last chapter, we saw SIFT for keypoint detection and description. But it was comparatively slow and people needed more speeded-up version. In 2006, Bay, H., Tuytelaars, T. and Van Gool, L, published another paper, **"SURF: Speeded Up Robust Features"** which introduced a new algorithm called SURF. As name suggests, it is a speeded-up version of SIFT.

In SIFT, Lowe approximated Laplacian of Gaussian with Difference of Gaussian for finding scale-space. SURF goes a little further and approximates LoG with Box Filter. One big advantage of this approximation is that, convolution with box filter can be easily calculated with the help of integral images. And it can be done in parallel for different scales. Also the SURF rely on determinant of Hessian matrix for both scale and location.

For orientation assignment, SURF uses wavelet responses in horizontal and vertical direction for a neighbourhood of size 6s. Adequate gaussian weights are also applied to it.

For feature description, SURF uses Wavelet responses in horizontal and vertical direction. A neighbourhood of size 20s×20s is taken around the keypoint where s is the size. It is divided into 4×4 subregions. For each subregion, horizontal and vertical wavelet responses are taken and a vector is formed like this:

**v = (Σdx, Σdy, Σ|dx|, Σ|dy|)**

This gives SURF feature descriptor with total 64 dimensions. For more distinctiveness, SURF feature descriptor has an extended 128 dimension version.

In short, SURF adds a lot of features to improve the speed in every step. Analysis shows it is 3 times faster than SIFT while performance is comparable to SIFT. SURF is good at handling images with blurring and rotation, but not good at handling viewpoint change and illumination change.

## SURF in OpenCV

> **Note:** SURF is patented and found in the opencv_contrib module. Check license requirements before using it in commercial applications.

```python
img = cv.imread('fly.png', cv.IMREAD_GRAYSCALE)

# Create SURF object. Set Hessian Threshold to 400
surf = cv.xfeatures2d.SURF_create(400)

# Find keypoints and descriptors directly
kp, des = surf.detectAndCompute(img, None)

print(len(kp))
# 699
```

We reduce it to some 50 to draw it on an image by increasing the Hessian Threshold:

```python
surf.setHessianThreshold(50000)
kp, des = surf.detectAndCompute(img, None)
print(len(kp))
# 47

img2 = cv.drawKeypoints(img, kp, None, (255, 0, 0), 4)
plt.imshow(img2), plt.show()
```

You can see that SURF is more like a blob detector. It detects the white blobs on wings of butterfly.

To apply U-SURF (doesn't find the orientation, faster):

```python
surf.setUpright(True)
kp = surf.detect(img, None)
img2 = cv.drawKeypoints(img, kp, None, (255, 0, 0), 4)
plt.imshow(img2), plt.show()
```

To use 128-dim descriptors:

```python
surf.setExtended(True)
kp, des = surf.detectAndCompute(img, None)
print(surf.descriptorSize())  # 128
print(des.shape)  # (47, 128)
```

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_surf_intro/py_surf_intro.markdown)
