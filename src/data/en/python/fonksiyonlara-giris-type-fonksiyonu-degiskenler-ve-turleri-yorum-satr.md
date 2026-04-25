---
publishDate: 2021-06-01T00:00:00Z
author: Hakan Çelik
title: "Introduction to Functions, the type() Function, Variables and Their Types, Comments"
excerpt: "Functions in programming languages are the same as the functions we know from mathematics. In fact, when you look at it broadly, mathematics and programming are essentially the same thing — a computer is itself a product of mathematics."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Introduction to Functions, the type() Function, Variables and Their Types, Comments

## Function

Functions in programming languages are the same as the functions we know from mathematics.
In fact, when you look at it broadly, mathematics and programming are essentially the same thing —
we should not forget that the machine we call a computer is a product of mathematics. In this
section we'll briefly touch on functions; the goal is just to give you a feel for what is happening
in this content. We will come back to functions in more depth later.

Functions have a general purpose, and just as in mathematics, they may take one, more than one,
or no parameters at all. The function uses the parameters it receives and arrives at a result that
we then retrieve. For example, **f(x) = x^2 + x** takes a single parameter named **x** and its
purpose is to square the given value and add it to itself. Let's also write this function in Python —
don't get too hung up on this; just know that such a thing exists, understand it, and move on.

```python
def f(x):
    return x*x+x # return makes the result available — don't worry about it too much
```

That's it. As you can see, there is very little difference beyond a slight syntax variation —
everything else is the same.

Now let's use (i.e., call) this function.

```python
>>> f(3)
12
>>> f(x=3) # you can also write it this way
12
```

As you can see, that's all there is to it. I gave 3 to the x parameter and the function
squared it and added it to itself — the result is 12.

## The type() Function

`type` is another useful function in Python. Its purpose is slightly different from the
`f` function we described above: it tells us the **type** of a variable, value, or any
other object passed to it as a parameter.

As an example, let's pass the **f** function we wrote above as a parameter:

```python
>>> type(f)
<class 'function'> # its type is 'function'
```

We will use this function to check the types of our variables going forward.

## Variables and Their Types

### Understanding Variables

When defining variables in Python, the syntax is straightforward and familiar from
mathematics — let's take a quick look.

For example, if I said **x = 3**, you would immediately tell me that x is equal to 3.
If I asked "what is x?", you'd say 3; if I asked "what kind of thing is it?", you'd say
a variable; and if I asked "what is its type?", you'd say an integer. Let's see if
Python agrees:

```python
>>> x = 3 # assigned 3 to the variable x
>>> x # called the variable x
3 # the result came back as 3
>>> type(x) # wrote the variable as a parameter to check its type
<class 'int'> # yes, the result is integer — a whole number
```

As you can see, mathematics is just programming — or is programming just mathematics? :D

### Variable Types

Just as there are 4 states of matter (solid, liquid, gas, and plasma), there are 4 main
variable types here:

- int (integer — number)
- str (string — character)
- dict (dictionary)
- list (list)

#### int (integer — number)

We can define an integer value in 3 different ways.

```python
>>> x = 5 # assigned 5 to the variable x
>>> x # called the variable x
3 # result returned as 3
>>> type(x) # wrote the variable as a parameter to check its type
<class 'int'> # yes, the result is integer — a whole number
>>> int(5) # 5 is already an integer, so x = 5 is the usual form; I'm writing it this way just to help you understand
5
>>> int("5") # this converts the string data type to an integer if mathematically possible
5
>>> int("a") # this is not mathematically possible, so it will raise an error
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: invalid literal for int() with base 10: 'a'
```

#### str (string — character)

In Python we can define a string variable in 5 different ways:

```python
>>> "string" # for a single-line string
>>> 'string' # for a single-line string
>>> """string""" # for a multi-line string
>>> '''string''' # for a multi-line string
>>> str(8) # we can also create a string object using the str() type
>>> str("hakan") # or
>>> type(str) # if we write this and want to see what str is
<class 'type'> # it tells us that this is a type
```

As you can see above, string values are defined using quotation marks — this is how
Python recognises that the value is a string. Let's do a quick example:

```python
>>> string_variable = "string" # assigned a string character to my variable
>>> type(string_variable) # checking what the type is
<class 'str'>
>>> string_variable2 = "10" # don't think this is an int — because it's written in quotes, its type is string
>>> type(string_variable) # checking what the type is
<class 'str'>
```

#### dict (dictionary)

