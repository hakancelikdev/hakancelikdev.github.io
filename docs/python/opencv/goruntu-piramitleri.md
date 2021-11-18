# Görüntü Piramitleri

> Image Pyramids

## Hedef

Bu bölümde,

- Görüntü piramitlerini öğreneceğiz
- Biz görüntü piramitleri yeni bir meyve oluşturmak için kullanacağız, "Orapple”
- ve bu fonksiyonları göreceğiz: `cv2.pyrUp()`, `cv2.pyridge()`

## Teori

Normalde, sabit boyutlu bir görüntü ile çalışırdık. Ama bazı durumlarda, aynı görüntünün
farklı çözünürlük görüntüleri ile çalışmak gerekir. Örneğin, bir görüntüde bir şey
ararken yüz gibi, nesnenin görüntüde ne boyutta olabileceğine emin olamayız. Bu durumda
farklı çözünürlük ve tüm görüntülerde nesne aramak için görüntü kümesi oluşturmak
gerekir. Farklı çözünürlüğe sahip bu görüntü kümesine görüntü piramitleri denir \( çünkü
en alttaki en büyük görüntü ve en üstteki en küçük görüntü ile yığında tutuldukları
zaman piramitlere benzer. \).

**İki çeşit görüntü piramidi vardır**

- **Gaussian Pyramid** \( Gauss piramidi \)
- **Laplacian Pyramids** \( Laplacian piramitleri \)

Gaussian piramidi yüksek düzey \( düşük çözünürlük \) düşük düzey \(yüksek çözünürlük\)
resim \( görüntü \)deki ardışık satır ve sütunları kaldırarak oluşturulur. Daha sonra
daha yüksek düzeydeki her piksel Gauss ağırlıkları ile temel düzeyde 5 pikselden gelen
katkıyla oluşur.

Bunu yaparak bir , **M x X** görüntüsü **M/2 x N/2** görüntüsü olur.

Yani alan orijinal alanın dörtte birine düşer. Buna oktav \( Octave \) denir. Biz
piramidin daha altına giderek \( yani çözünürlük azalır \) aynı desen devam eder. Benzer
şekilde genişlerken, alan her düzeyde 4 kez olur. Gauss piramitlerini `cv2.pyrDown()` ve
`cv2.pyrUp()` functions fonksiyonlarını kullanarak bulabiliriz.

```python
img = cv2.imread('messi5.jpg')
lower_reso = cv2.pyrDown(higher_reso)
```

Aşağıda bir görüntü piramidinde 4 seviyedir.

![görüntü-piramitleri](https://www.coogger.com/media/images/opencv_messi.jpg?style=center)
Şimdi görüntü piramitlerinin aşagısına inebiliriz `cv2.pyrUp()` fonksiyonu ile.
`higher_reso2 = cv2.pyrUp(lower_reso)`

Unutmayın, `higher_reso2` `higher_reso` eşit değildir, çünkü çözünürlüğü düşürdükten
sonra bilgiyi kaybedersin. Aşağıda görüntü önceki durumda en küçük görüntüden
oluşturulan piramit 3 düzey aşağıdır. Orijinal görüntü ile karşılaştırın.

![opencv](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/messiup.jpg?style=center)
Laplacian piramitleri Gauss piramitlerinden oluşur. Bunun için özel bir işlev yoktur.
Laplacian Piramidi görüntüleri sadece kenar görüntüleri gibidir. Elementlerin çoğu
sıfırdır. Görüntü sıkıştırmasında kullanılırlar. Laplacian piramidinde bir seviye Gauss
piramidindeki bu seviye ile Gauss piramidindeki üst seviyesinin genişletilmiş versiyonu
arasındaki fark ile oluşur. Bir Laplacian düzeyi üç düzeyleri aşağıdaki gibi görünür.
\(kontrast içeriğini geliştirmek için ayarlanır gibi görünecektir\):

![görüntü piramitleri](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/lap.jpg?style=center)

## Piramitleri Kullanarak Görüntü Karıştırma

Görüntü karşılaştırma piramitlerin bir uygulamasıdır. Örneğin, görüntü dikiminde iki
görüntüyü bir araya getirmeniz gerekir, ancak görüntüler arasındaki kesintiler nedeniyle
iyi görünmeyebilir. Bu durumda, piramitler ile karıştırma görüntülerde çok fazla veri
bırakmadan sorunsuz karıştırma sağlar. Bunun klasik bir örneği iki meyvenin, portakal ve
elma karışımıdır. Şimdi ne söylediğimi anlamak için sonuca bakın.
![orapple](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/orapple.jpg?style=center)
Lütfen ek kaynakları ve referansları kontrol edin ,bu görüntü karıştırma, Laplacian
Piramitleri vb tam diagramatik ayrıntıları vardır Basitçe şöyle yapılır.

- Elma ve portakal olan iki resim yüklenir.
- Elma ve portakal için Gauss piramitleri bulunur.
- Gauss piramitlerinden Laplacian piramitlerini bulunur.
- Şimdi Laplacian piramitlerinin her kademesinde elma ve turuncu sağ yarısı sol yarısı
  katılır.
- Sonunda bu ortak görüntü piramitlerinden, orijinal görüntüyü yeniden oluşturun.

Aşağıda tam kodu var. \(Basitlik uğruna, her adım ayrı ayrı yapılır, daha fazla bellek
alabilir. Eğer isterseniz optimize edebilirsiniz\).

```python
import cv2
import numpy as np,sys
A = cv2.imread('apple.jpg')
B = cv2.imread('orange.jpg')
# A için Gaussian piramidi oluşturuluyor
G = A.copy()
gpA = [G]
for i in xrange(6):
    G = cv2.pyrDown(G)
    gpA.append(G)
# B için Gaussian piramidi oluşturuluyor
G = B.copy()
gpB = [G]
for i in xrange(6):
    G = cv2.pyrDown(G)
    gpB.append(G)
# A için Laplacian piramidi oluşturuluyor
lpA = [gpA[5]]
for i in xrange(5,0,-1):
    GE = cv2.pyrUp(gpA[i])
    L = cv2.subtract(gpA[i-1],GE)
    lpA.append(L)
# B için Laplacian piramidi oluşturuluyor
lpB = [gpB[5]]
for i in xrange(5,0,-1):
    GE = cv2.pyrUp(gpB[i])
    L = cv2.subtract(gpB[i-1],GE)
    lpB.append(L)
# Şimdi her düzeyde görüntünün sol ve sağ yarısı eklenir
LS = []
for la,lb in zip(lpA,lpB):
    rows,cols,dpt = la.shape
    ls = np.hstack((la[:,0:cols/2], lb[:,cols/2:]))
    LS.append(ls)
# şimdi yeniden yapılandıralım
ls_ = LS[0]
for i in xrange(1,6):
    ls_ = cv2.pyrUp(ls_)
    ls_ = cv2.add(ls_, LS[i])
# Her yarım direkt bağlantı ile görüntü
real = np.hstack((A[:,:cols/2],B[:,cols/2:]))
cv2.imwrite('Pyramid_blending2.jpg',ls_)
cv2.imwrite('Direct_blending.jpg',real)
```

### Ek kaynak :

[Image Blending \( görüntü karşılaştıma \)](http://pages.cs.wisc.edu/~csverma/CS766_09/ImageMosaic/imagemosaic.html)
