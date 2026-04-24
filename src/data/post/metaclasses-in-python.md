---
publishDate: 2023-01-19T00:00:00Z
author: Hakan Çelik
title: "Metaclasses In Python"
excerpt: "Let's add an intermediate layer to the class creation phase."
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
category: Python
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