---
publishDate: 2021-11-24T00:00:00Z
author: Hakan Çelik
title: "Görüntünün Geometrik Dönüşümleri"
excerpt: "Çevirme, döndürme ve afin dönüşümü gibi görüntülere farklı geometrik dönüşüm uygulamayı öğreneceğiz. Bu fonksiyonu öğrenceğiz : cv2.getPerspectiveTransform"
category: OpenCV
subcategory: Görüntü İşleme
image: /images/posts/opencv/translation.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Görüntünün Geometrik Dönüşümleri

## Hedefler

- Çevirme, döndürme ve afin dönüşümü gibi görüntülere farklı geometrik dönüşüm
  uygulamayı öğreneceğiz.
- Bu fonksiyonu öğrenceğiz : `cv2.getPerspectiveTransform`

## Dönüşümler

> Transformations

OpenCV, `cv2.warpAffine` ve `cv2.warpPerspective` olmak üzere her türlü dönüştürme
işlemine sahip olabileceğiniz iki dönüştürme işlevi sunar. `cv2.warpAffine`, 2x3 dönüşüm
matrisi alırken `cv2.warpPerspective`, girdi olarak 3x3 dönüşüm matrisini alır.

### Ölçekleme

> Scaling

Ölçeklendirme yalnızca resmin yeniden boyutlandırılmasıdır. OpenCV, bu amaçla
`cv2.resize()` işleviyle birlikte gelir. Görüntünün boyutu manuel olarak belirtilebilir
veya ölçeklendirme faktörünü belirtebilirsiniz. Farklı enterpolasyon yöntemleri
kullanılır. Tercih edilen enterpolasyon yöntemleri küçültme için `cv2.INTER_AREA` ve
yakınlaştırma için `cv2.INTER_CUBIC(slow)` ve `cv2.INTER_LINEAR`'dir. Varsayılan olarak,
kullanılan yeniden boyutlandırma amaçları için `cv2.INTER_LINEAR` interpolasyon yöntemi
kullanılır. Bir girdi resmini aşağıdaki yöntemlerden biriyle yeniden
boyutlandırabilirsiniz:

```python
import cv2
import numpy as np
img = cv2.imread('messi5.jpg') # resmi aldık
res = cv2.resize(img,None,fx=2, fy=2, interpolation = cv2.INTER_CUBIC) # yenidem boyutlandırdık
#veya
height, width = img.shape[:2]
res = cv2.resize(img,(2*width, 2*height), interpolation = cv2.INTER_CUBIC) # yenidem boyutlandırdık
```

## Çeviri

Çeviri, cismin bulunduğu konumun değişmesidir. \(x, y\) yönündeki değişimi biliyorsanız,
olmasına izin verin , dönüşüm matrisi
yi aşağıdaki gibi oluşturabilirsiniz.

![](/images/posts/opencv/math-22fe.png)

`Np.float32` türünde bir **Numpy** dizisi haline getirebilir ve `cv2.warpAffine()`
fonksiyonuna iletebilirsiniz. \(100,50\) 'lik bir kayma için aşağıdaki örneğe bakın:

```python
import cv2
import numpy as np
img = cv2.imread('messi5.jpg',0)
rows,cols = img.shape
M = np.float32([[1,0,100],[0,1,50]])
dst = cv2.warpAffine(img,M,(cols,rows))
cv2.imshow('img',dst)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

`Cv2.warpAffine()` işlevinin üçüncü argümanı, \(genişlik, yükseklik\) /\(width, height\)
formunda olması gereken çıkış görüntüsünün boyutudur. Genişliği = sütunların sayısını ve
yüksekliği = satırların sayısını hatırlarsan.

## Rotasyon

Bir görüntünün bir açıyla döndürülmesi,
![](/images/posts/opencv/math-a9cf.png)
formun dönüşüm matrisi ile sağlanır

![](/images/posts/opencv/math-f3a6.png)

Ancak OpenCV, ayarlanabilen dönme merkezi ile ölçeklendirilmiş dönüş sağlar; böylece
istediğiniz herhangi bir konumda döndürebilirsiniz. Modifiye dönüştürme matrisi şu
şekilde verilir:

![](/images/posts/opencv/math-91ff.png)

![](/images/posts/opencv/math-383c.png)

Bu dönüşüm matrisini bulmak için, OpenCV bir fonksiyon, `cv2.getRotationMatrix2D`
sağlar. Aşağıdaki örnekte, görüntüyü herhangi bir ölçeklendirme olmadan merkeze göre 90
derece döndüren kontrol edin.

```python
img = cv2.imread('messi5.jpg',0)
rows,cols = img.shape
M = cv2.getRotationMatrix2D((cols/2,rows/2),90,1)
dst = cv2.warpAffine(img,M,(cols,rows))
```

![](/images/posts/opencv/rotation.jpg)

## Afin Dönüşüm

> Affine Transformation

Afin dönüşümde, orijinal görüntüdeki tüm paralel çizgiler çıkış görüntüsünde paralel
olacaktır. Dönüşüm matrisini bulmak için, giriş görüntüsünden üç noktaya ve çıkış
görüntüsündeki karşılık gelen konumlara ihtiyacımız var. Sonra `cv2.getAffineTransform`,
`cv2.warpAffine`'e geçirilecek 2x3 bir matris oluşturacaktır.

Aşağıdaki örneği kontrol edin ve seçtiğim noktalara da bakın \(bunlar Yeşil renkle
işaretlenmiştir\):

```python
img = cv2.imread('drawing.png')
rows,cols,ch = img.shape
pts1 = np.float32([[50,50],[200,50],[50,200]])
pts2 = np.float32([[10,100],[200,50],[100,250]])
M = cv2.getAffineTransform(pts1,pts2)
dst = cv2.warpAffine(img,M,(cols,rows))
plt.subplot(121),plt.imshow(img),plt.title('Input')
plt.subplot(122),plt.imshow(dst),plt.title('Output')
plt.show()
```

![](/images/posts/opencv/affine.jpg)

## Perspektif Dönüşümü

> Perspective Transformation

Perspektif dönüşümü için 3x3 dönüşüm matrisine ihtiyacınız var. Düz çizgiler dönüşümden
sonra bile düz kalacaktır.Bu dönüşüm matrisini bulmak için, giriş görüntüsünde 4 nokta
ve çıktı görüntüsünde karşılık gelen noktalara ihtiyacınız var.Bu 4 nokta arasından 3'ü
aynı çizgide olmamalıdır. Sonra dönüşüm matrisi `cv2.getPerspectiveTransform`
fonksiyonuyla bulunabilir. Daha sonra bu 3x3 dönüşüm matrisi ile `cv2.warpPerspective`'ı
uygulayın.

```python
img = cv2.imread('sudokusmall.png')
rows,cols,ch = img.shape
pts1 = np.float32([[56,65],[368,52],[28,387],[389,390]])
pts2 = np.float32([[0,0],[300,0],[0,300],[300,300]])
M = cv2.getPerspectiveTransform(pts1,pts2)
dst = cv2.warpPerspective(img,M,(300,300))
plt.subplot(121),plt.imshow(img),plt.title('Input')
plt.subplot(122),plt.imshow(dst),plt.title('Output')
plt.show()
```

![](/images/posts/opencv/perspective.jpg)