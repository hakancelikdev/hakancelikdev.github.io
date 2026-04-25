---
publishDate: 2022-12-22T00:00:00Z
author: Hakan Çelik
title: "Invisible Metaclasses In Python"
excerpt: "Every class in Python has a metaclass. If you don't specify one explicitly, type steps in as the default — invisible, but always there."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 3
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Invisible Metaclasses In Python

Every class in Python has a metaclass. If you don't specify one explicitly, Python
uses the `type` metaclass by default. This means the following two class definitions
are completely equivalent:

```python
class K(metaclass=type):
    pass

class Example(K, metaclass=type):
    pass
```

In the code above, `metaclass=type` is written explicitly. But you get the same
result without writing it:

```python
class K:
    pass

class Example(K):
    pass
```

## What Does This Mean?

`type` sits at the very top of the metaclass hierarchy in Python. When you define a
class, Python does the following behind the scenes:

```python
>>> type(K)
<class 'type'>

>>> type(Example)
<class 'type'>
```

In both approaches the class's `type` is `type`, because when no metaclass is
specified Python automatically brings `type` into play. This is the "invisible
metaclass" behavior — you don't see it, but it is always there.

## Inheritance and Metaclass

When a class inherits from another, the parent class's metaclass is also inherited.
In the `Example(K)` example, since `K`'s metaclass is `type`, `Example`'s metaclass
is also `type`. When you define a custom metaclass this behavior changes:

```python
class Meta(type):
    pass

class K(metaclass=Meta):
    pass

class Example(K):  # Meta is inherited, not type
    pass

>>> type(Example)
<class '__main__.Meta'>
```

## Why Does This Matter?

The `type` metaclass remains invisible in most situations; however, understanding
this default behavior is critically important when you are writing your own metaclass
or examining a library's metaclass. Not specifying a metaclass does not mean "no
metaclass" — it simply means `type` is quietly doing its job.
