---
publishDate: 2023-01-19T00:00:00Z
author: Hakan Çelik
title: "Metaclasses In Python"
excerpt: "A metaclass is a class whose instances are classes. Just as type produces classes like int or str, a custom metaclass produces its own classes in the same way."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 4
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Metaclasses In Python

A metaclass is used to add an intermediate layer to the class creation process.
Any class that derives from `type` can be a metaclass; `type` itself is Python's
default metaclass.

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

## What Does the Output Tell Us?

- `Meta.__class__` → `<class 'type'>` — Meta itself is an instance of `type`;
  that is, Meta is a class, so its type is `type`.
- `Example.__class__` → `<class '__main__.Meta'>` — Example is now created by
  `Meta` rather than `type`; its type is `Meta`.
- `Example().__class__` → `<class '__main__.Example'>` — ordinary instances
  return their own class as expected.

## The assert Lines

```python
assert isinstance(Meta, type)       # Meta is an instance of type (Meta is a class)
assert isinstance(Example, Meta)    # Example is an instance of Meta (Meta is a metaclass)
assert isinstance(Example(), Example)  # Instances are instances of their own class
```

## Analogy

The relationship `type` → `int` is identical to the relationship `Meta` → `Example`:

- `type` is used to create the `int` class; `int`'s type is `type`.
- `Meta` is used to create the `Example` class; `Example`'s type is `Meta`.

This is where a metaclass becomes useful: by overriding `Meta.__new__`, `Meta.__init__`,
or `Meta.__call__` during class creation, you can change the class-definition behavior.
