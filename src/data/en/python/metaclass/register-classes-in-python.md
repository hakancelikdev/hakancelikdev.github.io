---
publishDate: 2022-11-24T00:00:00Z
author: Hakan Çelik
title: "Register Classes in Python"
excerpt: "Three ways to automatically register subclasses: metaclass __new__, __init_subclass__, and class decorator. Which one is more appropriate for which situation?"
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 11
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Register Classes in Python

Automatically adding subclasses that derive from a base class to a list is a
common need — it is used in plugin systems, command registries, or factory patterns.
Below, three different approaches that produce the same result are compared:

```python
class Meta(type):
    _names = []

    def __new__(mcs, name, bases, namespace, **kwargs):
        obj = super().__new__(mcs, name, bases, namespace)
        if not [b for b in bases if isinstance(b, mcs)]:  # mcs is a Base
            return obj

        mcs._names.append(name)
        return obj

class Base(metaclass=Meta):
    pass

class Example(Base):
    pass

class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]

# -------

class Base:
    _names = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls._names.append(cls.__name__)

class Example(Base):
    pass

class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]

# -------

def decorator(cls):
    if hasattr(cls, "_names"):
        cls._names.append(cls.__name__)
    else:
        cls._names = []

    return cls

@decorator
class Base:
    pass

@decorator
class Example(Base):
    pass

@decorator
class Example2(Base):
    pass

assert Example._names == ["Example", "Example2"]
assert Example2._names == ["Example", "Example2"]
```

## Approach 1: Metaclass `__new__`

`Meta.__new__` runs for every class definition — for both `Base` and its
subclasses. The condition `not [b for b in bases if isinstance(b, mcs)]` means
"if none of the inherited bases is an instance of Meta, this is the Base class —
don't register it". This way only real subclasses are added to the list.

## Approach 2: `__init_subclass__`

Added in Python 3.6. When a class is derived from another class, that class's
`__init_subclass__` method is called. No metaclass needs to be written and the
code is much cleaner. For simple subclass registration needs, `__init_subclass__`
is the recommended choice.

## Approach 3: Decorator

The most explicit approach — there is no hidden mechanism. `@decorator` must be
applied manually to each class; this is both its strength and its weakness. It is
easy to forget with many classes, but what is registered is always clearly visible.

## Which Approach Should You Choose?

- If automatic behavior and complex control are needed → **Metaclass**
- For simple subclass tracking → **`__init_subclass__`**
- For selective and explicit registration → **Decorator**
