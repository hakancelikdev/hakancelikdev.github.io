---
publishDate: 2022-06-22T00:00:00Z
author: Hakan Çelik
title: "Windows'ta OpenCV-Python Kurulumu"
excerpt: "Windows sistemde OpenCV-Python kurulumunu öğrenin. Önceden derlenmiş ikili dosyalardan hızlı kurulum ve CMake ile Visual Studio kullanarak kaynak koddan derleme yöntemlerini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 63
subcategory: Kurulum
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - kurulum
---

# Windows'ta OpenCV-Python Kurulumu

> **Not:** Mümkünse PyPI ile dağıtılan ikilileri tercih edin. Ayrıntılar için [pip ile OpenCV Kurulumu](/pip-kurulum) konusuna bakın.

## Hedefler

Windows sistemde OpenCV-Python'u kurmayı öğreneceğiz.

## Yöntem 1: Önceden Derlenmiş Paketlerden Kurulum

1. Aşağıdaki Python paketlerini varsayılan konumlarına indirip kurun:
   - Python 3.x (3.4+) — [python.org](https://www.python.org/downloads/)
   - Numpy: `pip install numpy`
   - Matplotlib (isteğe bağlı ama önerilir): `pip install matplotlib`

2. En son OpenCV sürümünü [GitHub](https://github.com/opencv/opencv/releases)'dan indirin ve çıkartın.

3. **opencv/build/python/3.x** klasörüne gidin.

4. **cv2.pyd** dosyasını **C:/Python3x/lib/site-packages** klasörüne kopyalayın.

5. **opencv_world.dll** dosyasını da aynı klasöre kopyalayın.

6. Python IDLE'ı açın ve şunu yazın:

```python
import cv2 as cv
print(cv.__version__)
```

## Yöntem 2: Kaynak Koddan Derleme

1. Visual Studio ve CMake'i indirip kurun.

2. Gerekli Python paketlerini varsayılan konumlarına kurun:
   - Python
   - Numpy

3. OpenCV kaynak kodunu indirin — [GitHub](https://github.com/opencv/opencv) veya [SourceForge](http://sourceforge.net/projects/opencvlibrary/).

4. Kaynak kodu bir klasöre çıkartın ve içinde `build` klasörü oluşturun.

5. **CMake-gui**'yi açın (Start > All Programs > CMake-gui):
   - **Browse Source...** ile opencv klasörünü seçin
   - **Browse Build...** ile build klasörünü seçin
   - **Configure** butonuna tıklayın ve derleyiciyi seçin
   - **WITH**, **BUILD** ve **ENABLE** alanlarını ayarlayın
   - **Generate** butonuna tıklayın

6. `opencv/build` klasöründeki **OpenCV.sln** dosyasını Visual Studio ile açın.

7. Derleme modunu **Release** olarak ayarlayın.

8. Solution Explorer'da Solution veya ALL_BUILD üzerine sağ tıklayıp **Build** edin.

9. **INSTALL** üzerine sağ tıklayıp tekrar build edin. OpenCV-Python kurulacaktır.

10. Python IDLE'da `import cv2 as cv` yazarak test edin.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_setup/py_setup_in_windows/py_setup_in_windows.markdown)
