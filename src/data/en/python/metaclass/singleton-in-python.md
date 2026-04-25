---
publishDate: 2022-12-08T00:00:00Z
author: Hakan Çelik
title: "Singleton in Python"
excerpt: "Two ways to implement the Singleton pattern with a metaclass in Python — and the critical difference between them: in one, subclasses are separate objects; in the other, they are the same object."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 12
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Singleton in Python

Singleton is a design pattern that guarantees only a single instance is created
from a class. In Python it is possible to implement this through the `__call__`
method on a metaclass. Below, two different implementations are compared — both
work, but their behaviors differ significantly:

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

## Approach 1: Only `__call__`

`Meta.__call__` kicks in every time a class is called. The `instance` dict uses
the class as a key: on the first call the instance is created, and on subsequent
calls the same instance is returned.

**Result:** Each class is a separate object (`Example is not Example2`), but each
has its own singleton. `Example()` and `Example2()` return different instances.

## Approach 2: `__new__` + `__call__`

`Meta.__new__` runs for every **class** created through a metaclass (not for
instances). With the condition `if not hasattr(mcs, 'obj')`, whichever class is
first created through `Meta` is stored as `mcs.obj`; every subsequent `type.__new__`
call returns that same object.

**Result:** `Singleton`, `Example`, and `Example2` are the same object
(`assert Example is Example2`). Consequently `Example()` and `Example2()` also
return the same instance.

## Critical Difference

| | Approach 1 | Approach 2 |
|---|---|---|
| `Example is Example2` | `False` — different classes | `True` — same object |
| `Example() is Example2()` | `False` — different instances | `True` — same instance |
| Use case | Separate singleton per class | Single singleton for the whole hierarchy |

For most Singleton needs, Approach 1 gives the expected behavior. Approach 2 is
a great example for understanding the `__new__` mechanism of metaclasses.
