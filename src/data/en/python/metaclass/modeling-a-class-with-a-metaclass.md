---
publishDate: 2022-11-10T00:00:00Z
author: Hakan Çelik
title: "Modeling a Class with a Metaclass"
excerpt: "A dataclass-like structure built with a metaclass: automatic __slots__ derived from type annotations and runtime type validation inside __call__."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 13
image: ~/assets/images/blog/python.jpg
tags:
  - python
  - metaclass
---

# Modeling a Class with a Metaclass

In this example a metaclass does two things automatically: it derives `__slots__`
from `__annotations__`, and it validates the presence and type of fields when an
instance is created. It is a dataclass-like structure written from scratch that
explicitly demonstrates the metaclass mechanism:

```python
class Meta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        if not [base for base in bases if isinstance(base, mcs)]:
            return super().__new__(mcs, name, bases, namespace, **kwargs)

        annotations = namespace.get('__annotations__', {})
        namespace["__slots__"] = tuple(annotations.keys())  # auto __slots__

        return super().__new__(mcs, name, bases, namespace, **kwargs)

    def __call__(cls, **kwargs):
        for field_name, field_type in cls.__annotations__.items():
            if field_name not in kwargs:
                raise ValueError(f"Missing field {field_name}")
            else:
                assert isinstance(kwargs[field_name], field_type), f"Field {field_name} must be of type {field_type}"

        for field_name, field_value in kwargs.items():
            if field_name not in cls.__annotations__:
                raise ValueError(f"Unknown field {field_name}")

        return super().__call__(**kwargs)

class BaseModel(metaclass=Meta):
    def __init__(self, **kwargs):
        for field_name, field_value in kwargs.items():
            setattr(self, field_name, field_value)

class Account(BaseModel):
    first_name: str
    last_name: str
    username: str

account = Account(first_name="Hakan", last_name="Çelik", username="hakancelik")

assert account.__slots__ == ("first_name", "last_name", "username")
assert account.__dict__ == {}

assert account.first_name == "Hakan"
assert account.last_name == "Çelik"
assert account.username == "hakancelik"

# Account(first_name="Hakan", last_name="Çelik", username=1)
```

## `Meta.__new__` — Automatic `__slots__`

`__new__` runs when the class is being created. The condition
`not [base for base in bases if isinstance(base, mcs)]` skips `BaseModel` itself
(none of its bases are instances of `Meta`); only subclasses (like `Account`) are
processed.

The field names in the `__annotations__` dictionary are taken and assigned as
`__slots__`:

```python
namespace["__slots__"] = ("first_name", "last_name", "username")
```

When `__slots__` is defined Python does not create a `__dict__` — this saves
memory and makes the `account.__dict__ == {}` assertion valid.

## `Meta.__call__` — Type Validation

When `Account(...)` is called, two checks are performed before `super().__call__()`:

1. Has every required field been provided? (`Missing field`)
2. Is the type of every field correct? (`isinstance(value, type)`)
3. Has an unknown field been provided? (`Unknown field`)

The commented-out last line shows that calling `Account(username=1)` raises an
`AssertionError`: `username` is an `int`, but `str` is expected.

## `BaseModel.__init__`

At the end, `super().__call__(**kwargs)` runs `BaseModel.__init__`, which writes
the validated `kwargs` to the fields using `setattr`. Because `__slots__` is
defined, `setattr` can only write to permitted fields.
