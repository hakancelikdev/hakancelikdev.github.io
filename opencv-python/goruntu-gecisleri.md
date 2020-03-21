# Görüntü Geçişleri

> Image Gradients

## Hedefler
Bu konuda şunları öğreneceğiz.
- Görüntü geçişlerini ve kenar bulma
- ve bu fonksiyonlar `cv2.Sobel()`, `cv2.Scharr()`, `cv2.Laplacian()` vb

## Teori
Opencv 3 çeşit geçiş filtresi veya yüksek geçiş filtreleri sağlar. Bunların her birini göreceğiz.

### 1. Sobel ve Scharr Türevleri

Sobel işlemleri ortak bir Gausssian yumuşatma artı türev işlemleridir, yani bu kadar kirliliğe karşı daha dayanıklıdır.

Alınacak olan türevin yönünü belirleyebilirsiniz, yata veya dikey ( argüman olarak, sırası ile **yorder** ve **xorder** )

Ayrıca argümanın **ksize** tarafından çekirdek boyutunu belirleyebilirsiniz. If ksize = -1, bir 3x3 Sobel filtreden daha iyi sonuç veren 3 x 3 Scharr filtre kullanılır.

Lütfen kullanılan çekirdekler için dokümanlara bakın.

### 2. Laplacian Türevleri
İlişki tarafından verilen görüntünün Laplacian ni hesaplar  $$\Delta src = \frac{\partial ^2{src}}{\partial x^2} + \frac{\partial ^2{src}}{\partial y^2}$$    her türev Sobel türev yardımıyla bulunur. If ksize = 1 ( ksize 1 ise ) o zaman çekirdek aşağıdaki filtreleme için kullanılır:

![](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/math/2e4e208edcbed72b60c09a9e8eb8c00c4b21dbd6.png?style=center)

## Code

Aşağıdaki kod tek bir şemada tüm operatörleri gösterir. Tüm çekirdeklerin boyutu 5x5 dir. Çıkan görüntünün derinliğnden alınan sonuçların türü np.uint8 olarak geçer.

All kernels are of 5x5 size. Depth of output image is passed -1 to get the result in np.uint8 type.

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('dave.jpg',0)
laplacian = cv2.Laplacian(img,cv2.CV_64F)
sobelx = cv2.Sobel(img,cv2.CV_64F,1,0,ksize=5)
sobely = cv2.Sobel(img,cv2.CV_64F,0,1,ksize=5)
plt.subplot(2,2,1),plt.imshow(img,cmap = 'gray')
plt.title('Original'), plt.xticks([]), plt.yticks([])
plt.subplot(2,2,2),plt.imshow(laplacian,cmap = 'gray')
plt.title('Laplacian'), plt.xticks([]), plt.yticks([])
plt.subplot(2,2,3),plt.imshow(sobelx,cmap = 'gray')
plt.title('Sobel X'), plt.xticks([]), plt.yticks([])
plt.subplot(2,2,4),plt.imshow(sobely,cmap = 'gray')
plt.title('Sobel Y'), plt.xticks([]), plt.yticks([])
plt.show()
```
Sonuç:

![Image Gradients](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/gradients.jpg?style=center)

## Önemli Bir Konu!

Bizim son örneğimizde, çıkış data türü `cv2.CV_8U` veya `np.uint8`'di. Fakat bunun ile ilgili ufak bir problem var. White-to-Black ( beyazdan siyaha ) geçişler negatif slope alırken  Black-to-White   ( siyahtan beyaza ) geçiş pozitif slope olarak alır ( bu pozitif bir değerdir ). Yani data türünü `np.uint8`'ye dönüştürdüğünüzde, Bütün negatig slope'lar (slopes) ( bütün slope değerleri ) 0 yapılmalıdır.

basit bir değiş ile bu kenardan kaçarsın. Her iki kenarları tespit etmek istiyorsanız, biraz daha yüksek formlar, `cv2.CV_16S`, `cv2.CV_64F` gibi çıkan veri türleri  tutmak daha iyi bir seçenektir.

Eğer mutlak değeri almak ve sonra `cv2.CV_8U` den geriye dönersen, bu prosedür yatay sobel filtresi için ve sonuçların içindeki farkları aşağıdaki kod ile gösterir.

```python
import cv2
import numpy as np
from matplotlib import pyplot as plt
img = cv2.imread('box.png',0)
# Output dtype = cv2.CV_8U
sobelx8u = cv2.Sobel(img,cv2.CV_8U,1,0,ksize=5)
# Output dtype = cv2.CV_64F. Then take its absolute and convert to cv2.CV_8U
sobelx64f = cv2.Sobel(img,cv2.CV_64F,1,0,ksize=5)
abs_sobel64f = np.absolute(sobelx64f)
sobel_8u = np.uint8(abs_sobel64f)
plt.subplot(1,3,1),plt.imshow(img,cmap = 'gray')
plt.title('Original'), plt.xticks([]), plt.yticks([])
plt.subplot(1,3,2),plt.imshow(sobelx8u,cmap = 'gray')
plt.title('Sobel CV_8U'), plt.xticks([]), plt.yticks([])
plt.subplot(1,3,3),plt.imshow(sobel_8u,cmap = 'gray')
plt.title('Sobel abs(CV_64F)'), plt.xticks([]), plt.yticks([])
plt.show()
```
Sonucu kontrol edin :

![Double Edges](https://opencv-python-tutroals.readthedocs.io/en/latest/_images/double_edge.jpg?style=center)
