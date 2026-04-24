---
publishDate: 2022-09-15T00:00:00Z
author: Hakan Çelik
title: "Dynamic Class Creation"
excerpt: "class Example: ... yazmak ile type('Example', (), {...}) çağırmak tamamen aynı sonucu verir. Python class anahtar kelimesini sahne arkasında type() çağrısına dönüştürür."
category: Python
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Dynamic Class Creation

`class` anahtar kelimesi sözdizimsel bir kolaylıktan ibarettir. Python bunu sahne
arkasında `type(name, bases, namespace)` çağrısına dönüştürür. Aşağıdaki iki tanım
tamamen aynı sınıfı üretir:

```python
class Example:
	attr = 1

	def method(self):
		return "method"

name = "Example"
bases = ()
namespace = {
	"attr": 1,
	"method": lambda self: "method"
}

Example = type(name, bases, namespace)

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{Example().attr=}")        # 1
print(f"{Example().method()=}")    # 'method'
```

```python
assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## Üç Argüman

`type(name, bases, namespace)` çağrısında:

- **`name`** — sınıfın adı (`__name__` niteliğine yazılır).
- **`bases`** — miras alınan sınıfların demeti; boş demet `object`'ten türetmek
  anlamına gelir.
- **`namespace`** — sınıf gövdesindeki tüm atamaları içeren sözlük: nitelikler,
  metodlar, `__module__`, `__qualname__` vb.

## Neden Önemli?

Dinamik sınıf oluşturma; sınıf adlarını veya niteliklerini çalışma zamanında
belirlemeniz gereken durumlarda kullanışlıdır — örneğin bir ORM'nin tablo
tanımlarını kod üretirken, ya da bir plugin sisteminde eklentileri kayıt altına
alırken. Metaclass'ları anlamanın ilk adımı da budur: metaclass, `type`'ın yerine
geçen ve bu `type(name, bases, namespace)` çağrısını kontrol eden bir sınıftır.
