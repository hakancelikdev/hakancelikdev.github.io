---
publishDate: 2021-10-19T00:00:00Z
author: Hakan Çelik
title: "String Methods and Method Operations (Method, Method-Wrapper)"
excerpt: "Method Operations = Method Wrapper. An in-depth look at str object methods and method-wrappers in Python."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# String Methods and Method Operations (Method, Method-Wrapper)

## str Object Methods and Method Operations (Method, Method-Wrapper)

### Introduction

In previous articles we introduced Python and functions, learned to use a few functions,
touched on types, and examined conditional statements. Now we will tackle a much larger
and more interesting topic. We previously learned that everything in Python is an object
and we got to know the `str` type — let us now dive a little deeper together.

### What is a Method?

Methods are functions that belong to a class (object).

### What is a Method-Wrapper?

Method-wrappers are themselves methods, defined at the C level for built-in objects,
that make certain operations faster.

The wrappers covered here exist on every object defined in Python. I am progressing
through the `str` object in this article, but it is worth noting that they are universal.

> Python is written in C.

We generally use these methods without realising it. For example:

```python
>>> "string" <= "string"
>>> "1" == "1"
```

These operations are carried out by method-wrappers.

## Method-Wrappers

Understanding wrappers matters for object-oriented programming (OOP) because once we
know them we can override them in our own classes.

### `__ne__` — Not-Equal-To Operation Method

Open the Python console and type one of the following:

- `"".__ne__`
- `str('').__ne__`
- `"test".__ne__`

You will see output similar to
`<method-wrapper '__ne__' of str object at 0x0000024D27BB7C70>`, confirming that
`__ne__` on a `str` object is a **method-wrapper**.

#### What does `__ne__` do and how is it used?

```python
>>> "".__ne__.__doc__
'Return self!=value.'
```

It returns `True` if the object (self) is **not equal** to the given value.

```python
>>> "".__ne__("")     # same value → False
False
>>> "1".__ne__("")    # different values → True
True
```

The same operation written the normal way:

```python
>>> "" != ""
False
>>> "1" != ""
True
```

### `__mul__` — Multiplication Operation Method

```python
>>> str(1).__mul__.__doc__
'Return self*value.'
```

It multiplies the string by the given value:

```python
>>> str(1).__mul__(3)
'111'
>>> str("-").__mul__(13)
'-------------'
```

The familiar shorthand:

```python
>>> "-" * 13
'-------------'
```

Python uses this wrapper internally. You can even change the result of `"-" * 30` by
overriding `__mul__` in a subclass:

```python
class TStr(str):
    def __mul__(self, times):
        return times   # return the multiplier instead of repeating the string

test_str = TStr("this is a test class")
print(test_str * 3)   # outputs: 3
```

### `__lt__` — Less-Than Operation Method

```python
>>> "".__lt__.__doc__
'Return self<value.'
```

```python
>>> "".__lt__("123")
True
>>> "" < "123"
True
```

You can override `__lt__` in a custom class:

```python
class MyStrClass(str):
    def __lt__(self, text):
        return text   # return the right-hand operand instead of a bool

my_str = MyStrClass("my str object")
print(my_str < "test string")
# output: 'test string'
```

### `__len__` — Length Operation

```python
>>> "".__len__.__doc__
'Return len(self).'
```

Works exactly like the built-in `len()` function:

```python
>>> "33".__len__()
2
>>> [1, 2, 3].__len__()
3
```

### `__le__` — Less-Than-or-Equal-To Operation

```python
>>> "".__le__.__doc__
'Return self<=value.'
```

```python
>>> "test a".__le__("test a")
True
>>> "test a e".__le__("test a")
False
```

### `__eq__` — Equality Operation

```python
>>> "hakan".__eq__("hakan")
True
>>> "hakan celik".__eq__("hakan")
False
>>> "hakan" == "hakan"
True
```

### `__ge__` — Greater-Than-or-Equal-To Operation

Implements `"hakan" >= "celik"`, or equivalently `"hakan".__ge__("celik")`.

### `__gt__` — Greater-Than Operation

Implements `"hakan" > "celik"`, or equivalently `"hakan".__gt__("celik")`.

### `__iter__` — Iterator Operation

Turns the string into an iterator:

```python
>>> for i in "test".__iter__():
...     print(i)
```

```python
>>> for i in "test":
...     print(i)
```

Both examples do the same thing — we use `__iter__` without realising it.

### `__init_subclass__`

Runs when the class is subclassed. More information:
[PEP 487 -- Simpler customisation of class creation](https://www.python.org/dev/peps/pep-0487/)

### `__new__`

The first method called when an object is instantiated. The equivalent of a constructor
in other languages.

### `__init__`

Used to assign attributes when an object is instantiated.

---

## Methods

### swapcase()

Converts uppercase characters to lowercase and lowercase characters to uppercase.

```python
>>> "AbCd ".swapcase()
'aBcD '
```

### partition()

Splits the string into three parts using the given separator. Returns a 3-tuple.

```python
>>> "1231 1".partition("2")
('1', '2', '31 1')
>>> "a".partition("a")
('', 'a', '')
```

### maketrans()

Takes a single `dict` parameter and is used together with `translate()` to replace characters.

```python
>>> str().maketrans(dict(a=1))
{97: 1}
```

### translate()

Replaces each character in the string according to a translation table built with `maketrans()`.

```python
>>> "b".translate(str().maketrans(dict(b="r")))
'r'
>>> "bcca".translate(str().maketrans(dict(c="r")))
'brra'
```

### ljust()

Takes an integer parameter and pads the string with spaces on the right to reach that width.

```python
>>> "Hakan".ljust(11)
'Hakan      '
```

### join()

Takes a `list` or `tuple` and inserts the string between each element.

```python
>>> "/".join(["path", "to"])
'path/to'
```

### istitle()

Returns `True` if the string is in title case.

```python
>>> "This Is A Title".istitle()
True
>>> "This is a title".istitle()
False
```

### isspace()

Returns `True` if the string consists only of whitespace characters.

```python
>>> str().isspace()
False
>>> str("  ").isspace()
True
```

### islower()

Returns `True` if all characters are lowercase.

```python
>>> "Ab".islower()
False
>>> "ab".islower()
True
```

### isdecimal()

Returns `True` if all characters can be converted to a number.

```python
>>> "1".isdecimal()
True
>>> "a 1".isdecimal()
False
>>> "1234".isdecimal()
True
```

### isascii()

Returns `True` if all characters are ASCII.

```python
>>> "asd".isascii()
True
```

### isalpha()

Returns `True` if the string consists only of alphabetic characters.

```python
>>> "asd".isalpha()
True
>>> "123".isalpha()
False
```

### isalnum()

Returns `True` if the string consists only of letters or numbers.

```python
>>> "12s".isalnum()
True
>>> "test a".isalnum()   # space → False
False
```

### index()

Returns the index of the first occurrence of the given substring.

```python
>>> "test a".index("a")
5
```

### expandtabs()

Expands tab escape characters (`\t`) into spaces. Default tab size is 8.

```python
>>> "test \t".expandtabs()
'test    '
```

### count()

Returns how many times the given substring appears.

```python
>>> "I love you 3000".count("0")
3
```

### center()

Centers the string within the given total width.

```python
>>> "I do not feel good".center(30)
'      I do not feel good      '
```
