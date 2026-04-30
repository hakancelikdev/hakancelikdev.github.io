---
publishDate: 2022-05-13T00:00:00Z
author: Hakan Çelik
title: "Fourier Dönüşümü"
excerpt: "OpenCV ve NumPy kullanarak görüntülerin Fourier Dönüşümünü nasıl bulacağınızı öğrenin. cv2.dft(), cv2.idft() fonksiyonlarını ve frekans alanı uygulamalarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 23
subcategory: Görüntü İşleme
image: /images/posts/opencv/fft1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Fourier Dönüşümü

## Hedefler

Bu bölümde öğrenecekleriniz:

- OpenCV kullanarak görüntülerin Fourier Dönüşümünü bulmak
- NumPy'daki FFT fonksiyonlarını kullanmak
- Fourier Dönüşümünün bazı uygulamaları
- Şu fonksiyonları göreceksiniz: `cv2.dft()`, `cv2.idft()`

## Teori

Fourier Dönüşümü, çeşitli filtrelerin frekans özelliklerini analiz etmek için kullanılır. Görüntüler için frekans alanını bulmak amacıyla **2B Ayrık Fourier Dönüşümü (DFT)** kullanılır. DFT'nin hesaplanması için **Hızlı Fourier Dönüşümü (FFT)** adlı hızlı bir algoritma kullanılır.

Sinüzoidal bir sinyal için `x(t) = A·sin(2πft)`, `f` sinyalin frekansıdır. Frekans alanı alındığında `f` noktasında bir zirve görülür. Sinyal örneklenirse aynı frekans alanını elde edersiniz. Bir görüntüyü iki yönde örneklenmiş bir sinyal olarak düşünebilirsiniz. Hem X hem de Y yönlerinde Fourier dönüşümü almak size görüntünün frekans gösterimini verir.

Sezgisel olarak: Bir sinüzoidal sinyalde genlik kısa sürede çok hızlı değişiyorsa yüksek frekanslı, yavaş değişiyorsa düşük frekanslı bir sinyaldir. Bu düşünceyi görüntülere de uygulayabilirsiniz. Görüntülerde genlik nerede dramatik biçimde değişir? Kenar noktalarında veya gürültüde. Dolayısıyla kenarlar ve gürültüler görüntüdeki yüksek frekanslı içeriklerdir. Genlikte fazla değişiklik olmayan bölgeler ise düşük frekanslı bileşenlerdir.

## NumPy ile Fourier Dönüşümü

Önce NumPy kullanarak Fourier Dönüşümünü nasıl bulacağımıza bakalım. NumPy'ın `np.fft.fft2()` fonksiyonu bize karmaşık bir dizi olarak frekans dönüşümünü sağlar. İlk argüman gri tonlamalı girdi görüntüsüdür. Sıfır frekans bileşeni (DC bileşeni) sol üst köşede olacaktır. Onu merkeze taşımak için `np.fft.fftshift()` fonksiyonunu kullanın:

```python
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt

img = cv.imread('messi5.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"
f = np.fft.fft2(img)
fshift = np.fft.fftshift(f)
magnitude_spectrum = 20 * np.log(np.abs(fshift))

plt.subplot(121), plt.imshow(img, cmap='gray')
plt.title('Girdi Görüntüsü'), plt.xticks([]), plt.yticks([])
plt.subplot(122), plt.imshow(magnitude_spectrum, cmap='gray')
plt.title('Genlik Spektrumu'), plt.xticks([]), plt.yticks([])
plt.show()
```

Sonuç aşağıdaki gibi görünür:

![FFT genlik spektrumu](/images/posts/opencv/fft1.jpg)

Merkezdeki daha beyaz bölgenin düşük frekanslı içeriğin daha fazla olduğunu gösterdiğine dikkat edin.

Artık frekans dönüşümünü buldunuz. Frekans alanında bazı işlemler yapabilirsiniz; örneğin yüksek geçiren filtre uygulayıp görüntüyü geri oluşturabilirsiniz (ters DFT). Bunun için 60×60 boyutunda dikdörtgen bir pencereyle maskeleme yaparak düşük frekansları kaldırın, ardından `np.fft.ifftshift()` ile ters kaydırma uygulayın ve `np.fft.ifft2()` ile ters FFT'yi alın:

