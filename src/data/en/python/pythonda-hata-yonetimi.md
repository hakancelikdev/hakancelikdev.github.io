---
publishDate: 2021-10-05T00:00:00Z
author: Hakan Çelik
title: "Error Handling in Python"
excerpt: "In the topics covered so far we never talked about errors, how to catch them, or how to continue execution based on the error encountered. This is an important topic and you will learn it here."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Error Handling in Python

## Catching Errors in Python

In the topics covered so far we never talked about errors, how to catch them, or how to
continue execution based on the error encountered — but this is an important topic and
you will learn it here.

Here is a small example:

```python
get_n = float(input("Enter a number >> "))
result = 10 / get_n
print(f"result {result}")
```

What happens if the user enters 0 instead of 1 or 2? An error occurs and our program
does not produce the result we want. You could control the zero-entry case with `if`, or
you can use Python's error handling mechanism.

The script below shows how we find which error occurred:

```python
try:
    1 / 0
except Exception as exc:
    print(f"Oh no! We caught a {exc.__class__.__name__} error")
```

**Output:**

`Oh no! We caught a ZeroDivisionError error`

As you can see, dividing a number by zero gives us `ZeroDivisionError`.

## Catching Specific Errors

### Try, Except

#### General Structure

```python
try:
   # some code
   pass
except ValueError:
   # runs if a ValueError occurs
   pass
except (TypeError, ZeroDivisionError):
   # catching multiple errors at once
   # runs if TypeError or ZeroDivisionError occurs
   pass
except Exception:
   # runs if any other error occurs
   pass
```

### Try, Except, As

The `as` keyword assigns the caught exception instance to a name.

#### General Structure 1

```python
try:
   pass
except ValueError as error:
   # caught a ValueError — receive it as "error" and print it
   print(error)
```

#### General Structure 2

```python
try:
   pass
except Exception as e:
   # any error caught — receive it as "e" and print it
   print(e)
```

### Try, Except, Else

#### General Structure

```python
try:
   pass
except:
   # runs if any error occurs
   pass
else:
    # runs if NO error occurred
    pass
```

### Try, Except, Else, Finally

#### General Structure

```python
try:
   pass
except:
   pass
else:
    pass
finally:
    # runs whether or not an error occurred
    pass
```

## Creating Our Own Exception Class

To do this we use the `Exception` class and the `raise` keyword.

### raise

`raise` is a keyword used to raise (trigger) any exception class.

Let us redo the example from the beginning:

```python
class InputError(Exception):
    """An exception class for input errors.

    Attributes:
        expression -- input expression in which the error occurred
        message    -- explanation of the error
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

input_ = float(input("Enter a number other than 0 >> "))
if input_ == 0:
    raise InputError(input_, "do not enter 0")
```

**Result:**

```python
Traceback (most recent call last):
  File "myapp.py", line 28, in <module>
    raise InputError(input_, "do not enter 0")
__main__.InputError: (0.0, 'do not enter 0')
```

Now let us refine it and also catch the error we raise:

```python
class InputError(Exception):
    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

def get_input():
    input_ = float(input("Enter a number other than 0 >> "))
    if input_ == 0:
        raise InputError(input_, "do not enter 0")
    return input_

try:
    input_ = get_input()
except InputError as e:   # if the returned error is our InputError
    print(e)
else:
    print(input_)
```

**Result:**

```bash
Enter a number other than 0 >> 0
(0.0, 'do not enter 0')
```

## Python Built-in Exceptions

