---
publishDate: 2023-03-30T00:00:00Z
author: Hakan Çelik
title: "Understanding Python Classes"
excerpt: "In Python, everything is an object and every object has a type — including primitives, functions, and classes themselves. type() and __class__ reveal this relationship."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 1
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# Understanding Python Classes

In Python, everything is an object and every object has a type. This rule applies
to primitives just as it applies to classes themselves. The `type()` function or
the `.__class__` attribute returns the type of any object; the two always produce
the same result.

```python
class Example:
	attr = 1

	def method(self):
		return "method"

print(f"{type(44)=}")              # type(44)=<class 'int'>
print(f"{type('hello')=}")         # type('hello')=<class 'str'>
print(f"{type(())=}")              # type(())=<class 'tuple'>
print(f"{type([])=}")              # type([])=<class 'list'>

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{type(Example)=}")         # <class 'type'>
print(f"{type(type(type))=}")      # <class 'type'>

print(f"{Example().__class__=}")   # <class '__main__.Example'>

assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## What Does the Output Tell Us?

The first four lines show what we expect: `44` is an `int`, `'hello'` is a `str`.

The truly interesting part is the three lines in the middle:

- `Example.__class__` → `<class 'type'>` — the `Example` class itself is an
  instance of `type`. Classes are also objects; the type of these objects is `type`.
- `type(Example)` → same result; using `type()` and `.__class__` are equivalent.
- `type(type(type))` → still `<class 'type'>` — `type` is its own metaclass; its
  type is itself.

The last line completes the picture: `Example().__class__` → `<class '__main__.Example'>`.
An _instance_ created from a class returns its own class as its type — the same
logic as with ordinary objects.

## The assert Lines

```python
assert isinstance(Example, type)    # Classes are instances of type
assert isinstance(Example(), Example)  # Instances are instances of their own class
```

These two rules are the foundation of Python's object model. `type` sits at the top
of the metaclass hierarchy; all classes — whether we are aware of it or not — are
instances of `type`.
