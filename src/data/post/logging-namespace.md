---
publishDate: 2022-10-27T00:00:00Z
author: Hakan Çelik
title: "Logging Namespace"
excerpt: ""
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
category: Python
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