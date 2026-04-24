---
publishDate: 2022-12-22T00:00:00Z
author: Hakan Çelik
title: "Invisible Metaclasses In Python"
excerpt: "Implicit metaclasses in Python — when you don't specify one, type is used invisibly as the default."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

```python
class K(metaclass=type):
    pass

class Example(K, metaclass=type):
    pass

class K:
    pass

class Example(K):
    pass
```