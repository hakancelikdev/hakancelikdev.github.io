---
publishDate: 2023-03-16T00:00:00Z
author: Hakan Çelik
title: "Run Methods Order In Python"
excerpt: "Python metaclass'larında hangi metot ne zaman çalışır? Sınıf tanımı ve örnek oluşturma sırasındaki __prepare__, __new__, __init__, __call__ çalışma sırası."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 9
image: /images/posts/run-methods-order-in-python.png
tags:
  - python
  - metaclass
---

# Run Methods Order In Python

Bir metaclass tanımlanırken hangi metodun ne zaman tetiklendiğini anlamak, metaclass
yazımının en kritik parçasıdır. Aşağıdaki kod her metodun başına `print` ekleyerek
çalışma sırasını görünür kılar:

```python
class Meta(type):
    @classmethod
    def __prepare__(mcs, cls_name, bases, **kwargs):  # default, staticmethod
        print("Meta.__prepare__")
        return super().__prepare__(cls_name, bases)

    def __new__(mcs, cls_name, bases, namespace, **kwargs):
        print(f"Meta.__new__")
        return super().__new__(mcs, cls_name, bases, namespace)

    def __init__(cls, cls_name, bases, namespace, **kwargs):
        print(f"Meta.__init__")
        super().__init__(cls_name, bases, namespace, **kwargs)

    def __call__(cls, *args, **kwargs):
        print(f"Meta.__call__")
        return super().__call__(*args, **kwargs)

class Base:
    pass

class Example(Base, metaclass=Meta):  # Order: Meta.__prepare__, Meta.__new__, Meta.__init__
    # def __prepare__(mcs, cls_name, bases):  # it doesn't work, in this way

    def __new__(cls, *args, **kwargs):
        print(f"Example.__new__")
        return super().__new__(cls)

    def __init__(self):
        print(f"Example.__init__")

    def __call__(self, *args, **kwargs):
        print(f"Example.__call__")

base = Example()             # Meta.__call__, Example.__new__, Example.__init__
base()                       # Example.__call__
```

## Çalışma Sırası

**Sınıf tanımlanırken** (`class Example(Base, metaclass=Meta):` satırı okunduğunda):

```
Meta.__prepare__   ← namespace dict'i hazırlanır
Meta.__new__       ← sınıf nesnesi oluşturulur
Meta.__init__      ← sınıf nesnesi başlatılır
```

**Örnek oluşturulurken** (`base = Example()`):

```
Meta.__call__      ← metaclass'ın __call__'u tetiklenir (super().__call__ çağrılır)
Example.__new__    ← örnek nesnesi oluşturulur
Example.__init__   ← örnek nesnesi başlatılır
```

**Örnek çağrılırken** (`base()`):

```
Example.__call__   ← nesne callable olduğu için kendi __call__'u tetiklenir
```

## `__prepare__` Neden `@classmethod`?

`__prepare__` sınıf henüz oluşturulmadan önce çağrılır; dolayısıyla `self` olarak bir
sınıf örneği alamaz. `@classmethod` ile metaclass'ın kendisini (`mcs`) alır. İnce
bir ayrıntı: `__prepare__` yorumda belirtildiği gibi sınıf gövdesinde tanımlanamaz —
sadece metaclass üzerinde çalışır.
