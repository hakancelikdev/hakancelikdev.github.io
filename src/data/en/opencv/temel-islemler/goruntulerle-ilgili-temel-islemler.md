---
publishDate: 2021-11-10T00:00:00Z
author: Hakan Çelik
title: "Basic Operations on Images"
excerpt: "Accessing and modifying pixel values, Accessing image properties, Setting the Image Region (area) (ROI), Splitting and Merging Images"
category: OpenCV
subcategory: Basic Operations
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Basic Operations on Images

### Goals

- Accessing and modifying pixel values
- Accessing image properties
- Setting the Image Region \( area \) \(ROI\)
- Splitting and Merging Images

> Almost all the operations in this section are mainly related to **Numpy** rather than
> **OpenCV**. Good knowledge of **Numpy** is required to write better optimized code with
> **OpenCV**.

## Accessing and Modifying Pixel Values

Let's load a color image first:

```python
>>> import cv2
>>> import numpy as np

>>> img = cv2.imread('messi5.jpg')
```

You can access a pixel value by its row and column coordinates. For a BGR image, it
returns an array of Blue, Green, Red values. For a grayscale image, only the
corresponding intensity is returned.

```python
>>> px = img[100,100]
>>> print(px)
[157 166 200]

# accessing only blue pixel
>>> blue = img[100,100,0]
>>> print(blue)
157
```

You can modify the pixel values in the same way.

```python
>>> img[100,100] = [255,255,255]
>>> print(img[100,100])
[255 255 255]
```

#### Warning

> Numpy is a library optimized for fast array calculations. Therefore, accessing and
> modifying each pixel value individually will be very slow.

#### Note

> The method mentioned above is normally used to select a region of the array, for
> example the first 5 rows and the last 3 columns and similar things. For individual
> pixel access, Numpy array methods, array.item \(\) and array.itemset \(\) are
> considered better. But they always return a scalar. Therefore, if you want to access
> all B, G, R values, you need to call array.item \(\) separately for each one.

A better method for pixel access and editing:

```python
# accessing RED value
>>> img.item(10,10,2)
59
# modifying RED value
>>> img.itemset((10,10,2),100)
>>> img.item(10,10,2)
100
```

## Accessing Image Properties

Image properties include the number of rows, columns and channels, image data type,
number of pixels, etc.

The shape of the image is accessed by **img.shape**. It returns a tuple of a number of
rows, columns and channels \(if the image is color\).

```python
>>> print(img.shape)
(342, 548, 3)
```

#### Note

> If the image is grayscale, the returned tuple contains only the number of rows and
> columns. This is therefore a good method for checking whether a loaded image is
> grayscale or a color image.

Total number of pixels is accessed by **img.size**:

```python
>>> print(img.size)
562248
```

Image data type is obtained by **image.dtype**:

```python
>>> print(img.dtype)
uint8
```

#### Note

> img.dtype is very important when debugging, because a large number of errors in
> OpenCV-Python code are caused by invalid data types.

## Image ROI

Sometimes you will have to play with certain regions of images. For eye detection in
images, first face detection is done over the whole image. When a face is obtained, we
select the face region alone and search for eyes inside it. This approach improves
accuracy.

Here I will select the ball and copy it to another region in the image:

```python
>>> ball = img[280:340, 330:390]
>>> img[273:333, 100:160] = ball
```


## Splitting and Merging Image Channels

The B, G, R channels of an image can be split into their individual planes when needed.
Then, the individual channels can be merged back to form a BGR image again.

```python
>>> b,g,r = cv2.split(img)
>>> img = cv2.merge((b,g,r))
# or
>>> b = img[:,:,0]
# Suppose you want to set all red pixels to zero - you don't need to split
# like this. You can simply use Numpy, which is faster.

>>> img[:,:,2] = 0
```

#### Note

> **cv2.split\(\)** is a costly operation (in terms of time). So use it only if
> necessary. **Numpy** is much more efficient.

## Making Borders for Images \(Padding\)

If you want to create a border around an image, something like a photo frame, you can
use **cv2.copyMakeBorder\(\)** function. But it has more applications for convolution
operation, zero padding etc. This function takes following arguments:

- _**src**_ - input image
- _**top, bottom, left, right**_ - border width in number of pixels in corresponding
  directions
- _**borderType**_ - Flag defining what kind of border to be added. It can be following
  types:
- \_**cv2.BORDER_CONSTAN**\_T - Adds a constant colored border. The value should be
  given as next argument.
- _**cv2.BORDER_REFLECT**_ - Border will be a mirror reflection of the border elements,
  like this: fedcba \| abcdefgh \| hgfedcb
- _**cv2.BORDER_REFLECT_101 or cv2.BORDER_DEFAULT**_ - Same as above, but with a slight
  change, like this: gfedcb \| abcdefgh \| gfedcba
- _**cv2.BORDER_REPLICATE**_ - Last element is replicated throughout, like this:
  aaaaaa \| abcdefgh \| hhhhhhh
- _**cv2.BORDER_WRAP**_ - Can't explain, it will look like this: cdefgh \| abcdefgh \|
  abcdefg
- _**value**_ - Border color if border type is cv2.BORDER_CONSTANT

Below is a sample code demonstrating all these border types for better understanding:

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt

BLUE = [255,0,0]

img1 = cv2.imread('opencv_logo.png')

replicate = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REPLICATE)
reflect = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REFLECT)
reflect101 = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REFLECT_101)
wrap = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_WRAP)
constant= cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_CONSTANT,value=BLUE)

plt.subplot(231),plt.imshow(img1,'gray'),plt.title('ORIGINAL')
plt.subplot(232),plt.imshow(replicate,'gray'),plt.title('REPLICATE')
plt.subplot(233),plt.imshow(reflect,'gray'),plt.title('REFLECT')
plt.subplot(234),plt.imshow(reflect101,'gray'),plt.title('REFLECT_101')
plt.subplot(235),plt.imshow(wrap,'gray'),plt.title('WRAP')
plt.subplot(236),plt.imshow(constant,'gray'),plt.title('CONSTANT')

plt.show()
```

See the result below \( The image is displayed with **matplotlib**, so RED and BLUE
channels are swapped \):
