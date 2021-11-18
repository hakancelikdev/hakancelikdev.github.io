# Görüntüyü Yumuşatma - \( Smoothing Images \)

**Smoothing Images** olarak geçer.

## Hedefler

- Çeşitli düşük geçişli filtrelerle görüntüleri bulanıklaştırma
- Görüntülere özel filitreler uygulamak \(2B kıvrım\)

## 2D Kıvrım \( Resim Filtreleme \)

Tek boyutlu sinyaller olarak, çeşitli düşük geçişli **\(LPF\)** filtreler ile resimler
ayrıca filtrelenebilir, yüksek geçişli filtreler **\(HPF\)** vs. Bir LPF gürültünün
giderilmesinde yardım eder veya resmi bulanıklaştırmada. HPF ise resimlerdeki kenarları
bulmada yardım eder.

Bir resim ile çekirdeği \( kernel \) çevirmek, evirmek vs için OpenCV kütüphanesinde
`cv2.filter2D()` fonksiyonunu vardır. Örnekte görüldüğü gibi, biz resim üzerinde
ortalama filtre deniyoruz. 5x5 ortalama bir filtre çekirdeği bu şekilde tanımlanabilir.

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/220e403e44b16ea8e05d350c4ce69e9aedff5bd1.png?style=center)

Yukarıdaki çekirdek ile filtreleme, aşağıdakilerin gerçekleştirilmesine neden olur. Her
bir pixel, 5x5 bu pixel'in üzerinde ekran ordalıdır, bu pencerenin içine giren bütün
pixel'ler toplanır ve bunun sonucunda 25'e bölünür.Bu, o pencere içindeki piksel
değerlerinin ortalamasının hesaplanmasına denktir. Bu işlem çıktı filtrelenmiş görüntüyü
üretmek için görüntünün tüm pikselleri için gerçekleştirilir. Bu kodu deneyin ve
sonucunu kontrol edin:

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('opencv_logo.png')
kernel = np.ones((5,5),np.float32)/25
dst = cv2.filter2D(img,-1,kernel)
plt.subplot(121),plt.imshow(img),plt.title('Original')
plt.xticks([]), plt.yticks([])
plt.subplot(122),plt.imshow(dst),plt.title('Averaging')
plt.xticks([]), plt.yticks([])
plt.show()
```

**Sonuç;**

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/filter.jpg?style=center)

## Resim Bulanıklaştırma \( Görüntü Yumuşatma \)

Görüntü bulanıklaştırma düşük geçişli filtreler ile resmi evriştirilerek yapılır.Bu
görüntü kirliliğini kaldırmak için iyi bir yöntemdir.Aslında yüksek frekanslı içeriği
\(ör. Gürültü, kenar\) görüntüden kaldırır ve böylece filtre uygulandığında kenarları
bulanık hale getirir.OpenCV, esas olarak dört tür bulanıklaştırma tekniği sunar.

### 1. Averaging \( Ortalama \)

Bu normalize edilmiş kutu filtresi ile resmin evriştirilmesi sonuçu yapılır. Çekirdek
alanı altındaki tüm piksellerin ortalamasını alır ve merkezi öğeyi bu ortalama ile
değiştirir. Bu olay OpenCV de ki `cv2.blur()` ve `cv2.boxFilter()` fonksiyonları ile
yapılır.Çekirdek hakkında daha fazla bilgi edinmek için, çekirdeğin genişlik ve
yüksekliğini belirlemeliyiz 3x3 normalize edilmiş bir kutu filtresi şuna benzer:

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/42f61cdcb41615a23af32b0fd95e674090afdc8d.png?style=center)

> NOT; Eğer normalize edilmesin istiyorsanız cv2.boxFilter\(normalize = False \) demeniz
> yeterli oluyor.

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('opencv_logo.png') # resmi okuduk
blur = cv2.blur(img,(5,5)) # blur filtresi uyguladık
# ve oluşan orjinal ve yeni görüntüyü matplotlib kullanarak ekrana verdik
plt.subplot(121),plt.imshow(img),plt.title('Original')
plt.xticks([]), plt.yticks([])
plt.subplot(122),plt.imshow(blur),plt.title('Blurred')
plt.xticks([]), plt.yticks([])
plt.show()
```

Sonuç;

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/blur.jpg?style=center)

## 2. Gauss Filtreleme

