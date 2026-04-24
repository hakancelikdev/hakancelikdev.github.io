---
publishDate: 2022-11-24T00:00:00Z
author: Hakan Çelik
title: "Register Classes in Python"
excerpt: "Alt sınıfları otomatik kayıt altına almanın üç yolu: metaclass __new__, __init_subclass__ ve class decorator. Hangi durum için hangisi daha uygun?"
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Register Classes in Python

Bir temel sınıftan türeyen alt sınıfları otomatik olarak bir listeye kaydetmek yaygın
bir ihtiyaçtır — plugin sistemleri, komut kaydı veya fabrika desenleri gibi yerlerde
kullanılır. Aşağıda aynı sonucu üreten üç farklı yöntem karşılaştırılıyor:

```python
class Meta(type):
    _names = []

    def __new__(mcs, name, bases, namespace, **kwargs):
        obj = super().__new__(mcs, name, bases, namespace)
        if not [b for b in bases if isinstance(b, mcs)]:  # mcs is a Base
            return obj

        mcs._names.append(name)
        return obj

class Base(metaclass=Meta):
    pass

class Example(Base):
    pass

class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]

# -------

class Base:
    _names = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls._names.append(cls.__name__)

class Example(Base):
    pass

class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]

# -------

def decorator(cls):
    if hasattr(cls, "_names"):
        cls._names.append(cls.__name__)
    else:
        cls._names = []

    return cls

@decorator
class Base:
    pass

@decorator
class Example(Base):
    pass

@decorator
class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]
```

## Yöntem 1: Metaclass `__new__`

`Meta.__new__` her sınıf tanımında çalışır — hem `Base` hem de alt sınıflar için.
`not [b for b in bases if isinstance(b, mcs)]` koşulu "miras alınan base'lerden
hiçbiri Meta örneği değilse bu Base sınıfıdır, kaydetme" anlamına gelir. Böylece
yalnızca gerçek alt sınıflar listeye eklenir.

## Yöntem 2: `__init_subclass__`

Python 3.6'da eklendi. Bir sınıf başka bir sınıftan türetildiğinde o sınıfın
`__init_subclass__` metodu çağrılır. Metaclass yazmaya gerek yoktur ve kod çok
daha temizdir. Basit alt sınıf kayıt ihtiyaçları için `__init_subclass__` tercih
edilmesi önerilir.

## Yöntem 3: Decorator

En açık yöntemdir — hiçbir gizli mekanizma yoktur. `@decorator` her sınıfa elle
uygulanmalıdır; bu hem güçlü yönü hem de zayıf yönüdür. Çok sayıda sınıfta
unutmak kolaydır, ancak neyin kaydedildiği her zaman açıkça görülür.

## Hangi Yöntemi Seçmeli?

- Otomatik davranış ve karmaşık kontrol gerekiyorsa → **Metaclass**
- Basit alt sınıf takibi için → **`__init_subclass__`**
- Seçici ve açık kayıt için → **Decorator**