```python
rows, cols = img.shape
crow, ccol = rows // 2, cols // 2
fshift[crow-30:crow+31, ccol-30:ccol+31] = 0
f_ishift = np.fft.ifftshift(fshift)
img_back = np.fft.ifft2(f_ishift)
img_back = np.real(img_back)

plt.subplot(131), plt.imshow(img, cmap='gray')
plt.title('Girdi Görüntüsü'), plt.xticks([]), plt.yticks([])
plt.subplot(132), plt.imshow(img_back, cmap='gray')
plt.title('YGF Sonrası Görüntü'), plt.xticks([]), plt.yticks([])
plt.subplot(133), plt.imshow(img_back)
plt.title('JET Renk Uzayında Sonuç'), plt.xticks([]), plt.yticks([])
plt.show()
```

Sonuç aşağıdaki gibidir:

![Yüksek geçiren filtre sonucu](/images/posts/opencv/fft2.jpg)

Sonuç, Yüksek Geçiren Filtrenin (YGF) bir kenar tespiti işlemi olduğunu göstermektedir. Bu, Görüntü Gradyanları bölümünde gördüğümüz şeydir. Ayrıca görüntü verilerinin büyük çoğunluğunun spektrumun düşük frekans bölgesinde yer aldığını göstermektedir.

Son görüntüde bazı yapay izler (titreşim efektleri — ringing effects) görünmektedir. Bunlar maskeleme için kullandığımız dikdörtgen pencerenin sinc şekline dönüşmesinden kaynaklanmaktadır. Bu nedenle filtrelemedee dikdörtgen pencereler yerine Gaussian pencereleri kullanılması önerilir.

## OpenCV ile Fourier Dönüşümü

OpenCV bu işlem için `cv2.dft()` ve `cv2.idft()` fonksiyonlarını sağlar. Girdi görüntüsü önce `np.float32`'ye dönüştürülmelidir:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('messi5.jpg', cv.IMREAD_GRAYSCALE)
assert img is not None, "Dosya okunamadı, os.path.exists() ile kontrol edin"

dft = cv.dft(np.float32(img), flags=cv.DFT_COMPLEX_OUTPUT)
dft_shift = np.fft.fftshift(dft)

magnitude_spectrum = 20 * np.log(cv.magnitude(dft_shift[:, :, 0], dft_shift[:, :, 1]))

plt.subplot(121), plt.imshow(img, cmap='gray')
plt.title('Girdi Görüntüsü'), plt.xticks([]), plt.yticks([])
plt.subplot(122), plt.imshow(magnitude_spectrum, cmap='gray')
plt.title('Genlik Spektrumu'), plt.xticks([]), plt.yticks([])
plt.show()
```

> **Not:** `cv2.cartToPolar()` fonksiyonunu da kullanabilirsiniz; bu fonksiyon tek seferde hem büyüklüğü hem de fazı döndürür.

Şimdi LPF (düşük geçiren filtre) uygulayarak görüntüdeki yüksek frekanslı içerikleri kaldıralım. Bu aslında görüntüyü bulanıklaştırır. Bunun için düşük frekanslarda yüksek değerli (1), yüksek frekanslarda 0 değerli bir maske oluşturun:

```python
rows, cols = img.shape
crow, ccol = rows // 2, cols // 2

# Önce maske oluştur: merkez kare 1, geri kalanı 0
mask = np.zeros((rows, cols, 2), np.uint8)
mask[crow-30:crow+30, ccol-30:ccol+30] = 1

# Maskeyi uygula ve ters DFT hesapla
fshift = dft_shift * mask
f_ishift = np.fft.ifftshift(fshift)
img_back = cv.idft(f_ishift)
img_back = cv.magnitude(img_back[:, :, 0], img_back[:, :, 1])

