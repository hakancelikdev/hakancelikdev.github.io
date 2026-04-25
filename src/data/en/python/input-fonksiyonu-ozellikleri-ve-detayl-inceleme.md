---
publishDate: 2021-06-29T00:00:00Z
author: Hakan Çelik
title: "The input() Function — Features and In-Depth Exploration"
excerpt: "In my previous content I introduced Python functions and covered useful ones like type() and print(). Now we will look at the input() function, which lets us receive data (input) from users."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# The input() Function — Features and In-Depth Exploration

## What Is the input() Function?

In my previous content I introduced Python functions and covered useful ones like
**type()** and **print()**. Now we will look at the **input()** function, which
lets us receive data (input) from users.

Using the **type** function to check which class the input object (remember,
everything in Python is an object) belongs to:

```python
>>> type(input)
<class 'builtin_function_or_method'>
```

We see that it belongs to the _**builtin_function_or_method**_ class.

Let's also check which class the other objects we've seen so far belong to:

```python
>>> type(type) # the type() function is a type
<class 'type'>
>>> type(str) # str is also a type — which means int, dict, and list are types too
<class 'type'>
>>> type(print) # print is also a builtin_function_or_method
<class 'builtin_function_or_method'>
```

> builtin_function_or_method = A built-in function or method.

Let these serve as a reminder; let's continue.

### input()

- **input()** is a built-in function or method.
- **input()** is an object.
- **input()** lets us receive data from the user.
- Every value we receive via **input()** comes in string format.

### Other Features of the input Object

We can use the **dir** function to view the other features of an object (its functions,
methods, variables, etc.):

```python
>>> dir(input)
['__call__', '__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__name__', '__ne__', '__new__', '__qualname__', '__reduce__', '__reduce_ex__', '__repr__', '__self__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__text_signature__']
>>>
```

**Let's take a closer look at `input.__call__`:**

```python
>>> type(input.__call__)
<class 'method-wrapper'>
```

Our object is classified as a **method-wrapper**.

```python
>>> input.__call__.__doc__
'Call self as a function.'
```

A note has been left on the function saying "Call self as a function." We can view notes
written on functions using the **`__doc__`** method.

```python
>>> input.__call__()
I'm typing this text to test it
'I'm typing this text to test it'
```

I called the **call** function and it behaved just like calling **input()**. Wait a
moment — maybe when we write **input()** to call it, the method that actually gets
invoked is the **call** method.

## Using the input() Function

As you can see below, **input** takes a single parameter (as I mentioned in the
introduction to functions lesson) and displays that parameter to the user in the console.
This is typically used to tell the user what they should type — for example, we left a
note saying "Please enter your password":

> Note: The data type of the parameter input takes does not need to be a string — it can
> be int, list, or dict.
>
> ```python
> password = input("Please enter your password >>> ") # I received data from input and assigned it to the variable named password
> print("Your password is", password) # then I used print to display the data assigned to my password variable on screen
> ```
