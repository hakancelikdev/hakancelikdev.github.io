# Histogramlar

## Histogramlar - 1: Find, Plot, Analyze

> \( Histograms - 1 : Find, Plot, Analyze \)
>
> ### Hedefler

- `OpenCV`ve `Numpy` fonksiyonlarını kullanarak histogramları bulma.
- `OpenCV`ve `Numpy` fonksiyonlarını kullanarak histogramları çizme
- Bu fonksiyonları göreceksiniz : `cv2.calcHist()`, `np.histogram()` vs.

### Teori

Histogram nedir ? Bir görüntünün yoğunluk dağılımını veren, grafik veya çizim olarak
düşünebilirsiniz, Bu çizim 0 dan 255 pixel aralığında bulunan \( her zaman değil \) x
ekseni içindeki ve

Bu sadece görselleri anlamamızı sağlayan başka bir yoldur. Bir görselin histogramı
incelendiğinde

bu görüntünün kontrast, parlaklık, yoğunluk dağılımı vb. ile ilgili bir önsezi
alırsınız. Günümüzde neredeyse bütün görsel işleme araçlarında histogram özellikleri
sağlanmaktadır.

Aşağıda Cambridge color websitesinden bir görsel var ve daha fazla bilgi için siteyi
ziyaret etmenizi tavsiye ederim.

