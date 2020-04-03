# Resim Eşikleme

> **Image Thresholding**

## Hedefler

* Bu yazımızda basit eşikleme \( thresholding \) uyarlanabilir eşik ve otsu'nun eşiğini öğreneceğiz
* ve bu fonksiyonları öğreneceğiz, **cv2.threshold**, **cv2.adaptiveThreshold**

## Basit eşikleme

Burada sorun doğruca ilerler. Piksel değeri eşik değerinden büyükse, bir değer atanır \(beyaz olabilir\), küçük ise başka bir değere atanır \(siyah olabilir\). Kullanılan fonksiyon `cv2.threshold()` İlk argüman, gri tonlamalı bir resim olması gereken kaynak görüntüdür. İkinci argüman, piksel değerlerini sınıflandırmak için kullanılan eşik değeridir. Üçüncü argüman, piksel değeri eşik değerinden büyük \(bazen daha düşükse\) verilecek değeri temsil eden maxVal değeridir. OpenCV farklı eşik türleri sağlar ve fonksiyonun dördüncü parametresi olarak alır. Bu türler;

* `cv2.THRESH_BINARY`
* `cv2.THRESH_BINARY_INV`
* `cv2.THRESH_TRUNC`
* `cv2.THRESH_TOZERO`
* `cv2.THRESH_TOZERO_INV`

İki çıkış elde edilir, birincisi, daha sonra açıklanacak bir çizgidir. İkinci çıktı eşik değerli imajımızdır.

Kodlar:

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('gradient.png',0) # resmi okuduk , bu gri tonlamalı
# bir resindir
# bütün tipleri kullanarak
# gri skala resmi eşik ayarı yapıyoruz
ret,thresh1 = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
ret,thresh2 = cv2.threshold(img,127,255,cv2.THRESH_BINARY_INV)
ret,thresh3 = cv2.threshold(img,127,255,cv2.THRESH_TRUNC)
ret,thresh4 = cv2.threshold(img,127,255,cv2.THRESH_TOZERO)
ret,thresh5 = cv2.threshold(img,127,255,cv2.THRESH_TOZERO_INV)
titles = ['Original Image','BINARY','BINARY_INV','TRUNC','TOZERO','TOZERO_INV'] # liste tanımlayıp yukarıda yaptığımız eşik ayarlarını ve isimlerini iki farklı listeye atıyoruz
images = [img, thresh1, thresh2, thresh3, thresh4, thresh5]
for i in range(6): # for dögüsü ile orjinal resmi ve değiştirilmiş resmi ekrana vereceğiz
    plt.subplot(2,3,i+1),plt.imshow(images[i],'gray')
    plt.title(titles[i])
    plt.xticks([]),plt.yticks([])
plt.show()
```

> Not; Birden çok görüntüyü çizmek için `plt.subplot()` işlevi kullandık. Daha fazla bilgi için lütfen Matplotlib dokümanlarına göz atın.

bu kodların sonucu şöyle bir çıktı veriri.

![](https://github.com/abidrahmank/OpenCV2-Python-Tutorials/raw/master/source/py_tutorials/py_imgproc/py_thresholding/images/threshold.jpg?style=center)

## Uyarlamalı Eşikleme

Bir önceki bölümde eşik değeri olarak global bir değer kullandık. Fakat görüntünün farklı alanlarda farklı aydınlatma koşullarına sahip olduğu tüm koşullarda iyi olmayabilir. Bu durumda, uyarlanabilir eşik değer almaktayız.Burada, algoritma, resmin küçük bir bölgesi için eşiği hesaplar. Bu nedenle, aynı görüntünün farklı bölgelerinde farklı eşikler elde ediyoruz ve farklı aydınlatmalara sahip görüntüler için daha iyi sonuç vermektedir.

Üç 'özel' giriş parametresi ve yalnızca bir çıkış argümanı vardır.

Uyarlamalı Yöntem - Eşik değerinin nasıl hesaplanacağına karar verir.

* `cv2.ADAPTIVE_THRESH_MEAN_C` : komşuluk alanının ortalama eşik değeridir.
* `cv2.ADAPTIVE_THRESH_MEAN_C` : komşuluk alanının ortalama eşik değeridir.

**Block Size** - Komşuluk alanının boyutunu belirler

**C** - Hesaplanan ortalama veya ağırlıklı ortalamadan çıkarılmış bir sabittir. Aşağıdaki kod parçası, aydınlatma değişikliğine sahip bir görüntü için global eşikleme ve uyarlanabilir eşik değerini karşılaştırır:

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('dave.jpg',0)
img = cv2.medianBlur(img,5)
ret,th1 = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
th2 = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
            cv2.THRESH_BINARY,11,2)
th3 = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,\
            cv2.THRESH_BINARY,11,2)
titles = ['Original Image', 'Global Thresholding (v = 127)',
            'Adaptive Mean Thresholding', 'Adaptive Gaussian Thresholding']
images = [img, th1, th2, th3]
for i in range(4):
    plt.subplot(2,2,i+1),plt.imshow(images[i],'gray')
    plt.title(titles[i])
    plt.xticks([]),plt.yticks([])
plt.show()
```

