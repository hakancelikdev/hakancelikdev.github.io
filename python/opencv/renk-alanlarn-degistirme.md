# Renk Alanlarını Değiştirme

## Hedefler

* Bu yazıda, BGR  Gray, BGR  HSV vb. Gibi görüntüleri bir renk alanından diğerine dönüştürmeyi öğreneceğiz.
* Buna ek olarak, bir videoda renkli bir nesne çıkarmayı sağlayan bir uygulama oluşturacağız
* Bu fonksiyonları öğreneceğöğreneceğiziz cv2.cvtColor\(\), cv2.inRange\(\) vb.

## Renk Alanını Değiştirme

OpenCV'de 150'den fazla renk alanı dönüştürme yöntemi bulunmaktadır, fakat biz bunların en çok kullanılan bu ikisine bakacağız BGR &lt;-&gt; Gray, BGR &lt;-&gt; HSV .

Renk dönüştürmek için `cv2.cvtColor(input_image, flag)` fonksiyonunu kullanacağız, buradaki flag renk dönüşüm türünü belirler. **BGR** için gri **\(Gray\)** dönüşümü flag patametresine `cv2.COLOR_BGR2GRAY` girilir, benzer olarak HSV dönüşümü için flag parametresine `cv2.COLOR_BGR2HSV` girilir.

Az önce bahsettiğim 150'den fazla renk dönüşümü yani frag'ın alacağı bütün parametrelerin listesine erişmek isterseniz python konsoluna şu kodları yazmanız yeterli olacaktır.

```python
import cv2
flags = [i for i in dir(cv2) if i.startswith('COLOR_')]
print(flags)
```

### Not;

HSV için Hue aralığı \[0,179\], Doygunluk aralığı \[0,255\] ve Değer aralığı \[0,255\] 'dir. Farklı yazılımlar farklı ölçekler kullanır. Dolayısıyla OpenCV değerlerini onlarla karşılaştırıyorsanız, bu aralıkları normalleştirmeniz gerekir.

## Nesne İzleme

Şimdi BGR görüntüsünü HSV'ye nasıl dönüştüreceğimizi biliyoruz, bunu renkli bir nesne çıkarmak için kullanabiliriz. HSV'de bir rengi RGB renk alanından sunmak daha kolay dır. Uygulamamızda, mavi renkli bir cisim çıkarmaya çalışacağız. İşte yöntem şu:

* Videonun her karesini al
* BGR'den HSV renk uzayına dönüştür
* Bir dizi mavi renk için HSV görüntüsünü eşleştir
* Şimdi mavi nesneyi tek başına çıkartın, istediğimiz görüntü üzerinde ne olursa olsun yapabiliriz.

kodlar ve açıklamlar ;

```python
import cv2
import numpy as np
cap = cv2.VideoCapture(0)
while True:
    # video'yu kare kare alıyoruz
    _, frame = cap.read()
    # BGR yi HSV ye çeviriyoruz
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    # HSV'de mavi renk aralığını belirliyoruz
    lower_blue = np.array([110,50,50])
    upper_blue = np.array([130,255,255])
    # Yalnızca mavi renkleri elde etmek için HSV resmini eşik değerlerine getirin
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    # Bitwise-AND maskesi ve orjinal görüntü
    res = cv2.bitwise_and(frame,frame, mask= mask)
    cv2.imshow('frame',frame) # normal resmi gösteriyoruz
    cv2.imshow('mask',mask) # maskeli resim
    cv2.imshow('res',res) # sadece mavi rengi yakaladıgımız resmi gösteriyoruz
    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break
cv2.destroyAllWindows()
```

Çıktımız şu şekilde olacaktır.

![coogger-opencv-python](http://opencv-python-tutroals.readthedocs.io/en/latest/_images/frame.jpg?style=center)

## Takip Etmek İçin HSV Değerleri Nasıl Bulunur?

Bu, stackoverflow.com tarafından sorulan yaygın bir sorudur, `cv2.cvtColor()` işlevini kullanabilirsiniz. Örnek te anlatalım, Green'in HSV değerini bulmak için, Python terminalinde aşağıdaki komutları yazmanız yeterli olacaktır.

```python
# yeşil renginin BGR renk kodu 0,255,0 dır, renklerin BGR kodlarını nereden bileceğiz derseniz bunu #web tasarım yapanlar css'den bilir bilmeyenler şu adresten BGR(,,,) olan yerleri inceleyebilir
#adres : https://www.w3schools.com/colors/colors_picker.asp
>>> green = np.uint8([[[0,255,0 ]]])
>>> hsv_green = cv2.cvtColor(green,cv2.COLOR_BGR2HSV)
>>> print(hsv_green)
[[[ 60 255 255]]]
```