![opencv-histogram](https://www.coogger.com/media/images/opencv-histogram.jpg?style=center)

Görseli ve onun histogramını görebilirsiniz \( hatırlayın histgoram **grayscale**
görsel, renk olmandan çizilir \).

Görselde histogramın sol bölgesinde daha koyu pikseller görünür ve sağ bölgesinde ise
daha parlak pikseller görünür.

Histogramdan, daha koyu alanları aydınlık alanlardan daha fazla olduğunu görebilirsiniz,
ve orta tonların miktarı \(orta aralıktaki piksel değerleri, örneğin 127 civarında\) çok
daha azdır.

### Histogramları Bulmak

Şimdi histogramın ne olduğu öğrendik ve histogramın nasıl bulacağınıza öğrenmeye
geçebiliriz. Hem **OpenCV** hem de **Numpy** kütüphanelerini kullanarak bunu yapacağız.

#### 1. OpenCV ile Histogram Hesaplama

Şimdi `cv.calcHist()` fonksiyonunu kullanarak histogram bulacağız.

`cv.calcHist(images, channels, mask, histSize, ranges[, hist[, accumulate]])`

- images \( görseller \) : Bu uint8 or float32 tipli \( formatlı \) kaynak görüntüdür,
  köşeli parantez içinde, yani "\[img\]" şeklinde verilmelidir.
- channels \( kanallar \): Ayrıca köşeli parantez içinde verilmiştir. Histogramı
  hesapladığımız kanalın indeksidir. Örneğin, verilen görsel gri tonlamalı resim ise
  değeri \[0\] dır. Renkli görsel için, mavi, yeşil veya kırmızı kanalının histogramını
  hesaplamak için \[0\],\[1\] veya \[2\] 'i pas \(pass \) geçebilirsiniz.
- mask \( maske \) : maske görseli. Bütün görselin histogramını bulmak için None olarak
  verilir.
- histSize: BIN sayısını temsil eder. Köşeli ayraçlar halinde verilmelidir. Tam ölçek
  için, \[256\] verilir.
- ranges \( aralık \): bu bizim aralığımızdır. Normalde \[0,256\].

evet kolay bir örnek ile başlayalım. Basit gri modda bir resim yükleyelim ve bütün
histogramlarını bulalım.

```python
img = cv.imread('home.jpg',0)
hist = cv.calcHist([img],[0],None,[256],[0,256])
```

hist 256x1 boyutlu bir dizidir, her değer ilgili piksel değere sahip o görüntünün piksel
sayısına karşılık gelir.

#### 2. Numpy ile Histogram Hesaplama

Numpy ayrıca bu fonksiyonu sağlar `np.histogram()`. yani `calcHist()` fonksiyonu yerine
aşağıdaki kodu kullanabilirsiniz.

`hist,bins = np.histogram(img.ravel(),256,[0,256])`

hits daha önce hesapladığımız değeri ile aynıdır. Fakat bins \( kutu \#bilmiyorum \) 257
element \( öğe \) alır, çünkü Numpy 0-0.99, 1-1.99, 2-2.99 vb bins değerleri hesaplar.
Son aralık 255-255.99 olurdu.

Bunu temsil etmek için, bins 256 eklenir. Fakat bizim buna 256'ya ihtiyacımız yoktur.
maksimum \( upto\) 255 değeri yeterlidir.

**Ayrıca:**

Numpy'de bulunan `np.histogram()` dan daha hızlı olan \(10X katı \) diğer bir fonksiyon
vardır `np.bincount()` Tek boyutlu histogramlar için daha iyisini deneyebilirsiniz.
np.bincount minlength = 256 olarak ayarlamayı unutmayın.

Örneğin,

`hist = np.bincount (img.ravel (), minlength = 256)`

#### Not :

Opencv fonksiyonu np.histogram\(\) fonksiyonundan 40 kat daha hızlıdır bu yüzden opencv
kullanın

şimdi histogramları çizebiliriz fakat nasıl ? tabiki Matplotlib ile

### Histogramları Çizmek

> bunun iki yolu vardır

- Kısa yol **Matplotlib** ile
- Uzun yok **opencv** çizim fonksiyonları ile

#### 1- Matplotlib ile Çizim

Matplotlib, histogram çizim fonksiyonu ile gelir: `matplotlib.pyplot.hist()`

Bu fonksiyon doğrudan histogramı bulur ve çizer. Histogramı bulmak için `calcHist()`
veya `np.histogram()` fonksiyonlarını kullanmanız gerekmez.

Aşağıdaki kodu inceleyin:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt
img = cv.imread('home.jpg',0)
plt.hist(img.ravel(),256,[0,256]); plt.show()
```

![opencv-histogram](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/histogram_matplotlib.jpg?style=center)

Ya da BGR için daha iyi olan matplotlib'in normal grafiğini kullanabilirsiniz . Bunun
için önce histogram verilerini bulmanız gerekir.

Aşağıdaki kodu deneyin:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt
img = cv.imread('home.jpg')
color = ('b','g','r')
for i,col in enumerate(color):
    histr = cv.calcHist([img],[i],None,[256],[0,256])
    plt.plot(histr,color = col)
    plt.xlim([0,256])
plt.show()
```

Sonuç:
![histogram](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/histogram_rgb_plot.jpg?style=center)

Yukarıdaki grafikten, mavinin görüntüde yüksek değerli bazı alanlar bulunduğunu
düşebilirsiniz \(tabii ki gökyüzünden kaynaklanmaktadır\)

#### 2- Opencv Kullanarak Çizmek

Burada, histogramların değerlerini bin değerleri ile birlikte x ve y koordinatlarına
göre ayarlayarak yukarıda aynı görüntüyü oluşturmak üzere `cv.line()` veya
`cv.polyline()` işlevini kullanarak çizebilirsiniz.

**Mask'ın Uygulanması**

Bütün resmin histogramını bulmak için `cv.calcHist()` fonksiyonunu kullanırız. Peki
belirli bir alanın histogramını bulmak istersek ne yapacağız. Sadece histogramını bulmak
istediğiniz alanın beyaz rengi ile mask \( maske \) görüntüsünü yaratın ve aksi takdirde
siyah koyu.

```python
img = cv.imread('home.jpg',0)
# maske yarattık
mask = np.zeros(img.shape[:2], np.uint8)
mask[100:300, 100:400] = 255
masked_img = cv.bitwise_and(img,img,mask = mask)
# Histogramı maskeli ve maskesiz olarak hesapladık
# Maske için üçüncü argümanı kontrol ettik
hist_full = cv.calcHist([img],[0],None,[256],[0,256])
hist_mask = cv.calcHist([img],[0],mask,[256],[0,256])
plt.subplot(221), plt.imshow(img, 'gray')
plt.subplot(222), plt.imshow(mask,'gray')
plt.subplot(223), plt.imshow(masked_img, 'gray')
plt.subplot(224), plt.plot(hist_full), plt.plot(hist_mask)
plt.xlim([0,256])
plt.show()
```

![histogram](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/histogram_masking.jpg?style=center)

### Ek Kaynak

- [Cambridge in Color website](http://www.cambridgeincolour.com/tutorials/histograms1.htm)

## Histogramlar - 2: Histogram Eşitleme

> \( Histograms - 2: Histogram Equalization \)

### Hedefler;

Histogram eşitleme kavramlarını öğreneceğiz ve resimlerimizin karşıtlığını geliştirmek
için kullanacağız.

çeviride kalınan yer ;
[https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_histograms/py_histogram_equalization/py_histogram_equalization.html](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_histograms/py_histogram_equalization/py_histogram_equalization.html)
