### Hedefler
- Piksel değerlerine erişme ve bunları değiştirme
- Resim özelliklerine erişme
- Resim Bölgesini ( alanını ) Ayarlama (ROI)
- Görüntüleri Bölme ve Birleştirme

> Bu bölümdeki hemen hemen tüm işlemler esas olarak **OpenCV** yerine **Numpy** ile ilgilidir. **OpenCV** ile daha iyi optimize edilmiş kod yazmak için **Numpy**'nin iyi bir bilgisi gereklidir.

## Piksel değerlerine erişme ve değiştirme
Önce bir renkli resim yükleyelim:

```python
>>> import cv2
>>> import numpy as np

>>> img = cv2.imread('messi5.jpg')
```

Bir piksel değerine satır ve sütun koordinatlarıyla erişebilirsiniz.BGR görüntüsü için, Mavi, Yeşil, Kırmızı değerlerin bir dizisini döndürür.Gri tonlamalı görüntü için yalnızca karşılık gelen yoğunluk döndürülür.

```python
>>> px = img[100,100]
>>> print(px)
[157 166 200]

# sadece mavi pix'ele erişim
>>> blue = img[100,100,0]
>>> print(blue)
157
```

Piksel değerlerini aynı şekilde değiştirebilirsiniz.

```python
>>> img[100,100] = [255,255,255]
>>> print(img[100,100])
[255 255 255]
```

#### Uyarı
>Numpy, hızlı dizi hesaplamaları için optimize edilmiş bir kütüphanedir. Bu nedenle her piksel değerine erişmek ve onu değiştirmek çok yavaş olacaktır

#### Not
>Yukarıda bahsedilen yöntem normalde dizinin bir bölgesini seçmek için kullanılır, örneğin ilk 5 sıra ve son 3 sütun buna benzer. Tek tek piksel erişimi için, Numpy dizi yöntemleri, array.item () ve array.itemset () daha iyi kabul edilir. Fakat her zaman bir skala döndürür. Bu nedenle, tüm B, G, R değerlerine erişmek istiyorsanız, array.item () öğesini her biri için ayrı ayrı çağırmanız gerekir.

Daha iyi piksel erişme ve düzenleme yöntemi:

```python
# kırmızı( RED ) değerine erişme
>>> img.item(10,10,2)
59
# kırmızı (RED) değeri değiştirme
>>> img.itemset((10,10,2),100)
>>> img.item(10,10,2)
100
```

## Resim Özelliklerine Erişme
Görüntü özellikleri, satır sayısı, sütun ve kanallar, resim verileri türü, piksel sayısı vb. Içerir.

Görüntünün şekline **img.shape** tarafından erişilir. Birkaç satır, sütun ve kanal sayısı döndürür (resim renk ise )

```python
>>> print(img.shape)
(342, 548, 3)
```

#### Not
> Resim gri tonlamalıysa, döndürülen tuple yalnızca birkaç satır ve sütun içerir. Bu nedenle, yüklenen görüntünün gri tonlamalı mı yoksa renkli görüntü olup olmadığını kontrol etmek için iyi bir yöntemdir.

Toplam piksel sayısına **img.size** ile erişilebilir.

```python
>>> print(img.size)
562248
```

resim veri türü **image.dtype** tarafından elde edilir:

```python
>>> print(img.dtype)
uint8
```

#### Not

> Hata ayıklarken img.dtype çok önemlidir, çünkü OpenCV-Python kodların da çok sayıda geçersiz veri türünden kaynaklanan hata vardır.

## Image ROI
Bazen, belirli görüntü parçaları ile oynamak zorunda kalacaksınız.Görüntülerde göz algılaması için önce görüntünün yüz algılama işlemini yapın, daha sonra yüz bölgesi içinde gözler aranır. Bu yaklaşım göz bulma doğruluğunu artırır.

Burada topu seçip resmin başka bir bölgesine kopyalayacağım:
```python
>>> ball = img[280:340, 330:390]
>>> img[273:333, 100:160] = ball
```

