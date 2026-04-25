---
publishDate: 2021-07-27T00:00:00Z
author: Hakan Çelik
title: "Operators and the print() Function"
excerpt: "Operators (*, /, -, +, %) and the print() function (the function that lets us write to the screen)."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Operators and the print() Function

### What Will We Learn?

- Operators (\*, /, -, +, %)
- The print() function (the function that lets us write text to the screen)

### Operators

#### Mathematical Operators

Mathematical operators let us perform mathematical operations in Python. Let's do a few
examples to understand this topic better.

|      |                        |
| :--- | :--------------------- |
| +    | Addition               |
| -    | Subtraction            |
| \*   | Multiplication         |
| /    | Division               |
| \*\* | Exponentiation (power) |
| %    | Modular division       |
| //   | Floor division         |

```python
>>> 4 + 5 # addition
9
>>> 4 - 5 # subtraction
-1
>>> 4 * 5 # multiplication
20
>>> "Hakan "+"celik" # we can add two strings
'Hakan celik'
>>> "-"*5 # we can multiply a string
----- # there will be 5 dashes
>>> 4 / 5 # division
0.8
>>> 4 ** 5 # exponentiation
1024
>>> 4 % 5 # mod — gives the remainder of dividing 4 by 5
4
>>> 4 // 5 # floor division — gives the quotient of dividing 4 by 5
0
```

#### Comparison Operators

Comparison operators let us perform a comparison between operands — 3 is greater than 2,
3 equals 3, and so on.

|       |                          |
| :---- | :----------------------- |
| ==    | Equal to                 |
| !=    | Not equal to             |
| &gt;  | Greater than             |
| &lt;  | Less than                |
| &gt;= | Greater than or equal to |
| &lt;= | Less than or equal to    |

Below is a small number-guessing script — you can understand it by examining it.

```python
num = 99 # I assigned a number
get_num = input("Enter a number >> ") # I got a number from the user
if get_num > num: # if the user's number is greater than mine
    print("Go lower") # I printed "Go lower"
elif get_num < num: # if the user's number is lower
    print("Go higher") # I printed "Go higher"
else: # no condition was met — i.e., they are equal
    print("Correct!") # I printed "Correct!"
```

#### Boolean Operators

We all know that computers are built on 0 and 1 — binary: open, closed, present, absent,
true, false. Computer science is built on these two values. These bool values are **True**
and **False**.

For example:

```python
>>> 1 == 1 # this is not assignment — it's the equality sign from mathematics, a comparison operator
True
>>> 1 == 2 # 1 is not equal to 2
False
```

We said that computer science is built on 0 and 1, and that these are True and False.
From this we can conclude that everything in a computer has a bool value.

In a computer, everything except 0 and the empty character has a value of True. Let's
demonstrate this with a function called **bool()**:

```python
>>> bool(0)
False
>>> bool(-1)
True
>>> bool("")
False
>>> bool("hello")
True
>>> bool(1)
True
>>> bool("0") # this is a character — it's the string "0" — so it returns True
True
>>> 3 < 4
True
>>> "hakan" == "hakan"
True
>>> 1 == 1 and 1 > 0
True
```

|     |                                            |
| :-- | :----------------------------------------- |
| and | and                                        |
| not | not, no, none — negation-type meanings     |
| or  | or                                         |

```python
test_val = "01234"
if test_val == "01234" or test_val == "0":
    print("Correct")
```

#### Assignment Operators

Up to now we've only been using a single assignment sign: **=**, the assignment operator
that assigns data to a variable. Below is a table of all assignment operators — examine
them and then we'll do a few examples.

|       |                                             |
| :---- | :------------------------------------------ |
| =     | Assignment operator                         |
| +=    | Add-and-assign operator                     |
| -=    | Subtract-and-assign operator                |
| /=    | Divide-and-assign operator                  |
| \*=   | Multiply-and-assign operator                |
| %=    | Modular-divide-and-assign operator          |
| \*\*= | Exponentiate-and-assign operator            |
| //=   | Floor-divide-and-assign operator            |

