---
publishDate: 2023-01-05T00:00:00Z
author: Hakan Çelik
title: "Meta Classes Without Type"
excerpt: "Is it possible to write a metaclass without deriving from type? Yes — but what you end up with is not a real Python class; it is an instance of Meta."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 7
image: /images/posts/meta-classes-without-type.png
tags:
  - python
  - metaclass
---

# Meta Classes Without Type

Normally a metaclass derives from `type`. But what happens if it doesn't? Python
calls `Meta.__prepare__`, `Meta.__new__`, `Meta.__init__`, and `Meta.__call__`
through the `metaclass=Meta` expression — regardless of whether `Meta` derives from
`type`. In this post we implement this protocol from scratch and log the exact
arguments received by each method:

```python
class Meta:  # this class is a normal class, Meta = instance of type, Only the Meta class does not contain the properties of the type.  # noqa
    @classmethod
    def __prepare__(mcs, cls_name, bases):  # default, staticmethod
        prepare = dict()
        print(f"Meta.__prepare__({mcs=}, {cls_name=}, {bases=}, {prepare=})")
        #       Meta.__prepare__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name='K',
        #           bases=(),
        #           prepare={}
        #       )

        #       Meta.__prepare__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name='Example',
        #           bases=(<__main__.Meta object at 0x10b3bea60>,),
        #           prepare={}
        #       )
        return prepare

    def __new__(cls, cls_name, bases, namespace, **kwargs):
        new = super().__new__(cls)
        print(f"Meta.__new__({cls=}, {cls_name=}, {bases=}, {namespace=}, {kwargs=}, {new=})")
        #       Meta.__new__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name=='K',
        #           bases=(),
        #           namespace={'__module__': '__main__', '__qualname__': 'K'},
        #           kwargs={},
        #           new=<class '__main__.Meta'> ( self )
        #       )

        #       Meta.__new__(
        #           mcs=<class '__main__.Meta'>,
        #           cls_name=='Example',
        #           bases=(<__main__.Meta object at 0x10b3bea60>,),
        #           namespace={'__module__': '__main__', '__qualname__': 'Example', '__new__': <function Example.__new__ at 0x10b3cab80>, '__init__': <function Example.__init__ at 0x10b3cac10>, '__call__': <function Example.__call__ at 0x10b3caca0>, '__classcell__': <cell at 0x10b3bea90: empty>},  # noqa
        #           kwargs={},
        #           new=<class '__main__.Meta'> ( self )
        #       )
        return new

    def __init__(self, cls_name, bases, namespace, **kwargs):
        init = super().__init__()
        print(f"Meta.__init__({self=}, {cls_name=}, {bases=}, {namespace}, {kwargs=}, {init=})")
        #       Meta.__init__(
        #           cls=<class '__main__.Example'>,  ( self )
        #           cls_name='K',
        #           bases=(),
        #           namespace={'__module__': '__main__', '__qualname__': 'K'},  # noqa
        #           kwargs={},
        #           init=None  ( int return None )
        #       )

        #       Meta.__init__(
        #           cls=<class '__main__.Example'>,  ( self )
        #           cls_name='Example',
        #           bases=(<__main__.Meta object at 0x10b3bea60>,),
        #           namespace={'__module__': '__main__', '__qualname__': 'Example', '__new__': <function Example.__new__ at 0x10b3cab80>, '__init__': <function Example.__init__ at 0x10b3cac10>, '__call__': <function Example.__call__ at 0x10b3caca0>, '__classcell__': <cell at 0x10b3bea90: empty>},  # noqa
        #           kwargs={},
        #           init=None  ( int return None )
        #       )

    def __call__(self, *args, **kwargs):
        print(f"Meta.__call__({self=}, {args=}, {kwargs=})")
        #       Meta.__call__(
        #           cls=<class '__main__.Meta'>,
        #           args=(1, 2),
        #           kwargs={'c': 3},
        #           call=<__main__.Example object at 0x10d4c3940>
        #       )

        #       Meta.__call__(
        #           cls=<class '__main__.Meta'>,
        #           args=(1,),
        #           kwargs={'k': 1},
        #           call=<__main__.Example object at 0x10d4c3940>
        #       )
        return self

class K(metaclass=Meta):  # In order to get inherit, it must be instanced of Meta.
    pass                  # Order: Meta.__prepare__, Meta.__new__, Meta.__init__

class Example(K, metaclass=Meta):  # Order: Meta.__prepare__, Meta.__new__, Meta.__init__
    pass

base = Example(1, 2, c=3)             # Meta.__call__
base(1, k=1)                          # Meta.__call__
```

## The Key Difference

When a metaclass that derives from `type` is used, `K` is a real Python class —
`isinstance`, `issubclass`, and other protocols work normally.

Here, `K` and `Example` are **instances** of `Meta`; they are not real Python
classes. `type(K)` → `<class '__main__.Meta'>`, `type(Example)` →
`<class '__main__.Meta'>`.

The call `Example(1, 2, c=3)` is not class instantiation; it is a call to
`Meta.__call__` on `Example`, which is an instance of `Meta` — Python handles
every callable object this way.

## What Is It Good For?

Its practical use is limited; its main value is educational. By implementing Python's
class creation protocol (`__prepare__` → `__new__` → `__init__`) and instance
creation protocol (`__call__` → `__new__` → `__init__`) step by step without the
help of `type`, you gain a deep understanding of the underlying mechanism.
