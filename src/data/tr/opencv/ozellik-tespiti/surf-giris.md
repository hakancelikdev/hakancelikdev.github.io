---
publishDate: 2022-05-27T00:00:00Z
author: Hakan Çelik
title: "SURF'e Giriş (Hızlandırılmış Sağlam Özellikler)"
excerpt: "SURF algoritmasının temellerini öğrenin. SIFT'in hızlandırılmış versiyonu olan SURF, kutu filtre ve integral görüntüler kullanarak hesaplamayı 3 kat hızlandırır."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 37
subcategory: Özellik Tespiti
image: /images/posts/opencv/sift_keypoints.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# SURF'e Giriş (Hızlandırılmış Sağlam Özellikler)

## Hedefler

Bu bölümde:

- SURF'un temellerini göreceğiz
- OpenCV'deki SURF işlevselliğini göreceğiz

## Teori

Son bölümde anahtar nokta tespiti ve tanımlaması için SIFT'i gördük. Ancak görece yavaştı ve insanlar daha hızlandırılmış bir versiyona ihtiyaç duydu. 2006'da Bay, H., Tuytelaars, T. ve Van Gool, L. tarafından yayınlanan **"SURF: Speeded Up Robust Features"** adlı makalede **SURF** adında yeni bir algoritma tanıtıldı. Adından da anlaşılacağı gibi SIFT'in hızlandırılmış versiyonudur.

SIFT'te Lowe, ölçek uzayı bulmak için Gauss Laplace'ını Gauss Farkı ile yaklaştırdı. SURF biraz daha ileri giderek LoG'u Kutu Filtre ile yaklaştırır. Bu yaklaşımın büyük bir avantajı, kutu filtresiyle evrişimin integral görüntüler yardımıyla kolayca hesaplanabilmesidir. Ve farklı ölçekler için paralel olarak yapılabilir. Ayrıca SURF, hem ölçek hem de konum için Hessian matrisinin determinantına dayanır.

Yönelim ataması için SURF, 6s boyutundaki bir komşuluk için yatay ve dikey yönde dalgacık yanıtlarını kullanır. Gauss ağırlıkları da uygulanır.

Özellik tanımlaması için SURF, yatay ve dikey yönde Dalgacık yanıtlarını kullanır. Anahtar nokta etrafında 20s×20s boyutunda bir komşuluk alınır. 4×4 alt bölgelere bölünür. Her alt bölge için yatay ve dikey dalgacık yanıtları alınarak bir vektör oluşturulur:

**v = (Σdx, Σdy, Σ|dx|, Σ|dy|)**

Bu 64 boyutlu SURF özellik tanımlayıcısı verir. Daha fazla ayırt edicilik için 128 boyutlu genişletilmiş versiyon da mevcuttur.

Analiz, SIFT ile karşılaştırıldığında 3 kat daha hızlı olduğunu göstermektedir. SURF, bulanıklık ve döndürme içeren görüntüleri iyi işler.

## OpenCV'de SURF

> **Not:** SURF patentlidir ve opencv_contrib modülünde bulunur. Ticari uygulamalar için kullanmadan önce lisans gerekliliklerini kontrol edin.

```python
img = cv.imread('fly.png', cv.IMREAD_GRAYSCALE)

# Hessian Eşiği 400 ile SURF nesnesi oluştur
surf = cv.xfeatures2d.SURF_create(400)

# Anahtar noktaları ve tanımlayıcıları doğrudan bul
kp, des = surf.detectAndCompute(img, None)

print(len(kp))
# 699
```

Görüntüde göstermek için 50 civarına indirelim. Hessian Eşiğini artıralım:

```python
surf.setHessianThreshold(50000)
kp, des = surf.detectAndCompute(img, None)
print(len(kp))
# 47

img2 = cv.drawKeypoints(img, kp, None, (255, 0, 0), 4)
plt.imshow(img2), plt.show()
```

SURF'un blob dedektörüne daha çok benzediğini görebilirsiniz. Kelebek kanatlarındaki beyaz blob'ları tespit eder.

U-SURF uygulamak isterseniz (yönelim bulmaz, daha hızlıdır):

```python
surf.setUpright(True)
kp = surf.detect(img, None)
img2 = cv.drawKeypoints(img, kp, None, (255, 0, 0), 4)
plt.imshow(img2), plt.show()
```

128 boyutlu tanımlayıcı kullanmak için:

```python
surf.setExtended(True)
kp, des = surf.detectAndCompute(img, None)
print(surf.descriptorSize())  # 128
print(des.shape)  # (47, 128)
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_surf_intro/py_surf_intro.markdown)