| Exception             | Cause of Error                                                                                                             |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| AssertionError        | Raised when an `assert` statement fails.                                                                                   |
| AttributeError        | Raised when attribute assignment or reference fails.                                                                       |
| EOFError              | Raised when the `input()` function hits an end-of-file condition.                                                          |
| FloatingPointError    | Raised when a floating-point operation fails.                                                                              |
| GeneratorExit         | Raised when a generator's `close()` method is called.                                                                     |
| ImportError           | Raised when an imported module is not found.                                                                               |
| IndexError            | Raised when an index is out of range.                                                                                      |
| KeyError              | Raised when a key is not found in a dictionary.                                                                            |
| KeyboardInterrupt     | Raised when the user hits the interrupt key (Ctrl+C or Delete).                                                            |
| MemoryError           | Raised when an operation runs out of memory.                                                                               |
| NameError             | Raised when a variable is not found in local or global scope.                                                              |
| NotImplementedError   | Raised by abstract methods.                                                                                                |
| OSError               | Raised when a system operation causes a system-related error.                                                              |
| OverflowError         | Raised when the result of an arithmetic operation is too large to be represented.                                          |
| ReferenceError        | Raised when a weak reference proxy is used to access a garbage-collected referent.                                         |
| RuntimeError          | Raised when an error does not fall under any other category.                                                               |
| StopIteration         | Raised by `next()` to indicate there are no further items to return.                                                       |
| SyntaxError           | Raised by the parser when a syntax error is encountered.                                                                   |
| IndentationError      | Raised when there is incorrect indentation.                                                                                |
| TabError              | Raised when indentation consists of inconsistent tabs and spaces.                                                          |
| SystemError           | Raised when the interpreter detects an internal error.                                                                     |
| SystemExit            | Raised by `sys.exit()`.                                                                                                    |
| TypeError             | Raised when a function or operation is applied to an object of incorrect type.                                             |
| UnboundLocalError     | Raised when a reference is made to a local variable that has no value bound to it.                                         |
| UnicodeError          | Raised when a Unicode-related encoding or decoding error occurs.                                                           |
| UnicodeEncodeError    | Raised when a Unicode-related error occurs during encoding.                                                                |
| UnicodeDecodeError    | Raised when a Unicode-related error occurs during decoding.                                                                |
| UnicodeTranslateError | Raised when a Unicode-related error occurs during translating.                                                             |
| ValueError            | Raised when a function gets an argument of the correct type but an improper value.                                         |
| ZeroDivisionError     | Raised when the second operand of a division or modulo operation is zero.                                                  |

The tree below shows which exception inherits from which:

```bash
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- GeneratorExit
 +-- Exception
      +-- StopIteration
      +-- StopAsyncIteration
      +-- ArithmeticError
      |    +-- FloatingPointError
      |    +-- OverflowError
      |    +-- ZeroDivisionError
      +-- AssertionError
      +-- AttributeError
      +-- BufferError
      +-- EOFError
      +-- ImportError
      |    +-- ModuleNotFoundError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- MemoryError
      +-- NameError
      |    +-- UnboundLocalError
      +-- OSError
      |    +-- BlockingIOError
      |    +-- ChildProcessError
      |    +-- ConnectionError
      |    |    +-- BrokenPipeError
      |    |    +-- ConnectionAbortedError
      |    |    +-- ConnectionRefusedError
      |    |    +-- ConnectionResetError
      |    +-- FileExistsError
      |    +-- FileNotFoundError
      |    +-- InterruptedError
      |    +-- IsADirectoryError
      |    +-- NotADirectoryError
      |    +-- PermissionError
      |    +-- ProcessLookupError
      |    +-- TimeoutError
      +-- ReferenceError
      +-- RuntimeError
      |    +-- NotImplementedError
      |    +-- RecursionError
      +-- SyntaxError
      |    +-- IndentationError
      |         +-- TabError
      +-- SystemError
      +-- TypeError
      +-- ValueError
      |    +-- UnicodeError
      |         +-- UnicodeDecodeError
      |         +-- UnicodeEncodeError
      |         +-- UnicodeTranslateError
      +-- Warning
           +-- DeprecationWarning
           +-- PendingDeprecationWarning
           +-- RuntimeWarning
           +-- SyntaxWarning
           +-- UserWarning
           +-- FutureWarning
           +-- ImportWarning
           +-- UnicodeWarning
           +-- BytesWarning
           +-- ResourceWarning
```

## References

- [https://docs.python.org/3/library/exceptions.html](https://docs.python.org/3/library/exceptions.html)
- [https://docs.python.org/3/tutorial/errors.html](https://docs.python.org/3/tutorial/errors.html)
