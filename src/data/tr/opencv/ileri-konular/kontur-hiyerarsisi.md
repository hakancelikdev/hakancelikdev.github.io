---
publishDate: 2022-05-20T00:00:00Z
author: Hakan Çelik
title: "Kontur Hiyerarşisi"
excerpt: "Konturların hiyerarşisini, yani Konturlardaki ebeveyn-çocuk ilişkisini öğrenin. RETR_LIST, RETR_EXTERNAL, RETR_CCOMP ve RETR_TREE bayraklarını örneklerle anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 30
subcategory: İleri Konular
image: /images/posts/opencv/hierarchy.png
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Kontur Hiyerarşisi

## Hedefler

Bu bölümde konturların hiyerarşisini, yani Konturlardaki ebeveyn-çocuk ilişkisini öğreneceğiz.

## Teori

Konturlara ilişkin son birkaç makalede OpenCV'nin sunduğu çeşitli kontur fonksiyonlarıyla çalıştık. Ancak `cv2.findContours()` fonksiyonuyla görüntüdeki konturları bulurken bir argüman geçirdik: **Kontur Alma Modu**. Genellikle `cv2.RETR_LIST` veya `cv2.RETR_TREE` geçirdik ve düzgün çalıştı. Peki bu aslında ne anlama gelir?

Ayrıca çıktıda üç dizi elde ettik: birincisi görüntü, ikincisi konturlarımız, bir de **hierarchy** (hiyerarşi) adını verdiğimiz ek bir çıktı. Ama bu hiyerarşiyi hiçbir yerde kullanmadık. Peki bu hiyerarşi nedir ve ne işe yarar?

### Hiyerarşi Nedir?

Normalde `cv2.findContours()` fonksiyonunu bir görüntüdeki nesneleri tespit etmek için kullanırız. Bazen nesneler farklı konumlarda bulunur. Ancak bazı durumlarda bazı şekiller diğerlerinin içindedir; tıpkı iç içe geçmiş figürler gibi. Bu durumda dıştakine **ebeveyn**, içtekine ise **çocuk** deriz. Bu şekilde, bir görüntüdeki konturların birbirleriyle bir ilişkisi vardır. Bu ilişkinin temsili **Hiyerarşi** olarak adlandırılır.

Aşağıdaki örnek görüntüyü ele alalım:

![Kontur hiyerarşisi örneği](/images/posts/opencv/hierarchy.png)

Bu görüntüde **0-5** arasında numaralandırdığım birkaç şekil vardır. *2 ve 2a*, en dıştaki kutunun dış ve iç konturlarını belirtir.

Burada kontur 0, 1, 2 **dış veya en dışta** bulunanlardır. Bunlar **hiyerarşi-0**'da veya aynı hiyerarşi seviyesindedir.

Sonrasında **kontur-2a** gelir. Bu, **kontur-2'nin çocuğu** olarak değerlendirilebilir. Dolayısıyla **hiyerarşi-1**'dedir. Benzer şekilde kontur-3, kontur-2'nin çocuğudur ve bir sonraki hiyerarşide yer alır. Son olarak konturlar 4, 5 kontur-3a'nın çocuklarıdır ve son hiyerarşi seviyesindedir.

### OpenCV'de Hiyerarşi Temsili

Her kontur, hangi hiyerarşide olduğu, çocuğunun ve ebeveyninin kim olduğu hakkında bilgiye sahiptir. OpenCV bunu dört değerden oluşan bir dizi olarak temsil eder: **[Sonraki, Önceki, İlk_Çocuk, Ebeveyn]**

- **Sonraki (Next):** Aynı hiyerarşik seviyedeki bir sonraki konturu gösterir.
- **Önceki (Previous):** Aynı hiyerarşik seviyedeki önceki konturu gösterir.
- **İlk_Çocuk (First_Child):** İlk çocuk konturunu gösterir.
- **Ebeveyn (Parent):** Ebeveyn konturunun indeksini gösterir.

> **Not:** Çocuk veya ebeveyn yoksa, o alan -1 olarak alınır.

## Kontur Alma Modları

