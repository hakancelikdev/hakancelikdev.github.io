---
publishDate: 2021-10-27T00:00:00Z
author: Hakan Çelik
title: "Görüntülerde Aritmetik İşlemler"
excerpt: "Görüntüler üzerinde toplama, çıkarma, bitdüzeyi işlemleri gibi birkaç aritmetik işlemleri öğreneceğiz. Bu fonksiyonları öğreneceksiniz : cv2.add(), cv2.addWeighted() vb."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 5
subcategory: Görüntü İşleme
image: ~/assets/images/blog/opencv.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Görüntülerde Aritmetik İşlemler

## Hedefler

Görüntüler üzerinde **toplama**, **çıkarma**, **bitdüzeyi** işlemleri gibi birkaç
aritmetik işlemleri öğreneceğiz. Bu fonksiyonları öğreneceksiniz : **cv2.add\(\)**,
**cv2.addWeighted\(\)** vb.

## Resim ekleme

Opencv fonksiyonu, **cv2.add\(\)** veya **numpy** işlemleri, **res = img1 + img2** ile
iki resim ekleyebilirsiniz. Her iki görüntü de aynı derinlik ve türe sahip olmalı veya
ikinci görüntü yalnızca skalar değerinde olabilir.

**Not ;**

OpenCV eklemesi ile Numpy eklemesi arasında bir fark vardır. OpenCV eklemesi doymuş bir
işlemdir, buna karşın Numpy ilavesi modüler bir işlemdir.

örnek olarak ;

```python
>>> x = np.uint8([250])
>>> y = np.uint8([10])
>>> print(cv2.add(x,y)) # 250+10 = 260 => 255
[[255]]
>>> print(x+y)          # 250+10 = 260 % 256 = 4
[4]
```

İki resim eklediğinizde daha görünür olacaktır. OpenCV işlevi daha iyi sonuç verecektir.
Bu yüzden her zaman OpenCV işlevlerine sadık kalın.

## Görüntü Karıştırma

Bu aynı zamanda görüntü eklemesidir, ancak farklı ağırlıklar görüntülere verilir,
böylece harmanlama veya şeffaflık hissi verir. Resimler aşağıdaki denkleme göre eklenir:
![](/images/posts/opencv/math-8086.png)
![](/images/posts/opencv/math-e8b0.png)'e
değişen
![](/images/posts/opencv/math-ad59.png)
bir görüntü arasında diğerine serin bir geçiş yapabilirsiniz. Burada onları bir araya
getirmek için iki görüntü aldım.

İlk resme 0.7 ağırlık ve ikinci resme 0.3 verilir. **cv2.addWeighted\(\)**, aşağıdaki
denklemi görüntüye uygular.
![](/images/posts/opencv/math-ce1e.png)

Burada
![](/images/posts/opencv/math-0ebb.png)
sıfır olarak alınır.

```python
img1 = cv2.imread('ml.png')
img2 = cv2.imread('opencv_logo.jpg')
dst = cv2.addWeighted(img1,0.7,img2,0.3,0)
cv2.imshow('dst',dst)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

**sonuç ;**


## Bitwise Operations \( Bit düzeyi işlemleri \)

Bu bitwise **AND**, **OR**, **NOT** ve **XOR** işlemlerini içerir. Resmin herhangi bir
bölümünü çıkartırken \(ilerleyen bölümlerde de göreceğimiz gibi\) dikdörtgen olmayan ROI
vb. Ile tanımlama ve çalışma yaparken son derece faydalı olacaklar.

Aşağıda, resmin belirli bir bölümünü nasıl değiştireceğinize ilişkin bir örnek
göreceğiz.

OpenCV logosunu bir resmin üzerine koyalım. İki resim eklersem renk değişir, Eğer
dikdörtgen bir bölge olsaydı, ROI'yı son bölümde yaptığımız gibi kullanabilirdim. Ancak
OpenCV logosu dikdörtgen bir şekle değil. Dolayısıyla, bunu aşağıdaki gibi bitwise
işlemlerle yapabilirsiniz:

```python
# iki resmi yüklüyoruz
img1 = cv2.imread('messi5.jpg')
img2 = cv2.imread('opencv_logo.png')

# Sol üst köşeye logo koymak istiyorum, bu yüzden bir ROI oluşturuyorum
rows,cols,channels = img2.shape
roi = img1[0:rows, 0:cols ]

# şimdi logonun maskesini oluşturun ve ayrıca ters maskesinide oluşturun
img2gray = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)
ret, mask = cv2.threshold(img2gray, 10, 255, cv2.THRESH_BINARY)
mask_inv = cv2.bitwise_not(mask)

# şimdi logo içindeki ROI 'un alanını karartalım
img1_bg = cv2.bitwise_and(roi,roi,mask = mask_inv)

# Logo görüntüsünden yalnızca logo bölgesi aldık.
img2_fg = cv2.bitwise_and(img2,img2,mask = mask)

# ROI'ye logo koyun ve ana görüntüyü değiştiriyoruz
dst = cv2.add(img1_bg,img2_fg)
img1[0:rows, 0:cols ] = dst

cv2.imshow('res',img1)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

Aşağıdaki sonuca bakın, Sol resim imal ettiğimiz maskeyi gösterir, Sağ görüntü ise sen
son oluşan sonucu gösterir.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_core/py_image_arithmetics/py_image_arithmetics.markdown)