```python
>>> a = 5
>>> a += 1 # this means a = a + 1
6
>>> a -= 1 # means a = a - 1; a's new value is 6 from the line above, so here it becomes 5 again
5
>>> a /= 2 # a = a/2
2.5
```

#### Membership Operators

The purpose of this operator is to let us query whether a value exists inside another
value.

|        |                          |
| :----- | :----------------------- |
| in     | Membership operator      |
| not in | Non-membership operator  |

```python
>>> "1234" in "01234" # the left value is found inside the right value, so it returns True; is 1234 in 01234?
True # yes, it is
>>> "1234" not in "0" # is 1234 not in "0"?
True # yes, it is not
```

#### Identity Operators

Every object in Python has an identity number. This identity number essentially shows the
address of that object in memory. We can find the id information of objects using the
built-in **id()** function.

|        |                                  |
| :----- | :------------------------------- |
| id\(\) | Function that returns the id     |
| is     | Identity operator                |

```python
>>> a = 2.5
>>> id(a) # its location in memory
1510664639136
>>> id("hello world")
1510666808640
```

As you can see, every value has an id number and a location. Let's also look at the
other identity operator, **is**:

```python
>>> a = 1
>>> a is 1
True
>>> a = 1000
>>> a is 1000 # why did this return False?
False
```

The reason is that for numbers **outside the range -5 to 257**, Python creates a new
memory allocation each time. Let me explain it this way:

```python
>>> a = 1000 # opened a new space (address) with value 1000
>>> a is 1000 # because it opened another one here, the same value now has two different addresses — and that's why
False # we got False
```

## The print() Function

The purpose of the print function is to write text to the screen. If you remember the
brief introduction to functions lesson, functions take parameters or don't, depending on
the task they perform — just like in mathematics. The print function is one that can
accept unlimited data parameters while also having its own special parameters. Whatever
you pass to it as parameters, the print function will output them to the screen in order.

> How to build functions with unlimited parameters is something I'll cover in upcoming
> lessons.

```python
>>> text = "Python's name does not come from the snake"
>>> print(text)
Python's name does not come from the snake
>>> text2 = """python is an "open source" language"""
>>> print(text2)
python is an "open source" language
>>> print(1, 2, 3, 4, 5, 6, 7) # used 7 parameters
1 2 3 4 5 6 7
```

### Other Parameters in the print() Function

#### sep

The purpose of the sep parameter is to add something after each value written to the
print function. If you write `sep="0"`, Python will append 0 after each value you pass
as a parameter to print. For example:

**print("data", sep="str_value")** — sep takes either **None** or a string value.

```python
>>> print(1, 2, 3, 4, 5, 6, 7, sep=" - ")
1 - 2 - 3 - 4 - 5 - 6 - 7 # as you can see, a dash was added between all of them
```

#### end

The role of the end parameter is to write the object that will be appended to the end of
the data given to the print function.

The **end** parameter also takes **None** or a string value.

By default, the print function has **print(end="\n")** — the newline escape character.

```python
>>> print("I couldn't think of what to write here", end="\n") # \n is the newline escape character
I couldn't think of what to write here
>>> print("I couldn't think of what to write here", end=" - ")
I couldn't think of what to write here - >>> print("I couldn't think of what to write here", end=" - \n")
I couldn't think of what to write here -
```

#### Writing to a File Instead of the Screen with print

We'll cover file operations in Python later, but it's good to mention it briefly here.
Normally the print function outputs to the screen, but we can change this and make it
write to a file instead.

**file parameter**

Tells it which file to write the data to:

```python
>>> file = open("test.txt", "w") # w = we opened our file in write mode
>>> print("writing to a file for the first time", file = file) # printed
>>> file.close() # closed
```

#### flush

The flush parameter lets us write data to the file immediately without buffering:

```python
>>> file = open("test.txt", "w") # w = we opened our file in write mode
>>> print("writing to a file for the second time", file = file) # if you open the file right now you'll see it's empty — the write operation actually happens when you do "file.close()", but if you want it to happen immediately:
>>> print("writing to a file for the second time", file = file, flush=True) # write it like this
>>> file.close()
```
