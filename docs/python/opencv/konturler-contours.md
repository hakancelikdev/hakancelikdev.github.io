# Konturler \( Contours \)

## Konturlar: Başlarken

### Hedefler

- Konturlerin ne olduğunu anlayacağız.
- Konturleri bulmayı ve çizmeyi öğreneceğiz.
- Bu fonksiyonları öğreneceğiz : `cv2.findContours()`, `cv2.drawContours()`

### Kontur Nedir ? \( Contours \)

Konturlar, aynı renk veya yoğunluğa sahip olan tüm kesintisiz noktaları \(sınır
boyunca\) birleştiren bir eğri olarak basitçe açıklanabilir. Konturlar, şekil analizi,
nesne algılama ve tanıma için yararlı bir araçtır.

- Daha iyi doğruluk için ikili görsel kullanılır \( binary images. \) yani kontur
  bulmadan önce, eşik veya canny kenar algılama uygulanır
- **findContours** fonksiyonu kaynak görüntüyü değiştirir modifiye eder. Ayrıca kaynak
  görüntüyü, konturleri bulduktan sonra bile istenirse o başka değişkenler ile saklanır.
  yani saklayın.
- OpenCV'de kontur bulma, siyah zeminden beyaz nesne bulmak gibidir. Hatırlayın,
  bulunması gereken nesne beyaz olmalı ve arka plan siyah olmalı.

İkili görselin konturlerini nasıl bulacağımıza bakalım.

```python
import numpy as np
import cv2
im = cv2.imread('test.jpg')
imgray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(imgray, 127, 255, 0)
image, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
```

`cv2.findContours()` fonksiyonunda 3 tane argüman olduğunu görmüşsünüzdür, bunlar

- Kaynak resim
- Kontur alma modu \( contour retrieval mode \)
- Kontur yaklaşım yöntemi \( contour approximation method \)

ve görselde ki konturler ve hiyerarşı çıkartılıyor.

konturler görsel içindeki bütün konturlerin python listesidir. Her bir kontur nesnenin
sınır noktalarının \(x,y\) kordinatlarının numpy dizisidir.

### Konturleri Nasıl Çizeriz ?

Konturleri çizmek için `cv2.drawContours` fonksiyonu kullanılır. Bu fonksiyon ayrıca
sınır noktaları verilen herhangi bit şeklin çiziminide destekler.

- İlk argüman kaynak resim \( source image \)
- İkinci argüman bir Python listesi olarak geçmesi gereken contours
- Üçüncü argüman konturlerin dizinidir \( bir kontur çizildiğinde kullanışlıdır. Bütün
  konturleri çizmek için, pass-1\) ve geriye kalan argümanlar color \( renk \) thickness
  \( kalınlık \) vb.

Bir resmin bütün konturlerini çizmek

`img = cv2.drawContours(img, contours, -1, (0,255,0), 3)`

Bir kontur çizmek için, 4. konturu söyle \( say 4th contour \):

`img = cv2.drawContours(img, contours, 3, (0,255,0), 3)`

Ama çoğu zaman, aşağıdaki yöntem yararlı olacaktır:

```python
cnt = contours[4]
img = cv2.drawContours(img, [cnt], 0, (0,255,0), 3)
```

Not : Son iki yöntem aynıdır, ancak ilerlediğinizde, sonuncusunun daha yararlı olduğunu
göreceksiniz.

### Kontur Yaklaşım Yöntemi

> Contour Approximation Method

Bu üçüncü argüman olan `cv2.findContours` fonksiyonudur peki aslında bu nedir ?

Yukarıda, kontürlerin aynı yoğunlukta bir şeklin sınırları olduğunu söyledik. Bir şeklin
sınırını \(x, y\) koordinatları saklar. Ancak bütün koordinatları saklıyor mu? İşte bu
saklanacak olan konturleri yaklaştırma metodu ile bulunur.

Eğer `cv2.CHAIN_APPROX_NONE` değerini es \( pass \) geçerseniz, bütün sınır noktaları
depolanır. Ancak aslında bütün noktalara ihtiyacınız varmı dır. Örneğin düz bir çizginin
konturunu buldunuz. Bunu temsil etmek için çizgideki bütün noktalara ihtiyacınız varmı ?
Hayır o çizginin sadece iki bitiş noktasına ihtiyacınız vardır.
`cv2.CHAIN_APPROX_SIMPLE` bu ne yapar. Gereksiz tüm noktaları kaldırır ve konturu
sıkıştırır, böylece belleği kurtarır.

Aşağıdaki dikdörtgen görüntüsü bu tekniği göstermektedir. Kontur dizideki tüm
koordinatların üzerine bir daire çizer \(mavi renkle çizilmiş\). İlk resim, cv2 ile elde
ettiğim noktaları \( points \) gösteriyor. `CHAIN_APPROX_NONE` \(734 nokta \( points
\)\) ve İkinci resim, `cv2.CHAIN_APPROX_SIMPLE` \(yalnızca 4 nokta\) içeren bir resim
gösterir. Bu şekilde hafızadan kazanmış oluyoruz.

![opencv Konturler](https://www.coogger.com/media/images/konturler.jpg?style=center)

## Kontur Özellikleri

### Hedefler

- Konturlerin farklı özelliklerini bulacağız alan, çevre, ağırlık merkezi, sınırlayıcı
  kutu vb gibi.
- Konturler ile ilgili bir çok fonksiyon göreceğiz.

Çevrilmeye kalınan yer;
[https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.html](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.html)
