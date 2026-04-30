---
publishDate: 2022-06-23T00:00:00Z
author: Hakan Çelik
title: "OpenCV-Python Bağlayıcıları Nasıl Çalışır?"
excerpt: "OpenCV-Python bağlayıcılarının nasıl oluşturulduğunu öğrenin. C++ modüllerinin Python'a nasıl aktarıldığını, CV_EXPORTS_W, CV_WRAP gibi makroları ve gen2.py üreteci ile hdr_parser.py başlık ayrıştırıcısını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 64
subcategory: Python Bağlayıcıları
image: /images/posts/opencv/opencv-icon.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# OpenCV-Python Bağlayıcıları Nasıl Çalışır?

## Hedefler

- OpenCV-Python bağlayıcılarının nasıl oluşturulduğunu öğreneceğiz
- Yeni OpenCV modüllerinin Python'a nasıl genişletileceğini göreceğiz

## OpenCV-Python Bağlayıcıları Nasıl Oluşturulur?

OpenCV'de tüm algoritmalar C++ ile uygulanır. Ancak bu algoritmalar Python, Java gibi farklı dillerden kullanılabilir. Bunu mümkün kılan **bağlayıcı üreteçleridir (bindings generators)**. Bu üreteçler C++ ile Python arasında bir köprü oluşturarak kullanıcıların Python'dan C++ fonksiyonlarını çağırmasına olanak tanır.

OpenCV, tüm fonksiyonlar için sarmalayıcı (wrapper) fonksiyonları manuel olarak yazmak yerine bunu daha akıllıca yapar: `modules/python/src2/` altındaki Python betikleri aracılığıyla C++ başlıklarından otomatik olarak üretir.

### Sürecin Adımları

1. **`modules/python/CMakeFiles.txt`** — Python'a genişletilecek modülleri kontrol eden CMake betiğidir. Tüm modülleri otomatik olarak kontrol eder ve başlık dosyalarını toplar.

2. **`modules/python/src2/gen2.py`** — Python bağlayıcı üreteci betiğidir. `hdr_parser.py`'yi çağırır.

3. **`modules/python/src2/hdr_parser.py`** — Başlık ayrıştırıcısıdır. Başlık dosyasını Python listelerine ayırır; her liste belirli bir fonksiyon, sınıf vb. hakkındaki tüm ayrıntıları içerir (fonksiyon adı, dönüş tipi, giriş argümanları, argüman tipleri vb.).

Başlık ayrıştırıcısı tüm fonksiyon ve sınıfları değil, yalnızca geliştiricinin Python'a aktarmak için işaretlediklerini ayrıştırır.

## Yeni Modülleri Python'a Genişletme

### Fonksiyon Genişletme: `CV_EXPORTS_W`

```cpp
CV_EXPORTS_W void equalizeHist( InputArray src, OutputArray dst );
```

Başlık ayrıştırıcısı, `InputArray`, `OutputArray` gibi anahtar kelimelerden giriş ve çıkış argümanlarını anlayabilir.

Bazen C++'ta referansla geçirilen parametreler giriş, çıkış veya her ikisi olarak kullanılabilir. `CV_OUT` ve `CV_IN_OUT` makroları bunu açıkça belirtir:

```cpp
CV_EXPORTS_W void minEnclosingCircle( InputArray points,
                                     CV_OUT Point2f& center, CV_OUT float& radius );
```

### Sınıf Genişletme: `CV_EXPORTS_W` ve `CV_WRAP`

Büyük sınıflar için `CV_EXPORTS_W` kullanılır. Sınıf yöntemlerini genişletmek için `CV_WRAP`, sınıf alanları için `CV_PROP` kullanılır:

```cpp
class CV_EXPORTS_W CLAHE : public Algorithm
{
public:
    CV_WRAP virtual void apply(InputArray src, OutputArray dst) = 0;

    CV_WRAP virtual void setClipLimit(double clipLimit) = 0;
    CV_WRAP virtual double getClipLimit() const = 0;
};
```

### Aşırı Yüklenmiş Fonksiyonlar: `CV_EXPORTS_AS`

Aşırı yüklenmiş fonksiyonlar yeni isimlerle genişletilir:

```cpp
CV_EXPORTS_W void integral( InputArray src, OutputArray sum, int sdepth = -1 );

CV_EXPORTS_AS(integral2) void integral( InputArray src, OutputArray sum,
                                        OutputArray sqsum, int sdepth = -1, int sqdepth = -1 );

CV_EXPORTS_AS(integral3) void integral( InputArray src, OutputArray sum,
                                        OutputArray sqsum, OutputArray tilted,
                                        int sdepth = -1, int sqdepth = -1 );
```

### Küçük Struct'lar: `CV_EXPORTS_W_SIMPLE`

`KeyPoint`, `DMatch` gibi küçük struct'lar `CV_EXPORTS_W_SIMPLE` ile genişletilir. Yöntemleri için `CV_WRAP`, alanları için `CV_PROP_RW` kullanılır:

```cpp
class CV_EXPORTS_W_SIMPLE DMatch
{
public:
    CV_WRAP DMatch();
    CV_WRAP DMatch(int _queryIdx, int _trainIdx, float _distance);

    CV_PROP_RW int queryIdx;
    CV_PROP_RW int trainIdx;
    CV_PROP_RW int imgIdx;
    CV_PROP_RW float distance;
};
```

### Python Sözlüğüne Dışa Aktarma: `CV_EXPORTS_W_MAP`

Bazı küçük struct'lar Python yerel sözlüğüne aktarılabilir. `Moments()` buna bir örnektir:

```cpp
class CV_EXPORTS_W_MAP Moments
{
public:
    CV_PROP_RW double m00, m10, m01, m20, m11, m02, m30, m21, m12, m03;
    CV_PROP_RW double mu20, mu11, mu02, mu30, mu21, mu12, mu03;
    CV_PROP_RW double nu20, nu11, nu02, nu30, nu21, nu12, nu03;
};
```

## Özet

Temel işlemler şu şekilde gerçekleşir: Python'dan `res = equalizeHist(img1, img2)` çağrıldığında iki numpy dizisi geçirilir. Bu numpy dizileri `cv::Mat`'a dönüştürülür, C++'daki `equalizeHist()` fonksiyonu çağrılır ve sonuç tekrar numpy dizisine dönüştürülür. Bu sayede neredeyse tüm işlemler C++'ta yapılır ve C++ ile benzer bir hız elde edilir.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_bindings/py_bindings_basics/py_bindings_basics.markdown)
