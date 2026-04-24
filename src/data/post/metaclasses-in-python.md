---
publishDate: 2023-01-19T00:00:00Z
author: Hakan Çelik
title: "Metaclasses In Python"
excerpt: "Metaclass, örnekleri sınıf olan bir sınıftır. type nasıl int veya str gibi sınıflar üretiyorsa, özel bir metaclass da kendi sınıflarını aynı şekilde üretir."
category: Python
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Metaclasses In Python

Sınıf oluşturma aşamasına bir ara katman eklemek için metaclass kullanılır.
`type`'tan türeyen her sınıf bir metaclass olabilir; `type` ise Python'ın varsayılan
metaclass'ıdır.

```python
class Meta(type):
    pass

class Example(metaclass=Meta):
    attr = 1

    def method(self):
        return "method"

print(f"{Meta.__class__=}")       # <class 'type'>
print(f"{Example.__class__=}")    # <class '__main__.Meta'>
print(f"{Example().__class__=}")  # <class '__main__.Example'>

print(f"{Example().attr=}")        # 1
print(f"{Example().method()=}")    # 'method'

assert isinstance(Meta, type)
assert isinstance(Example, Meta)
assert isinstance(Example(), Example)
```

## Çıktı Ne Söylüyor?

- `Meta.__class__` → `<class 'type'>` — Meta'nın kendisi `type`'ın bir örneğidir;
  yani Meta bir sınıftır, dolayısıyla tipi `type`.
- `Example.__class__` → `<class '__main__.Meta'>` — Example artık `type` tarafından
  değil `Meta` tarafından oluşturulmuştur; tipi `Meta`'dır.
- `Example().__class__` → `<class '__main__.Example'>` — sıradan örnekler beklendiği
  gibi kendi sınıflarını döndürür.

## assert Satırları

```python
assert isinstance(Meta, type)       # Meta, type'ın bir örneğidir (Meta bir sınıftır)
assert isinstance(Example, Meta)    # Example, Meta'nın bir örneğidir (Meta bir metaclass'tır)
assert isinstance(Example(), Example)  # Örnekler kendi sınıflarının birer örneğidir
```

## Analoji

`type` → `int` ilişkisi ile `Meta` → `Example` ilişkisi özdeştir:

- `type`, `int` sınıfını oluşturmak için kullanılır; `int`'in tipi `type`'tır.
- `Meta`, `Example` sınıfını oluşturmak için kullanılır; `Example`'ın tipi `Meta`'dır.

Metaclass bu noktada işe yarar: sınıf oluşturulurken `Meta.__new__`, `Meta.__init__`
veya `Meta.__call__` metodlarını override ederek sınıf tanımlama davranışını
değiştirebilirsiniz.
