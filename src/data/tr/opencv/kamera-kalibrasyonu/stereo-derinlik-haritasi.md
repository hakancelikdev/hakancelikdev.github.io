---
publishDate: 2022-06-08T00:00:00Z
author: Hakan Çelik
title: "Stereo Görüntülerden Derinlik Haritası"
excerpt: "Stereo görüntülerden derinlik haritası oluşturmayı öğrenin. cv2.StereoBM.create() ile disparite haritası hesaplamayı ve parametrelerini ayarlamayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 49
subcategory: Kamera Kalibrasyonu
image: /images/posts/opencv/disparity_map.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Stereo Görüntülerden Derinlik Haritası

## Hedefler

Bu oturumda:

- Stereo görüntülerden derinlik haritası oluşturmayı öğreneceğiz

## Temeller

Son oturumda epipolar kısıtlamalar ve ilgili terimler gibi temel kavramları gördük. Aynı sahnenin iki görüntüsüne sahipsek sezgisel bir şekilde derinlik bilgisi elde edebileceğimizi gördük. Aşağıdaki diyagram bu sezgiyi kanıtlayan eşdeğer üçgenler içermektedir:

![Stereo derinlik](/images/posts/opencv/stereo_depth.jpg)

Diyagramdaki eşdeğer üçgenler şu sonucu verir:

**disparite = x - x' = Bf/Z**

Burada x ve x', 3D sahne noktasına karşılık gelen görüntü düzlemindeki noktalar ile kamera merkezleri arasındaki mesafelerdir. B iki kamera arasındaki mesafedir (bilinen), f ise kameranın odak uzunluğudur (zaten bilinen). Yani bir sahnedeki noktanın derinliği, karşılıklı görüntü noktaları ve kamera merkezleri arasındaki mesafe farkıyla ters orantılıdır.

## Kod

Aşağıdaki kod parçacığı, bir disparite haritası oluşturmak için basit bir prosedür göstermektedir:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

imgL = cv.imread('tsukuba_l.png', cv.IMREAD_GRAYSCALE)
imgR = cv.imread('tsukuba_r.png', cv.IMREAD_GRAYSCALE)

stereo = cv.StereoBM.create(numDisparities=16, blockSize=15)
disparity = stereo.compute(imgL, imgR)
plt.imshow(disparity, 'gray')
plt.show()
```

Aşağıdaki görüntü orijinal görüntüyü (sol) ve disparite haritasını (sağ) içermektedir:

![Disparite haritası](/images/posts/opencv/disparity_map.jpg)

Sonucun yüksek derecede gürültüyle kirlendiğini görebilirsiniz. numDisparities ve blockSize değerlerini ayarlayarak daha iyi bir sonuç elde edebilirsiniz.

StereoBM ile bazı ayarlanabilir parametreler:

- **texture_threshold** — Güvenilir eşleştirme için yeterli doku içermeyen alanları filtreler
- **Speckle aralığı ve boyutu** — Blok tabanlı eşleştiriciler genellikle nesne sınırları yakınında "leke" oluşturur; bu parametreler disparity görüntüsüne bir leke filtresi uygular
- **numDisparities** — Pencerenin kaç piksel kaydırılacağı. Büyükse daha geniş görünür derinlik aralığı sağlar
- **min_disparity** — Aramanın başladığı x konumundan ofset
- **uniqueness_ratio** — En iyi eşleşen disparite yeterince iyi değilse piksel filtrelenir

## Ek Kaynaklar

1. [ROS stereo görüntü işleme wiki sayfası](http://wiki.ros.org/stereo_image_proc/Tutorials/ChoosingGoodStereoParameters)

## Alıştırmalar

1. OpenCV örnekleri, disparite haritası oluşturma ve 3D yeniden yapılandırma örneği içerir. OpenCV-Python örneklerindeki stereo_match.py'yi inceleyin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_depthmap/py_depthmap.markdown)
