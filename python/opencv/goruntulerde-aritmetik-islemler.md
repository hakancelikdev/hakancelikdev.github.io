# Görüntülerde Aritmetik İşlemler

## Hedefler

Görüntüler üzerinde **toplama**, **çıkarma**, **bitdüzeyi** işlemleri gibi birkaç
aritmetik işlemleri öğreneceğiz. Bu fonksiyonları öğreneceksiniz : **cv2.add\(\)**,
**cv2.addWeighted\(\)** vb.

## Resim ekleme

Opencv fonksiyonu, **cv2.add\(\)** veya **numpy** işlemleri, **res = img1 + img2** ile
iki resim ekleyebilirsiniz. Her iki görüntü de aynı derinlik ve türe sahip olmalı veya
ikinci görüntü yalnızca skalar değerinde olabilir.

**Not ;**

OpenCV eklemesi ile Numpy eklemesi arasında bir fark vardır. OpenCV eklemesi doymuş bir
işlemdir, buna karşın Numpy ilavesi modüler bir işlemdir.

örnek olarak ;

```python
>>> x = np.uint8([250])
>>> y = np.uint8([10])
>>> print(cv2.add(x,y)) # 250+10 = 260 => 255
[[255]]
>>> print(x+y)          # 250+10 = 260 % 256 = 4
[4]
```

İki resim eklediğinizde daha görünür olacaktır. OpenCV işlevi daha iyi sonuç verecektir.
Bu yüzden her zaman OpenCV işlevlerine sadık kalın.

## Görüntü Karıştırma

Bu aynı zamanda görüntü eklemesidir, ancak farklı ağırlıklar görüntülere verilir,
böylece harmanlama veya şeffaflık hissi verir. Resimler aşağıdaki denkleme göre eklenir:
![](https://steemitimages.com/0X0/http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/8086cd5f33e2aed7d185e1f55fc31ceab4433c2b.png)
![](https://steemitimages.com/0X0/http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/e8b0946e02b57d6440cad75c8e0666f071d5ab3c.png)'e
değişen
![](https://steemitimages.com/0X0/http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/ad59b6e24a4a00ac621801f8d7513d68be654ab5.png)
bir görüntü arasında diğerine serin bir geçiş yapabilirsiniz. Burada onları bir araya
getirmek için iki görüntü aldım.

İlk resme 0.7 ağırlık ve ikinci resme 0.3 verilir. **cv2.addWeighted\(\)**, aşağıdaki
denklemi görüntüye uygular.
![](https://steemitimages.com/0X0/http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/ce1ee966236689be38f566b9fb6bc92812bbd54d.png)

Burada
![](https://steemitimages.com/0X0/http://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/0ebb67342b546ca42a1c634b1ef03c893c4cdedb.png)
sıfır olarak alınır.

```python
img1 = cv2.imread('ml.png')
img2 = cv2.imread('opencv_logo.jpg')
dst = cv2.addWeighted(img1,0.7,img2,0.3,0)
cv2.imshow('dst',dst)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

**sonuç ;**

![](https://www.coogger.com/media/images/opencv_YfZ6eAZ.jpg)

## Bitwise Operations \( Bit düzeyi işlemleri \)

Bu bitwise **AND**, **OR**, **NOT** ve **XOR** işlemlerini içerir. Resmin herhangi bir
bölümünü çıkartırken \(ilerleyen bölümlerde de göreceğimiz gibi\) dikdörtgen olmayan ROI
vb. Ile tanımlama ve çalışma yaparken son derece faydalı olacaklar.

Aşağıda, resmin belirli bir bölümünü nasıl değiştireceğinize ilişkin bir örnek
göreceğiz.

OpenCV logosunu bir resmin üzerine koyalım. İki resim eklersem renk değişir, Eğer
dikdörtgen bir bölge olsaydı, ROI'yı son bölümde yaptığımız gibi kullanabilirdim. Ancak
OpenCV logosu dikdörtgen bir şekle değil. Dolayısıyla, bunu aşağıdaki gibi bitwise
işlemlerle yapabilirsiniz:

```python
# iki resmi yüklüyoruz
img1 = cv2.imread('messi5.jpg')
img2 = cv2.imread('opencv_logo.png')

# Sol üst köşeye logo koymak istiyorum, bu yüzden bir ROI oluşturuyorum
rows,cols,channels = img2.shape
roi = img1[0:rows, 0:cols ]

# şimdi logonun maskesini oluşturun ve ayrıca ters maskesinide oluşturun
img2gray = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)
ret, mask = cv2.threshold(img2gray, 10, 255, cv2.THRESH_BINARY)
mask_inv = cv2.bitwise_not(mask)

# şimdi logo içindeki ROI 'un alanını karartalım
img1_bg = cv2.bitwise_and(roi,roi,mask = mask_inv)

# Logo görüntüsünden yalnızca logo bölgesi aldık.
img2_fg = cv2.bitwise_and(img2,img2,mask = mask)

# ROI'ye logo koyun ve ana görüntüyü değiştiriyoruz
dst = cv2.add(img1_bg,img2_fg)
img1[0:rows, 0:cols ] = dst

cv2.imshow('res',img1)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

Aşağıdaki sonuca bakın, Sol resim imal ettiğimiz maskeyi gösterir, Sağ görüntü ise sen
son oluşan sonucu gösterir.

![](https://www.coogger.com/media/images/opencv_LAvFMC7.jpg)
