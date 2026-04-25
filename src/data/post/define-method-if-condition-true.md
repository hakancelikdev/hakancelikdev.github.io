---
publishDate: 2022-10-13T00:00:00Z
author: Hakan Çelik
title: "Define Method If Condition True"
excerpt: "defineif kütüphanesinin implementasyonu: __prepare__ ile özelleştirilmiş namespace, sınıf oluşturulurken boolean koşula göre metodları sessizce tanımlar ya da atlar."
category: Python
subcategory: Metaclass
series: "Python Metaclass Serisi"
seriesIndex: 14
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Define Method If Condition True

Bu kod, kendi geliştirdiğim [defineif](https://github.com/hakancelikdev/defineif)
kütüphanesinin çekirdek implementasyonudur. Sınıf gövdesindeki bir metodu yalnızca
bir koşul `True` olduğunda tanımlamayı sağlar; koşul `False` ise metot sessizce
atlanır.

```python
import inspect
import typing

__all__ = ("DefineMeta", "Namespace")

FuncT = typing.Callable[[typing.Any], typing.Any]  # unexport: not-public

class NotSet:  # unexport: not-public
    ...

class Namespace(dict):
    test: typing.List[bool] = []  # TODO: rename

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        super().__setitem__("define_if", self.define_if)

    def __setitem__(self, key: str, value: typing.Any):
        if inspect.isfunction(value):
            if self.test:
                if self.test.pop() is True:
                    super().__setitem__(key, value)
            else:
                super().__setitem__(key, value)
        else:
            super().__setitem__(key, value)

    @classmethod
    def define_if(cls, condition: bool) -> typing.Callable[[typing.Callable], FuncT]:
        def wrapper(func: FuncT) -> FuncT:
            cls.test.append(condition)
            return func

        return wrapper

class DefineMeta(type):
    if typing.TYPE_CHECKING:

        @classmethod
        def define_if(mcs, condition: bool) -> typing.Callable[[typing.Callable], FuncT]:
            ...

    @classmethod
    def __prepare__(mcs, name, bases, **kwargs) -> typing.Union["Namespace", dict]:  # type: ignore[override]  # noqa: E501
        return Namespace()

    def __call__(cls, condition: typing.Union[bool, typing.Type[NotSet], None] = NotSet):
        if condition is NotSet:
            return super().__call__()
        else:
            assert isinstance(condition, bool)
            return cls.define_if(condition)

class Defineif(metaclass=DefineMeta):
    pass

define_if = Defineif

class Example(metaclass=DefineMeta):
    @define_if(condition=True)
    def foo(self):
        return True

    @define_if(condition=False)
    def foo(self):
        return False

assert Example().foo() is True
```

## Nasıl Çalışır?

Mekanizma üç parçadan oluşur:

### 1. `Namespace(dict)` — Özel Namespace

`DefineMeta.__prepare__` standart `dict` yerine `Namespace` döndürür. Sınıf gövdesi
çalıştırılırken her atama `Namespace.__setitem__` üzerinden geçer.

Bir fonksiyon atanırken (`inspect.isfunction(value)` True) `Namespace.test` listesine
bakılır:
- Liste doluysa `test.pop()` ile koşul alınır: `True` ise metot eklenir, `False` ise
  sessizce atlanır.
- Liste boşsa koşulsuz eklenir (normal metot tanımı).

### 2. `define_if(condition)` — Koşul Decorator'ı

`@define_if(condition=True)` çağrıldığında `condition` değeri `Namespace.test`
listesine eklenir ve fonksiyon olduğu gibi döndürülür. Python bu fonksiyonu hemen
ardından `Namespace.__setitem__`'e atar — bu noktada `test.pop()` koşulu okur.

```
@define_if(condition=True)   # → test.append(True)
def foo(self): ...            # → Namespace.__setitem__ → test.pop() is True → eklenir

@define_if(condition=False)  # → test.append(False)
def foo(self): ...            # → Namespace.__setitem__ → test.pop() is False → atlanır
```

Sonuç: `foo` adlı slot yalnızca `True` koşullu tanımı tutar.

### 3. `DefineMeta.__call__` — Çift Kullanım

`Defineif` (ve `define_if` kısayolu) iki şekilde çağrılabilir:

- `Defineif()` — `condition` verilmezse `NotSet` varsayılanı tetiklenir,
  `super().__call__()` çalışır ve normal bir sınıf örneği döner.
- `Defineif(condition=True)` — `condition` verilirse `cls.define_if(condition)`
  döndürülür; bu da `@decorator` gibi kullanılabilecek bir callable'dır.

## Sonuç

```python
assert Example().foo() is True
```

`condition=True` ile tanımlanan `foo` sınıfta kaldı; `condition=False` ile tanımlanan
`foo` namespace'e hiç yazılmadı. `Example().foo()` → `True`.
