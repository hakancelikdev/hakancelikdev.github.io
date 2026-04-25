---
publishDate: 2022-10-13T00:00:00Z
author: Hakan Çelik
title: "Define Method If Condition True"
excerpt: "The implementation of the defineif library: a customized namespace via __prepare__ that silently defines or skips methods at class creation time based on a boolean condition."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 14
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Define Method If Condition True

This code is the core implementation of [defineif](https://github.com/hakancelikdev/defineif),
a library I developed myself. It allows a method in the class body to be defined
only when a condition is `True`; if the condition is `False`, the method is
silently skipped.

```python
import inspect
import typing

__all__ = ("DefineMeta", "Namespace")

FuncT = typing.Callable[[typing.Any], typing.Any]  # unexport: not-public

class NotSet:  # unexport: not-public
    ...

class Namespace(dict):
    test: typing.List[bool] = []  # TODO: rename

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        super().__setitem__("define_if", self.define_if)

    def __setitem__(self, key: str, value: typing.Any):
        if inspect.isfunction(value):
            if self.test:
                if self.test.pop() is True:
                    super().__setitem__(key, value)
            else:
                super().__setitem__(key, value)
        else:
            super().__setitem__(key, value)

    @classmethod
    def define_if(cls, condition: bool) -> typing.Callable[[typing.Callable], FuncT]:
        def wrapper(func: FuncT) -> FuncT:
            cls.test.append(condition)
            return func

        return wrapper

class DefineMeta(type):
    if typing.TYPE_CHECKING:

        @classmethod
        def define_if(mcs, condition: bool) -> typing.Callable[[typing.Callable], FuncT]:
            ...

    @classmethod
    def __prepare__(mcs, name, bases, **kwargs) -> typing.Union["Namespace", dict]:  # type: ignore[override]  # noqa: E501
        return Namespace()

    def __call__(cls, condition: typing.Union[bool, typing.Type[NotSet], None] = NotSet):
        if condition is NotSet:
            return super().__call__()
        else:
            assert isinstance(condition, bool)
            return cls.define_if(condition)

class Defineif(metaclass=DefineMeta):
    pass

define_if = Defineif

class Example(metaclass=DefineMeta):
    @define_if(condition=True)
    def foo(self):
        return True

    @define_if(condition=False)
    def foo(self):
        return False

assert Example().foo() is True
```

## How It Works

The mechanism consists of three parts:

### 1. `Namespace(dict)` — Custom Namespace

`DefineMeta.__prepare__` returns a `Namespace` instead of a plain `dict`. While
the class body is being executed, every assignment passes through
`Namespace.__setitem__`.

When a function is being assigned (`inspect.isfunction(value)` is True), the
`Namespace.test` list is checked:
- If the list is non-empty, the condition is retrieved with `test.pop()`: if `True`
  the method is added; if `False` it is silently skipped.
- If the list is empty, it is added unconditionally (normal method definition).

### 2. `define_if(condition)` — Condition Decorator

When `@define_if(condition=True)` is called, the `condition` value is appended to
`Namespace.test` and the function is returned as-is. Python then immediately assigns
this function to `Namespace.__setitem__` — at which point `test.pop()` reads the
condition.

```
@define_if(condition=True)   # → test.append(True)
def foo(self): ...            # → Namespace.__setitem__ → test.pop() is True → added

@define_if(condition=False)  # → test.append(False)
def foo(self): ...            # → Namespace.__setitem__ → test.pop() is False → skipped
```

Result: the slot named `foo` holds only the definition with the `True` condition.

### 3. `DefineMeta.__call__` — Dual Use

`Defineif` (and the `define_if` shortcut) can be called in two ways:

- `Defineif()` — if `condition` is not provided, the `NotSet` default is triggered,
  `super().__call__()` runs, and a normal class instance is returned.
- `Defineif(condition=True)` — if `condition` is provided, `cls.define_if(condition)`
  is returned; this is a callable that can be used like a `@decorator`.

## Result

```python
assert Example().foo() is True
```

The `foo` defined with `condition=True` remained in the class; the `foo` defined
with `condition=False` was never written to the namespace. `Example().foo()` → `True`.
