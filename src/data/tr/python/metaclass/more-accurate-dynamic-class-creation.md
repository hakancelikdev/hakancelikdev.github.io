---
publishDate: 2023-02-02T00:00:00Z
author: Hakan Çelik
title: "namespace['attr'] = 1"
excerpt: "Python'ın class ifadesini gerçekten nasıl işlediğini görmek için: type.__prepare__ ile namespace al, exec ile gövdeyi çalıştır, type() ile sınıfı oluştur."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 5
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# namespace['attr'] = 1

Önceki yazıda namespace'i elle bir dict olarak oluşturmuştuk. Bu sefer Python'ın
`class` ifadesini işlerken gerçekte yaptığı şeyi daha doğru bir biçimde taklit
ediyoruz:

```python
import textwrap

class Example:
	attr = 1

	def method(self):
		return "method"

name = "Example"
bases = ()
namespace = type.__prepare__(name, bases)  # >>> {}, default is dict()
# namespace["attr"] = 1
# namespace["method"] = lambda self: "method"

body = textwrap.dedent(
	"""\
	attr = 1

	def method(self):
		return "method"
	"""
)

exec(body, globals(), namespace)
Example = type(name, bases, namespace)  # type: ignore

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{Example().attr=}")        # 1
print(f"{Example().method()=}")    # 'method'

assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## Üç Adım

**1. `type.__prepare__(name, bases)`**
Boş bir `dict` döndürür — bu namespace, sınıf gövdesinin içine yazılacak tüm
atamaları tutacaktır. Özel bir metaclass bu adımı override ederek standart `dict`
yerine başka bir nesne döndürebilir (bkz. `Logging Namespace` yazısı).

**2. `exec(body, globals(), namespace)`**
Sınıf gövdesini bir string olarak alıp `namespace` dict'ine çalıştırır. Bu,
Python'ın `class` bloğunu işlerken yaptığı şeyin tam karşılığıdır. `exec`
tamamlandığında `namespace` şunu içerir:

```python
{
    'attr': 1,
    'method': <function method at ...>,
    '__module__': '__main__',
    '__qualname__': 'Example',
}
```

**3. `type(name, bases, namespace)`**
Doldurulmuş namespace ile sınıfı oluşturur. Sonuç, `class Example: ...` ile
yazmakla birebir aynıdır.

## Neden Önemli?

Özel bir metaclass yazdığınızda `__prepare__`, `__new__`, `__init__` metodları
tam da bu üç adıma karşılık gelir. Python bu süreci sizden saklarken, bu örnek
"perdenin arkasını" görmenizi sağlar.
