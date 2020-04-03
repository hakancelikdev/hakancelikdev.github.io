# Opencv Video Işlemleri

## Opencv video işlemleri

### Hedefler

* Video okumayı öğreneceğiz, video ları açmayı ve kayıte etmeyi
* Kamera ile video kaydı ve pencerede çalıştırmayı öğreneceğiz
* Bu fonksiyonları öğreneceğiz : cv2.VideoCapture\(\), cv2.VideoWriter\(\)

## Kamera ile video kaydı

Sık sık kamera ile canlı akış yakalamak durumdayız, bunu opencv basit bir şekilde sunuyor, haydi kamera ile video kayıt edelim \( ben kendi bilgisayarımın kamerasını kullanıyorum \)

Size başlamak için basit bir görev, kameradan vide alın ve gri tonlamalı videoya dönüştürün + gösterin.

Video kaydetmek için _**VideoCapture**_ nesnesini yaratmalısınız, bunu bir değişken kullarak yapın örneğin cap değişken ismi ile.

Bu nesneye verilen parametre hangi kamerayı kullanacağınızı seçmenize yarar, eğer bir kamera bağlayacaksanız \( benim gibi \) 0 veya -1 değerini vermelisiniz.

ikinci bir kamera için 1 değeri ve bu şekilde değerle verilmelidir.

```python
import numpy as np
import cv2

cap = cv2.VideoCapture(0) # nesneyi yarattık

while(True):
    # kare kare yakalamaya başladık
    ret, frame = cap.read() # kameradan gelen veriyi okuyoruz, sürekli dir.
    # frame üzerinden işlemler buraya gelir
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # gelen anlık veriyi gri tona çeviriyoruz
    cv2.imshow('frame',gray)# frame'i ekranda gösteriyoruz ( pencere ismi "frame" okunacak veri ise ikinci parametre olan gray dır tıpkı bir önceki derste resim işleme'de anlatılar gibi.
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# herşey bittiğinde ekran kapanır
cap.release()
cv2.destroyAllWindows()
```

burda tıpkı resim işmedeki gibi anlık resim dosyası geliyor ve biz bunu sürekli while döngüsü sayesinde okup ekrana döküyoruz hızlı olduğu için video olmuş oluyor. Pek bir fark yok.

cap.read\(\) fonksiyonu bir bool döndürür **True** veya **False**, bazen cap kayıt yapmaya başlamıyor olabilir bu durumda bu kodlar bir hata gösterir. Başlayıp başlamadığını kontrol edebilirisin veya **cap.isOpened\(\)** bu fonksiyon ile başlayıp başlamadığı kontrol edilebilir.

Eğer bu fonksiyon **True** değerini döndürürse **cap** başlıyor ve video kaydı alabiliyordur yani herhangi bir sorun yoktur, eğer **False** dönderiyorsa **cap.open\(\)** fonksiyonu'nu kullarak açınız.

Ayrıca **cap.get\(propId\)** fonksiyonunu kullarak bu video da bazı özellikleri açabilirsiniz. Bu fonksiyonda ki **propId** parametresi 0 ile 18 arasında değerler alır, her numara videonun özelliği anlamına gelir, o video için geçerli ise bütün detayi görmek için tıklayınız bu değerlerin bazıları **cap.set\(propId, value\)** kullanarak değiştirilebilir value değeri istediğiniz herhangi bir numarak olabilir.

### Örnek olarak;

**cap.get\(3\)** ve **cap.get\(4\)** fonksiyonunu kullanarak çerçeve genişliğini ve yüksekliğini kontrol edebilirim. Bana varsayılan olarak 640x480 bunu verir. Fakat ben bunu 320x240 olarak değiştirebilirim sadece bunu kullanarak **ret = cap.set\(3,320\)** ve **ret = cap.set\(4,240\)**

## Dosyadan video oynatma

