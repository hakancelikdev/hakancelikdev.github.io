---
publishDate: 2023-03-30T00:00:00Z
author: Hakan Çelik
title: "Understanding Python Classes"
excerpt: "Every object in python has a type, and type(obj) == obj.class"
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
category: Python
tags:
  - python
  - metaclass
---

> Every object in python has a type, and type(obj) == obj.**class**

```python
class Example:
	attr = 1

	def method(self):
		return "method"

print(f"{type(44)=}")              # type(44)=<class 'int'>
print(f"{type('hello')=}")         # type('hello')=<class 'str'>
print(f"{type(())=}")              # type(())=<class 'tuple'>
print(f"{type([])=}")              # type([])=<class 'list'>

print(f"{Example.__class__=}")     # <class 'type'>
print(f"{type(Example)=}")         # <class 'type'>
print(f"{type(type(type))=}")      # <class 'type'>

print(f"{Example().__class__=}")   # <class '__main__.Example'>

assert isinstance(Example, type)
assert isinstance(Example(), Example)
```