plt.subplot(121), plt.imshow(img, cmap='gray')
plt.title('Girdi Görüntüsü'), plt.xticks([]), plt.yticks([])
plt.subplot(122), plt.imshow(img_back, cmap='gray')
plt.title('Genlik Spektrumu'), plt.xticks([]), plt.yticks([])
plt.show()
```

Sonucu görün:

![Düşük geçiren filtre sonucu](/images/posts/opencv/fft4.jpg)

> **Not:** OpenCV'nin `cv2.dft()` ve `cv2.idft()` fonksiyonları NumPy karşılıklarından daha hızlıdır; ancak NumPy fonksiyonları daha kullanıcı dostudur.

## DFT Performans Optimizasyonu

DFT hesaplama performansı bazı dizi boyutları için daha iyidir. Dizi boyutu 2'nin kuvveti olduğunda en hızlıdır. 2, 3 ve 5'in çarpımı olan diziler de verimli işlenir. Performans konusunda endişeliyseniz, DFT hesaplamadan önce diziyi sıfır ekleyerek optimal bir boyuta getirin.

OpenCV bu optimal boyutu bulmak için `cv2.getOptimalDFTSize()` fonksiyonunu sağlar:

```python
img = cv.imread('messi5.jpg', cv.IMREAD_GRAYSCALE)
rows, cols = img.shape
print("{} {}".format(rows, cols))     # 342 548

nrows = cv.getOptimalDFTSize(rows)
ncols = cv.getOptimalDFTSize(cols)
print("{} {}".format(nrows, ncols))   # 360 576
```

Boyut (342, 548)'den (360, 576)'ya değiştirildi. Şimdi sıfır ekleyelim:

```python
nimg = np.zeros((nrows, ncols))
nimg[:rows, :cols] = img
```

Veya `cv2.copyMakeBorder()` kullanın:

```python
right = ncols - cols
bottom = nrows - rows
nimg = cv.copyMakeBorder(img, 0, bottom, 0, right, cv.BORDER_CONSTANT, value=0)
```

NumPy ile performans karşılaştırması yaklaşık 4 kat hızlanma gösterir. OpenCV fonksiyonları ise NumPy'dan yaklaşık 3 kat daha hızlıdır.

## Laplacian Neden Yüksek Geçiren Filtredir?

Laplacian filtresinin Fourier dönüşümünü alarak bunu görebilirsiniz. Farklı filtre çekirdeklerinin frekans tepkilerini karşılaştıralım:

```python
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt

mean_filter = np.ones((3, 3))
x = cv.getGaussianKernel(5, 10)
gaussian = x * x.T

scharr = np.array([[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]])
sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
laplacian = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])

filters = [mean_filter, gaussian, laplacian, sobel_x, sobel_y, scharr]
filter_name = ['mean_filter', 'gaussian', 'laplacian', 'sobel_x', 'sobel_y', 'scharr_x']
fft_filters = [np.fft.fft2(x) for x in filters]
fft_shift = [np.fft.fftshift(y) for y in fft_filters]
mag_spectrum = [np.log(np.abs(z) + 1) for z in fft_shift]

for i in range(6):
    plt.subplot(2, 3, i + 1), plt.imshow(mag_spectrum[i], cmap='gray')
    plt.title(filter_name[i]), plt.xticks([]), plt.yticks([])

plt.show()
```

Sonucu görün:

![Filtre frekans tepkileri](/images/posts/opencv/fft5.jpg)

Görüntüden her çekirdeğin hangi frekans bölgesini engellediğini ve hangisini geçirdiğini görebilirsiniz. Bu bilgiden her çekirdeğin neden YGF (HPF) veya DGF (LPF) olduğunu anlayabilirsiniz.

## Ek Kaynaklar

- [Fourier Teorisinin Sezgisel Açıklaması](http://cns-alumni.bu.edu/~slehar/fourier/fourier.html) — Steven Lehar
- [HIPR'de Fourier Dönüşümü](http://homepages.inf.ed.ac.uk/rbf/HIPR2/fourier.htm)
- [Görüntülerde Frekans Alanı Ne İfade Eder?](http://dsp.stackexchange.com/q/1637/818)

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_transforms/py_fourier_transform/py_fourier_transform.markdown)
