---
publishDate: 2022-12-08T00:00:00Z
author: Hakan Çelik
title: "--------"
excerpt: ""
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
category: Python
tags:
  - python
  - metaclass
---

```python
class Meta(type):
    instance = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls.instance:
            cls.instance[cls] = super().__call__(*args, **kwargs)

        return cls.instance[cls]

class Singleton(metaclass=Meta):
    pass

class Example(Singleton):
    pass

class Example2(Singleton):
    pass

assert Example is not Example2
assert Singleton is not Example
assert Singleton is not Example2

assert Singleton() is Singleton()
assert Example() is Example()
assert Example2() is Example2()

assert Example() is not Example2()

# --------

class Meta(type):
    instance = {}

    def __new__(mcs, *args, **kwargs):
        if not hasattr(mcs, 'obj'):
            mcs.obj = super().__new__(mcs, *args, **kwargs)
        return mcs.obj

    def __call__(cls, *args, **kwargs):
        if cls not in cls.instance:
            cls.instance[cls] = super().__call__(*args, **kwargs)

        return cls.instance[cls]

class Singleton(metaclass=Meta):
    pass

class Example(Singleton):
    pass

class Example2(Singleton):
    pass

assert Example is Example2
assert Singleton is Example
assert Singleton is Example2

assert Singleton() is Singleton()
assert Example() is Example()
assert Example2() is Example2()

assert Example() is Example2()
```