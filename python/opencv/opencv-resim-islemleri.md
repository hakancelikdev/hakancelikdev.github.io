# Opencv Resim Işlemleri

## Resim dosyasını okuma

Resim dosyasını okumak için **cv2.imread\(\)** fonksiyon kullanılır ve iki arguman alır.

- birincisi okunmak istenilen dosya ismi veya tam yolu
- ikicisi ise dosyanın nasıl okunması gerektiğidir ikinci argüman 3 değer alabilir
  bunlar
  - **cv2.IMREAD_COLOR** varsayılan olarak gelir renkli çıktı verir
  - **cv2.IMREAD_GRAYSCALE** gri modda okur
  - **cv2.IMREAD_UNCHANGED** alfa kanalı olarak okur

örnek kod:

```python
import cv2
import numpy as np

# resmi gri modda okuttuk
img = cv2.imread('messi5.jpg',0)
```

## Resmi görmek

**cv2.imshow\(\)** resmi görmek için kullanılan fonksiyondur, işlemler sonrası
yaptığınız değişiklikleri bunun ile görebilirsiniz,iki argüman alır

- açılacak olan pencerenin ismi \( her pencere ismi farklı olmalı \)
- gösterilecek olan resim

```python
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

**cv2.waitKey\(\)** klavye olaylarını dinleyen fonksiyondur, aldığı argüman mili saniye
cinsindedir, klavyede herhangi bir zamanda herhangi bir tüşa basılırsa program kaldığı
yerden devam etmesini sağlar,

eğer 0 geçilirse, bir tuş vuruşu için süresiz olarak bekler. Ayrıca, a tuşu basılırsa,
aşağıda tartışacağımız gibi belirli tuş vuruşlarını algılamak için de ayarlanabilir.

**cv2.destroyAllWindows\(\)** oluşan ekranları kapatmamızı sağlayan fonksiyondur,
kapatmak istediğiniz bir pencere ismini vererekte kapanmasını sağlayabilirsiniz.

```python
cv2.namedWindow('image', cv2.WINDOW_NORMAL)
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

## Resmi kaydetme

**cv2.imwrite\(\)** bu fonksiyon ile değişiklik yaptığımız resim dosyalarını kayıt
edebiliriz,iki argüman alır

- kayıt edilecek olan resim dosyasının ismi \( isim girilirse bulunduğu dizine kayıt
  edilir,tam yol girilirse yola kayıt edilir \)
- kayıt edilecek olan resim

```python
cv2.imwrite('messigray.png',img)
png formatında bulunduğu dizine kayıt edilir
```

Özet olarak Aşağıdaki kod parçası resmi gri modda yükler,pencere açarak görüntüler eğer
s harfine basılırsa kayıt eder ve çıkar veya esc basılırsa kayıt etmeden çıkar.

```python
import cv2
import numpy as np

img = cv2.imread('messi5.jpg',0)
cv2.imshow('image',img)
k = cv2.waitKey(0)
if k == 27:         # esc ye basılırsa çıkış yapar
    cv2.destroyAllWindows()
elif k == ord('s'): #s harfine basılırsa
    cv2.imwrite('messigray.png',img) # kayıt eder
    cv2.destroyAllWindows() # ve pencere yi kapatır
```

### Uyarı !

Eğer 64 bit makina kullanıyorsanız, burayı değiştirmelisiniz

```python
k = cv2.waitKey(0) #bu satırı

k = cv2.waitKey(0) & 0xFF # bu şekilde yapmalısınız
```

**Matplotlib** kullanımı **Matplotlib**, çok çeşitli çizim yöntemleri sağlayan Python
için bir çizim kütüphanesi.

Burada Matplotlib ile resim dosyasının nasıl açıldığını öğreneceksiniz, resmi
yakınlaştırabilir ve Matplotlib kullanarak kayıt edebilirsiniz.

```python
import numpy as np
import cv2
from matplotlib import pyplot as plt

img = cv2.imread('messi5.jpg',0)
plt.imshow(img, cmap = 'gray', interpolation = 'bicubic')
plt.xticks([]), plt.yticks([])  # x ve y eksenindeki işaret değerlerini gizler
plt.show()
```

![](https://www.coogger.com/media/images/matplotlib_screenshot.jpg)

bu şekilde görünecektir.
