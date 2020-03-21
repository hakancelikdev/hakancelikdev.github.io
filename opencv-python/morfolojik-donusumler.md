# Morfolojik Dönüşümler

## Hedef
Bu bölümde,
- Erozyon, Dilatasyon, Açılış, Kapanış gibi farklı morfolojik işlemleri öğreneceğiz. ( Erosion, Dilation, Opening, Closing )
- Farklı işlevleri şöyle göreceğiz: `cv2.erode()`, `cv2.dilate()`, `cv2.morphologyEx()` vb.

## Teori

Morfolojik dönüşümler, görüntü şekline dayanan bazı basit işlemlerdir. Normalde ikili görüntülerde gerçekleştirilir. İki girdiye ihtiyaç duyulur; biri bizim orijinal resim imajımız, ikinciye yapılandırma unsuru denir veya işlemin niteliğini belirleyen çekirdek. İki temel morfolojik operatör Erozyon ve Dilatasyon'dur. Ardından Açılış, Kapanış, Gradyan vb. Gibi değişken biçimler de oyuna girer. Onları aşağıdaki resim yardımıyla tek tek göreceğiz:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/j.png?style=center)

## 1. Erozyon

Erozyonun temel fikri şudur, toprak erozyonu gibidir, ön plandaki nesnenin sınırlarını aşındırır (Daima ön plandaki beyazı tutmaya çalışın). Peki ne yapar? Çekirdek, görüntü boyunca slaytlar (2B kıvrımında olduğu gibi). Orijinal resimdeki (1 veya 0) bir piksel, yalnızca çekirdek altındaki tüm piksellerin 1 olması halinde 1 kabul edilir, aksi halde aşınır (sıfıra yapılır).

Öyleyse ne oluyor, sınırın yakınındaki bütün pikseller çekirdeğin boyutuna bağlı olarak yok olacak. Böylece ön plan nesnesinin kalınlığı veya boyutu düşer veya resimde beyaz bölge azalır. Küçük beyaz kirliliği kaldırılır (renk alan bölümünde gördüğümüz gibi), birbirine bağlı iki nesneyi ayırmak vb. Için yararlıdır.

Burada örnek olarak, 5x5 çekirdeği ile dolu bir çekirdek kullanacağım. Nasıl çalıştığını görelim:

```python
import cv2
import numpy as np
img = cv2.imread('j.png',0)
kernel = np.ones((5,5),np.uint8)
erosion = cv2.erode(img,kernel,iterations = 1)
```

Sonuç;

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/erosion.png?style=center)

## 2. Dilatasyon

Erozyonun tam tersi. Burada çekirdeğin en az bir pikseli '1' ise bir piksel öğesi '1' olur. Böylece resimdeki beyaz bölgeyi arttırır veya ön plan nesnesinin boyutu artar. Normal olarak, gürültüyü gidermek gibi durumlarda, erozyonu dilatasyon izler. Çünkü, erozyon beyaz kirliliği kaldırır, ancak aynı zamanda nesne küçülür. Böylece onu genişletiyoruz. Gürültü bittiğinden geri dönmeyecekler, ancak nesne alanımız artar. Aynı zamanda, bir nesnenin kırılmış bölümlerine katılmada da yararlıdır.

`dilation = cv2.dilate(img,kernel,iterations = 1)`

Sonuç;

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/dilation.png?style=center)

## 3. Açılış

Açılma dilatosyon tarafından takip eden erozyonun başka bir ismidir .Yukarıda açıkladığımız gibi, gürültünün giderilmesinde yararlıdır. Burada `cv2.morphologyEx()` işlevini kullanıyoruz;

`opening = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)`

Sonuç:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/opening.png?style=center)

## 4. Kapanış

Kapanış, Açmanın tersidir, Dilatasyon ve ardından Erozyon. Ön plan nesneleri içindeki küçük deliklerin kapatılması veya nesnedeki küçük siyah noktaların kapatılmasında yararlıdır.

`closing = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)`

Sonuç;

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/closing.png?style=center)

## 5. Morfolojik Gradyan

Bir görüntünün genişlemesi ve erozyonu arasındaki farktır.

Sonuç, cismin taslağı gibi görünecektir.

`gradient = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)`

Sonuç:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/gradient.png?style=center)

## 6. Üst Şapka

Giriş görüntüsü ve görüntünün açılması arasındaki farktır. Aşağıdaki örnek, 9x9 çekirdek için yapılır. `tophat = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)`

Sonuç:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/tophat.png?style=center)

## 7. Kara Şapka

Giriş görüntüsünün ve giriş görüntüsünün kapanışı arasındaki farktır.

`blackhat = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)`

Sonuç:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/blackhat.png?style=center)

## Yapılandırma Elemanı

Önceki örneklerde Numpy yardımıyla elle bir yapılandırma unsuru yaratmıştık. Dikdörtgen şeklidir. Ancak bazı durumlarda, eliptik / dairesel şekilli çekirdeklere ihtiyacınız olabilir. Bu amaçla OpenCV, `cv2.getStructuringElement()` işlevine sahiptir. Sadece çekirdeğin şeklini ve boyutunu aktarırsanız, istediğiniz çekirdeği elde edersiniz.

```python
# Rectangular Kernel ( Dikdörtgen Çekirdek )
>>> cv2.getStructuringElement(cv2.MORPH_RECT,(5,5))
array([[1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1]], dtype=uint8)
# Elliptical Kernel ( Eliptik Çekirdek )
>>> cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))
array([[0, 0, 1, 0, 0],
       [1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1],
       [1, 1, 1, 1, 1],
       [0, 0, 1, 0, 0]], dtype=uint8)
# Cross-shaped Kernel ( Çapraz şekilli Çekirdek )
>>> cv2.getStructuringElement(cv2.MORPH_CROSS,(5,5))
array([[0, 0, 1, 0, 0],
       [0, 0, 1, 0, 0],
       [1, 1, 1, 1, 1],
       [0, 0, 1, 0, 0],
       [0, 0, 1, 0, 0]], dtype=uint8)
```
