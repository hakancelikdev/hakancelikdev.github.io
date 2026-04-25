---
publishDate: 2022-07-15T00:00:00Z
author: Hakan Çelik
title: "Submitting a PR"
excerpt: "How do you make your first contribution to CPython? From finding an issue and forking the repo, to making a fix and opening a PR — a step-by-step walkthrough with a real example."
category: CPython
image: ~/assets/images/blog/cpython.jpg
tags:
  - python
  - cpython
  - open-source
---

# Submitting a PR

CPython bugs are listed, discussed, and tracked at
[https://bugs.python.org/](https://bugs.python.org/). After completing your CLA
registration, you can find an issue to work on there and make a contribution.

### Example PR

Let's walk through how to submit a PR using a real example.

I'll pick [https://bugs.python.org/issue29418](https://bugs.python.org/issue29418) as
the issue. The person who opened it reported that
[`isroutine`](https://docs.python.org/library/inspect.html#inspect.isroutine) from the
[`inspect`](https://docs.python.org/library/inspect.html) module returns `False` for
some [built-in functions](https://docs.python.org/library/functions.html). In the
example they provided:

```python
>>> inspect.isroutine(object().__str__)
False
```

```python
>>> object().__str__
<method-wrapper '__str__' of object object at 0x7fb92f30a0d0>
```

this object is a `method-wrapper`. So what we need to fix is to make
`inspect.isroutine` return `True` for `method-wrapper` objects as well. Let's look at
the function's definition:

> Return `True` if the object is a user-defined or built-in function or method.

According to the definition, the function should return `True` if the object is a
user-defined or built-in function or method. Since a `method-wrapper` is a built-in
method, expecting it to return `True` is perfectly reasonable.

### Forking CPython

Now that we know what to do, the first step is to fork CPython. Go to the
[CPython GitHub repository](https://github.com/python/cpython) and click the **Fork**
button in the top right to fork it to your own account.

Now open a git console on your machine and run the following commands in order:

```bash
git clone https://github.com/{username}/cpython
cd cpython
./configure
make
```

We've now cloned CPython and compiled it on our machine. To test the compiled version:

```bash
./python.exe
Python 3.9.0a5+ (heads/master-dirty:0bae8d6f45, Apr 17 2020, 17:54:17)
[GCC 7.5.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

The latest version at the time of writing this post was **3.9.0a5+**.

### Finding the Code

The `inspect.isroutine` function lives in `Lib/inspect.py`. Let's open the file and
find the relevant function:

```python
def isroutine(object):
    """Return true if the object is any kind of function or method."""
    return (isbuiltin(object) or isfunction(object) or
            ismethod(object) or ismethoddescriptor(object))
```

The function performs four different checks but doesn't include any check for
`method-wrapper` objects. Let's see what type `method-wrapper` objects belong to:

```python
>>> type(object().__str__)
<class 'method-wrapper'>
>>> import types
>>> isinstance(object().__str__, types.MethodWrapperType)
True
```

We can detect `method-wrapper` objects using `types.MethodWrapperType`.

### Making the Fix

Let's add a new `ismethodwrapper` function to `Lib/inspect.py` and update the
`isroutine` function:

```python
def ismethodwrapper(object):
    """Return true if the object is a method-wrapper."""
    return isinstance(object, types.MethodWrapperType)


def isroutine(object):
    """Return true if the object is any kind of function or method."""
    return (isbuiltin(object) or isfunction(object) or
            ismethod(object) or ismethoddescriptor(object) or
            ismethodwrapper(object))
```

Don't forget to add the new function to the module's `__all__` list as well.

### Running the Tests

After making changes to CPython, you are expected to add a test to
`Lib/test/test_inspect.py`. Look at the existing tests and add an appropriate one:

```python
def test_ismethodwrapper(self):
    self.assertTrue(inspect.ismethodwrapper(object().__str__))
    self.assertTrue(inspect.ismethodwrapper(object().__repr__))
    self.assertFalse(inspect.ismethodwrapper(inspect.ismethodwrapper))
    # isroutine should now return True for method-wrappers
    self.assertTrue(inspect.isroutine(object().__str__))
```

To run the tests:

```bash
./python.exe -m unittest Lib.test.test_inspect -v
```

Once the tests pass, we can move on to creating a branch.

### Creating a Branch and Committing

For CPython contributions, always create a topic-specific branch — never work directly
on `main`:

```bash
git checkout -b fix-isroutine-method-wrapper
```

Stage your changes and commit:

```bash
git add Lib/inspect.py Lib/test/test_inspect.py
git commit -m "bpo-29418: Add ismethodwrapper() to the inspect module"
```

### Opening the PR

Push the branch to your own fork:

```bash
git push origin fix-isroutine-method-wrapper
```

Then go to your fork on GitHub. GitHub will automatically offer you a
**"Compare & pull request"** option. Click it and create your PR.

When writing the PR description, pay attention to:

- **Title**: `bpo-29418: Add ismethodwrapper() to the inspect module`
- **Description**: Briefly explain what you fixed, why you fixed it, and how you tested it
- **Issue link**: Add the line `Fixes https://bugs.python.org/issue29418`

### Conclusion

You've submitted your first CPython PR! Wait for the core developers to review it; you
may be asked to make changes based on their feedback. Be patient — contributing to a
large open source project is both exciting and educational.

> **Note:** This post is based on a contribution made in 2020. Since then, CPython's
> bug tracking system has been fully migrated to
> [GitHub Issues](https://github.com/python/cpython/issues).
> `bugs.python.org` is now only accessible for historical records.
