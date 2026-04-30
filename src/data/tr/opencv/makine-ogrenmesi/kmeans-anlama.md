---
publishDate: 2022-06-13T00:00:00Z
author: Hakan Çelik
title: "K-Ortalamalar Kümeleme'yi Anlamak"
excerpt: "K-Ortalamalar (K-Means) Kümeleme algoritmasının kavramlarını öğrenin. Adım adım algoritma ile T-shirt boyutu problemi üzerinden kümeleme analizini anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 54
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/kmeans_begin.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# K-Ortalamalar Kümeleme'yi Anlamak

## Hedefler

Bu bölümde K-Ortalamalar Kümeleme kavramlarını anlayacağız.

## Teori

Bir T-shirt şirketini düşünün. Tüm boyutlardaki insanları memnun etmek için farklı boyutlarda T-shirt üretmeleri gerekecek. Şirket insanların boyunu ve kilosunu bir grafiğe çiziyor:

![T-shirt başlangıç](/images/posts/opencv/kmeans_begin.jpg)

Şirket tüm boyutlarda T-shirt üretemez. Bunun yerine insanları Küçük, Orta ve Büyük olarak üç gruba böler ve yalnızca bu 3 modeli üretir. Bu insanları üç gruba ayırma işlemi k-ortalamalar kümeleme ile yapılabilir. Algoritma bize en iyi 3 boyutu verir:

![K-Means Demo](/images/posts/opencv/kmeans_demo.jpg)

## Algoritma Nasıl Çalışır?

Bu yinelemeli bir süreçtir:

**Adım 1:** Algoritma rastgele iki merkez C1 ve C2 seçer.

**Adım 2:** Her noktadan her iki merkeze olan mesafeyi hesaplar. Eğer bir test verisi C1'e daha yakınsa '0' ile etiketlenir, C2'ye daha yakınsa '1' ile.

**Adım 3:** Tüm mavi noktaların ve kırmızı noktaların ortalamasını ayrı ayrı hesaplarız ve bunlar yeni merkezlerimiz olur.

**Adım 2** ve **Adım 3**, her iki merkez de sabit noktalara yakınsayana kadar (veya belirttiğimiz kritere göre) tekrarlanır. Bu noktalar, test verilerinden karşılıklı merkezlerine olan mesafelerin toplamının minimum olduğu noktalardır:

**J = Σ mesafe(C1, Kırmızı_Nokta) + Σ mesafe(C2, Mavi_Nokta)** → minimize et

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_kmeans/py_kmeans_understanding/py_kmeans_understanding.markdown)
