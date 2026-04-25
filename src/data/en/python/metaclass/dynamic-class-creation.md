---
publishDate: 2022-09-15T00:00:00Z
author: Hakan Çelik
title: "Dynamic Class Creation"
excerpt: "Writing `class Example: ...` and calling `type('Example', (), {...})` produce exactly the same result. Python transforms the class keyword into a type() call behind the scenes."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 2
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Dynamic Class Creation

The `class` keyword is merely syntactic sugar. Python transforms it behind the
scenes into a `type(name, bases, namespace)` call. The following two definitions
produce exactly the same class:

```python
class Example:
	attr = 1

	def method(self):
		return "method"

name = "Example"
bases = ()
namespace = {
	"attr": 1,
	"method": lambda self: "method"
}

Example = type(name, bases, namespace)

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{Example().attr=}")        # 1
print(f"{Example().method()=}")    # 'method'
```

```python
assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## The Three Arguments

In the `type(name, bases, namespace)` call:

- **`name`** — the name of the class (written to the `__name__` attribute).
- **`bases`** — a tuple of inherited classes; an empty tuple means deriving from
  `object`.
- **`namespace`** — a dictionary containing all assignments in the class body:
  attributes, methods, `__module__`, `__qualname__`, etc.

## Why Does This Matter?

Dynamic class creation is useful when you need to determine class names or
attributes at runtime — for example, when an ORM generates table definitions
from code, or when a plugin system registers plugins. This is also the first
step to understanding metaclasses: a metaclass is a class that takes the place
of `type` and controls this `type(name, bases, namespace)` call.
