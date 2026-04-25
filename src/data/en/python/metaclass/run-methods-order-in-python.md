---
publishDate: 2023-03-16T00:00:00Z
author: Hakan Çelik
title: "Run Methods Order In Python"
excerpt: "Which method runs when in Python metaclasses? The execution order of __prepare__, __new__, __init__, and __call__ during class definition and instance creation."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 9
image: /images/posts/run-methods-order-in-python.png
tags:
  - python
  - metaclass
---

# Run Methods Order In Python

Understanding which method is triggered at which point when a metaclass is defined
is the most critical part of writing metaclasses. The code below adds a `print` at
the start of each method to make the execution order visible:

```python
class Meta(type):
    @classmethod
    def __prepare__(mcs, cls_name, bases, **kwargs):  # default, staticmethod
        print("Meta.__prepare__")
        return super().__prepare__(cls_name, bases)

    def __new__(mcs, cls_name, bases, namespace, **kwargs):
        print(f"Meta.__new__")
        return super().__new__(mcs, cls_name, bases, namespace)

    def __init__(cls, cls_name, bases, namespace, **kwargs):
        print(f"Meta.__init__")
        super().__init__(cls_name, bases, namespace, **kwargs)

    def __call__(cls, *args, **kwargs):
        print(f"Meta.__call__")
        return super().__call__(*args, **kwargs)

class Base:
    pass

class Example(Base, metaclass=Meta):  # Order: Meta.__prepare__, Meta.__new__, Meta.__init__
    # def __prepare__(mcs, cls_name, bases):  # it doesn't work, in this way

    def __new__(cls, *args, **kwargs):
        print(f"Example.__new__")
        return super().__new__(cls)

    def __init__(self):
        print(f"Example.__init__")

    def __call__(self, *args, **kwargs):
        print(f"Example.__call__")

base = Example()             # Meta.__call__, Example.__new__, Example.__init__
base()                       # Example.__call__
```

## Execution Order

**While the class is being defined** (when the `class Example(Base, metaclass=Meta):` line is read):

```
Meta.__prepare__   ← namespace dict is prepared
Meta.__new__       ← class object is created
Meta.__init__      ← class object is initialized
```

**While an instance is being created** (`base = Example()`):

```
Meta.__call__      ← the metaclass's __call__ is triggered (calls super().__call__)
Example.__new__    ← instance object is created
Example.__init__   ← instance object is initialized
```

**While an instance is being called** (`base()`):

```
Example.__call__   ← the object's own __call__ is triggered because it is callable
```

## Why Is `__prepare__` a `@classmethod`?

`__prepare__` is called before the class has been created; therefore it cannot
receive a class instance as `self`. With `@classmethod` it receives the metaclass
itself (`mcs`). A subtle detail: as noted in the comment, `__prepare__` cannot be
defined inside the class body — it only works on the metaclass.
