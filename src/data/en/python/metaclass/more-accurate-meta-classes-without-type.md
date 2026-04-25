---
publishDate: 2023-02-16T00:00:00Z
author: Hakan Çelik
title: "More Accurate Meta Classes Without Type"
excerpt: "A more complete metaclass implementation without deriving from type: a two-phase lifecycle managed by __call__, and delegation of __str__ and attribute access to the namespace."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 8
image: /images/posts/meta-classes-without-type.png
tags:
  - python
  - metaclass
---

# More Accurate Meta Classes Without Type

In the previous post we implemented the basic metaclass protocol without deriving
from `type`. This time we have a more complete version: `__call__` manages a
two-phase lifecycle, and `__str__` along with all attribute/item operations are
delegated to the namespace.

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

## Two-Phase Lifecycle

A `Meta` instance (i.e., `Klass`) is called in two different ways; the
`__call_run` flag distinguishes these two phases:

**Phase 1 — `klass = Klass(1, a=1)` (first call, `__call_run = False`)**

`Meta.__call__` takes over:
- Because `__call_run` is False, it runs `__new__` and `__init__` from the class body
- `Klass.__new__(self, 1, a=1)` → `return cls` → `obj = Klass`'s Meta instance
- `Klass.__init__(obj, 1, a=1)` → `pass`
- Marks `__call_run = True`
- Returns `obj` → `klass` is the Meta instance of `Klass` itself

**Phase 2 — `klass(deneme=3)` (subsequent call, `__call_run = True`)**

`Meta.__call__` takes over again:
- Because `__call_run` is True, it fetches `__call__` from the namespace and runs it
- `Klass.__call__(self, deneme=3)` → `return self`

**`print(klass)` → `<Klass: Klass>`**

`Meta.__str__` is called; since `__call_run = True`, it delegates to `__str__` in
the namespace: `Klass.__str__(klass)` → `"<Klass: {}>".format(self.name)` →
`self.name = "Klass"` (stored in `Meta.__init__`).

## Why Is `__prepare__` Not a classmethod?

In this implementation `__prepare__` is defined as a plain function. Python performs
a special lookup on `__prepare__` and calls it directly; it is not required to be a
`classmethod`. As a result, the `name` and `bases` arguments arrive as the first and
second parameters — without `cls/mcs`.
