---
publishDate: 2022-12-22T00:00:00Z
author: Hakan Çelik
title: "Invisible Metaclasses In Python"
excerpt: ""
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
category: Python
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