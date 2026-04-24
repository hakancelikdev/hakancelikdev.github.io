---
publishDate: 2022-10-27T00:00:00Z
author: Hakan Çelik
title: "Logging Namespace"
excerpt: "Log every attribute assignment during class body execution by returning a custom dict from __prepare__."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

```python
class LoggingDict(dict):
    def __setitem__(self, key, value):
        print("d[%r] = %r" % (key, value))
        dict.__setitem__(self, key, value)

class Meta(type):
    @classmethod
    def __prepare__(mcs, name, bases):
        return LoggingDict()

class C(metaclass=Meta):
    foo = 2+2
    foo = 42
    bar = 123

    def __int__(self):
        pass
```