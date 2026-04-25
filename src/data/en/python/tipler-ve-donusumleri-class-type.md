---
publishDate: 2021-11-02T00:00:00Z
author: Hakan Çelik
title: "Types and Type Conversions"
excerpt: "First let us recall which data types exist in Python, then learn how to convert between them using type conversion functions."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Types and Type Conversions

### Reminder

First let us recall which data types exist in Python. The list below contains the data
types available in Python along with examples. Please study them carefully so this topic
is easier to understand.

> Note: I will not write Turkish equivalents of Python-related terms — learning the
> English terms is more useful.

- Numbers
  - **int()**
    - `variable = 1`
  - **float()**
    - `variable = 0.1`
    - `variable = 0.00012`
- String
  - **str()**
    - `variable = "string"`
    - `variable = 'string'`
    - `variable = """long string"""`
    - `variable = '''long string'''`
- List
  - **list()**
    - `variable = [1, 2, 3, 4]`
    - `variable = ["1", "2", "3", "4"]`
    - `variable = [1.1, 2.2, 3.3, 4.4]`
    - `variable = [{1: 2}, {2: 3}, {3: 4}]`
- Tuple
  - `variable = 1, 2, 3, 4`
  - `variable = (1, 2, 3, 4)`
  - `variable = "1", "2", "3", "4"`
- Dictionary
  - **dict()**
    - `variable = {1: 2, "a": "b", "c": 2}`
    - `variable = dict(a=1, b=2, c=3)`
    - `variable = {1: [3, 4], "a": "b", "c": 2}`

## Type Conversions in Python

Now that we have a good reminder, let us get to the main topic. These operations are
really quite simple. Here is the short version:

You have a variable with a value whose type you know (or can find using `type()`). You
then call the type function/method for the type you want to convert to.

In a previous article on the `input()` function, we saw that every value received via
`input()` (from the user) arrives as a **string**.

This is where the problem starts: if I ask the user to enter a number and they type
**2049**, it does not reach my variable as a number — it arrives as a string, and I need
to check and convert it.

```python
string_data = input("Please enter any number you want >> ")
print(type(string_data))
print(string_data / 1)   # dividing by 1 — will raise an error if it is not a number
```

The error we get will be **TypeError** — we tried to divide a string by an integer.

```python
<class 'str'>
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unsupported operand type(s) for /: 'str' and 'int'
```

We need to convert the incoming value to **int** or **float**:

```python
string_data = input("Please enter any number you want >> ")
string_data = int(string_data) / 1
print(type(string_data))
print(string_data)
```

Result:

```python
<class 'int'>
2049
```

No error this time. Now let us look at the other conversion functions.

### int()

> int() argument must be a string, a bytes-like object or a number

Converts the given object to **int** if possible.

```python
>>> int("10")
10
>>> int(0.21)
0
```

> Note: `int("10.1")` — a string in float format cannot be converted directly to int;
> you need to convert it to float first.

### float()

> float() argument must be a string or a number

Converts the given object to **float** if possible.

```python
>>> float("10")
10.0
>>> float("10.1")
10.1
>>> float(0.21)
0.21
```

### str()

Converts any object to **string**.

```python
>>> str(10)
'10'
>>> str(10.1)
'10.1'
>>> str(False)
'False'
>>> str(int)
"<class 'int'>"
>>> str({1: 2})
'{1: 2}'
>>> str([1, 2])
'[1, 2]'
```

### complex()

> first argument must be a string or a number

Takes one or two parameters. If only one parameter is given it can be a string or a
number; if two parameters are given the first cannot be a string. The second parameter
is the imaginary part.

```python
>>> complex(10)
(10+0j)
>>> complex("10")
(10+0j)
>>> complex(1, 2)
(1+2j)
>>> complex(3.4, 4)
(3.4+4j)
```

### dict()

Creates a **dict** from the parameter names and values.

```python
>>> dict(a=1)
{'a': 1}
>>> dict(name="hakan", no=0.538)
{'name': 'hakan', 'no': 0.538}
```

### list()

Converts a **tuple** or **string** to a **list**.

```python
>>> list("test")
['t', 'e', 's', 't']
>>> list((1, 2))
[1, 2]
```