Bu yaklaşım eşit filtre katsayılarından oluşan bir kutu filtresi yerine, bir gauss
çekirdeği kullanır bu işlem `cv2.GaussianBlur()` fonksiyonu kullanılarak yapılır.Tek ve
pozitif olan çekirdeğin yükseklik ve genişliğini belirlemeliyiz. Standart sapmayı da
sırasıyla X ve Y yönlerinde, sigmaX ve sigmaY olarak belirtmeliyiz. Yalnızca sigmaX
belirtilirse, sigmaY sigmaX'e eşit olarak alınır. Her ikisi de sıfır olarak verilirse,
bunlar çekirdek boyutundan hesaplanır. Gauss filtrelemesi, görüntüdeki Gauss gürültüsünü
gidermede oldukça etkilidir. Bu işlemi yapmak için `cv2.getGaussianKernel()`.
fonksiyonunu kullanmalısınız. Yukarda verdiğimiz kodun ilgili yerini sadece bununla
değiştirerek yapılabilir

`blur = cv2.GaussianBlur(img,(5,5),0)`

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/gaussian.jpg?style=center)

## 3. Medyan \( Ortanca \) Filtreleme

Burada, `cv2.medianBlur()` fonksiyonu çekirdek penceresinin altındaki tüm piksellerin
ortanca değerini hesaplar ve orta piksel bu orta değerle değiştirilir. Bu, tuz ve biber
gürültüsünü gidermede son derece etkilidir. Dikkat çekilmesi gereken ilginç bir nokta,
Gauss ve kutu filtrelerinde, merkezi öğe için filtrelenmiş değer, orijinal resimde
bulunmayan bir değer olabilir. Bununla birlikte, medyan filtrelemede bu geçerli
değildir, çünkü merkezi öğe daima görüntüdeki bazı piksel değerleri ile değiştirilir.
Bu, gürültüyü etkili bir şekilde azaltır. Çekirdek boyutu pozitif tek sayıyla olmalıdır.

Bu demoda, orijinal resmimize % 50 gürültü ekliyoruz ve bir medyan filtre kullanıyoruz.
Sonucu kontrol edin:

`median = cv2.medianBlur(img,5)`

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/median.jpg?style=center)

## 4. Bilateral Filtreleme

Not ettiğimiz gibi daha önce gösterdiğimiz filtrelerin kenarlarını bulanıklaştırma
olaylarında. Kenarları korurken gürültünün giderilmesinde oldukça etkili olan ikili
filtre `cv2.bilateralFilter()` için durum böyle değildir. fakat bu işlem, diğerlerine
göre daha yavaş çalışır.

Zaten bir Gauss filtresinin pikselin çevresini aldığını ve Gauss ağırlıklı ortalamasını
bulduğunu gördük. Bu Gauss filtresi yalnızca alanın bir fonksiyonudur; diğer bir
deyişle, filtreleme sırasında yakındaki pikseller dikkate alınır. Piksellerin hemen
hemen aynı yoğunluk değerine sahip olup olmadığına bakmaz ve pikselin bir kenar üzerinde
olup olmadığını düşünmez. Ortaya çıkan sonuç, Gauss filtrelerinin kenarları
bulanıklaştırma eğiliminde olmasıdır, bu istenmeyen bir durumdur.

Bilateral filtre aynı zamanda uzay alanında bir Gauss filtresi kullanır, ancak piksel
yoğunluğu farklılıklarının bir fonksiyonu olan bir tane daha \(çarpımsal\) Gauss filtre
bileşenini kullanır. Uzayın Gauss fonksiyonu, yoğunluk alanına uygulanan Gauss bileşeni
\(yoğunluk farklılıklarının bir Gauss fonksiyonu\) yalnızca piksellerin 'filtreleme
için' uzaysal komşular 'olarak düşünülmesini sağlarken, yoğunluk farklılıklarının bir
Gauss fonksiyonu, sadece merkeze benzer yoğunluklara sahip olan piksellerin bulanık
yoğunluk değerini hesaplamak için piksel \('yoğunluklu komşular'\) dahil edilmiştir.
Sonuç olarak, bu yöntem kenarları korur, çünkü kenarların yakınında bulunan pikseller
için kenarın diğer tarafına yerleştirilen komşu pikseller ve bu nedenle merkez pikselle
karşılaştırıldığında büyük yoğunluk değişiklikleri sergilemek bulanıklaştırma için dahil
edilmez.

Aşağıdaki örnek bilateral filtrelemeyi göstermektedir \(argümanlar hakkında ayrıntılı
bilgi için OpenCV dokümanlarına bakın\).

`blur = cv2.bilateralFilter(img,9,75,75)`

Sonuç;

![](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/bilateral.jpg?style=center)
