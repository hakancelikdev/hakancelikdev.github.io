# Opencv'de Çizim Fonksiyonları

### Hedefler

- OpenCV ile farklı geometrik şekilleri çizmeyi öğreneçeğiz
- Bu fonksiyonları öğreneceğiz: **cv2.line \(\)**, **cv2.circle \(\)**, **cv2.rectangle
  \(\)**, **cv2.ellipse \(\)**, **cv2.putText \(\)** vb.

### Kod

Yukarıdaki tüm fonksiyonlarda , aşağıda verilen şekilde ortak argümanlar göreceksiniz.

**img** : şekilleri çizmek istediğiniz görüntü **color** : şeklin rengi. BGR için tuble
olarak geçer örneğin mavi için \(255,0,0\) , gri tonlama için sadece sayısal değeri
geçin. **thickness** : çizgi veya çemberin kalınlığı, örneğin çevreler gibi kapalı
şekiller için -1 geçerliyse şekli dolduracaktır. varsayılan kalınlık = 1 dir
**lineType** : çizginin tipi, 8 bağlantılı, kenar yumuşatma hattı vb. Varsayılan olarak,
8 bağlantılı. cv2.LINE_AA, eğriler için harika görünen kenar yumuşatma hattı verir.

## Çizgi çizimi

Bir çizgi çizmek için, çizginin başlama ve bitiş kordinatlarını vermeniz gerek. Biz bir
siyah resim yaratacağız ve çizilen mavi çizgiyi sol üst köşeden sağ alt köşeye bir mavi
çizgi çizeriz.

```python
import numpy as np
import cv2

# siyah bir resim yaratıyoruz
img = np.zeros((512,512,3), np.uint8)

# 5 px kalınlığında bir diyagonal mavi çizgi çiziyoruz
img = cv2.line(img,(0,0),(511,511),(255,0,0),5)
```

## Dikdörtgen çizimi

Bir dikdörtgen çizmek için, dikdörtgenin üst-sol köşe ve alt-sağ köşe'sine ihtiyacımız
var. Bu defa resmin üst-sağ köşesinde yeşil bir dikdörtgen çizelim.

```python
img = cv2.rectangle(img,(384,0),(510,128),(0,255,0),3)
```

## Çember çizimi

Bir çember çizmek için, merkez koordinatlarına ve yarıçapına ihtiyacınız var, Yukarıda
çizilen dikdörtgen içine bir daire çizeceğiz.

```python
img = cv2.circle(img,(447,63), 63, (0,0,255), -1)
```

## Elips çizimi

Bir elips çizmek için, bir kaç argümana ihtiyacımız var,

Birinci argüman çizilmek istenilen resimdir, okunan resim dosyası veya okunan video
dosyasının anlık verisidir. ikinci argüman, merkez konumu \(x,y\). üçüncü argüman, eksen
uzunluklarıdır \(büyük eksen uzunluğu, küçük eksen uzunluğu\) **angle\(açı\)**, elipsin
saat yönünün tersine dönme açısıdır **startAngle** ve **endAngle**, elips yayının, ana
eksenden saat yönünde ölçülen başlangıcını ve bitişini belirtir. Yani 0 ve 360 değerleri
verirse, tam elips verir.

Daha fazla ayrıntı için, **cv2.ellipse\(\)** belgelerine bakın. Aşağıdaki örnek,
görüntünün merkezinde yarım elips çizmektedir.

```python
img = cv2.ellipse(img,(256,256),(100,50),0,0,180,255,-1)
```

## Çokgen Çizim

Bir çokgen çizmek için öncelikle köşelerin koordinatlarına ihtiyacınız vardır.Bu
noktaları bir dizi \( array \) şekil haline getirin, köşe sayıları olan satırlar burada
**ROWSx1x2** dir ve **int** türünde olması gerekir.

Burada sarı renkte dört köşeli küçük bir çokgen çiziyoruz.

```python
pts = np.array([[10,5],[20,30],[70,20],[50,10]], np.int32)
pts = pts.reshape((-1,1,2))
img = cv2.polylines(img,[pts],True,(0,255,255))
```

Üçüncü argüman'ı **False** yaparsanız, kapalı bir şekil değil de tüm noktaları
birleştiren bir çokgen alırsınız.

## Resme metin eklemek

Metinleri resimlere yerleştirmek için aşağıdaki şeyleri belirtmeniz gerekir.

Yazmak istediğiniz veri Yazıları yerleştirmek istediğiniz yerin kordinatları Yazı tipi
\( font type \) \(Desteklenen fontlar için cv2.putText \(\) dokümanlarını kontrol edin\)
Yazı tipi Ölçeği \(yazı tipi boyutunu belirtir\) renk, kalınlık, çizgi türü vb. düzenli
şeyler. Daha iyi görünmek için lineType = cv2.LINE_AA önerilir. Şimdi resmimize beyaz
renkte OpenCV yazalım.

```python
font = cv2.FONT_HERSHEY_SIMPLEX # yazı tipimiz
cv2.putText(img,'OpenCV',(10,500), font, 4,(255,255,255),2,cv2.LINE_AA)
# ilk argüman yazı yazmak istediğimiz resim( veri )
# ikincisi yazılacak olan veri
# üçüncü argüman kordinatlar
# dördüncü argüman fontumuz
# altıncı argüman metin rengi
# beşinci ve yedinci argüman kalınlık vs
```

**Sonuç**

![](https://www.coogger.com/media/images/drawing.jpg)
