---
publishDate: 2023-02-16T00:00:00Z
author: Hakan Çelik
title: "More Accurate Meta Classes Without Type"
excerpt: "type'tan türetmeyen daha eksiksiz bir metaclass implementasyonu: __call__ ile iki aşamalı yaşam döngüsü, __str__ ve attribute erişiminin namespace'e delegasyonu."
category: Python
image: /images/posts/meta-classes-without-type.png
tags:
  - python
  - metaclass
---

# More Accurate Meta Classes Without Type

Önceki yazıda `type`'tan türetmeden temel metaclass protokolünü uyguladık. Bu sefer
daha eksiksiz bir versiyon: `__call__` iki aşamalı yaşam döngüsünü yönetiyor,
`__str__` ve tüm attribute/item operasyonları namespace'e delege ediliyor.

```python
class Meta:
    def __prepare__(name, bases, **kwargs):
        return dict()

    def __new__(cls, name, bases, namespace, **kwargs):
        obj = object.__new__(cls)

        obj.__init__(name, bases, namespace, **kwargs)
        return obj

    def __init__(self, name, bases, namespace, **kwargs):
        self.name = name
        self.bases = bases
        self.namespace = namespace
        self.kwargs = kwargs

        self.__call_run = False

    def __call__(self, *args, **kwargs):
        if not self.__call_run:
            self.__call_run = True

            cls_new = self.namespace["__new__"]
            cls_init = self.namespace["__init__"]

            obj = cls_new(self, *args, **kwargs)
            cls_init(obj, *args, **kwargs)
        else:
            cls_call = self.namespace["__call__"]
            obj = cls_call(self, *args, **kwargs)

        return obj

    def __str__(self):
        if not self.__call_run:
            return "<Meta: {}>".format(self.name)
        else:
            return self.namespace["__str__"](self)

    def __repr__(self):
        return self.__str__()

    def __getattribute__(self, name):
        return object.__getattribute__(self, name)

    def __setattr__(self, name, value):
        object.__setattr__(self, name, value)

    def __delattr__(self, name):
        object.__delattr__(self, name)

    def __getitem__(self, key):
        return self.namespace[key]

    def __setitem__(self, key, value):
        self.namespace[key] = value

    def __delitem__(self, key):
        del self.namespace[key]

    def __len__(self):
        return len(self.namespace)

    def __contains__(self, item):
        return item in self.namespace

    def __iter__(self):
        return iter(self.namespace)

    def __reversed__(self):
        return reversed(self.namespace)

class Klass(metaclass=Meta):
    def __new__(cls, *args, **kwargs):
        return cls

    def __init__(self, *args, **kwargs):
        pass

    def __call__(self, *args, **kwargs):
        return self

    def __str__(self):
        return "<Klass: {}>".format(self.name)

klass = Klass(1, a=1)
klass(deneme=3)

print(klass)
```

## İki Aşamalı Yaşam Döngüsü

`Meta` örneği (yani `Klass`) iki farklı şekilde çağrılır; `__call_run` flag'ı bu
iki aşamayı ayırt eder:

**1. Aşama — `klass = Klass(1, a=1)` (ilk çağrı, `__call_run = False`)**

`Meta.__call__` devreye girer:
- `__call_run` False olduğu için sınıf gövdesindeki `__new__` ve `__init__`'i çalıştırır
- `Klass.__new__(self, 1, a=1)` → `return cls` → `obj = Klass`'ın Meta örneği
- `Klass.__init__(obj, 1, a=1)` → `pass`
- `__call_run = True` olarak işaretler
- `obj` döndürülür → `klass = Klass` Meta örneğinin kendisidir

**2. Aşama — `klass(deneme=3)` (sonraki çağrı, `__call_run = True`)**

`Meta.__call__` yeniden devreye girer:
- `__call_run` True olduğu için `__call__`'u namespace'den alıp çalıştırır
- `Klass.__call__(self, deneme=3)` → `return self`

**`print(klass)` → `<Klass: Klass>`**

`Meta.__str__` çağrılır; `__call_run = True` olduğundan namespace'deki `__str__`'e
delege edilir: `Klass.__str__(klass)` → `"<Klass: {}>".format(self.name)` →
`self.name = "Klass"` (`Meta.__init__`'te saklanmıştı).

## `__prepare__` Neden classmethod Değil?

Bu implementasyonda `__prepare__` sıradan bir fonksiyon olarak tanımlanmış. Python,
`__prepare__` üzerinde özel bir arama yapar ve bunu doğrudan çağırır; `classmethod`
olması zorunlu değildir. Sonuç olarak `name` ve `bases` argümanları birinci ve
ikinci parametreye gelir — `cls/mcs` olmadan.
