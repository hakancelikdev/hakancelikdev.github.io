---
publishDate: 2023-03-02T00:00:00Z
author: Hakan Çelik
title: "Run Methods Order In Python With More Explanation"
excerpt: "The execution order of metaclass methods together with their full argument lists. Follow step by step which values arrive at each method."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 10
image: /images/posts/run-methods-order-in-python.png
tags:
  - python
  - metaclass
---

# Run Methods Order In Python With More Explanation

In the previous post we only printed the method name. This time each method logs
its full set of arguments, which is ideal for following step by step what values
Python passes and where. The inline comments show the actual output at each
execution point.

```python
class Meta(type):
    @classmethod
    def __prepare__(mcs, cls_name, bases, **kwargs):  # default, staticmethod
        prepare = super().__prepare__(cls_name, bases)
        print(f"Meta.__prepare__({mcs=}, {cls_name=}, {bases=}, {prepare=})")
        #       Meta.__prepare__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name='Example',
        #           bases=(<class '__main__.Base'>,),
        #           prepare={}
        #       )
        return prepare

    def __new__(mcs, cls_name, bases, namespace, **kwargs):
        new = super().__new__(mcs, cls_name, bases, namespace)
        print(f"Meta.__new__({mcs=}, {cls_name=}, {bases=}, {namespace=}, {kwargs=}, {new=})")
        #       Meta.__new__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name='Example',
        #           bases=(<class '__main__.Base'>,),
        #           namespace={'__module__': '__main__', '__qualname__': 'Example', '__new__': <function Example.__new__ at 0x109203c10>, '__init__': <function Example.__init__ at 0x109203ca0>},  # noqa
        #           kwargs={},
        #           new=<class '__main__.Example'> ( self )
        #       )
        return new

    def __init__(cls, cls_name, bases, namespace, **kwargs):
        init = super().__init__(cls_name, bases, namespace, **kwargs)
        print(f"Meta.__init__({cls=}, {cls_name=}, {bases=}, {namespace}, {kwargs=}, {init=})")
        #       Meta.__init__(
        #           cls=<class '__main__.Example'>,  ( self )
        #           cls_name='Example',
        #           bases=(<class '__main__.Base'>,),
        #           namespace={'__module__': '__main__', '__qualname__': 'Example', '__new__': <function Example.__new__ at 0x109203c10>, '__init__': <function Example.__init__ at 0x109203ca0>},  # noqa
        #           kwargs={},
        #           init=None  ( int return None )
        #       )

    def __call__(cls, *args, **kwargs):
        call = super().__call__(*args, **kwargs)
        print(f"Meta.__call__({cls=}, {args=}, {kwargs=}, {call=})")
        #       Meta.__call__(
        #           cls=<class '__main__.Example'>,
        #           args=(1, 2),
        #           kwargs={'c': 3},
        #           call=<__main__.Example object at 0x10d4c3940>
        #       )
        return call

class Base:
    pass

class Example(Base, metaclass=Meta):
    def __new__(cls, *args, **kwargs):
        new = super().__new__(cls)
        print(f"Example.__new__({cls=}, {args=}, {kwargs=}, {new=})")
        #       Example.__new__(
        #           cls=<class '__main__.Example'>,
        #           args=(1, 2)
        #           kwargs={'c': 3},
        #           new=<__main__.Example object at 0x109226a90>
        #       )
        return new

    def __init__(self, a, b, c):
        print(f"Example.__init__({self=}, {a=}, {b=}, {c=})")
        #       Example.__init__(
        #           self=<__main__.Example object at 0x10dd9e940>,
        #           a=1,
        #           b=2,
        #           c=3
        #       )
        self.a = a
        self.b = b
        self.c = c

    def __call__(self, *args, **kwargs):
        print(f"Example.__call__({self=}, {args=}, {kwargs=})")
        #       Example.__call__(
        #           self=<__main__.Example object at 0x10b2eea90>,
        #           args=(1,),
        #           kwargs={'k': 1}
        #       )

base = Example(1, 2, c=3)
base(1, k=1)
```

## Things to Watch For

**`__new__` and `__init__` arguments come from `__call__`.**
The chain `Meta.__call__` → `Example.__new__` → `Example.__init__` is driven by
`super().__call__(*args, **kwargs)`. `args=(1, 2)` and `kwargs={'c': 3}` are
forwarded identically to all three methods.

**`namespace` is populated in `__new__` but empty in `__prepare__`.**
When `__prepare__` is called the body has not been executed yet; namespace returns
`{}`. By the time it reaches `__new__`, namespace already contains all definitions
such as `__new__`, `__init__`, and `__qualname__`.

**The return value of `__init__` is `None`.**
You can see `init=None` in the output; `__init__` does not return anything — it
modifies the class in place.
