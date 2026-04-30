---
publishDate: 2022-05-21T00:00:00Z
author: Hakan Çelik
title: "GrabCut ile Etkileşimli Ön Plan Çıkarma"
excerpt: "GrabCut algoritmasını kullanarak görüntülerdeki ön planı çıkarmayı öğrenin. cv2.grabCut() fonksiyonu ile dikdörtgen ve maske modlarında çalışmayı anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 31
subcategory: Görüntü İşleme
image: /images/posts/opencv/grabcut_output1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# GrabCut ile Etkileşimli Ön Plan Çıkarma

## Hedefler

Bu bölümde:

- Görüntülerde ön planı çıkarmak için GrabCut algoritmasını göreceğiz
- Bu amaçla etkileşimli bir uygulama oluşturacağız

## Teori

GrabCut algoritması, Microsoft Research Cambridge'den Carsten Rother, Vladimir Kolmogorov ve Andrew Blake tarafından ["GrabCut": iterative graph cut kullanarak etkileşimli ön plan çıkarma](http://dl.acm.org/citation.cfm?id=1015720) adlı makalede tasarlanmıştır. Minimal kullanıcı etkileşimiyle ön plan çıkarma için bir algoritma gerekiyordu ve sonuç GrabCut oldu.

Kullanıcı açısından nasıl çalışır? Başlangıçta kullanıcı, ön plan bölgesinin etrafına bir dikdörtgen çizer (ön plan bölgesi tamamen dikdörtgenin içinde olmalıdır). Ardından algoritma, en iyi sonucu elde etmek için bunu yinelemeli olarak segmentler. Tamam. Ancak bazı durumlarda segmentasyon iyi olmayabilir; örneğin bazı ön plan bölgelerini arka plan olarak, bazı arka plan bölgelerini ön plan olarak işaretlemiş olabilir. Bu durumda kullanıcının bazı ince düzenlemeler yapması gerekir. Hatalı sonuçların olduğu görüntü üzerinde çizgiler çizmeniz yeterlidir. Bu çizgiler temelde şunu söyler: *"Hey, bu bölge ön plan olmalı, arka plan olarak işaretledin, bir sonraki iterasyonda düzelt"* ya da tam tersi. Bir sonraki iterasyonda daha iyi sonuçlar alırsınız.

Aşağıdaki görüntüye bakın. İlk olarak oyuncu ve top mavi bir dikdörtgenin içine alınır. Ardından beyaz çizgilerle (ön planı gösteren) ve siyah çizgilerle (arka planı gösteren) bazı son düzenlemeler yapılır. Ve güzel bir sonuç elde edilir:

![GrabCut çıktısı](/images/posts/opencv/grabcut_output1.jpg)

Peki arka planda ne oluyor?

- Kullanıcı dikdörtgeni girer. Bu dikdörtgenin dışındaki her şey kesin arka plan olarak alınır (bu yüzden dikdörtgeninizin tüm nesneleri içermesi gerektiği daha önce belirtilmiştir). Dikdörtgenin içindeki her şey bilinmeyendir. Benzer şekilde, kullanıcının ön planı veya arka planı belirten girdiler "sabit etiketleme" olarak kabul edilir; bu, süreçte değişmeyecekleri anlamına gelir.
- Bilgisayar, verdiğimiz verilere göre başlangıç etiketlemesi yapar. Ön plan ve arka plan piksellerini etiketler.
- Şimdi ön planı ve arka planı modellemek için bir Gauss Karışım Modeli (GMM) kullanılır.
- Verdiğimiz verilere bağlı olarak, GMM yeni piksel dağılımları öğrenir ve oluşturur. Yani bilinmeyen pikseller, renk istatistikleri açısından diğer sabit etiketlenmiş piksellerle ilişkilerine bağlı olarak muhtemel ön plan veya muhtemel arka plan olarak etiketlenir (sadece kümeleme gibi).
- Bu piksel dağılımından bir grafik oluşturulur. Grafikteki düğümler piksellerdir. İki ek düğüm eklenir: **Kaynak düğüm** ve **Havuz düğümü**. Her ön plan pikseli Kaynak düğümüne, her arka plan pikseli ise Havuz düğümüne bağlanır.
- Pikselleri kaynak/son düğüme bağlayan kenarların ağırlıkları, pikselin ön plan/arka plan olma olasılığıyla tanımlanır. Pikseller arasındaki ağırlıklar, kenar bilgisi veya piksel benzerliğiyle tanımlanır. Piksel renginde büyük bir fark varsa, aralarındaki kenar düşük bir ağırlık alır.
- Ardından, grafiği segmentlemek için bir minimum kesme (mincut) algoritması kullanılır. Minimum maliyet fonksiyonuyla kaynak düğümü ve havuz düğümünü ayırarak grafiği iki parçaya böler. Maliyet fonksiyonu, kesilen tüm kenarların ağırlıklarının toplamıdır. Kesimden sonra Kaynak düğümüne bağlı tüm pikseller ön plan, Havuz düğümüne bağlı olanlar ise arka plan olur.
- Sınıflandırma yakınsayana kadar süreç devam eder.

