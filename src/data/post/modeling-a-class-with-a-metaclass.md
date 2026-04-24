---
publishDate: 2022-11-10T00:00:00Z
author: Hakan Çelik
title: "Modeling a Class with a Metaclass"
excerpt: "Metaclass ile dataclass benzeri bir yapı: type annotation'lardan otomatik __slots__ türetme ve __call__'da çalışma zamanı tip doğrulama."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Modeling a Class with a Metaclass

Bu örnekte bir metaclass iki şeyi otomatik olarak yapıyor: `__annotations__`'dan
`__slots__` üretiyor ve örnek oluşturulurken alanların varlığını ve tipini doğruluyor.
`dataclass` benzeri ama sıfırdan yazılmış, metaclass mekanizmasını açıkça gösteren
bir yapı:

```python
class Meta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        if not [base for base in bases if isinstance(base, mcs)]:
            return super().__new__(mcs, name, bases, namespace, **kwargs)

        annotations = namespace.get('__annotations__', {})
        namespace["__slots__"] = tuple(annotations.keys())  # auto __slots__

        return super().__new__(mcs, name, bases, namespace, **kwargs)

    def __call__(cls, **kwargs):
        for field_name, field_type in cls.__annotations__.items():
            if field_name not in kwargs:
                raise ValueError(f"Missing field {field_name}")
            else:
                assert isinstance(kwargs[field_name], field_type), f"Field {field_name} must be of type {field_type}"

        for field_name, field_value in kwargs.items():
            if field_name not in cls.__annotations__:
                raise ValueError(f"Unknown field {field_name}")

        return super().__call__(**kwargs)

class BaseModel(metaclass=Meta):
    def __init__(self, **kwargs):
        for field_name, field_value in kwargs.items():
            setattr(self, field_name, field_value)

class Account(BaseModel):
    first_name: str
    last_name: str
    username: str

account = Account(first_name="Hakan", last_name="Çelik", username="hakancelik")

assert account.__slots__ == ("first_name", "last_name", "username")
assert account.__dict__ == {}

assert account.first_name == "Hakan"
assert account.last_name == "Çelik"
assert account.username == "hakancelik"

# Account(first_name="Hakan", last_name="Çelik", username=1)
```

## `Meta.__new__` — Otomatik `__slots__`

`__new__` sınıf oluşturulurken çalışır. `not [base for base in bases if isinstance(base, mcs)]`
koşulu `BaseModel`'in kendisini atlar (onun hiçbir base'i `Meta` örneği değildir);
yalnızca alt sınıflar (`Account` gibi) işlenir.

`__annotations__` sözlüğündeki alan adları alınıp `__slots__` olarak atanır:

```python
namespace["__slots__"] = ("first_name", "last_name", "username")
```

`__slots__` tanımlandığında Python `__dict__` oluşturmaz — bu bellek tasarrufu sağlar
ve `account.__dict__ == {}` assertion'ını geçerli kılar.

## `Meta.__call__` — Tip Doğrulama

`Account(...)` çağrısında, `super().__call__()` çağrılmadan önce iki kontrol yapılır:

1. Her zorunlu alan verilmiş mi? (`Missing field`)
2. Her alanın tipi doğru mu? (`isinstance(value, type)`)
3. Bilinmeyen bir alan verilmiş mi? (`Unknown field`)

Son satırdaki yorum `Account(username=1)` çağrısının `AssertionError` fırlattığını
gösteriyor: `username` bir `int`, ama `str` bekleniyor.

## `BaseModel.__init__`

`super().__call__(**kwargs)` sonunda `BaseModel.__init__` çalışır ve doğrulanmış
`kwargs`'ı `setattr` ile alanlara yazar. `__slots__` tanımlı olduğundan `setattr`
yalnızca izin verilen alanlara yazar.
