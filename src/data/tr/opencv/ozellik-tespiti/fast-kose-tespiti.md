---
publishDate: 2022-05-28T00:00:00Z
author: Hakan Çelik
title: "Köşe Tespiti için FAST Algoritması"
excerpt: "Gerçek zamanlı uygulamalar için tasarlanmış FAST (Hızlandırılmış Segment Testi Özellikleri) algoritmasını öğrenin. OpenCV'de cv2.FastFeatureDetector_create() kullanımını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 38
subcategory: Özellik Tespiti
image: /images/posts/opencv/fast_kp.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Köşe Tespiti için FAST Algoritması

## Hedefler

Bu bölümde:

- FAST algoritmasının temellerini anlayacağız
- FAST algoritması için OpenCV işlevlerini kullanarak köşeleri bulacağız

## Teori

Çeşitli özellik dedektörlerini gördük ve bunların birçoğu gerçekten iyidir. Ancak gerçek zamanlı uygulama bakış açısından yeterince hızlı değiller. Buna iyi bir örnek, sınırlı hesaplama kaynaklarına sahip mobil robot SLAM (Eş Zamanlı Konumlama ve Haritalama) olacaktır.

Buna çözüm olarak, Edward Rosten ve Tom Drummond tarafından 2006'da yayınlanan **"Machine learning for high-speed corner detection"** adlı makalede **FAST (Features from Accelerated Segment Test)** algoritması önerildi.

### FAST Kullanarak Özellik Tespiti

1. Görüntüde bir piksel p seçin, yoğunluğu Ip olsun.
2. Uygun eşik değerini t seçin.
3. Test edilen pikselin etrafında 16 piksellik bir daire düşünün:

   ![FAST hız testi](/images/posts/opencv/fast_speedtest.jpg)

4. Piksel p, bu 16 piksellik dairede tümü Ip + t'den daha parlak olan veya tümü Ip − t'den daha koyu olan n ardışık piksel varsa bir köşedir (n = 12 seçilmiştir).

5. Çok sayıda köşe olmayan adayı dışlamak için bir **yüksek hızlı test** önerildi: Yalnızca 1, 9, 5 ve 13 konumlarındaki dört piksel inceleniyor. p bir köşeyse, bunların en az üçü Ip + t'den daha parlak veya Ip − t'den daha koyu olmalıdır.

Dedektörün çeşitli zayıflıkları vardır:
- n < 12 için fazla aday reddetmiyor
- Piksel seçimi optimal değil
- Bitişik konumlarda birden fazla özellik tespit edilir

İlk 3 nokta makine öğrenmesi yaklaşımıyla, sonuncusu ise maksimum olmayan bastırmayla ele alınır.

### Özet Durum Diyagramı

![FAST denklemler](/images/posts/opencv/fast_eqns.jpg)

### Maksimum Olmayan Bastırma

Bitişik konumlarda birden fazla ilgi noktası tespit etmek başka bir sorundur. Bu, Maksimum Olmayan Bastırma ile çözülür:

1. Tespit edilen tüm özellik noktaları için p ile 16 çevre piksel değerleri arasındaki mutlak farklılıkların toplamı olan bir skor fonksiyonu V hesaplanır.
2. İki bitişik anahtar nokta düşünüldüğünde, düşük V değerine sahip olanı atılır.

### Özet

SIFT'ten birkaç kat daha hızlıdır. Ancak yüksek düzeyde gürültüye karşı sağlam değildir ve bir eşiğe bağlıdır.

## OpenCV'de FAST Özellik Dedektörü

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('blox.jpg', cv.IMREAD_GRAYSCALE)

# Varsayılan değerlerle FAST nesnesi başlat
fast = cv.FastFeatureDetector_create()

# Anahtar noktaları bul ve çiz
kp = fast.detect(img, None)
img2 = cv.drawKeypoints(img, kp, None, color=(255, 0, 0))

# Tüm varsayılan parametreleri yazdır
print("Threshold: {}".format(fast.getThreshold()))
print("nonmaxSuppression:{}".format(fast.getNonmaxSuppression()))
print("neighborhood: {}".format(fast.getType()))
print("Total Keypoints with nonmaxSuppression: {}".format(len(kp)))

cv.imwrite('fast_true.png', img2)

# nonmaxSuppression'ı devre dışı bırak
fast.setNonmaxSuppression(0)
kp = fast.detect(img, None)

print("Total Keypoints without nonmaxSuppression: {}".format(len(kp)))

img3 = cv.drawKeypoints(img, kp, None, color=(255, 0, 0))
cv.imwrite('fast_false.png', img3)
```

Sonuçlar — birincisi nonmaxSuppression ile, ikincisi olmadan:

![FAST anahtar noktaları](/images/posts/opencv/fast_kp.jpg)

## Ek Kaynaklar

1. Edward Rosten and Tom Drummond, "Machine learning for high speed corner detection" in 9th European Conference on Computer Vision, vol. 1, 2006, pp. 430–443.
2. Edward Rosten, Reid Porter, and Tom Drummond, "Faster and better: a machine learning approach to corner detection" in IEEE Trans. Pattern Analysis and Machine Intelligence, 2010, vol 32, pp. 105-119.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_fast/py_fast.markdown)
