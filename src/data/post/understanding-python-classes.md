---
publishDate: 2023-03-30T00:00:00Z
author: Hakan Çelik
title: "Understanding Python Classes"
excerpt: "Python'da her şey nesnedir ve her nesnenin bir tipi vardır — primitifler, fonksiyonlar ve sınıfların kendisi de dahil. type() ve __class__ bu ilişkiyi ortaya çıkarır."
category: Python
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Understanding Python Classes

Python'da her şey bir nesnedir ve her nesnenin bir tipi vardır. Bu kural primitifler
için geçerli olduğu gibi sınıfların kendisi için de geçerlidir. `type()` fonksiyonu
veya `.__class__` niteliği herhangi bir nesnenin tipini döndürür; ikisi her zaman
aynı sonucu verir.

```python
class Example:
	attr = 1

	def method(self):
		return "method"

print(f"{type(44)=}")              # type(44)=<class 'int'>
print(f"{type('hello')=}")         # type('hello')=<class 'str'>
print(f"{type(())=}")              # type(())=<class 'tuple'>
print(f"{type([])=}")              # type([])=<class 'list'>

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{type(Example)=}")         # <class 'type'>
print(f"{type(type(type))=}")      # <class 'type'>

print(f"{Example().__class__=}")   # <class '__main__.Example'>

assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## Çıktı Ne Söylüyor?

İlk dört satır beklenen şeyi gösteriyor: `44` bir `int`, `'hello'` bir `str`.

Asıl ilginç kısım ortadaki üç satırdır:

- `Example.__class__` → `<class 'type'>` — `Example` sınıfının kendisi `type`'ın bir
  örneğidir. Sınıflar da birer nesnedir; bu nesnelerin tipi `type`'tır.
- `type(Example)` → aynı sonuç; `type()` ile `.__class__` kullanımı eşdeğerdir.
- `type(type(type))` → hâlâ `<class 'type'>` — `type` kendi metaclass'ıdır; kendisinin
  tipi de yine kendisidir.

Son satır bunu tamamlar: `Example().__class__` → `<class '__main__.Example'>`. Sınıftan
oluşturulan bir _örnek_, tipi olarak kendi sınıfını döndürür — bu da sıradan
nesnelerle aynı mantıktır.

## assert Satırları

```python
assert isinstance(Example, type)    # Sınıflar type'ın birer örneğidir
assert isinstance(Example(), Example)  # Örnekler kendi sınıflarının birer örneğidir
```

Bu iki kural Python nesne modelinin temelidir. `type` metaclass hiyerarşisinin
zirvesindedir; tüm sınıflar —farkında olsak da olmasak da— `type`'ın birer
örneğidir.
