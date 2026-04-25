---
publishDate: 2023-02-02T00:00:00Z
author: Hakan Çelik
title: "namespace['attr'] = 1"
excerpt: "To see how Python truly processes a class statement: get a namespace with type.__prepare__, execute the body with exec, then build the class with type()."
category: Python
subcategory: Metaclass
series: "Python Metaclass Series"
seriesIndex: 5
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

# namespace['attr'] = 1

In the previous post we built the namespace manually as a plain dict. This time
we are reproducing more accurately what Python actually does when it processes a
`class` statement:

```python
import textwrap

class Example:
	attr = 1

	def method(self):
		return "method"

name = "Example"
bases = ()
namespace = type.__prepare__(name, bases)  # >>> {}, default is dict()
# namespace["attr"] = 1
# namespace["method"] = lambda self: "method"

body = textwrap.dedent(
	"""\
	attr = 1

	def method(self):
		return "method"
	"""
)

exec(body, globals(), namespace)
Example = type(name, bases, namespace)  # type: ignore

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{Example().attr=}")        # 1
print(f"{Example().method()=}")    # 'method'

assert isinstance(Example, type)
assert isinstance(Example(), Example)
```

## Three Steps

**1. `type.__prepare__(name, bases)`**
Returns an empty `dict` — this namespace will hold all assignments written inside
the class body. A custom metaclass can override this step and return something other
than a plain `dict` (see the _Logging Namespace_ post).

**2. `exec(body, globals(), namespace)`**
Takes the class body as a string and runs it into the `namespace` dict. This is the
exact counterpart of what Python does while processing a `class` block. Once `exec`
finishes, `namespace` contains:

```python
{
    'attr': 1,
    'method': <function method at ...>,
    '__module__': '__main__',
    '__qualname__': 'Example',
}
```

**3. `type(name, bases, namespace)`**
Creates the class from the populated namespace. The result is identical to writing
`class Example: ...`.

## Why Does This Matter?

When you write a custom metaclass, the `__prepare__`, `__new__`, and `__init__`
methods correspond exactly to these three steps. While Python hides this process
from you, this example lets you see "behind the curtain".