<img general="center br-2" title="opencv" src="https://www.coogger.com/media/images/opencv.jpg">

## Görüntü Kanallarının Ayrılması ve Birleştirilmesi
Gerektiğinde bir görüntünün  B, G,R kanalları, tek tek düzlemlerine ayrılabilir. Sonra, bireysel kanallar yine BGR görüntüsünü oluşturmak üzere bir araya birleştirilebilir.
```python
>>> b,g,r = cv2.split(img)
>>> img = cv2.merge((b,g,r))
# veya
>>> b = img[:,:,0]
# Diyelim ki, tüm kırmızı pikselleri sıfırlamak istiyorsan,
# bunu yapmana gerek yok. Daha hızlı olan Numpy'i kullanabilirsiniz.

>>> img[:,:,2] = 0
```
#### Not

> **cv2.split()** uzun sğren bir işlemdir , bu nedenle yalnızca gerekirse kullanın. **Numpy** çok daha verimlidir.

## Resimler için Sınırlar Oluşturma (Padding)
Görüntünün etrafında, fotoğraf çerçevesi gibi bir çerçeve oluşturmak istiyorsanız **cv2.copyMakeBorder()** işlevini kullanabilirsiniz. Ancak konvolüsyon işlemi, sıfır doldurma vb. Için daha fazla uygulama vardır. Bu işlev aşağıdaki argümanları alır:

- ***src*** - input image ( resim girdisi )
- ***top, bottom, left, right*** - üst, alt, sol, sağ kenarlık genişliği ilgili yöndeki piksel sayısına göre
- ***borderType*** - Hangi sınırın ekleneceğini tanımlayan kısım. Şu türlerden biri olabilir:
- ***cv2.BORDER_CONSTAN***T - Sabit renkli bir kenarlık ekler. Değer sonraki argüman olarak verilmelidir.
- ***cv2.BORDER_REFLECT*** -Kenarlık, sınır öğelerinin ayna yansıması olacaktır bunun gibi: fedcba | abcdefgh | hgfedcb
- ***cv2.BORDER_REFLECT_101 or cv2.BORDER_DEFAULT*** - Yukarıdakiyle aynı, ancak şu şekilde hafif bir değişiklikle: gfedcb | abcdefgh | gfedcba
- ***cv2.BORDER_REPLICATE*** - Son öğe, şu şekilde çoğaltılır: aaaaaa | abcdefgh | hhhhhhh
- ***cv2.BORDER_WRAP*** -Açıklayamıyorum, şuna benzeyecektir: cdefgh | abcdefgh | abcdefg
- ***value*** - Kenarlık türünün cv2.BORDER_CONSTANT olması durumunda kenarlık rengi

Daha iyi anlamak için tüm bu kenarlık türlerini gösteren örnek bir kod aşağıdadır:
```python
import cv2
import numpy as np
from matplotlib import pyplot as plt

BLUE = [255,0,0]

img1 = cv2.imread('opencv_logo.png')

replicate = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REPLICATE)
reflect = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REFLECT)
reflect101 = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_REFLECT_101)
wrap = cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_WRAP)
constant= cv2.copyMakeBorder(img1,10,10,10,10,cv2.BORDER_CONSTANT,value=BLUE)

plt.subplot(231),plt.imshow(img1,'gray'),plt.title('ORIGINAL')
plt.subplot(232),plt.imshow(replicate,'gray'),plt.title('REPLICATE')
plt.subplot(233),plt.imshow(reflect,'gray'),plt.title('REFLECT')
plt.subplot(234),plt.imshow(reflect101,'gray'),plt.title('REFLECT_101')
plt.subplot(235),plt.imshow(wrap,'gray'),plt.title('WRAP')
plt.subplot(236),plt.imshow(constant,'gray'),plt.title('CONSTANT')

plt.show()
```
Aşağıdaki sonuca bakın, ( Resim **matplotlib** ile gösterilir, böylece KIRMIZI ve MAVİ'ler değiş tokuş olur );

<img general="center br-4" title="opencv" src="https://www.coogger.com/media/images/opencv_5MHKX6N.jpg">
