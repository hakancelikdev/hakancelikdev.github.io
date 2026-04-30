---
publishDate: 2022-06-21T00:00:00Z
author: Hakan Çelik
title: "Fedora'da OpenCV-Python Kurulumu"
excerpt: "Fedora'da OpenCV-Python'u önceden derlenmiş paketlerden veya kaynak koddan derleme yöntemiyle nasıl kuracağınızı öğrenin. CMake, GCC ve bağımlılık kurulumu dahil adım adım kılavuz."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 62
subcategory: Kurulum
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Fedora'da OpenCV-Python Kurulumu

> **Not:** Mümkünse PyPI ile dağıtılan ikilileri tercih edin. Ayrıntılar için [pip ile OpenCV Kurulumu](/pip-kurulum) konusuna bakın.

## Hedefler

Fedora sisteminizde OpenCV-Python'u kurmayı öğreneceğiz. Bu adımlar Fedora 18 (64-bit) ve Fedora 19 (32-bit) üzerinde test edilmiştir.

## Yöntem 1: Önceden Derlenmiş Paketlerden Kurulum

Terminal'de root olarak aşağıdaki komutu çalıştırın:

```bash
yum install numpy opencv*
```

Ardından Python terminal'inde:

```python
import cv2 as cv
print(cv.__version__)
```

**Not:** Yum depoları en son OpenCV sürümünü içermeyebilir. Ayrıca kamera desteği, video oynatma vb. konularda sürücüler ve ffmpeg/gstreamer paketlerine bağlı olarak sorunlar yaşanabilir.

## Yöntem 2: Kaynak Koddan Derleme

### Zorunlu Bağımlılıklar

```bash
yum install cmake
yum install python-devel numpy
yum install gcc gcc-c++

# GTK ve medya desteği:
yum install gtk2-devel
yum install libdc1394-devel
yum install ffmpeg-devel
yum install gstreamer-plugins-base-devel
```

### İsteğe Bağlı Bağımlılıklar

```bash
yum install libpng-devel
yum install libjpeg-turbo-devel
yum install jasper-devel
yum install openexr-devel
yum install libtiff-devel
yum install libwebp-devel

# TBB desteği için:
yum install tbb-devel

# Eigen desteği için:
yum install eigen3-devel

# Dokümantasyon oluşturmak için:
yum install doxygen
```

### OpenCV'yi İndirme

```bash
yum install git
git clone https://github.com/opencv/opencv.git
cd opencv
mkdir build
cd build
```

### Yapılandırma ve Kurulum

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..

# TBB ve Eigen desteğiyle:
cmake -D WITH_TBB=ON -D WITH_EIGEN=ON ..

# Testler ve örnekler olmadan:
cmake -D BUILD_DOCS=ON -D BUILD_TESTS=OFF -D BUILD_PERF_TESTS=OFF -D BUILD_EXAMPLES=OFF ..

make
su
make install
```

Kurulum `/usr/local/` klasörüne yapılır. Python'un OpenCV modülünü bulabilmesi için:

```bash
export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python2.7/site-packages
```

satırını `~/.bashrc` dosyasına ekleyip sistemi yeniden başlatın. Ardından `import cv2 as cv` yazarak test edin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_fedora/py_setup_in_fedora.markdown)
