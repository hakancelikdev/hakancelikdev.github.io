---
publishDate: 2022-12-08T00:00:00Z
author: Hakan Çelik
title: "Singleton in Python"
excerpt: "Python'da Singleton desenini metaclass ile uygulamanın iki yolu — ve aralarındaki kritik fark: birinde alt sınıflar ayrı nesne, diğerinde aynı nesne olur."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 12
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Singleton in Python

Singleton, bir sınıftan yalnızca tek bir örnek oluşturulmasını garantileyen bir
tasarım desenidir. Python'da bunu metaclass üzerinden `__call__` metoduyla uygulamak
mümkündür. Aşağıda iki farklı implementasyon karşılaştırılıyor — ikisi de çalışıyor
ama davranışları birbirinden önemli ölçüde farklı:

```python
class Meta(type):
    instance = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls.instance:
            cls.instance[cls] = super().__call__(*args, **kwargs)

        return cls.instance[cls]

class Singleton(metaclass=Meta):
    pass

class Example(Singleton):
    pass

class Example2(Singleton):
    pass

assert Example is not Example2
assert Singleton is not Example
assert Singleton is not Example2

assert Singleton() is Singleton()
assert Example() is Example()
assert Example2() is Example2()

assert Example() is not Example2()

# --------

class Meta(type):
    instance = {}

    def __new__(mcs, *args, **kwargs):
        if not hasattr(mcs, 'obj'):
            mcs.obj = super().__new__(mcs, *args, **kwargs)
        return mcs.obj

    def __call__(cls, *args, **kwargs):
        if cls not in cls.instance:
            cls.instance[cls] = super().__call__(*args, **kwargs)

        return cls.instance[cls]

class Singleton(metaclass=Meta):
    pass

class Example(Singleton):
    pass

class Example2(Singleton):
    pass

assert Example is Example2
assert Singleton is Example
assert Singleton is Example2

assert Singleton() is Singleton()
assert Example() is Example()
assert Example2() is Example2()

assert Example() is Example2()
```

## Yöntem 1: Yalnızca `__call__`

`Meta.__call__`, bir sınıf her çağrıldığında devreye girer. `instance` dict'i
sınıfı anahtar olarak kullanır: ilk çağrıda örnek oluşturulur, sonraki çağrılarda
aynı örnek döndürülür.

**Sonuç:** Her sınıf ayrı bir nesnedir (`Example is not Example2`), ama her biri
kendi singleton'ına sahiptir. `Example()` ile `Example2()` farklı örnekler döndürür.

## Yöntem 2: `__new__` + `__call__`

`Meta.__new__`, bir metaclass üzerinden oluşturulan her **sınıf için** çalışır
(örnekler için değil). `if not hasattr(mcs, 'obj')` koşuluyla `Meta` ile oluşturulan
ilk sınıf ne ise `mcs.obj` olarak saklanır; sonraki her `type.__new__` çağrısı bu
aynı nesneyi döndürür.

**Sonuç:** `Singleton`, `Example` ve `Example2` aynı nesnedir (`assert Example is Example2`).
Dolayısıyla `Example()` ve `Example2()` de aynı örneği döndürür.

## Kritik Fark

| | Yöntem 1 | Yöntem 2 |
|---|---|---|
| `Example is Example2` | `False` — farklı sınıflar | `True` — aynı nesne |
| `Example() is Example2()` | `False` — farklı örnekler | `True` — aynı örnek |
| Kullanım amacı | Her sınıf için ayrı singleton | Tüm hiyerarşi için tek singleton |

Çoğu Singleton ihtiyacı için Yöntem 1 beklenen davranışı verir. Yöntem 2 ise
metaclass'ın `__new__` mekanizmasını anlamak için güzel bir örnektir.
