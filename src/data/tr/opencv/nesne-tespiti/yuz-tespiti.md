---
publishDate: 2022-06-18T00:00:00Z
author: Hakan Çelik
title: "Haar Cascade ile Yüz Tespiti"
excerpt: "OpenCV'de Haar Cascade sınıflandırıcılarını kullanarak yüz ve göz tespiti yapın. cv.CascadeClassifier ile gerçek zamanlı nesne tespitinin temellerini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 59
subcategory: Nesne Tespiti
image: /images/posts/opencv/messi_face.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Haar Cascade ile Yüz Tespiti

## Hedefler

- Haar cascade sınıflandırıcılarını kullanarak yüz tespiti yapmayı öğreneceğiz
- OpenCV'deki **cv.CascadeClassifier** kullanımını göreceğiz

## Teori

Nesne Tespiti, Paul Viola ve Michael Jones'un 2001 tarihli "Rapid Object Detection using a Boosted Cascade of Simple Features" makalesiyle önerilen makine öğrenmesi tabanlı bir yaklaşım kullanır. Bu, iyi eğitilmiş bir nesne tespiti için çok sayıda pozitif görüntü (yüz görüntüleri) ve negatif görüntü (yüz içermeyen görüntüler) gerektiren bir cascade fonksiyondur.

### Haar Özellikleri

Algoritmanın ilk aşaması **Haar özelliklerinin** toplanmasıdır. Her özellik komşu dikdörtgen bölgelerden piksel yoğunluklarının toplamını çıkaran tek bir değerdir. Siyah ve beyaz dikdörtgenlerden oluşan çeşitli kernel boyutları ile bu özellikler hesaplanır.

### Integral Görüntü

Bu özelliklerin hesaplanmasını hızlandırmak için **integral görüntü** tekniği kullanılır. Integral görüntü, her piksel için o piksele kadar sol üst köşedeki tüm piksellerin toplamını içerir. Bu sayede herhangi bir dikdörtgenin piksel toplamı sabit sürede (4 referans noktası ile) hesaplanabilir.

### AdaBoost

Hesaplanan Haar özelliklerinden en iyi olanları seçmek için **AdaBoost** algoritması kullanılır. 24x24 piksellik bir pencerede 160.000'den fazla özellik hesaplanabilir. Ancak bunların büyük çoğunluğu gereksizdir. AdaBoost, bu özelliklerden yalnızca en etkili ~6000 tanesini seçer.

### Cascade Sınıflandırıcı

Tüm 6000 özelliği her pencereye uygulamak yavaştır. **Cascade sınıflandırıcı** yaklaşımı, özellikleri aşamalara ayırır. Bir aşama başarısız olursa, o pencere hemen reddedilir ve işlem durur. Böylece potansiyel olmayan bölgeler için gereksiz hesaplama yapılmaz.

## OpenCV'de Yüz Tespiti

OpenCV, yüz tespiti için eğitilmiş birçok cascade XML dosyasıyla birlikte gelir. Bunlar `opencv/data/haarcascades/` klasöründe yer alır.

```python
import numpy as np
import cv2 as cv

face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_eye.xml')

img = cv.imread('sachin.jpg')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)

for (x, y, w, h) in faces:
    cv.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
    roi_gray = gray[y:y+h, x:x+w]
    roi_color = img[y:y+h, x:x+w]

    eyes = eye_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in eyes:
        cv.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)

cv.imshow('img', img)
cv.waitKey(0)
cv.destroyAllWindows()
```

Sonuç aşağıdaki gibi görünecektir — yüzler mavi, gözler yeşil dikdörtgenlerle işaretlenir.

## Gerçek Zamanlı Yüz Tespiti (Kamera)

Kameradan gerçek zamanlı yüz tespiti yapmak için:

```python
import numpy as np
import cv2 as cv

face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_eye.xml')

cap = cv.VideoCapture(0)

while True:
    ret, img = cap.read()
    if not ret:
        break
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]

        eyes = eye_cascade.detectMultiScale(roi_gray)
        for (ex, ey, ew, eh) in eyes:
            cv.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)

    cv.imshow('img', img)
    if cv.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv.destroyAllWindows()
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_objdetect/py_face_detection/py_face_detection.markdown)
