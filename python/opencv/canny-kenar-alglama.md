# Canny Kenar Algılama

## Hedefler

* Canny kenar algılama kavramı
* Bunun işlem için OpenCV fonksiyonlarından : `cv2.Canny()`

## Teori

Canny kenar algılama algoritması popüler olan bir kenar algılama algoritmasıdır. 1986 yılında **John F. Canny** tarafından geliştirilmiştir. Bu çok aşamalı bir algoritmadır ve biz hepsini öğreneceğiz.

### Kirlilik Azaltma

Kenar tespiti görüntüdeki kirliliğe karşı hassas olduğu için, ilk adım görüntüdeki kirliliği 5x5 Gaussian filter ile kaldırmaktır. Bunu daha önceki bölümlerde zaten gördük.

### Görüntünün Yoğunluk Gradyanını Bulma

Düzeltilmiş görüntü yatay yönde ![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/435f8877ff8b95bab1e4f3bd435524ffee5c14e6.png) ve dikey yönde ![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/8bc80afcfda0a10c756110ee5b0dfdfa5c137392.png) birinci türev elde etmek için yatay ve dikey yönde bir Sobel çekirdeğiyle filtrelenir. Bu iki resimden, her piksel için kenar eğimini ve yönünü aşağıdaki gibi bulabilirsiniz:

![canny-kenar-alglama](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/fc9752466c9c38d07985d62e86946489e23c61e2.png?style=center)

Gradyan yönü \( Gradient direction \) her zaman kenarlara diktir. Dikey, yatay ve iki diyagonal yönde dört açıdan birine yuvarlanır.

### Maksimum Olmayan Bastırma \( Non-maximum Suppression \)

Eğim büyüklüğü ve yönünü aldıktan sonra, kenar oluşturmayan istenmeyen pikselleri kaldırmak için görüntünün tam bir taraması yapılır. Bunun için, her pikselde, pikselin gradyan yönündeki komşusundan yerel bir maksimum olup olmadığı kontrol edilir. Aşağıdaki görüntüyü kontrol edin:

![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/nms.jpg?style=center)

A noktası kenarındadır \(dikey yönde\). Gradyan yönü kenarın normalidir. B ve C noktası gradyan yönündedir. Böylece, nokta A, yerel maksimum oluşturup oluşturmadığını görmek için B ve noktaları ile kontrol edilir. Eğer öyleyse bir sonraki aşamada kabul edilir, aksi takdirde baskı yapılır \(sıfıra getirilir\). Kısacası elde ettiğiniz sonuç, "ince kenarlar" içeren bir ikili görüntüdür.

### Histerik Eşik \( Hysteresis Thresholding \)

Bu aşamada tüm kenarların gerçek bir kenar olup olmadığı kontrol edilir. Bunun için, iki eşik değer olan minVal \( minimum değer \) ve maxVal'ye \( maksimum değer \) ihtiyacımız var. Yoğunluk gradyantı maxVal \( maksimum değer \) 'dan daha fazla olan kenarların kesinlikle kenardır ve minVal \( minimum değer \)'ın altındaki kenarların ise gerçek kenar olmayacağından emin olunur, bu işlem bu şekilde geçilir. Bu iki eşik değeri \( maksimum ve minimum \) ile sınıflandırılır. Onlar gerçek kenar piksellerine bağlı ise kenarların bir parçası olarak kabul edilir ve diğer leri yani kenar olmayanlar atılır. Aşağıdaki görüntüye bakın.

![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/hysteresis.jpg?style=center)

A kenarı, "kesin kenar" olarak kabul edilen maxVal'ın üstündedir. Kenar C, maxVal'ın altında olmasına rağmen, kenar A'ya bağlıdır, böylece geçerli kenar olarak da düşünülür ve bu tam eğri elde edilir. Fakat Kenar B, minVal'ın üstünde ve Kenar C ile aynı bölgede olmasına rağmen, herhangi bir "kesin-kenara" bağlı değildir, böylece bu çıkartılır. Dolayısıyla doğru sonuca ulaşmak için minVal ve maxVal değerlerini buna göre seçmemiz çok önemlidir.

Bu aşama, kenarların uzun çizgiler olduğu varsayımıyla küçük piksel kirliliği çıkartır.

Dolayısıyla nihayetinde elde ettiğimiz, görselde güçlü kenarlar kalır.

## OpenCV'de Canny Kenar Algılama

Opencv yukarıda işin teorik kısmında bahsettiğimiz olayları `cv2.Canny()` fonksiyonu ile yapar. Şimdi bu fonksiyonun nasıl kullanacağımızı göreceğiz.

* ilk parametremiz girdi argümanı yani görselimizdir.
* ikinci ve
* üçüncü parametreler sırası ile minimum ve maksimum değerlerdir.
* dördüncü argüman, **aperture\_size**'dir. Resim gradyanları bulmak için kullanılan Sobel çekirdeği boyutudur. Varsayılan olarak 3'tür.
* Son argüman, gradyan büyüklüğünü bulma denklemini belirten **L2gradient**'tir. Doğruysa, yukarıda belirtilen doğru denklemi kullanır, aksi takdirde bu işlevi kullanır: ![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/559f1d19fb3ffb98feccf9e5931edc0f73e1f26e.png?style=center)

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('messi5.jpg',0)
edges = cv2.Canny(img,100,200)
plt.subplot(121),plt.imshow(img,cmap = 'gray')
plt.title('Original Image'), plt.xticks([]), plt.yticks([])
plt.subplot(122),plt.imshow(edges,cmap = 'gray')
plt.title('Edge Image'), plt.xticks([]), plt.yticks([])
plt.show()
```

#### Sonuç;

![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/canny1.jpg?style=center)

