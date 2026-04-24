---
publishDate: 2023-01-15T00:00:00Z
author: Hakan Çelik
title: "Python'da Sınıfları Anlamak: type ve __class__"
excerpt: "Python'da her nesnenin bir tipi vardır. type(obj) == obj.__class__ ilişkisini ve bunun metaclass'larla bağlantısını keşfediyoruz."
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
category: Python
tags:
  - python
  - metaclass
  - nesne-yonelimli
---

Python'da her nesnenin bir tipi vardır. Bu temel gerçeği anlamak, metaclass'ları kavramanın ilk adımıdır.

```python
class Example:
    attr = 1

    def method(self):
        return "method"

print(f"{type(44)=}")         # type(44)=<class 'int'>
print(f"{type('hello')=}")    # type('hello')=<class 'str'>
print(f"{Example.__class__=}") # <class 'type'>
print(f"{type(Example)=}")    # <class 'type'>
```

`type(obj)` ve `obj.__class__` her zaman eşittir. Bu iki sözdizimi birbirinin yerine kullanılabilir.

## Sınıfların Tipi

Peki sınıfların kendisinin tipi nedir?

```python
assert type(Example) is type
assert isinstance(Example, type)
```

Evet, sınıflar da birer nesnedir ve `type` sınıfının birer örneğidir. İşte bu noktada metaclass kavramı devreye girer.

Daha fazlası için [dokümantasyona](https://docs.hakancelik.dev/metaclasses/) bakabilirsiniz.
