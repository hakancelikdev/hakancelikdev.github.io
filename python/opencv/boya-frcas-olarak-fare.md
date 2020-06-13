# Boya Fırçası Olarak Fare

### Hedefler

- OpenCV de fare olaylarını işlemeyi öğreneceğiz
- Bu fonksiyonu öğreneceğiz : _**cv2.setMouseCallback\(\)**_

## Basit Demo

Resim üzerinde iki defa tıkladığımız herhangi bir yere çember çizen basit bir uygulama
oluşturacağız.

İlk olarak bir fare olayı gerçekleştiğinde, bu olayı yakalamak için bir geri dönüş
fonksiyonu oluşturacağız. Bu olaylar herhangi bir fare ile ilgili olabilir örneğin; sol
düğme aşağı, sol düğme yukarı, sol düğme çift tıklama.

Her fare olayı için \(x,y\) kordinat noktalarını vermeliyiz, bu olaylar ve kordinat
bilgisi ile istediğimiz herşeyi yapabiliriz.

Mevcut tüm olayları listelemek için, Python terminalinde aşağıdaki kodu çalıştırın;

```python
>>> import cv2
>>> events = [i for i in dir(cv2) if 'EVENT' in i]
>>> print(events)
```

Fare geri çağırma fonkiyonu oluşturmak genel olarak heryerde aynı olan belirli bir
formata sahiptir. Sadece fonksiyonun yaptıkları farklıdır.Yani fare geri çağırma olayı
iki defa tıklandığında bir çember çizer.

Aşağıdaki kodu inceleyelim, açıklamalar kod satırlarında mevcut.

```python
import cv2
import numpy as np
# fare geri çağırma fonksiyonu
def draw_circle(event,x,y,flags,param): # event parametresi gelen fare olayı,x,y kordinatlar
    if event == cv2.EVENT_LBUTTONDBLCLK: # gelen fare olayı çift tıklama ise
        cv2.circle(img,(x,y),100,(255,0,0),-1) # burada gelen x,y kordinat bölgesinde çember çiziyoruz

# siyah bir resim yaratalım,bir pencere ve fonksiyonu pencereye bağlayalım
img = np.zeros((512,512,3), np.uint8)
cv2.namedWindow('image')
cv2.setMouseCallback('image',draw_circle) # burada dikkat ederseniz draw_circle()
# şeklinde vermiyoruz direk fonksiyonu gönderiyoruz
while(1):
    cv2.imshow('image',img)
    if cv2.waitKey(20) & 0xFF == 27:
        break
cv2.destroyAllWindows()
```

## Daha Fazla Gelişmiş Demo

Şimdi daha iyi bir uygulama yapacağız.Burada, dikdörtgen veya daireler çizeceğiz
\(seçtiğimiz modele bağlı olarak\), Paint uygulamasında yaptığımız gibi fareyi
sürükleyerek yapacağız.Yani fare geri cağırma fonksiyonu \( mouse callback function \)
olarak iki part mevcut.

Birincisi dikdörtgen çizmek için İkincisi çember çizmek için Bu özel örnek, nesne
izleme, resim parçalama gibi bazı etkileşimli uygulamaları oluşturma ve anlama konusunda
gerçekten yardımcı olacaktır.

```python
import cv2
import numpy as np

drawing = False # fare sıkışmış ise True ( pressed )
mode = True # eğer True ise, dikdörtgen çizin. Eğriye geçmek için 'm' ye basın
ix,iy = -1,-1

# fare geri çağırma fonksiyonu ( mouse callback function)
def draw_circle(event,x,y,flags,param):
    global ix,iy,drawing,mode

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix,iy = x,y

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing == True:
            if mode == True:
                cv2.rectangle(img,(ix,iy),(x,y),(0,255,0),-1)
            else:
                cv2.circle(img,(x,y),5,(0,0,255),-1)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        if mode == True:
            cv2.rectangle(img,(ix,iy),(x,y),(0,255,0),-1)
        else:
            cv2.circle(img,(x,y),5,(0,0,255),-1)
```

Sonra bu fare geri arama işlevini OpenCV penceresine bağlamalıyız. Ana döngüde,
dikdörtgen ve daire arasında geçiş yapmak için 'm' anahtarı için bir klavye bağlaması
ayarlamalıyız.

```python
img = np.zeros((512,512,3), np.uint8)
cv2.namedWindow('image')
cv2.setMouseCallback('image',draw_circle)

while(1):
    cv2.imshow('image',img)
    k = cv2.waitKey(1) & 0xFF
    if k == ord('m'):
        mode = not mode
    elif k == 27:
        break

cv2.destroyAllWindows()
```
