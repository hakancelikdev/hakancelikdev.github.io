---
publishDate: 2022-10-27T00:00:00Z
author: Hakan Çelik
title: "Logging Namespace"
excerpt: "Automatically record every assignment in the class body using the metaclass __prepare__ method — discover the power of a customized namespace."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 6
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Logging Namespace

When a class is defined in Python, all assignments in the class body are written
into a `dict`. The metaclass's `__prepare__` class method provides the opportunity
to create this dictionary ahead of time, allowing you to return a customized
namespace instead of a plain `dict`.

In the example below every assignment is automatically printed to the console:

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

## Output

When class `C` is defined, `__prepare__` is called and returns a `LoggingDict`.
Every assignment in the class body passes through `LoggingDict.__setitem__` and
prints the following to the console:

```
d['foo'] = 4
d['foo'] = 42
d['bar'] = 123
d['__int__'] = <function C.__int__ at 0x...>
```

Notice that `foo` appears twice; Python executes the class body line by line and
each assignment is triggered separately.

## How It Works

`__prepare__` runs **before** the class is created. While Python is compiling the
class body it uses the object returned by this method as the namespace. After the
class definition is complete, `type.__new__` takes this namespace and constructs
the class.

```python
# In a standard class definition Python does this behind the scenes:
namespace = Meta.__prepare__("C", ())   # LoggingDict()
# ... class body is executed, assignments are written to namespace ...
C = Meta("C", (), namespace)
```

## Why Is This Useful?

Customizing the namespace through `__prepare__` is helpful in the following situations:

- **Auditing / debugging**: Recording all assignments as in this example.
- **Duplicate definitions**: Catching cases where the same name is assigned more than
  one function, or applying custom behavior.
- **Redirection**: Writing certain names to different structures (caches, custom storage).
- **Ordered attributes**: Before Python 3.7 when `dict` was unordered, returning an
  `OrderedDict` was important for preserving the order of assignments.