sonuç

![](https://github.com/abidrahmank/OpenCV2-Python-Tutorials/raw/master/source/py_tutorials/py_imgproc/py_thresholding/images/ada_threshold.jpg?style=center)

## Otsu'nun İkiliği \(  Binarization \)

İlk bölümde, ikinci parametre retVal'ın var olduğunu söyledik. Kullanımı Otsu'nun İki Katmanlaştırması'na gittiğimizde gelir. ne olur peki ?

Global eşiklemede, eşik değeri için keyfi bir değer kullandık, değil mi? Peki seçtiğimiz bir değeri iyi mi, kötü mü biliyor muyuz ? Cevap, deneme yanılma yöntemidir. Ancak bimodal bir görüntü düşünün \(Basit bir deyişle, bimodal görüntü, histogramında iki tepe bulunan bir görüntüdür\). Bu görüntü için yaklaşık olarak bu zirvelerin ortasında bir değer eşik değeri olarak alabiliriz, değil mi? Otsu ikileminin yaptığı şey de budur. Basit bir deyişle, bimodal bir görüntü için görüntü histogramından otomatik olarak bir eşik değeri hesaplar. \(Bimodal olmayan görüntüler için, binaryleme doğru olmayacaktır.\)

Bunun için `cv2.threshold()` fonksiyonu kullanılır, ancak `cv2.THRESH_OTSU` ek bir bayrak geçer. Eşik değeri için, sıfırdan geçmeniz yeterlidir. Ardından, algoritma en uygun eşik değerini bulur ve sizi ikinci çıktı olarak geri getirir, retVal. Otsu eşik değeri kullanılmazsa, RetVal değeri kullandığınız eşik değeriyle aynıdır.

Aşağıdaki örneği inceleyin. Giriş imgesi gürültülü bir görüntüdür. İlk durumda, 127 değerinde küresel eşik değer uyguladım. İkinci durumda, Otsu'nun eşik değerini doğrudan uyguladım. Üçüncü durumda, gürültüyü gidermek için görüntüyü 5x5 gaussian çekirdeğiyle süzdüm, sonra Otsu eşik değeri uyguladım. Gürültünün filtrelemesinin sonucu nasıl geliştirdiğini görün.

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('noisy2.png',0)
# global eşik
ret1,th1 = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
# Otsu's eşiği
ret2,th2 = cv2.threshold(img,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
#  Gaussian flitrelemesinden sonra Otsu'nun eşiği
blur = cv2.GaussianBlur(img,(5,5),0)
ret3,th3 = cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
# tüm görüntüleri ve histogramlarını çiz
images = [img, 0, th1,
          img, 0, th2,
          blur, 0, th3]
titles = ['Original Noisy Image','Histogram','Global Thresholding (v=127)',
          'Original Noisy Image','Histogram',"Otsu's Thresholding",
          'Gaussian filtered Image','Histogram',"Otsu's Thresholding"]
for i in range(3):
    plt.subplot(3,3,i*3+1),plt.imshow(images[i*3],'gray')
    plt.title(titles[i*3]), plt.xticks([]), plt.yticks([])
    plt.subplot(3,3,i*3+2),plt.hist(images[i*3].ravel(),256)
    plt.title(titles[i*3+1]), plt.xticks([]), plt.yticks([])
    plt.subplot(3,3,i*3+3),plt.imshow(images[i*3+2],'gray')
    plt.title(titles[i*3+2]), plt.xticks([]), plt.yticks([])
plt.show()
```

![](https://github.com/abidrahmank/OpenCV2-Python-Tutorials/raw/master/source/py_tutorials/py_imgproc/py_thresholding/images/otsu.jpg?style=center)

