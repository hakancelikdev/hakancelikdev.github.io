---
publishDate: 2021-09-21T00:00:00Z
author: Hakan Çelik
title: "Loops in Python"
excerpt: "The while loop is a loop that runs based on a condition. Just like if, elif, or else, the only thing a while loop cares about is whether the given condition is true. If it is, the loop keeps running; if not, it stops."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Loops in Python

## The while Loop

Its general structure is:

```python
while <expr>:
    <statement(s)>
```

The while loop is a loop that runs based on a condition. Just like if, elif, or else,
the only thing a while loop cares about is whether the given condition is true. If it is
true, it keeps running; if false, it does not — you cannot go wrong against structures like
this; the moment you do, it's the moment it's done with you.

For example, let's try going against a while loop below and see if it forgives us:

```python
while False:
    print("You're only human — you can go against me, it's fine, I can keep running")
```

Run it and see whether it gives the result it's thinking of — of course it won't. You
don't get forgiveness if you go against structures like this.

Now let's do the right things for it and see what it says:

```python
while True:
    print("Thank you for treating me well — I'll always be your friend")
```

When you run the code above, it will keep running and being your friend until you cut the
friendship (i.e., close it).

In my [operators and print function](https://www.coogger.com/@hakancelik96/islecler-ve-print-fonksiyonu/)
article I discussed how other bool values are obtained, how Python understands them, and
how every object or value has a bool value. If you replace the `True` or `False` in the
examples above with expressions you've learned in that content, the loop will check the
bool value of what you wrote — if it's `True` it will keep running; if `False` it will
stop — the same logic applies. Connect the topics you've learned rather than treating
them as isolated subjects.

### While Example

```python
password = "123"
while (password != str(input("please enter your password >> "))):
    pass
```

Let's examine the example above:

- We set a password

  > password = "123"

- We wrote the condition: the entered text does not equal our password

  > (password != str(input("please enter your password >> "))) as the condition

- If the condition holds — i.e., the password is incorrect — it will keep running.
- We used the `pass` keyword to keep running without doing anything.
- The moment the condition is satisfied — i.e., the passwords match — since we said "run
  while the condition is not correct", when it becomes correct it stopped running.

If I had written the following and left it, I would have gotten an error — because what
does the while loop do? I haven't coded that part, so it would error:

```python
password = "123"
while (password != str(input("please enter your password >> "))):
```

Instead of `pass`, we could also do the following:

```python
password = "123"
while (password != str(input("please enter your password >> "))):
    "We are doing password verification with this loop"
```

> Note: Inside loops you can use structures like if, elif, else, and other loops.
> Connect everything that has been taught, and remember that this is a language — languages
> are flexible and you are free to do what you want.

For example:

```python
stop = False
count = 0
while not stop:
    count += 1
    print("count", count, "stop", stop)
    if count == 10:
        while count:
            print("count", count, "stop", stop)
            count -= 1
        stop = True
        print("count", count, "stop", stop)
```

## The for Loop

The for loop is essentially an advanced while loop. Its general structure is:

```python
for <variable_name> in <list or str or tuple>:
    <statement(s)>
```

In a for loop, the `<list, str, tuple, or dict>` part must be an **iterator** object.

### How Iterators Work

```python
>>> x = iter([1, 2, 3]) # x is now an iterator
>>> x
<listiterator object at 0x1004ca850>
>>> x.next() # each time we call the next function on our iterator object, it returns the next item
1
>>> x.next()
2
>>> x.next()
3
>>> x.next() # once items are exhausted, it raises an error
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
```

Here **iter** is a built-in function that takes an **iterable** object and returns an
**iterator**.

This is actually the working logic of the for loop. You can also use a while loop to
achieve the same effect as a for loop.

### Examples of the for Loop

#### String Iterator

```python
for i in "1234":
    print(i)
```

In each iteration, the value of `i` will be 1, 2, 3, and 4, in order.

As you can understand from this example, for loops run as many times as the length of
the given **iterator** — they do not need a condition.

#### List Iterator

```python
my_list = ["1", "2", "3"]
for i in my_list:
    print(i)
```

Here the number of elements is 3, so the for loop will run 3 times. On each run it calls
the `next()` method on the iterator it created from `["1", "2", "3"]`, so `i` will be
1, 2, and 3 in order.

#### Dict Iterator

```python
my_dict = dict(a=1, b=2, c=3)
for key, value in my_dict.items():
    print(key, value)
```

Here the number of elements is again 3, so the for loop will run 3 times. This time I'm
using two variables called `key, value` because my iterator is a dictionary and each
call to `next` will return a tuple with a key and its corresponding value.

> Note: The `i` used in each loop is the letter `i` from "index". It's commonly used
> this way in general practice, but of course you can name the variable whatever you like.

## Related Functions and Keywords

### range

`range` is a **built-in** function that takes numbers as parameters and returns an
iterator.

```python
>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```

Below are additional examples and their outputs when substituted into the loop above:

```python
range(5, 10)
   5, 6, 7, 8, 9

range(0, 10, 3)
   0, 3, 6, 9

range(-10, -100, -30)
  -10, -40, -70
```

Or an example where our variable type is **list**:

```python
>>> a = ['Mary', 'had', 'a', 'little', 'lamb']
>>> for i in range(len(a)):
...     print(i, a[i])
...
0 Mary
1 had
2 a
3 little
4 lamb
```

The **len** function here returns the length (number of elements) of the variable passed
to it as a parameter.

In each iteration, `i` becomes 0, 1, etc., and we access the elements of our list by
writing `a[i]`.

> Note: If you put an iterator inside a list type, it converts it to a list.

```python
>>> list(range(5))
[0, 1, 2, 3, 4]
```

### break

The `break` keyword stops the loop directly above it.

#### break in a while Loop

```python
count = 0
while True:
    count += 1
    print(count)
    if count == 10:
        break
```

In the example above, when the value of `count` reaches 10, the if conditional will run,
and as a result, `break` will also run — closing (exiting) the while loop above it.

#### break in a for Loop

```python
for i in range(100):
    print(i)
    if i == 10:
        break
```

This gives the same kind of result as the example above.

What if we use two loops?

```python
count = 0
while True:
    count += 1
    print("count", count)
    for i in range(count):
        print("i", i)
        if i == 10:
            break
```

The `break` in this loop will stop the for loop when the condition is met, but since it
cannot stop the outermost `while` loop, the while loop will keep running forever.

### continue

`continue` carries the same meaning as the English word — it means "keep going". Let's
explain it with an example in Python:

```python
for i in range(20):
    if i == 10:
        continue
    print("this text won't print when i is 10", i)
```

In the example above, if `i` equals 10, we said "continue" — meaning: don't look at the
line below; execute the next value from the iterator.

### else

Imagine we're using an if conditional inside our for loop, but we want something like
this: if this condition is never satisfied during the entire loop, run this at the end of
the loop. That's where `else` comes to the rescue again.

```python
for i in range(20):
    if i == 21: # if this condition is never satisfied during the loop
        continue
else:
    print("run this line")
```

### pass

We've already looked at the `pass` keyword — it comes to your aid whenever you want to
say "do nothing here, but don't leave this line empty because it will cause an error."

#### Examples

In loops:

```python
>>> while True:
...     pass  # Busy-wait for keyboard interrupt (Ctrl+C)
...
```

When defining a class:

```python
>>> class MyEmptyClass:
...     pass
...
```

When defining a function:

```python
>>> def initlog(*args):
...     pass   # Remember to implement this!
...
```