### 1. RETR_LIST

Dört bayrak arasından açıklama açısından en basiti budur. Tüm konturları alır ancak herhangi bir ebeveyn-çocuk ilişkisi oluşturmaz. **Ebeveynler ve çocuklar bu kuralda eşittir; hepsi yalnızca konturlardır.** Yani hepsi aynı hiyerarşi seviyesine aittir.

```python
>>> hierarchy
array([[[ 1, -1, -1, -1],
        [ 2,  0, -1, -1],
        [ 3,  1, -1, -1],
        [ 4,  2, -1, -1],
        [ 5,  3, -1, -1],
        [ 6,  4, -1, -1],
        [ 7,  5, -1, -1],
        [-1,  6, -1, -1]]])
```

Kodunuzda hiyerarşi özelliklerini kullanmıyorsanız bu iyi bir seçimdir.

### 2. RETR_EXTERNAL

Bu bayrağı kullanırsanız yalnızca en dıştaki konturları döndürür. Tüm çocuk konturlar geride bırakılır. **Bu kuralda yalnızca her ailenin en büyüğü önem taşır; diğer aile üyeleriyle ilgilenmez.**

Görüntümüzde en dışta kaç kontur vardır? Yani hiyerarşi-0 seviyesinde? Yalnızca 3 tane: konturlar 0, 1, 2.

```python
>>> hierarchy
array([[[ 1, -1, -1, -1],
        [ 2,  0, -1, -1],
        [-1,  1, -1, -1]]])
```

Yalnızca dış konturları çıkarmak istiyorsanız bu bayrağı kullanabilirsiniz.

### 3. RETR_CCOMP

Bu bayrak tüm konturları alır ve onları 2 seviyeli bir hiyerarşide düzenler. Nesnenin dış konturları hiyerarşi-1'e, nesnenin içindeki deliklerin konturları ise hiyerarşi-2'ye yerleştirilir.

![CCOMP hiyerarşi örneği](/images/posts/opencv/ccomp_hierarchy.png)

Örneğin kontur-0'ı düşünün. Hiyerarşi-1'dedir. İki deliği var: konturlar 1 ve 2, bunlar hiyerarşi-2'ye aittir. Bu nedenle kontur-0'ın aynı hiyerarşi seviyesindeki bir sonraki konturu kontur-3'tür. Önceki yoktur. İlk çocuğu hiyerarşi-2'deki kontur-1'dir. Ebeveyni yoktur çünkü hiyerarşi-1'dedir. Dizi: `[3, -1, 1, -1]`

```python
>>> hierarchy
array([[[ 3, -1,  1, -1],
        [ 2, -1, -1,  0],
        [-1,  1, -1,  0],
        [ 5,  0,  4, -1],
        [-1, -1, -1,  3],
        [ 7,  3,  6, -1],
        [-1, -1, -1,  5],
        [ 8,  5, -1, -1],
        [-1,  7, -1, -1]]])
```

### 4. RETR_TREE

Bu son ve en kapsamlı bayraktır. Tüm konturları alır ve tam bir aile hiyerarşisi listesi oluşturur. **Kim büyükbaba, kim baba, kim oğul, kim torun olduğunu bile söyler!**

![TREE hiyerarşi örneği](/images/posts/opencv/tree_hierarchy.png)

Kontur-0'ı ele alalım: Hiyerarşi-0'dadır. Aynı hiyerarşideki bir sonraki kontur, kontur-7'dir. Önceki kontur yoktur. Çocuğu kontur-1'dir. Ebeveyni yoktur. Dizi: `[7, -1, 1, -1]`

```python
>>> hierarchy
array([[[ 7, -1,  1, -1],
        [-1, -1,  2,  0],
        [-1, -1,  3,  1],
        [-1, -1,  4,  2],
        [-1, -1,  5,  3],
        [ 6, -1, -1,  4],
        [-1,  5, -1,  4],
        [ 8,  0, -1, -1],
        [-1,  7, -1, -1]]])
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_imgproc/py_contours/py_contours_hierarchy/py_contours_hierarchy.markdown)
