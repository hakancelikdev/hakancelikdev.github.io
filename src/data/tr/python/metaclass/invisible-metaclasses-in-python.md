---
publishDate: 2022-12-22T00:00:00Z
author: Hakan Çelik
title: "Invisible Metaclasses In Python"
excerpt: "Python'da her sınıfın bir metaclass'ı vardır. Açıkça belirtmezseniz type varsayılan olarak devreye girer — görünmez ama her zaman oradadır."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 3
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Invisible Metaclasses In Python

Python'da her sınıfın bir metaclass'ı vardır. Bunu açıkça belirtmezseniz Python,
varsayılan olarak `type` metaclass'ını kullanır. Yani aşağıdaki iki sınıf tanımı
tamamen aynı anlama gelir:

```python
class K(metaclass=type):
    pass

class Example(K, metaclass=type):
    pass
```

Yukarıdaki kodda `metaclass=type` açıkça yazılmıştır. Ancak bunu yazmadan da
aynı sonucu elde edersiniz:

```python
class K:
    pass

class Example(K):
    pass
```

## Peki Bu Ne Anlama Gelir?

`type`, Python'da metaclass hiyerarşisinin en tepesinde yer alır. Bir sınıf
tanımladığınızda Python sahne arkasında şunları yapar:

```python
>>> type(K)
<class 'type'>

>>> type(Example)
<class 'type'>
```

Her iki yaklaşımda da sınıfın `type`'ı `type`'tır; çünkü metaclass belirtilmediğinde
Python otomatik olarak `type`'ı devreye sokar. İşte "görünmez metaclass" davranışı
budur — siz görmezsiniz, ama her zaman oradadır.

## Miras ve Metaclass

Bir sınıf miras aldığında parent sınıfın metaclass'ı da devralınır. `Example(K)`
örneğinde `K`'nın metaclass'ı `type` olduğu için `Example`'ın metaclass'ı da `type`
olur. Özel bir metaclass tanımladığınızda bu davranış değişir:

```python
class Meta(type):
    pass

class K(metaclass=Meta):
    pass

class Example(K):  # Meta devralınır, type değil
    pass

>>> type(Example)
<class '__main__.Meta'>
```

## Neden Önemli?

`type` metaclass'ı çoğu durumda görünmez kalır; ancak kendi metaclass'ınızı
yazarken veya bir kütüphanenin metaclass'ını incelerken bu varsayılan davranışı
anlamak kritik öneme sahiptir. Metaclass belirtilmemesi "metaclass yok" anlamına
gelmez; sadece `type` sessizce işini yapar.
