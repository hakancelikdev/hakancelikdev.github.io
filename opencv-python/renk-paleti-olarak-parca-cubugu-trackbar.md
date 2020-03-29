# Renk Paleti Olarak Parça Çubuğu \( Trackbar \)

## Hedefler

* **Trackbar'ı** OpenCV pencerelerine bağlamayı öğreneceğiz
* Şu fonksiyonları öğreneceğiz ;  **cv2.getTrackbarPos \(\)**, **cv2.createTrackbar\(\)** vb.

## Demo

Burada belirttiğiniz rengi gösteren basit bir uygulama oluşturacağız.B, G ve R renklerinin her birini belirtmek için rengi ve üç trackbarı gösteren bir pencereniz var.İz çubuğunu kaydırırsınız ve buna karşılık gelen renk pençerede değişir.Varsayılan olarak, başlangıç rengi Siyah olarak ayarlanacaktır.

**Cv2.getTrackbarPos\(\)** işlevi için

* ilk argüman trackbar ismidir
* ikincisi bağlı olduğu pencere adıdır
* Üçüncü argüman varsayılan değerdir
* dördüncüsü ise maksimum değerdir
* beşincisi, trackbar değerinin her değiştiğinde çalıştırılan geri çağırma fonksiyonudur.

Geri çağırma fonksiyonu her zaman trackbar konumu olan bir varsayılan argümana sahiptir.Bizim durumumuzda, işleve hiçbir şey yapmaz, bu nedenle pas geçeriz.

trackbar'ın bir diğer önemli uygulaması, onu bir düğme veya anahtar olarak kullanmaktır.OpenCV, varsayılan olarak düğme fonksiyonunu içermez.

Bu yüzden bu tür işlemler için trackbar'ı kullanabilirsiniz.Uygulamamızda, uygulamanın yalnızca anahtar AÇIK olduğu durumda çalıştığı bir anahtar oluşturduk, aksi halde ekran her zaman siyahtır.

```python
import cv2
import numpy as np

def nothing(x):
    pass

# siyah bir resim oluşturduk, bir pencere
img = np.zeros((300,512,3), np.uint8)
cv2.namedWindow('image')
#  renk değişimi için trackbars'ı oluşturduk
cv2.createTrackbar('R','image',0,255,nothing)
cv2.createTrackbar('G','image',0,255,nothing)
cv2.createTrackbar('B','image',0,255,nothing)
# ON / OFF işlevselliği için anahtar oluşturduk
switch = '0 : OFF \n1 : ON'
cv2.createTrackbar(switch, 'image',0,1,nothing)
while(1):
    cv2.imshow('image',img)
    k = cv2.waitKey(1) & 0xFF
    if k == 27:
        break
    #dört trackbars'ın geçerli konumlarını aldık
    r = cv2.getTrackbarPos('R','image')
    g = cv2.getTrackbarPos('G','image')
    b = cv2.getTrackbarPos('B','image')
    s = cv2.getTrackbarPos(switch,'image')

    if s == 0:
        img[:] = 0
    else:
        img[:] = [b,g,r]
cv2.destroyAllWindows()
```

Ekran görüntüsü ;

![](https://www.coogger.com/media/images/opencv_3JcB3OU.jpg)

