---
publishDate: 2023-01-19T00:00:00Z
author: Hakan Çelik
title: "Metaclasses In Python"
excerpt: "Let's add an intermediate layer to the class creation phase."
category: Python
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

> Let's add an intermediate layer to the class creation phase.

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