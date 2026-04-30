---
publishDate: 2022-05-26T00:00:00Z
author: Hakan Çelik
title: "SIFT'e Giriş (Ölçek Değişmez Özellik Dönüşümü)"
excerpt: "SIFT algoritmasının kavramlarını öğrenin. Ölçek uzayı aşırı nokta tespiti, anahtar nokta konumlandırma, yönelim atama ve SIFT anahtar noktalarını OpenCV ile bulmayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 36
subcategory: Özellik Tespiti
image: /images/posts/opencv/sift_keypoints.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# SIFT'e Giriş (Ölçek Değişmez Özellik Dönüşümü)

## Hedefler

Bu bölümde:

- SIFT algoritmasının kavramlarını öğreneceğiz
- SIFT Anahtar Noktalarını ve Tanımlayıcılarını bulmayı öğreneceğiz

## Teori

Son birkaç bölümde Harris gibi birkaç köşe dedektörü gördük. Bunlar dönüşüm değişmezdir, yani görüntü döndürülmüş olsa bile aynı köşeleri bulabiliriz. Döndürülmüş görüntüde de köşeler köşe olarak kalır. Peki ölçekleme konusunda ne yapabiliriz? Görüntü ölçeklendirildiğinde köşe, köşe olmayabilir. Örneğin aşağıdaki basit görüntüye bakın. Küçük bir penceredeki küçük görüntüdeki bir köşe, aynı pencerede yakınlaştırıldığında düzdür. Bu nedenle Harris köşesi ölçek değişmez değildir.

![SIFT ölçek değişmezliği](/images/posts/opencv/sift_scale_invariant.jpg)

2004 yılında British Columbia Üniversitesi'nden **D.Lowe**, anahtar noktaları çıkaran ve tanımlayıcılarını hesaplayan **Distinctive Image Features from Scale-Invariant Keypoints** adlı makalesinde **SIFT (Scale Invariant Feature Transform)** adlı yeni bir algoritma ortaya koydu.

SIFT algoritmasında dört ana adım vardır:

### 1. Ölçek Uzayı Aşırı Nokta Tespiti

Farklı ölçeklerdeki anahtar noktaları tespit edemeyeceğimiz açıktır. Bunun için ölçek uzayı filtrelemesi kullanılır. Görüntü için çeşitli σ değerleriyle Gauss'un Laplacian'ı hesaplanır. Yaklaşım olarak SIFT, LoG'un yaklaşımı olan iki farklı σ ile Gauss bulanıklaştırmasının farkını kullanır — Gauss Farkı (DoG). Bu işlem Gauss Piramidindeki görüntünün farklı oktavları için yapılır:

![SIFT DoG](/images/posts/opencv/sift_dog.jpg)

DoG bulunduktan sonra görüntüler ölçek ve uzay üzerinde yerel aşırı noktalar için aranır. Bir piksel, 8 komşusu ve 9 piksel sonraki ölçekte ve önceki ölçekteki 9 piksel ile karşılaştırılır:

![SIFT yerel aşırı noktalar](/images/posts/opencv/sift_local_extrema.jpg)

### 2. Anahtar Nokta Konumlandırma

Potansiyel anahtar nokta konumları bulunduğunda, daha doğru sonuçlar elde etmek için rafine edilirler. Ölçek uzayının Taylor serisi açılımı kullanılır. Bu aşırı nokta yoğunluğu eşik değerinden düşükse (makalede 0.03) reddedilir. Düşük kontrastlı anahtar noktalar ve kenar anahtar noktaları elenir; kalan güçlü ilgi noktalarıdır.

### 3. Yönelim Atama

Görüntü döndürmesine değişmezlik elde etmek için her anahtar noktaya bir yönelim atanır. Anahtar nokta konumu etrafında ölçeğe bağlı bir komşuluk alınır ve o bölgedeki gradyan büyüklüğü ve yönü hesaplanır.

### 4. Anahtar Nokta Tanımlayıcısı

Anahtar nokta etrafındaki 16×16 komşuluk alınır. 4×4 boyutunda 16 alt bloğa bölünür. Her alt blok için 8 binalık yönelim histogramı oluşturulur. Böylece toplam 128 bin değeri elde edilir. Anahtar nokta tanımlayıcısı oluşturmak için bir vektör olarak temsil edilir.

### 5. Anahtar Nokta Eşleştirme

İki görüntü arasındaki anahtar noktalar en yakın komşuları belirlenerek eşleştirilir. En yakın mesafenin ikinci en yakın mesafeye oranı 0,8'den büyükse reddedilir. Bu, yanlış eşleşmelerin yaklaşık %90'ını ortadan kaldırır.

## OpenCV'de SIFT

Artık OpenCV'deki SIFT işlevselliğini görelim. Bu özellikler önceden yalnızca opencv contrib'de mevcuttu, ancak 2020'de patent süresi doldu ve artık ana repoya dahil edildi:

```python
import numpy as np
import cv2 as cv

img = cv.imread('home.jpg')
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

sift = cv.SIFT_create()
kp = sift.detect(gray, None)

img = cv.drawKeypoints(gray, kp, img)
cv.imwrite('sift_keypoints.jpg', img)
```

**sift.detect()** fonksiyonu görüntüdeki anahtar noktaları bulur. Her anahtar nokta, (x,y) koordinatları, boyutu, açısı, yanıtı gibi birçok özelliğe sahip özel bir yapıdır.

OpenCV ayrıca anahtar noktaların konumlarına küçük daireler çizen **cv.drawKeyPoints()** fonksiyonunu sağlar. **cv.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS** bayrağını geçerseniz anahtar noktanın boyutuyla bir daire çizer ve yönelimini de gösterir:

```python
img = cv.drawKeypoints(gray, kp, img, flags=cv.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
cv.imwrite('sift_keypoints.jpg', img)
```

![SIFT anahtar noktaları](/images/posts/opencv/sift_keypoints.jpg)

Tanımlayıcıları hesaplamak için iki yöntem vardır:

1. Zaten anahtar noktaları bulduysanız, **sift.compute()** çağrıyorsunuz: `kp, des = sift.compute(gray, kp)`
2. Anahtar noktaları bulmadıysanız, doğrudan anahtar noktaları ve tanımlayıcıları tek adımda bulabilirsiniz: **sift.detectAndCompute()**

```python
sift = cv.SIFT_create()
kp, des = sift.detectAndCompute(gray, None)
```

Burada `kp` bir anahtar noktalar listesi, `des` ise `(Anahtar Nokta Sayısı) × 128` şeklinde bir numpy dizisidir.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_sift_intro/py_sift_intro.markdown)