Kameradan video kaydı ile aynı şey, sadece kamera indexi ile video ismini değiştireceğiz.Ayrıca çerçeveyi görüntülerken **cv2.waitKey\(\)** için uygun zamanı kullanacağız.Çok daha azı ise video çok hızlı olacak ve eğer kalitesi çok yüksek ise, video yavaş olacak \( peki videoları yavaş çekimde nasıl görebilirsiniz \)

Normal durumlarda 25 milisaniye sorunsuz olacaktır.

```python
import numpy as np
import cv2

cap = cv2.VideoCapture('vtest.avi') # vtest.avi adında video dosyasını acıyoruz

while(cap.isOpened()): #ve cap isimli değişken açık olana kadar yani video dosyası açık olduğu sürece
    ret, frame = cap.read() # gelen veriyi anlık okuyoruz

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # COLOR_BGR2GRAY modunda dönüştürdük

    cv2.imshow('frame',gray) # pencere ismini ve gösterilecek olan veriyi yazdık ve ekranda görüntü aldık
    if cv2.waitKey(1) & 0xFF == ord('q'): #klavye ile kapatma işlemlerini ekledik,klavye ile döngüyü yani veri okunmasını durdurmak için
        break

cap.release()
cv2.destroyAllWindows() # pencereleri yok ettik
```

## Video ları kaydetme

Evet kameradan video çektik kare kare,ve videoları yaptığımız değişiklikler sonrası kaydetmek istedik, Resimler için bu çok kolaydı , sadece **cv2.imwrite\(\)** bunu kullanıyorduk burda biraz daha iş istiyor.

Bu sefer **VideoWriter** nesnesini oluşturmamız gerek, çıktı dosya adını belirlemeliyiz örneğin:output.avi.

Daha sonra **FourCC** kodunu belirtmeliyiz bir sonraki paragrafta açıklayacağız, daha sonra saniye de ki kare sayısının numarasını vermeliyiz yani \( fps \) değerini ve çerçeve boyutuna geçmeliyiz, son olarak **isColor** etiketini vermeliyiz doğruysa, kodlayıcı renk karesini bekler, aksi halde gri tonlamalı çerçeve ile çalışır.

FourCC, video codec bileşenini belirlemek için kullanılan 4 baytlık bir koddur. Mevcut kodların listesi şu adreste bulunabilir:

[https://en.wikipedia.org/wiki/FourCC](https://en.wikipedia.org/wiki/FourCC) tabiki wikipedia çalışmadığı için biz burdaki adrese bakamıyacagız.

[fourcc](http://www.free-codecs.com/guides/fourcc.htm) şöyle birşey buldum aynısımı bilmiyorum ama bi bakın.

> * Fedora'da: DIVX, XVID, MJPG, X264, WMV1, WMV2. \(XVID daha çok tercih edilebilir.MJPG, yüksek boyutlu videolara neden olur X264 çok küçük boyutlu video verir\)
> * Windows'ta: DIVX \(Test edilecek ve eklenecek daha fazlası\)
> * OSX'te: \(Ben OSX'e erişemiyorum. Birisi bunu doldurabilir mi?\) \( dökümanda böyle yazıyor ben size sormuyorum yani :D \) // düzenleme öner diye bir şey eklenebilir aslında siteye güzel olur //
>
>   FourCC kodu, MJPG için cv2.VideoWriter\_fourcc \('M', 'J', 'P', 'G'\) veya cv2.VideoWriter\_fourcc \(\* 'MJPG\) olarak iletilir.

#### Kameradan video yakalayıp kayıt edelim

```python
import numpy as np
import cv2

cap = cv2.VideoCapture(0)

# VideoWriter nesnesini yaratıyoruz
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output.avi',fourcc, 20.0, (640,480))

while(cap.isOpened()):
    ret, frame = cap.read()
    if ret==True:
        frame = cv2.flip(frame,0)

        # flipped çerçevesini yazıyoruz
        out.write(frame)

        cv2.imshow('frame',frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

# herşey bittiğinde
cap.release()
out.release()
cv2.destroyAllWindows()
```