Aşağıdaki görüntüde bu süreç gösterilmektedir (Görüntü kaynağı: <http://www.cs.ru.ac.za/research/g02m1682/>):

![GrabCut şeması](/images/posts/opencv/grabcut_scheme.jpg)

## Demo

Şimdi OpenCV ile GrabCut algoritmasına geçelim. OpenCV bunun için **cv.grabCut()** fonksiyonuna sahiptir. Argümanlarına bakalım:

- **img** — Giriş görüntüsü
- **mask** — Hangi alanların arka plan, ön plan veya muhtemel arka plan/ön plan olduğunu belirttiğimiz maske görüntüsü. Bu **cv.GC_BGD, cv.GC_FGD, cv.GC_PR_BGD, cv.GC_PR_FGD** bayraklarıyla veya görüntüye 0, 1, 2, 3 geçirerek yapılır.
- **rect** — Ön plan nesnesini içeren dikdörtgenin koordinatları: (x, y, w, h) formatında
- **bdgModel**, **fgdModel** — Algoritma tarafından dahili olarak kullanılan diziler. Sadece boyutu (1, 65) olan iki np.float64 tipi sıfır dizisi oluşturun.
- **iterCount** — Algoritmanın çalışması gereken iterasyon sayısı
- **mode** — **cv.GC_INIT_WITH_RECT** veya **cv.GC_INIT_WITH_MASK** ya da birleşimi olmalıdır; dikdörtgen mi yoksa son dokunuş çizgileri mi çizdiğimize karar verir.

Önce dikdörtgen modunu görelim. Görüntüyü yüklüyoruz, benzer bir maske görüntüsü oluşturuyoruz, fgdModel ve bgdModel oluşturuyoruz, dikdörtgen parametrelerini veriyoruz ve algoritmayı 5 iterasyon çalıştırıyoruz:

```python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('messi5.jpg')
assert img is not None, "file could not be read, check with os.path.exists()"
mask = np.zeros(img.shape[:2], np.uint8)

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

rect = (50, 50, 450, 290)
cv.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT)

mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
img = img * mask2[:, :, np.newaxis]

plt.imshow(img), plt.colorbar(), plt.show()
```

Sonuçlara bakın:

![GrabCut dikdörtgen modu](/images/posts/opencv/grabcut_rect.jpg)

Messi'nin saçları gitti. *Kim Messi'yi saçsız sever?* Geri getirmemiz gerekiyor. Yani orada 1-piksel (kesin ön plan) ile ince bir dokunuş yapacağız. Aynı zamanda resme giren zemin ve logo gibi istemediğimiz kısımlar da var. Onları kaldırmamız gerekiyor, bunlar için 0-piksel (kesin arka plan) dokunuşu yapıyoruz:

```python
# newmask el ile etiketlediğim maske görüntüsüdür
newmask = cv.imread('newmask.png', cv.IMREAD_GRAYSCALE)
assert newmask is not None, "file could not be read, check with os.path.exists()"

# beyaz işaretli yerleri (kesin ön plan) mask=1 yap
# siyah işaretli yerleri (kesin arka plan) mask=0 yap
mask[newmask == 0] = 0
mask[newmask == 255] = 1

mask, bgdModel, fgdModel = cv.grabCut(img, mask, None, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_MASK)

mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
img = img * mask[:, :, np.newaxis]
plt.imshow(img), plt.colorbar(), plt.show()
```

Sonuca bakın:

![GrabCut maske modu](/images/posts/opencv/grabcut_mask.jpg)

İşte bu kadar. Dikdörtgen modunda başlatmak yerine, doğrudan maske moduna geçebilirsiniz. Sadece maske görüntüsündeki dikdörtgen alanını 2-piksel veya 3-piksel (muhtemel arka plan/ön plan) ile işaretleyin. Ardından ikinci örnekteki gibi kesin_ön_planı 1-piksel ile işaretleyin. Sonra GrabCut fonksiyonunu doğrudan maske moduyla uygulayın.

## Alıştırmalar

1. OpenCV örnekleri, GrabCut kullanan etkileşimli bir araç olan grabcut.py'yi içerir. Kontrol edin. Ayrıca nasıl kullanıldığına dair bu [youtube videosunu](http://www.youtube.com/watch?v=kAwxLTDDAwU) izleyin.
2. Burada, fare ile dikdörtgen ve çizgiler çizerek bu uygulamayı etkileşimli bir örneğe dönüştürebilirsiniz; çizgi genişliğini ayarlamak için kaydırma çubuğu ekleyebilirsiniz.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_grabcut/py_grabcut.markdown)