We can define a dict value in two different ways: using **{}** curly braces, or by using
the dict type object directly.

- **dict(value="key")** or **{"value": "key"}** — that's the general pattern.

```python
>>> my_first_dict = {"name": "hakan", "surname": "celik", "no": 201555573}
# this is how we define a dictionary value; I assigned it to the variable my_first_dict
# I can also do it this way:
>>> my_first_dict = dict(name="hakan", surname="celik", no=201555573) # created a dict value using the dict type object
# to explain: dict() behaves like a function that accepts unlimited parameters,
# and the values you pass as parameters form the value portions of your dict object.
```

Now that we've assigned the data to a variable, let's use it.

```python
>>> type(my_first_dict)
<class 'dict'>  # yes, its type is dict
```

For example, if I want to retrieve the value **"hakan"** stored inside my **my_first_dict**
variable, I should do it like this:

- **variable["key"]** — when called this way, it returns the value stored under the given
  key in the variable.

Let's use what we've just learned to retrieve the value under the **"name"** key:

```python
>>> my_first_dict["name"] # I wrote variable["key"]; since my variable contains "name":"hakan"
# the result should come back as hakan
'hakan'
```

Let's also retrieve the student number:

```python
>>> my_first_dict["no"] # I stored the student number as an integer, not a string
201555573 # yes, it did not come back as a string
```

**Updating Our Dict Data**

There are 2 different ways to update the data stored in our variable.

```python
>>> my_first_dict["no"] = 0 # we can update it by assignment, just like we do with variables
>>> my_first_dict["no"] # let's call it and check the variable's value
0  # yes, it has been updated
```

The second method is **using the dict object's update function** — we update it using
`variable.update(key="value")`:

```python
>>> my_first_dict.update(no=12) # updated
>>> my_first_dict["no"] # let's call it and check the variable's value
12  # yes, it has been updated
```

**Deleting an Item from Our Dict Data**

For example, if I want to delete the **surname** entry from my variable, I can do it using
the **del** keyword: `del variable["key"]` will delete it.

```python
>>> del my_first_dict["surname"] # deleted
>>> my_first_dict # let's call it and check the result
{'name': 'hakan', 'surname': 'celik'} # yes, it has been deleted
```

With this, we have briefly introduced methods. `.update()` is a method that belongs to the
dict class. We will explore methods like these for list, str, and int in more detail
later — there are other useful functions for dict as well. For now, just keep them in mind.

#### list (list)

We define a list in two different ways:

- Using **[]** square brackets
- Using the **list** object

```python
>>> my_firs_list = [0, 1, 2, 3, 4] # we coded our first list with 5 items
>>> my_firs_list # print it
[0, 1, 2, 3, 4]
```

Let's also define one using the **list** object:

```python
>>> my_firs_list = list((0, 1, 2, 3, 4, 5)) # the list object takes a single parameter; here the parameter is (0, 1, 2, 3, 4, 5), which is a tuple — another type
>>> my_firs_list # print it
[0, 1, 2, 3, 4, 5]

>>> my_firs_list = list([0, 1, 2, 3, 4, 5]) # we can also define it this way
>>> my_firs_list = list("hakan") # or this way — each character becomes an item
["h", "a", "k", "a", "n"] # result
```

**Reading Our List Data**

We can read it using `variable[index]`, `variable[first_index:last_index]`, or `variable[:]`:

```python
>>> my_firs_list[0] # read the first item
0 # the first item was 0
>>> my_firs_list[-1] # last item
5 # it was 5
>>> my_firs_list[2:4] # read from index 2 to 4
[2, 3] # 2 and 3
>>> my_firs_list[:] # read everything
[0, 1, 2, 3, 4, 5]
```

**Updating Our List Data**

Again, just like we did with the dict type, you can update it by assignment:

```python
>>> my_firs_list[2:4] = [1, 2] # if we do this
>>> my_firs_list[2:4] # let's look at the result
[1, 2] # updated
```

## Comments and Explanatory Notes

Above, you saw that I wrote notes to explain what the code does, and you read them. I
wrote notes inside the code and Python ignores those comments — it distinguishes between
actual code and a comment/explanatory line by the **\#** character:

```python
# this is a comment line
x = 0 # this part is a code line, but this text is again a comment
```

You don't have to use the **\#** symbol to leave a comment — you can also write comments
in string format:

```python
x = 0
"this is a comment line in string format, and since I haven't assigned this data to any variable, it's fine"
```

Everything in Python Is an Object
