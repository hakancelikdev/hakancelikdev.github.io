---
publishDate: 2022-10-27T00:00:00Z
author: Hakan Çelik
title: "Logging Namespace"
excerpt: "Metaclass'ın __prepare__ metoduyla sınıf gövdesindeki her atamayı otomatik olarak kayıt altına alın — özelleştirilmiş namespace'in gücünü keşfedin."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 6
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Logging Namespace

Python'da bir sınıf tanımlanırken sınıf gövdesindeki tüm atamalar bir `dict`'e yazılır.
Metaclass'ın `__prepare__` sınıf metodu bu sözlüğü önceden oluşturma imkânı tanır;
böylece standart `dict` yerine özelleştirilmiş bir namespace döndürebilirsiniz.

Aşağıdaki örnekte tüm atamalar otomatik olarak konsola yazdırılır:

```python
class LoggingDict(dict):
    def __setitem__(self, key, value):
        print("d[%r] = %r" % (key, value))
        dict.__setitem__(self, key, value)

class Meta(type):
    @classmethod
    def __prepare__(mcs, name, bases):
        return LoggingDict()

class C(metaclass=Meta):
    foo = 2+2
    foo = 42
    bar = 123

    def __int__(self):
        pass
```

## Çıktı

`C` sınıfı tanımlandığında `__prepare__` çağrılır ve `LoggingDict` döner. Sınıf
gövdesindeki her atama `LoggingDict.__setitem__` üzerinden geçer ve konsola şunu basar:

```
d['foo'] = 4
d['foo'] = 42
d['bar'] = 123
d['__int__'] = <function C.__int__ at 0x...>
```

`foo`'nun iki kez göründüğüne dikkat edin; Python sınıf gövdesini satır satır çalıştırır
ve her atama ayrı ayrı tetiklenir.

## Nasıl Çalışır?

`__prepare__` sınıf oluşturulmadan **önce** çalışır. Python sınıf gövdesini derlerken
namespace olarak bu metotun döndürdüğü nesneyi kullanır. Sınıf tanımı tamamlandıktan
sonra `type.__new__` bu namespace'i alıp sınıfı oluşturur.

```python
# Standart sınıf tanımında Python arka planda şunu yapar:
namespace = Meta.__prepare__("C", ())   # LoggingDict()
# ... sınıf gövdesi çalıştırılır, atamalar namespace'e yazılır ...
C = Meta("C", (), namespace)
```

## Neden Kullanışlı?

`__prepare__` ile namespace'i özelleştirmek aşağıdaki durumlarda işe yarar:

- **Denetim / debug**: Bu örnekte olduğu gibi tüm atamaları kayıt altına almak.
- **Tekrar eden tanımlar**: Aynı isme birden fazla fonksiyon atanmasını yakalamak
  ya da özel bir davranış uygulamak.
- **Yönlendirme**: Belirli isimleri farklı yapılara (cache, özel depolama) yazmak.
- **Sıralı özellikler**: Python 3.7 öncesinde `dict` sıralı olmadığından
  `OrderedDict` döndürerek atama sırasını korumak önemliydi.
