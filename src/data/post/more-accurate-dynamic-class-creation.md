---
publishDate: 2023-02-02T00:00:00Z
author: Hakan Çelik
title: "namespace['attr'] = 1"
excerpt: "Another example of dynamic class creation"
category: Python
image: /images/posts/understanding-python-classes.png
tags:
  - python
  - metaclass
---

> Another example of dynamic class creation

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